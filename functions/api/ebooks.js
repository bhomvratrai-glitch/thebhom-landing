/**
 * /api/ebooks - Cloudflare Pages Function
 * Crore+ Book Edge Gateway v3.0
 * Sources:
 *  1. Open Library API (10M+ books — Cover, Live Rating, PDF)
 *  2. Google Books API  (10M+ books — Best Description, Rating, HD Cover)
 *  3. Internet Archive  (40L+ Hindi & English — Real Reviews + Direct PDF)
 *  4. NDL / Rashtriya e-Pustakalaya (12,800+ — Govt India HD Covers)
 *  5. NCERT Official Textbooks (1,250+)
 *  6. Project Gutenberg via Gutendex (79,400+ Public Domain Classics)
 * Features: Edge Caching, Parallel Fetching, Auto-Dedup, Language Filter
 */

const LANG_WHITELIST = ['en', 'hi', 'hin', 'eng', 'english', 'hindi', 'hinglish', 'sanskrit', 'san'];

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  const query  = (url.searchParams.get('q') || url.searchParams.get('search') || '').trim();
  const topic  = (url.searchParams.get('topic') || url.searchParams.get('cat') || '').trim();
  const source = (url.searchParams.get('source') || '').toLowerCase().trim();
  const page   = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const rows   = 32;

  // Smart Download Resolver
  const downloadParam = url.searchParams.get('download');
  if (downloadParam) {
    const iaId  = (url.searchParams.get('ia_id')  || '').replace(/^ia_/, '').trim();
    const pgId  = (url.searchParams.get('pg_id')  || '').replace(/^pg_/, '').trim();
    const repId = (url.searchParams.get('rep_id') || '').replace(/^rep_/, '').trim();

    if (repId) {
      try {
        const repRes = await fetch(`https://ndl.education.gov.in/api/v1/book/?bookid=${encodeURIComponent(repId)}&userid=40ce1dca-5c9d-5908-b4bb-5a25c5274184`, { headers: { 'Accept': 'application/json', 'Authorization': 'aef0cad103e968400d3c8db69a064bd9' } });
        if (repRes.ok) { const d = await repRes.json(); const b = Array.isArray(d) ? d[0] : d; if (b && b.book_link) return Response.redirect(b.book_link, 302); }
      } catch (e) {}
    }
    if (iaId) {
      try {
        const metaRes = await fetch(`https://archive.org/metadata/${encodeURIComponent(iaId)}/files`, { headers: { 'User-Agent': 'TheBhomEbooks/2026' } });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          const files = meta.result || meta.files || [];
          if (downloadParam === 'epub') { const f = files.find(f => f.name && f.name.toLowerCase().endsWith('.epub')); if (f) return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(f.name)}`, 302); }
          if (downloadParam === 'txt')  { const f = files.find(f => f.name && (f.name.toLowerCase().endsWith('_djvu.txt') || f.name.toLowerCase().endsWith('.txt'))); if (f) return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(f.name)}`, 302); }
          let pdf = files.find(f => f.name && f.name.toLowerCase().endsWith('.pdf') && !f.name.toLowerCase().includes('_text.pdf'));
          if (!pdf) pdf = files.find(f => f.name && f.name.toLowerCase().endsWith('.pdf'));
          if (pdf) return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(pdf.name)}`, 302);
        }
      } catch (e) {}
      return Response.redirect(`https://archive.org/download/${iaId}`, 302);
    }
    if (pgId) {
      if (downloadParam === 'mobi') return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.kf8.images`, 302);
      if (downloadParam === 'txt')  return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.txt.utf-8`, 302);
      return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.epub3.images`, 302);
    }
  }

  const topicLower = topic.toLowerCase();
  const queryLower = query.toLowerCase();

  const isRep    = source === 'rep' || source === 'ndl' || source === 'pustakalaya' || topicLower === 'rep' || topicLower === 'ndl' || topicLower === 'stories' || topicLower === 'comics';
  const isNcert  = source === 'ncert' || topicLower === 'ncert' || topicLower === 'upsc' || queryLower.includes('ncert') || queryLower.includes('cbse');
  const isOL     = source === 'openlibrary' || source === 'ol';
  const isGoogle = source === 'google' || source === 'googlebooks';
  const isArchive= source === 'archive' || source === 'ia';
  const isDli    = source === 'dli' || topicLower === 'dli' || (topicLower === 'hindi' && !query);
  const isAll    = source === 'all' || source === 'mega' || (!source && query);

  try {
    if (isAll)     return await handleAllSources(query, topicLower, page, rows);
    if (isOL)      return await handleOpenLibraryRequest(query, topicLower, page, rows);
    if (isGoogle)  return await handleGoogleBooksRequest(query, topicLower, page, rows);
    if (isRep)     return await handleRepRequest(query, topicLower, page, rows);
    if (isNcert)   return await handleNcertRequest(query, page, rows);
    if (isDli)     return await handleDliRequest(query, topicLower, page, rows);
    if (isArchive) return await handleArchiveGlobalSearch(query, page, rows);
    return await handleGutenbergRequest(query, topic, page);
  } catch (err) {
    return new Response(JSON.stringify({ status: 'fallback', message: err.message, total: 10000000, count: 0, books: [] }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}

// ── ALL SOURCES UNIFIED (Crore+ Mode) ────────────────────────
async function handleAllSources(query, topicLower, page, rows) {
  const per = Math.ceil(rows / 3);
  const isHindi = topicLower === 'hindi' || (query && /[\u0900-\u097F]|hindi|premchand|gita|ramayan/i.test(query));
  const repLangId = isHindi ? 2 : (topicLower === 'english' ? 1 : 0);
  const [olR, archR, repR] = await Promise.allSettled([
    fetchOpenLibraryBooks(query || (isHindi ? 'hindi literature' : (topicLower || 'bestseller')), isHindi ? 'hindi' : topicLower, page, per),
    fetchArchiveBooks(query || (isHindi ? 'hindi literature' : 'popular hindi english'), page, per),
    fetchRepFromGovt(query || '', page, per, repLangId),
  ]);
  const ol    = olR.status   === 'fulfilled' ? olR.value   : [];
  const arch  = archR.status === 'fulfilled' ? archR.value : [];
  const rep   = repR.status  === 'fulfilled' ? repR.value  : [];
  const seen  = new Set();
  const merged = [...ol, ...rep, ...arch].filter(b => {
    const key = (b.title || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, '').slice(0, 30);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  merged.sort((a, b) => ((b.rating || 4.5) * 1000 + (b.downloads || 1000) / 100) - ((a.rating || 4.5) * 1000 + (a.downloads || 1000) / 100));
  if (merged.length === 0 && query) {
    return await handleGutenbergRequest(query, topicLower, page);
  }
  return jsonResp({ status: 'success', source: 'all', total: 10000000, count: merged.length, page, has_next: true, books: merged.slice(0, rows) });
}

// ── OPEN LIBRARY API ─────────────────────────────────────────
async function fetchOpenLibraryBooks(query, topicLower, page, rows) {
  const isHindi   = topicLower === 'hindi' || (query && /[\u0900-\u097F]|hindi|premchand|gita/i.test(query));
  const langParam = isHindi ? '&lang=hin' : '';
  const offset    = (page - 1) * rows;
  const qStr      = query || (isHindi ? 'hindi literature' : (topicLower && topicLower !== 'all' ? topicLower : 'bestseller'));
  const cleanQ    = encodeURIComponent(qStr.replace(/[^\w\s\u0900-\u097F]/g, ' ').trim());
  const searchUrl = `https://openlibrary.org/search.json?q=${cleanQ}${langParam}&limit=${rows}&offset=${offset}&fields=key,title,author_name,cover_i,ratings_average,ratings_count,first_publish_year,ia,subject,number_of_pages_median,language`;

  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(searchUrl, { signal: ctrl.signal, headers: { 'User-Agent': 'TheBhomEbooks/2026 (+https://thebhom.in)', 'Accept': 'application/json' } });
  clearTimeout(t);
  if (!res.ok) return [];
  const data = await res.json();
  const docs = data.docs || [];

  // Parallel ratings fetch (up to 6 books without ratings)
  const noRating = docs.filter(d => d.key && !d.ratings_average).slice(0, 6);
  const ratingResults = await Promise.allSettled(noRating.map(d => fetch(`https://openlibrary.org${d.key}/ratings.json`, { headers: { 'User-Agent': 'TheBhomEbooks/2026' } }).then(r => r.ok ? r.json() : null).catch(() => null)));
  const rMap = {};
  noRating.forEach((d, i) => { const r = ratingResults[i]; if (r.status === 'fulfilled' && r.value && r.value.summary) rMap[d.key] = r.value.summary; });

  return docs.filter(d => d.title && (d.cover_i || d.ia)).map(d => {
    const coverId = d.cover_i;
    const iaId    = d.ia ? (Array.isArray(d.ia) ? d.ia[0] : d.ia) : null;
    const cover   = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : (iaId ? `https://archive.org/services/img/${iaId}` : '');
    const rData   = rMap[d.key] || {};
    const rating  = parseFloat(d.ratings_average || rData.average || 4.5);
    const rCount  = parseInt(d.ratings_count || rData.count || 120);
    const author  = d.author_name ? (Array.isArray(d.author_name) ? d.author_name[0] : d.author_name) : 'Open Library';
    const subject = d.subject ? (Array.isArray(d.subject) ? d.subject[0] : d.subject) : '';
    const lang    = d.language ? (Array.isArray(d.language) ? d.language[0] : d.language) : 'en';
    if (!isAllowedLang(lang)) return null;
    return {
      id: `ol_${(d.key || '').replace(/\//g, '_')}`, ol_key: d.key,
      title: d.title, author, cat: detectCat(subject, d.title),
      source: 'openlibrary', source_label: '📖 Open Library',
      downloads: rCount * 180 + 5000, rating: Math.min(5.0, rating),
      reviews_count: rCount, year: d.first_publish_year || 'Digital Edition',
      pages: d.number_of_pages_median || null,
      summary: subject ? `${d.title} — ${subject}. Free ebook on Open Library.` : `Free ebook '${d.title}' by ${author}.`,
      cover, language: lang,
      formats: {
        pdf:  iaId ? `/api/ebooks?download=pdf&ia_id=${iaId}`  : `https://openlibrary.org${d.key}`,
        epub: iaId ? `/api/ebooks?download=epub&ia_id=${iaId}` : `https://openlibrary.org${d.key}`,
        txt:  iaId ? `/api/ebooks?download=txt&ia_id=${iaId}`  : null,
        read_online: iaId ? `https://archive.org/details/${iaId}?view=theater&ui=embed&wrapper=false` : `https://openlibrary.org${d.key}`
      }
    };
  }).filter(Boolean);
}

async function handleOpenLibraryRequest(query, topicLower, page, rows) {
  const books = await fetchOpenLibraryBooks(query, topicLower, page, rows);
  return jsonResp({ status: 'success', source: 'openlibrary', total: 10000000, count: books.length, page, has_next: true, books });
}

// ── GOOGLE BOOKS API ─────────────────────────────────────────
async function handleGoogleBooksRequest(query, topicLower, page, rows) {
  const startIndex   = (page - 1) * rows;
  const langRestrict = topicLower === 'hindi' ? 'hi' : 'en';
  const q = encodeURIComponent((query || 'bestseller').replace(/[^\w\s\u0900-\u097F]/g, ' ').trim());
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&langRestrict=${langRestrict}&maxResults=${Math.min(rows, 40)}&startIndex=${startIndex}&printType=books&filter=free-ebooks`;

  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
  let res;
  try { res = await fetch(apiUrl, { signal: ctrl.signal, headers: { 'Accept': 'application/json' } }); clearTimeout(t); }
  catch (e) { return await handleOpenLibraryRequest(query, topicLower, page, rows); }

  if (!res.ok) return await handleOpenLibraryRequest(query, topicLower, page, rows);

  const data  = await res.json();
  const items = data.items || [];
  const books = items.map(item => {
    const info   = item.volumeInfo || {};
    const access = item.accessInfo || {};
    const title  = info.title || 'Untitled';
    const author = info.authors ? info.authors.join(', ') : 'Unknown';
    const desc   = info.description || `'${title}' — free on Google Books.`;
    const rating = info.averageRating || 4.4;
    const rCount = info.ratingsCount  || 80;
    const lang   = (info.language || 'en').toLowerCase();
    if (!isAllowedLang(lang)) return null;
    let cover = '';
    if (info.imageLinks) cover = (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '').replace('zoom=1', 'zoom=3').replace('http://', 'https://');
    const pdfLink  = access.pdf  && access.pdf.isAvailable  ? access.pdf.acsTokenLink  : null;
    const epubLink = access.epub && access.epub.isAvailable ? access.epub.acsTokenLink : null;
    const webLink  = info.previewLink ? info.previewLink.replace('http://', 'https://') : null;
    return {
      id: `gb_${item.id}`, gb_id: item.id, title, author,
      cat: detectCat(info.categories ? info.categories[0] : '', title),
      source: 'google', source_label: '📕 Google Books',
      downloads: rCount * 200 + 8000, rating: Math.min(5.0, parseFloat(rating)),
      reviews_count: rCount, year: info.publishedDate ? info.publishedDate.slice(0, 4) : 'Digital Edition',
      pages: info.pageCount || null,
      summary: desc.length > 400 ? desc.slice(0, 397) + '...' : desc,
      cover, language: lang,
      formats: { pdf: pdfLink || webLink || `https://books.google.com/books?id=${item.id}&output=pdf`, epub: epubLink || webLink, read_online: webLink || `https://books.google.com/books?id=${item.id}` }
    };
  }).filter(Boolean);

  return jsonResp({ status: 'success', source: 'google', total: data.totalItems || 10000000, count: books.length, page, has_next: (startIndex + rows) < (data.totalItems || 10000000), books });
}

// ── RASHTRIYA e-PUSTAKALAYA (NDL Govt India) ─────────────────
async function fetchRepFromGovt(query, page = 1, rows = 30, langId = 0) {
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6500);
  try {
    const payload = { _id: 0, author_id: 0, book_cat: 0, itemcount: parseInt(rows), language_id: langId, offsetvalue: (parseInt(page) - 1) * parseInt(rows), publisher: false, search_word: (query || '').trim(), type_title: 'All', userid: '40ce1dca-5c9d-5908-b4bb-5a25c5274184' };
    const res = await fetch('https://ndl.education.gov.in/api/v1/books/', { method: 'POST', signal: ctrl.signal, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'aef0cad103e968400d3c8db69a064bd9', 'User-Agent': 'TheBhomEbooks/2026' }, body: JSON.stringify(payload), cf: { cacheTtl: 86400, cacheEverything: true } });
    clearTimeout(t);
    if (!res.ok) return [];
    const rawList = await res.json();
    if (!Array.isArray(rawList)) return [];
    return rawList.map(b => {
      const title = b.book_title || 'Untitled'; const author = b.author_name || 'Rashtriya e-Pustakalaya'; const dl = b.download_count || 420;
      const isPdf = b.book_link && b.book_link.toLowerCase().endsWith('.pdf'); const isEpub = b.book_link && b.book_link.toLowerCase().endsWith('.epub');
      return { id: `rep_${b._id}`, rep_id: b._id, title, author, publisher: b.publisher_name || 'Ministry of Education (Govt of India)', cat: b.category_name || 'National Library', source: 'rep', source_label: '🇮🇳 राष्ट्रीय ई-पुस्तकालय', downloads: dl * 12 + 1800, rating: b.avg_rating && b.avg_rating > 0 ? parseFloat(b.avg_rating) : 4.9, reviews_count: Math.floor(dl / 3) + 45, year: b.book_year || 'Official Govt Edition', pages: b.book_pages || null, summary: b.book_desc || `Official Indian publication '${title}' by ${author}.`, cover: b.book_cover_img || '', language: b.language || 'Hindi', formats: { pdf: isPdf ? b.book_link : `/api/ebooks?download=pdf&rep_id=${b._id}`, epub: isEpub ? b.book_link : `/api/ebooks?download=epub&rep_id=${b._id}`, read_online: b.book_link || null } };
    });
  } catch (err) { return []; }
}

async function handleRepRequest(query, topicLower, page, rows) {
  const langId = topicLower === 'hindi' ? 2 : 0;
  let books = await fetchRepFromGovt(query, page, rows, langId);
  if (books.length === 0 && query) return await handleArchiveGlobalSearch(query, page, rows);
  return jsonResp({ status: 'success', source: 'rep', total: books.length >= rows ? 12800 : books.length, count: books.length, page, has_next: books.length >= rows, books });
}

// ── NCERT TEXTBOOKS ───────────────────────────────────────────
async function handleNcertRequest(query, page, rows) {
  try { const b = await fetchRepFromGovt(query || 'ncert', page, rows, 0); if (b.length > 0) return jsonResp({ status: 'success', source: 'ncert', total: 1250, count: b.length, page, has_next: b.length >= rows, books: b }); } catch (e) {}
  let sc = '(title:(ncert) OR creator:(ncert) OR collection:(ncertbooks))';
  if (query) sc += ` AND (${query.replace(/[^\w\s]/gi, ' ').trim()})`;
  const iaUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(sc)}+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(iaUrl, { signal: ctrl.signal, headers: { 'User-Agent': 'TheBhomEbooks/2026' }, cf: { cacheTtl: 86400, cacheEverything: true } }); clearTimeout(t);
  if (!res.ok) throw new Error(`NCERT error ${res.status}`);
  const data = await res.json(); const docs = (data.response && data.response.docs) ? data.response.docs : []; const total = (data.response && data.response.numFound) ? data.response.numFound : 4886;
  const books = docs.map(d => { const id = d.identifier; const title = (d.title || id).replace(/_/g, ' '); const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'NCERT (Govt of India)'; const desc = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : ''; return { id: `ia_${id}`, ia_id: id, title, author, cat: 'NCERT Textbooks', source: 'ncert', source_label: '🎓 NCERT Official', downloads: d.downloads || 18500, rating: 5.0, reviews_count: Math.floor((d.downloads || 4000) / 25) + 320, year: d.year || 'CBSE Edition', summary: desc.replace(/<[^>]*>?/gm, '').trim().slice(0, 350) || 'Official NCERT Textbook for school and UPSC preparation.', cover: `https://archive.org/services/img/${id}`, formats: { pdf: `/api/ebooks?download=pdf&ia_id=${id}`, epub: `/api/ebooks?download=epub&ia_id=${id}`, read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false` } }; });
  return jsonResp({ status: 'success', source: 'ncert', total, count: books.length, page, has_next: page * rows < total, books });
}

// ── DIGITAL LIBRARY OF INDIA / DLI ───────────────────────────
async function fetchArchiveBooks(query, page, rows) {
  const langF = '(language:(english OR hindi OR en OR hi OR hin OR eng))';
  const sc    = query ? `(${query.replace(/[^\w\s\u0900-\u097F]/gi, ' ').trim()}) AND ${langF}` : langF;
  const iaUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(sc)}+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads,language,avg_rating,num_reviews&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(iaUrl, { signal: ctrl.signal, headers: { 'User-Agent': 'TheBhomEbooks/2026' }, cf: { cacheTtl: 86400, cacheEverything: true } }); clearTimeout(t);
  if (!res.ok) return [];
  const data = await res.json(); const docs = (data.response && data.response.docs) ? data.response.docs : [];
  return docs.map(d => {
    const id = d.identifier; const title = (d.title || id).replace(/_/g, ' ').replace(/-/g, ' ');
    const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'Open Digital Library';
    const desc   = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : '';
    const lang   = d.language ? (Array.isArray(d.language) ? d.language[0] : d.language) : 'en';
    if (!isAllowedLang(lang.toLowerCase())) return null;
    return { id: `ia_${id}`, ia_id: id, title, author, cat: detectCat('', title), source: 'archive', source_label: '🌐 Internet Archive', downloads: d.downloads || 4500, rating: d.avg_rating && parseFloat(d.avg_rating) > 0 ? Math.min(5, parseFloat(d.avg_rating)) : 4.7, reviews_count: d.num_reviews || Math.floor((d.downloads || 1500) / 40) + 80, year: d.year || 'Digital Edition', summary: desc.replace(/<[^>]*>?/gm, '').trim().slice(0, 350) || `Free digital edition of '${title}' by ${author}.`, cover: `https://archive.org/services/img/${id}`, language: lang, formats: { pdf: `/api/ebooks?download=pdf&ia_id=${id}`, epub: `/api/ebooks?download=epub&ia_id=${id}`, txt: `/api/ebooks?download=txt&ia_id=${id}`, read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false` } };
  }).filter(Boolean);
}

async function handleDliRequest(query, topicLower, page, rows) {
  let langC = '(language:(hindi OR english OR hin OR en OR eng))';
  if (topicLower === 'hindi') langC = '(language:(hindi OR hin) OR subject:(Hindi))';
  let sc = langC;
  if (query) sc += ` AND (${query.replace(/[^\w\s\u0900-\u097F]/gi, ' ').trim()})`;
  const iaUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(sc)}+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads,language,avg_rating,num_reviews&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
  const res = await fetch(iaUrl, { signal: ctrl.signal, headers: { 'User-Agent': 'TheBhomEbooks/2026' }, cf: { cacheTtl: 86400, cacheEverything: true } }); clearTimeout(t);
  if (!res.ok) throw new Error(`DLI error ${res.status}`);
  const data = await res.json(); const docs = (data.response && data.response.docs) ? data.response.docs : []; const total = (data.response && data.response.numFound) ? data.response.numFound : 822837;
  const books = docs.map(d => {
    const id = d.identifier; const title = (d.title || id).replace(/_/g, ' ');
    const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'Indian Classic';
    const desc = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : '';
    const lang = d.language ? (Array.isArray(d.language) ? d.language[0] : d.language) : 'hi';
    if (!isAllowedLang(lang.toLowerCase())) return null;
    return { id: `ia_${id}`, ia_id: id, title, author, cat: topicLower === 'hindi' ? 'Hindi' : detectCat('', title), source: 'dli', source_label: topicLower === 'hindi' ? '🇮🇳 Hindi Classic' : '🇮🇳 Digital Library of India', downloads: d.downloads || 12000, rating: d.avg_rating && parseFloat(d.avg_rating) > 0 ? Math.min(5, parseFloat(d.avg_rating)) : 4.9, reviews_count: d.num_reviews || Math.floor((d.downloads || 2500) / 35) + 180, year: d.year || 'Heritage Edition', summary: desc.replace(/<[^>]*>?/gm, '').trim().slice(0, 350) || `Authentic public-domain text from the Digital Library of India.`, cover: `https://archive.org/services/img/${id}`, language: lang, formats: { pdf: `/api/ebooks?download=pdf&ia_id=${id}`, epub: `/api/ebooks?download=epub&ia_id=${id}`, read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false` } };
  }).filter(Boolean);
  return jsonResp({ status: 'success', source: 'dli', total, count: books.length, page, has_next: page * rows < total, books });
}

// ── PROJECT GUTENBERG (Gutendex) ─────────────────────────────
async function handleGutenbergRequest(query, topic, page) {
  const tl = topic ? topic.toLowerCase().trim() : '';
  let apiUrl = `https://gutendex.com/books/?languages=en,hi&page=${page}`;
  if (query) { apiUrl += `&search=${encodeURIComponent(query)}`; }
  else if (tl && tl !== 'all') {
    if (tl === 'self help' || tl === 'mind') apiUrl += `&search=psychology`;
    else if (tl === 'technology' || tl === 'ai') apiUrl += `&search=science`;
    else if (tl === 'business' || tl === 'finance') apiUrl += `&search=economics`;
    else if (tl === 'philosophy') apiUrl += `&topic=Philosophy`;
    else if (tl === 'mystery')    apiUrl += `&topic=Mystery`;
    else if (tl === 'history')    apiUrl += `&topic=History`;
    else if (tl === 'fiction')    apiUrl += `&topic=Fiction`;
    else apiUrl += `&search=${encodeURIComponent(topic)}`;
  }
  let data = null;
  try { const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), query ? 3500 : 7000); const r = await fetch(apiUrl, { signal: ctrl.signal, headers: { 'User-Agent': 'TheBhomEbooks/2026', 'Accept': 'application/json' }, cf: { cacheTtl: 86400, cacheEverything: true } }); clearTimeout(t); if (r.ok) data = await r.json(); } catch (e) {}
  const raw = (data && data.results) ? data.results : [];
  if (query && raw.length === 0) return await handleArchiveGlobalSearch(query, page, 32);
  const AL = ['en', 'hi', 'hin', 'eng'];
  const books = raw.filter(item => (item.languages || ['en']).some(l => AL.includes(l.toLowerCase()))).map(item => {
    const author = item.authors && item.authors.length > 0 ? item.authors[0].name.replace(/(\w+),\s*(\w+)/, '$2 $1') : 'Unknown';
    const fmts = item.formats || {}; const id = item.id;
    const cover = fmts['image/jpeg'] || `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`;
    const allSubs = [...(item.subjects || []), ...(item.bookshelves || [])].join(' ').toLowerCase();
    const summary = item.summaries && item.summaries.length > 0 ? item.summaries[0] : `Classic masterpiece '${item.title}' by ${author}. Public domain — free reading and download.`;
    return { id: `pg_${id}`, pg_id: id, title: item.title || 'Untitled', author, cat: detectCat(allSubs, item.title), source: 'gutenberg', source_label: '📚 Public Domain Classic', downloads: item.download_count || 1200, rating: parseFloat((4.8 + ((id % 3) * 0.1)).toFixed(1)), reviews_count: Math.floor((item.download_count || 2000) / 45) + 110, year: 'Public Domain Edition', summary, cover, languages: item.languages || ['en'], formats: { epub: fmts['application/epub+zip'] || `https://www.gutenberg.org/ebooks/${id}.epub3.images`, mobi: fmts['application/x-mobipocket-ebook'] || `https://www.gutenberg.org/ebooks/${id}.kf8.images`, pdf: `/api/ebooks?download=pdf&pg_id=${id}`, txt: fmts['text/plain; charset=utf-8'] || `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`, read_online: `https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.html` } };
  });
  return jsonResp({ status: 'success', source: 'gutenberg', total: data ? data.count : 79403, count: books.length, page: parseInt(page), has_next: Boolean(data && data.next), books });
}

// ── GLOBAL INTERNET ARCHIVE SEARCH ───────────────────────────
async function handleArchiveGlobalSearch(query, page = 1, rows = 32) {
  const books = await fetchArchiveBooks(query, page, rows);
  return jsonResp({ status: 'success', source: 'archive', total: 44000000, count: books.length, page, has_next: true, books });
}

// ── HELPERS ───────────────────────────────────────────────────
function isAllowedLang(lang) {
  if (!lang) return true;
  const l = lang.toLowerCase().trim();
  // Block non-English/Hindi languages explicitly
  const blocked = ['fr', 'de', 'es', 'it', 'fi', 'ru', 'la', 'zh', 'tl', 'pt', 'nl', 'sv', 'da', 'pl', 'cs', 'hu', 'ro', 'ar', 'fa', 'tr', 'ko', 'ja'];
  if (blocked.includes(l)) return false;
  return LANG_WHITELIST.some(w => l.includes(w)) || l === 'en' || l === 'hi';
}

function detectCat(subject, title) {
  const s = (subject + ' ' + title).toLowerCase();
  if (s.includes('philosophy') || s.includes('ethics'))                return 'Philosophy';
  if (s.includes('science fiction') || s.includes('sci-fi'))           return 'Sci-Fi';
  if (s.includes('mystery') || s.includes('detective') || s.includes('crime')) return 'Mystery';
  if (s.includes('history') || s.includes('biography') || s.includes('memoir')) return 'History';
  if (s.includes('business') || s.includes('economics') || s.includes('finance')) return 'Business';
  if (s.includes('psychology') || s.includes('self-help') || s.includes('self help')) return 'Self Help';
  if (s.includes('technology') || s.includes('computer') || s.includes('programming')) return 'Technology';
  if (s.includes('health') || s.includes('yoga') || s.includes('medicine')) return 'Health';
  if (s.includes('spiritual') || s.includes('religion') || s.includes('gita') || s.includes('veda')) return 'Spiritual';
  if (s.includes('hindi') || s.includes('premchand') || s.includes('hindi sahitya')) return 'Hindi';
  if (s.includes('children') || s.includes('kids') || s.includes('juvenile')) return 'Kids';
  if (s.includes('fiction') || s.includes('novel'))                    return 'Fiction';
  return 'Classics';
}

function jsonResp(data, cacheSeconds = 3600) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': `public, max-age=${cacheSeconds}, s-maxage=86400` } });
}
