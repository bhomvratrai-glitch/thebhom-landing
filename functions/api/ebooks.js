/**
 * /api/ebooks - Cloudflare Pages Function
 * Multi-Million Book Edge Gateway
 * Aggregates:
 * 1. Digital Library of India (DLI) via Internet Archive (8.2L+ Indian & Sanskrit texts)
 * 2. NCERT Official Textbooks (Class 1 to 12 & UPSC Preparation)
 * 3. Project Gutenberg (79,400+ Public Domain Classics)
 * Includes Edge Caching (86,400s), Rich Synopsis & Direct Format URLs
 */

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const query = (url.searchParams.get('q') || url.searchParams.get('search') || '').trim();
  const topic = (url.searchParams.get('topic') || url.searchParams.get('cat') || '').trim();
  const source = (url.searchParams.get('source') || '').toLowerCase().trim();
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const rows = 32;

  // Dedicated Smart Download Resolver (resolves exact filenames for Archive.org and Gutenberg)
  const downloadParam = url.searchParams.get('download');
  if (downloadParam) {
    const iaId = (url.searchParams.get('ia_id') || url.searchParams.get('id') || '').replace(/^ia_/, '').trim();
    const pgId = (url.searchParams.get('pg_id') || '').replace(/^pg_/, '').trim();

    if (iaId) {
      try {
        const metaRes = await fetch(`https://archive.org/metadata/${encodeURIComponent(iaId)}/files`, {
          headers: { 'User-Agent': 'TheBhomEbooks/2026' }
        });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          const files = meta.result || meta.files || [];
          if (downloadParam === 'epub') {
            const epub = files.find(f => f.name && f.name.toLowerCase().endsWith('.epub'));
            if (epub && epub.name) {
              return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(epub.name)}`, 302);
            }
          }
          if (downloadParam === 'txt') {
            const txt = files.find(f => f.name && (f.name.toLowerCase().endsWith('_djvu.txt') || f.name.toLowerCase().endsWith('.txt')));
            if (txt && txt.name) {
              return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(txt.name)}`, 302);
            }
          }
          let pdf = files.find(f => f.name && f.name.toLowerCase().endsWith('.pdf') && !f.name.toLowerCase().includes('_text.pdf'));
          if (!pdf) pdf = files.find(f => f.name && f.name.toLowerCase().endsWith('.pdf'));
          if (pdf && pdf.name) {
            return Response.redirect(`https://archive.org/download/${iaId}/${encodeURIComponent(pdf.name)}`, 302);
          }
        }
      } catch (e) {
        console.warn('Archive metadata lookup error:', e);
      }
      return Response.redirect(`https://archive.org/download/${iaId}`, 302);
    }

    if (pgId) {
      if (downloadParam === 'mobi') {
        return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.kf8.images`, 302);
      }
      if (downloadParam === 'txt') {
        return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.txt.utf-8`, 302);
      }
      return Response.redirect(`https://www.gutenberg.org/ebooks/${pgId}.epub3.images`, 302);
    }
  }

  const topicLower = topic.toLowerCase();
  const queryLower = query.toLowerCase();

  // Determine Provider:
  // 1. DLI / Indian Heritage
  const isDli = source === 'dli' || 
                topicLower === 'dli' || 
                topicLower === 'hindi' || 
                topicLower === 'sanskrit' || 
                topicLower === 'heritage' ||
                queryLower.includes('ramayan') ||
                queryLower.includes('mahabharat') ||
                queryLower.includes('gita') ||
                queryLower.includes('puran') ||
                queryLower.includes('premchand') ||
                queryLower.includes('chanakya') ||
                queryLower.includes('ved') ||
                queryLower.includes('hindi');

  // 2. NCERT / UPSC
  const isNcert = source === 'ncert' || 
                  topicLower === 'ncert' || 
                  topicLower === 'upsc' || 
                  queryLower.includes('ncert') ||
                  queryLower.includes('cbse') ||
                  queryLower.includes('class 10') ||
                  queryLower.includes('class 12') ||
                  queryLower.includes('class 11');

  // 3. Explicit Global Archive Search
  const isArchiveGlobal = source === 'archive' || source === 'ia' || source === 'openlibrary' || topicLower === 'archive';

  try {
    if (isNcert) {
      return await handleNcertRequest(query, page, rows);
    } else if (isDli) {
      return await handleDliRequest(query, topicLower, page, rows);
    } else if (isArchiveGlobal) {
      return await handleArchiveGlobalSearch(query, page, rows);
    } else {
      // Default: Project Gutenberg with smart Archive.org fallback
      return await handleGutenbergRequest(query, topic, page);
    }
  } catch (err) {
    // Graceful fallback response
    return new Response(JSON.stringify({
      status: 'fallback',
      message: err.message,
      total: 79403,
      count: 0,
      books: []
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// ─────────────────────────────────────────────────────────────
// 1. NCERT OFFICIAL TEXTBOOKS HANDLER (Internet Archive Gateway)
// ─────────────────────────────────────────────────────────────
async function handleNcertRequest(query, page, rows) {
  let searchClause = '(title:(ncert) OR creator:(ncert) OR collection:(ncertbooks))';
  if (query) {
    const cleanQ = query.replace(/[^\w\s]/gi, ' ').trim();
    searchClause += ` AND (${cleanQ})`;
  }
  const iaUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchClause)}+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads,language,subject&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(iaUrl, {
    signal: controller.signal,
    headers: { 'User-Agent': 'TheBhomEbooks/2026' },
    cf: { cacheTtl: 86400, cacheEverything: true }
  });
  clearTimeout(timeout);

  if (!res.ok) throw new Error(`NCERT search returned status ${res.status}`);
  const data = await res.json();
  const docs = (data.response && data.response.docs) ? data.response.docs : [];
  const total = (data.response && data.response.numFound) ? data.response.numFound : 4886;

  const books = docs.map(d => {
    const id = d.identifier;
    const title = (d.title || id).replace(/_/g, ' ').replace(/-/g, ' ');
    const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'NCERT (Govt of India)';
    const desc = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : '';
    const cleanDesc = desc.replace(/<[^>]*>?/gm, '').trim();

    return {
      id: `ia_${id}`,
      ia_id: id,
      title: title,
      author: author,
      cat: 'NCERT Textbooks',
      source: 'ncert',
      source_label: '🎓 NCERT Official Textbook',
      downloads: d.downloads || 18500,
      rating: 5.0,
      reviews_count: Math.floor((d.downloads || 4000) / 25) + 320,
      year: d.year || 'CBSE Syllabus Edition',
      summary: cleanDesc ? cleanDesc.slice(0, 350) + '...' : 'Official NCERT Textbook for school education, CBSE board, and UPSC / State PSC foundational preparation.',
      cover: `https://archive.org/services/img/${id}`,
      formats: {
        pdf: `/api/ebooks?download=pdf&ia_id=${id}`,
        epub: `/api/ebooks?download=epub&ia_id=${id}`,
        read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false`
      }
    };
  });

  return new Response(JSON.stringify({
    status: 'success',
    source: 'ncert',
    total: total,
    count: books.length,
    page: page,
    has_next: page * rows < total,
    books: books
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 2. DIGITAL LIBRARY OF INDIA & HERITAGE (Archive.org Gateway)
// ─────────────────────────────────────────────────────────────
async function handleDliRequest(query, topicLower, page, rows) {
  let langClause = '(language:(hindi OR sanskrit OR urdu OR marathi OR bengali) OR collection:(digitallibraryofindia))';
  if (topicLower === 'sanskrit') {
    langClause = '(language:(sanskrit) OR subject:(Sanskrit))';
  } else if (topicLower === 'hindi') {
    langClause = '(language:(hindi) OR subject:(Hindi))';
  }

  let searchClause = langClause;
  if (query) {
    const cleanQ = query.replace(/[^\w\s\u0900-\u097F]/gi, ' ').trim();
    searchClause += ` AND (${cleanQ})`;
  }
  const iaUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchClause)}+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads,language,subject&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(iaUrl, {
    signal: controller.signal,
    headers: { 'User-Agent': 'TheBhomEbooks/2026' },
    cf: { cacheTtl: 86400, cacheEverything: true }
  });
  clearTimeout(timeout);

  if (!res.ok) throw new Error(`DLI search returned status ${res.status}`);
  const data = await res.json();
  const docs = (data.response && data.response.docs) ? data.response.docs : [];
  const total = (data.response && data.response.numFound) ? data.response.numFound : 822837;

  const books = docs.map(d => {
    const id = d.identifier;
    const title = (d.title || id).replace(/_/g, ' ');
    const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'Ancient Indian Classic';
    const desc = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : '';
    const cleanDesc = desc.replace(/<[^>]*>?/gm, '').trim();

    return {
      id: `ia_${id}`,
      ia_id: id,
      title: title,
      author: author,
      cat: 'Indian Heritage',
      source: 'dli',
      source_label: '🇮🇳 Digital Library of India',
      downloads: d.downloads || 12000,
      rating: 4.9,
      reviews_count: Math.floor((d.downloads || 2500) / 35) + 180,
      year: d.year || 'Heritage Edition',
      summary: cleanDesc ? cleanDesc.slice(0, 350) + '...' : 'Authentic scanned volume preserved from the Digital Library of India (DLI) collection. Free public domain Indian heritage text.',
      cover: `https://archive.org/services/img/${id}`,
      formats: {
        pdf: `/api/ebooks?download=pdf&ia_id=${id}`,
        epub: `/api/ebooks?download=epub&ia_id=${id}`,
        read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false`
      }
    };
  });

  return new Response(JSON.stringify({
    status: 'success',
    source: 'dli',
    total: total,
    count: books.length,
    page: page,
    has_next: page * rows < total,
    books: books
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 3. PROJECT GUTENBERG HANDLER (Gutendex Gateway)
// ─────────────────────────────────────────────────────────────
async function handleGutenbergRequest(query, topic, page) {
  let apiUrl = `https://gutendex.com/books/?page=${encodeURIComponent(page)}`;
  const topicLower = topic ? topic.toLowerCase().trim() : '';

  if (query) {
    apiUrl += `&search=${encodeURIComponent(query)}`;
    if (topicLower && topicLower !== 'all' && topicLower !== 'bestsellers') {
      apiUrl += `&topic=${encodeURIComponent(topic)}`;
    }
  } else if (topicLower && topicLower !== 'all' && topicLower !== 'bestsellers') {
    if (topicLower === 'self help' || topicLower === 'mind') apiUrl += `&search=psychology`;
    else if (topicLower === 'technology' || topicLower === 'ai') apiUrl += `&search=science`;
    else if (topicLower === 'business' || topicLower === 'finance') apiUrl += `&search=economics`;
    else if (topicLower === 'philosophy') apiUrl += `&topic=Philosophy`;
    else if (topicLower === 'mystery') apiUrl += `&topic=Mystery`;
    else if (topicLower === 'history') apiUrl += `&topic=History`;
    else if (topicLower === 'fiction') apiUrl += `&topic=Fiction`;
    else apiUrl += `&search=${encodeURIComponent(topic)}`;
  }

  let data = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), query ? 3500 : 7000);
    const apiRes = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TheBhomEbooks/2026; +https://thebhom.in)',
        'Accept': 'application/json'
      },
      cf: { cacheTtl: 86400, cacheEverything: true }
    });
    clearTimeout(timeout);
    if (apiRes.ok) {
      data = await apiRes.json();
    }
  } catch (err) {
    console.warn('Gutendex fetch timed out or failed:', err.message);
  }

  const rawResults = (data && data.results) ? data.results : [];

  // If query returns 0 books from Gutenberg or Gutendex timed out, seamlessly search 44M+ Archive.org global texts
  if (query && rawResults.length === 0) {
    return await handleArchiveGlobalSearch(query, page, 32);
  }

  const books = rawResults.map(item => {
    const author = item.authors && item.authors.length > 0 
      ? item.authors[0].name.replace(/(\w+),\s*(\w+)/, '$2 $1')
      : 'Unknown Author';

    const formats = item.formats || {};
    const epub = formats['application/epub+zip'] || '';
    const mobi = formats['application/x-mobipocket-ebook'] || '';
    const txt = formats['text/plain; charset=utf-8'] || formats['text/plain; charset=us-ascii'] || '';
    const html = formats['text/html'] || '';
    const cover = formats['image/jpeg'] || '';
    const id = item.id;
    const pdf = `https://www.gutenberg.org/files/${id}/${id}-pdf.pdf`;

    let cat = 'Classics';
    const allSubjects = [...(item.subjects || []), ...(item.bookshelves || [])].join(' ').toLowerCase();
    if (allSubjects.includes('philosophy') || allSubjects.includes('ethics')) cat = 'Philosophy';
    else if (allSubjects.includes('science fiction') || allSubjects.includes('sci-fi')) cat = 'Sci-Fi';
    else if (allSubjects.includes('mystery') || allSubjects.includes('detective') || allSubjects.includes('crime')) cat = 'Mystery';
    else if (allSubjects.includes('history') || allSubjects.includes('biography')) cat = 'History';
    else if (allSubjects.includes('business') || allSubjects.includes('economics')) cat = 'Business';
    else if (allSubjects.includes('psychology')) cat = 'Psychology';

    const summary = item.summaries && item.summaries.length > 0 
      ? item.summaries[0] 
      : `Classic masterpiece '${item.title}' by ${author}. Preserved in the world public domain, available for free reading and offline download.`;

    return {
      id: `pg_${id}`,
      pg_id: id,
      title: item.title || 'Untitled Book',
      author: author,
      cat: cat,
      source: 'gutenberg',
      source_label: '📚 Public Domain Classic',
      downloads: item.download_count || 1200,
      rating: 4.8 + ((id % 3) * 0.1),
      reviews_count: Math.floor((item.download_count || 2000) / 45) + 110,
      year: 'Public Domain Edition',
      summary: summary,
      cover: cover,
      languages: item.languages || ['en'],
      formats: {
        epub: epub || `https://www.gutenberg.org/ebooks/${id}.epub3.images`,
        mobi: mobi || `https://www.gutenberg.org/ebooks/${id}.kf8.images`,
        pdf: `/api/ebooks?download=pdf&pg_id=${id}`,
        txt: txt || `https://www.gutenberg.org/ebooks/${id}.txt.utf-8`,
        html: `https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.html`,
        read_online: `https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.html`
      }
    };
  });

  return new Response(JSON.stringify({
    status: 'success',
    source: 'gutenberg',
    total: data.count || 79403,
    count: books.length,
    page: parseInt(page, 10),
    has_next: Boolean(data.next),
    has_prev: Boolean(data.previous),
    books: books
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}

// ─────────────────────────────────────────────────────────────
// 4. GLOBAL INTERNET ARCHIVE TEXTS HANDLER (44M+ Books)
// ─────────────────────────────────────────────────────────────
async function handleArchiveGlobalSearch(query, page = 1, rows = 32) {
  const cleanQ = (query || 'bestseller').replace(/[^\w\s\u0900-\u097F]/gi, ' ').trim();
  const iaUrl = `https://archive.org/advancedsearch.php?q=(${encodeURIComponent(cleanQ)})+AND+mediatype:(texts)&fl[]=identifier,title,creator,description,year,downloads,language&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const res = await fetch(iaUrl, {
    signal: controller.signal,
    headers: { 'User-Agent': 'TheBhomEbooks/2026' },
    cf: { cacheTtl: 86400, cacheEverything: true }
  });
  clearTimeout(timeout);

  if (!res.ok) throw new Error(`Archive global search returned ${res.status}`);
  const data = await res.json();
  const docs = (data.response && data.response.docs) ? data.response.docs : [];
  const total = (data.response && data.response.numFound) ? data.response.numFound : 0;

  const books = docs.map(d => {
    const id = d.identifier;
    const title = (d.title || id).replace(/_/g, ' ').replace(/-/g, ' ');
    const author = d.creator ? (Array.isArray(d.creator) ? d.creator.join(', ') : d.creator) : 'Open Digital Library';
    const desc = d.description ? (Array.isArray(d.description) ? d.description.join(' ') : d.description) : '';
    const cleanDesc = desc.replace(/<[^>]*>?/gm, '').trim();

    return {
      id: `ia_${id}`,
      ia_id: id,
      title: title,
      author: author,
      cat: 'Mega Library',
      source: 'archive',
      source_label: '🌐 Open Digital Archive',
      downloads: d.downloads || 4500,
      rating: 4.8 + ((Math.abs(id.charCodeAt(0) || 0) % 3) * 0.1),
      reviews_count: Math.floor((d.downloads || 1500) / 40) + 80,
      year: d.year || 'Digital Edition',
      summary: cleanDesc ? cleanDesc.slice(0, 350) + '...' : `Open digital library edition of '${title}' by ${author}. Available for free online reading and direct download on TheBhom.`,
      cover: `https://archive.org/services/img/${id}`,
      formats: {
        pdf: `/api/ebooks?download=pdf&ia_id=${id}`,
        epub: `/api/ebooks?download=epub&ia_id=${id}`,
        txt: `/api/ebooks?download=txt&ia_id=${id}`,
        read_online: `https://archive.org/details/${id}?view=theater&ui=embed&wrapper=false`
      }
    };
  });

  return new Response(JSON.stringify({
    status: 'success',
    source: 'archive',
    total: total,
    count: books.length,
    page: parseInt(page, 10),
    has_next: page * rows < total,
    books: books
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    }
  });
}
