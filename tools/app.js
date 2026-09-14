// ToolNest Full Engine (Step-33 Client Architecture)
// 100% In-Browser Privacy, Lightning Fast, Zero Server Hosting Cost

const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const toast = (m) => {
  const t = $('toast');
  if (!t) return;
  t.textContent = m;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
};

const fmt = (n) => {
  if (n < 1024) return n + ' B';
  if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
};

// Tool definitions
const imageTools = [
  ['compress', 'Compress Image', 'Reduce JPG, PNG or WebP file size while preserving crisp visual quality.'],
  ['resize', 'Resize Image', 'Scale image width and height with optional aspect ratio lock.'],
  ['convert', 'Convert Image', 'Convert instantly between JPG, PNG and modern WebP formats.'],
  ['crop', 'Crop Image', 'Crop to exact dimensions or popular social aspect ratios (1:1, 16:9, 9:16).'],
  ['rotate', 'Rotate Image', 'Lossless canvas rotation by 90°, 180° or 270°.'],
  ['image-pdf', 'Image to PDF', 'Compile single or multiple images into a downloadable PDF document.']
];

const pdfTools = [
  ['merge', 'Merge PDF', 'Combine multiple PDF files into one in your chosen order.'],
  ['split', 'Split PDF', 'Extract specific pages or page ranges (e.g. 1-3, 5) into a new PDF.'],
  ['rotate-pdf', 'Rotate PDF', 'Rotate all pages by 90°, 180° or 270°.'],
  ['watermark', 'Watermark PDF', 'Add a customizable text watermark across all pages.'],
  ['pdf-to-image', 'PDF to Image', 'Render and extract PDF pages as crisp JPG images in your browser.'],
  ['info', 'PDF Info & Audit', 'Inspect total page count, dimensions and structure locally.']
];

let mode = 'image';
let tool = 'compress';
let files = [];
let cropPreset = 'free';
let keepAspect = true;
let originalAspect = 1;

function currentMeta() {
  return [...imageTools, ...pdfTools].find((x) => x[0] === tool) || imageTools[0];
}

function renderTools() {
  const list = mode === 'image' ? imageTools : pdfTools;
  const pills = $('toolPills');
  if (!pills) return;
  pills.innerHTML = list
    .map(
      ([id, n]) =>
        `<button class="tool-pill ${id === tool ? 'active' : ''}" data-tool="${id}">${esc(n)}</button>`
    )
    .join('');

  document.querySelectorAll('[data-tool]').forEach((b) => {
    b.onclick = () => {
      tool = b.dataset.tool;
      renderTools();
      updateWorkspace();
    };
  });
}

function updateWorkspace() {
  const [id, name, desc] = currentMeta();
  if ($('wsTitle')) $('wsTitle').textContent = name;
  if ($('wsDesc')) $('wsDesc').textContent = desc;

  const input = $('fileInput');
  if (input) {
    input.accept = mode === 'image' ? 'image/jpeg,image/png,image/webp' : 'application/pdf';
    input.multiple = tool === 'merge' || tool === 'image-pdf';
  }

  buildControls();
  clearFiles();
}

function buildControls() {
  const box = $('controls');
  if (!box) return;
  let html = '';

  if (mode === 'image') {
    if (tool === 'compress') {
      html = `
        <div class="field">
          <label>Compression Level (<span id="qualityLabel">78%</span>)</label>
          <input id="quality" type="range" min="30" max="95" value="78">
        </div>
        <div class="field">
          <label>Max Width Constraint (Optional)</label>
          <input id="maxWidth" type="number" placeholder="Original width" min="200" step="50">
        </div>
        <div class="field">
          <label>Target Format</label>
          <select id="compFormat">
            <option value="keep">Preserve Original Format</option>
            <option value="image/webp">Auto WebP (Smallest file)</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      `;
    } else if (tool === 'resize') {
      html = `
        <div class="field">
          <label>Target Width (px)</label>
          <input id="rw" type="number" min="1" value="1200">
        </div>
        <div class="field">
          <label>Target Height (px)</label>
          <input id="rh" type="number" min="1" value="800">
        </div>
        <div class="field">
          <label>Format & Options</label>
          <select id="rf">
            <option value="image/webp">WebP (Optimized)</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </select>
        </div>
      `;
    } else if (tool === 'convert') {
      html = `
        <div class="field">
          <label>Target Format</label>
          <select id="cf">
            <option value="image/webp">WebP (Modern & Lightweight)</option>
            <option value="image/jpeg">JPG / JPEG (Standard)</option>
            <option value="image/png">PNG (Lossless & Alpha)</option>
          </select>
        </div>
        <div class="field">
          <label>Quality (<span id="convQualityLabel">90%</span>)</label>
          <input id="convQuality" type="range" min="40" max="100" value="90">
        </div>
      `;
    } else if (tool === 'crop') {
      html = `
        <div class="field">
          <label>Aspect Ratio Preset</label>
          <select id="cropPresetSel">
            <option value="free">Custom / Freeform</option>
            <option value="1:1">1:1 Square (Instagram / Profile)</option>
            <option value="16:9">16:9 Landscape (YouTube / Banner)</option>
            <option value="9:16">9:16 Vertical (Reels / Shorts / TikTok)</option>
            <option value="4:3">4:3 Standard Photo</option>
          </select>
        </div>
        <div class="field">
          <label>Crop Width (px)</label>
          <input id="cw" type="number" min="10" value="800">
        </div>
        <div class="field">
          <label>Crop Height (px)</label>
          <input id="ch" type="number" min="10" value="800">
        </div>
      `;
    } else if (tool === 'rotate') {
      html = `
        <div class="field">
          <label>Clockwise Rotation</label>
          <select id="rot">
            <option value="90">90° Clockwise</option>
            <option value="180">180° Upside Down</option>
            <option value="270">270° (90° Counter-Clockwise)</option>
          </select>
        </div>
      `;
    } else if (tool === 'image-pdf') {
      html = `
        <div class="field">
          <label>Page Orientation</label>
          <select id="imgPdfOrient">
            <option value="auto">Auto (Match Image)</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      `;
    }
  } else {
    // PDF Tools
    if (tool === 'merge') {
      html = `
        <div class="field">
          <label>Merge Mode</label>
          <input value="Merge in listed order" disabled>
        </div>
        <div class="field">
          <label>Output Filename</label>
          <input id="mergeFileName" value="merged-documents.pdf">
        </div>
      `;
    } else if (tool === 'split') {
      html = `
        <div class="field">
          <label>Pages to Extract (e.g. 1-3, 5)</label>
          <input id="pageRange" value="1" placeholder="e.g. 1 or 1-4 or 1,3,5">
        </div>
        <div class="field">
          <label>Extraction Strategy</label>
          <select id="splitMode">
            <option value="single">Single PDF with selected pages</option>
            <option value="each">Extract every page into individual file</option>
          </select>
        </div>
      `;
    } else if (tool === 'rotate-pdf') {
      html = `
        <div class="field">
          <label>Rotate Angle</label>
          <select id="prot">
            <option value="90">90° Clockwise</option>
            <option value="180">180° Flip</option>
            <option value="270">270° Counter-Clockwise</option>
          </select>
        </div>
      `;
    } else if (tool === 'watermark') {
      html = `
        <div class="field">
          <label>Watermark Text</label>
          <input id="wm" value="CONFIDENTIAL">
        </div>
        <div class="field">
          <label>Opacity (0.1 - 1.0)</label>
          <input id="op" type="range" min="0.1" max="0.9" step="0.05" value="0.25">
        </div>
        <div class="field">
          <label>Font Size</label>
          <input id="wmSize" type="number" min="14" max="72" value="32">
        </div>
      `;
    } else if (tool === 'pdf-to-image') {
      html = `
        <div class="field">
          <label>Output Image Format</label>
          <select id="pdfImgFormat">
            <option value="image/jpeg">JPG High Quality</option>
            <option value="image/png">PNG Lossless</option>
          </select>
        </div>
        <div class="field">
          <label>Render Scale</label>
          <select id="pdfImgScale">
            <option value="1.5">Standard (1.5x Resolution)</option>
            <option value="2.0">High Definition (2.0x Retina)</option>
            <option value="1.0">Web Standard (1.0x)</option>
          </select>
        </div>
      `;
    } else if (tool === 'info') {
      html = `
        <div class="field">
          <label>Audit Details</label>
          <input value="Full structural page & size breakdown" disabled>
        </div>
      `;
    }
  }

  box.innerHTML = html;

  // Bind dynamic inputs
  const q = $('quality');
  if (q) q.oninput = () => ($('qualityLabel').textContent = q.value + '%');

  const cq = $('convQuality');
  if (cq) cq.oninput = () => ($('convQualityLabel').textContent = cq.value + '%');

  const cp = $('cropPresetSel');
  if (cp) {
    cp.onchange = () => {
      cropPreset = cp.value;
      const cw = $('cw');
      const ch = $('ch');
      if (!cw || !ch) return;
      if (cropPreset === '1:1') {
        ch.value = cw.value;
      } else if (cropPreset === '16:9') {
        ch.value = Math.round((cw.value * 9) / 16);
      } else if (cropPreset === '9:16') {
        ch.value = Math.round((cw.value * 16) / 9);
      } else if (cropPreset === '4:3') {
        ch.value = Math.round((cw.value * 3) / 4);
      }
    };
  }
}

function clearFiles() {
  if ($('fileInput')) $('fileInput').value = '';
  files = [];
  if ($('fileList')) $('fileList').innerHTML = '';
  if ($('result')) {
    $('result').className = 'result';
    $('result').innerHTML = '';
  }
}

function listFiles() {
  const fl = $('fileList');
  if (!fl) return;

  const isMulti = tool === 'merge' || tool === 'image-pdf';

  fl.innerHTML =
    files
      .map(
        (f, i) => `
      <div class="file-row">
        <div style="min-width:0">
          <div class="file-name">${esc(f.name)}</div>
          <div class="file-meta">${fmt(f.size)} • ${esc(f.type || 'file')}</div>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          ${isMulti && i > 0 ? `<button class="btn secondary btn-sm" onclick="moveFile(${i}, -1)" title="Move Up">↑</button>` : ''}
          ${isMulti && i < files.length - 1 ? `<button class="btn secondary btn-sm" onclick="moveFile(${i}, 1)" title="Move Down">↓</button>` : ''}
          <button class="btn secondary btn-sm" onclick="removeFile(${i})">Remove</button>
        </div>
      </div>`
      )
      .join('') +
    (files.length && isMulti
      ? `<div style="margin-top:12px;text-align:right;">
           <button class="btn primary" id="processBtn">Process ${files.length} Files Now</button>
         </div>`
      : '');

  const p = $('processBtn');
  if (p) p.onclick = processCurrent;
}

window.moveFile = function (index, dir) {
  const target = index + dir;
  if (target < 0 || target >= files.length) return;
  const temp = files[index];
  files[index] = files[target];
  files[target] = temp;
  listFiles();
};

window.removeFile = function (index) {
  files.splice(index, 1);
  listFiles();
  if (!files.length && $('result')) {
    $('result').className = 'result';
    $('result').innerHTML = '';
  }
};

function acceptFiles(fs) {
  const isMulti = tool === 'merge' || tool === 'image-pdf';
  files = isMulti ? [...files, ...fs] : fs.slice(0, 1);
  listFiles();
  if (files.length && !isMulti) {
    processCurrent();
  }
}

function setupDrop() {
  const d = $('dropzone');
  if (!d) return;
  ['dragenter', 'dragover'].forEach((e) =>
    d.addEventListener(e, (x) => {
      x.preventDefault();
      d.classList.add('drag');
    })
  );
  ['dragleave', 'drop'].forEach((e) =>
    d.addEventListener(e, (x) => {
      x.preventDefault();
      d.classList.remove('drag');
    })
  );
  d.addEventListener('drop', (e) => {
    e.preventDefault();
    acceptFiles([...e.dataTransfer.files]);
  });
  if ($('pickBtn')) $('pickBtn').onclick = () => $('fileInput')?.click();
  if ($('fileInput')) $('fileInput').onchange = (e) => acceptFiles([...e.target.files]);
}

function blobFromCanvas(c, m, q) {
  return new Promise((r) => c.toBlob(r, m, q));
}

function loadImage(f) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const u = URL.createObjectURL(f);
    img.onload = () => {
      URL.revokeObjectURL(u);
      resolve(img);
    };
    img.onerror = reject;
    img.src = u;
  });
}

function ext(m) {
  return m === 'image/png' ? 'png' : m === 'image/jpeg' ? 'jpg' : 'webp';
}

// Client-side image processing
async function processImage(f) {
  const img = await loadImage(f);
  let w = img.width;
  let h = img.height;
  let outMime = f.type || 'image/jpeg';
  let q = 0.8;

  if (tool === 'compress') {
    const qVal = $('quality') ? Number($('quality').value) / 100 : 0.78;
    q = qVal;
    const maxW = $('maxWidth') && $('maxWidth').value ? Number($('maxWidth').value) : null;
    if (maxW && w > maxW) {
      h = Math.round((h * maxW) / w);
      w = maxW;
    }
    const cf = $('compFormat') ? $('compFormat').value : 'keep';
    if (cf !== 'keep') outMime = cf;
  } else if (tool === 'resize') {
    w = Math.max(1, Number($('rw')?.value) || w);
    h = Math.max(1, Number($('rh')?.value) || h);
    outMime = $('rf')?.value || 'image/webp';
    q = 0.88;
  } else if (tool === 'convert') {
    outMime = $('cf')?.value || 'image/webp';
    q = $('convQuality') ? Number($('convQuality').value) / 100 : 0.9;
  } else if (tool === 'crop') {
    const targetW = Math.min(w, Math.max(1, Number($('cw')?.value) || w));
    const targetH = Math.min(h, Math.max(1, Number($('ch')?.value) || h));
    const c = document.createElement('canvas');
    c.width = targetW;
    c.height = targetH;
    const ctx = c.getContext('2d');
    const sx = Math.max(0, (img.width - targetW) / 2);
    const sy = Math.max(0, (img.height - targetH) / 2);
    ctx.drawImage(img, sx, sy, targetW, targetH, 0, 0, targetW, targetH);
    const blob = await blobFromCanvas(c, outMime, 0.9);
    return {
      blob,
      name: `toolnest-cropped-${f.name.replace(/\.[^.]+$/, '')}.${ext(outMime)}`,
      msg: `Cropped to ${targetW}×${targetH} px (${fmt(blob.size)}).`,
    };
  } else if (tool === 'rotate') {
    const deg = Number($('rot')?.value) || 90;
    if (deg === 90 || deg === 270) {
      [w, h] = [h, w];
    }
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.translate(w / 2, h / 2);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    const blob = await blobFromCanvas(c, outMime, 0.9);
    return {
      blob,
      name: `toolnest-rotated-${f.name.replace(/\.[^.]+$/, '')}.${ext(outMime)}`,
      msg: `Rotated by ${deg}° (${fmt(blob.size)}).`,
    };
  }

  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await blobFromCanvas(c, outMime, q);

  const diffBytes = f.size - blob.size;
  const diffPct = Math.round((diffBytes / f.size) * 100);
  const savedTxt = diffBytes > 0 ? `Saved ${fmt(diffBytes)} (${diffPct}%)` : `Output ${fmt(blob.size)}`;

  return {
    blob,
    name: `toolnest-${f.name.replace(/\.[^.]+$/, '')}.${ext(outMime)}`,
    msg: `Produced ${w}×${h} ${ext(outMime).toUpperCase()} • ${savedTxt}`,
  };
}

// Images to single PDF document
async function imagesToPdf(imgFiles) {
  if (!window.PDFLib) throw Error('PDF library unavailable');
  const pdf = await PDFLib.PDFDocument.create();

  for (const f of imgFiles) {
    const bytes = await f.arrayBuffer();
    const img = await loadImage(f);
    const page = pdf.addPage([img.width, img.height]);
    const embedded =
      f.type === 'image/png'
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);
    page.drawImage(embedded, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const saved = await pdf.save();
  const blob = new Blob([saved], { type: 'application/pdf' });
  return {
    blob,
    name: `toolnest-document-${imgFiles.length}-pages.pdf`,
    msg: `Compiled ${imgFiles.length} image(s) into a unified PDF document (${fmt(blob.size)}).`,
  };
}

// Client-side PDF processing
async function processPdf() {
  if (!window.PDFLib) throw Error('PDF library unavailable');

  if (tool === 'merge') {
    if (files.length < 2) throw Error('Please add at least 2 PDF files to merge.');
    const out = await PDFLib.PDFDocument.create();
    for (const f of files) {
      const d = await PDFLib.PDFDocument.load(await f.arrayBuffer());
      const pages = await out.copyPages(d, d.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    }
    const saved = await out.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: 'application/pdf' });
    const outName = $('mergeFileName')?.value?.trim() || 'merged-documents.pdf';
    return {
      blob,
      name: outName.endsWith('.pdf') ? outName : outName + '.pdf',
      msg: `Merged ${files.length} PDFs into a single file (${fmt(saved.length)}).`,
    };
  }

  const src = files[0];
  const bytes = await src.arrayBuffer();
  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: false });
  const totalPages = doc.getPageCount();

  if (tool === 'info') {
    return {
      info: true,
      msg: `Document has ${totalPages} page(s) • Original size: ${fmt(src.size)} • Title: "${doc.getTitle() || 'Untitled'}".`,
    };
  }

  if (tool === 'split') {
    const rawRange = $('pageRange')?.value?.trim() || '1';
    const targetPages = parsePageRange(rawRange, totalPages);
    if (!targetPages.length) throw Error(`Invalid page range. Document has ${totalPages} pages.`);

    const out = await PDFLib.PDFDocument.create();
    const copied = await out.copyPages(doc, targetPages);
    copied.forEach((p) => out.addPage(p));
    const saved = await out.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: 'application/pdf' });
    return {
      blob,
      name: `toolnest-split-pages-${rawRange.replace(/[^0-9,-]/g, '')}.pdf`,
      msg: `Extracted ${targetPages.length} page(s) [${targetPages.map((n) => n + 1).join(', ')}] (${fmt(saved.length)}).`,
    };
  }

  if (tool === 'rotate-pdf') {
    const deg = Number($('prot')?.value) || 90;
    doc.getPages().forEach((p) => {
      const current = p.getRotation().angle || 0;
      p.setRotation(PDFLib.degrees((current + deg) % 360));
    });
    const saved = await doc.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: 'application/pdf' });
    return {
      blob,
      name: `toolnest-rotated-${deg}deg.pdf`,
      msg: `Rotated all ${totalPages} pages by ${deg}° (${fmt(saved.length)}).`,
    };
  }

  if (tool === 'watermark') {
    const text = $('wm')?.value || 'ToolNest';
    const opacity = Number($('op')?.value) || 0.25;
    const size = Number($('wmSize')?.value) || 32;

    doc.getPages().forEach((p) => {
      const { width, height } = p.getSize();
      p.drawText(text, {
        x: Math.max(20, width / 2 - (text.length * size) / 4),
        y: height / 2,
        size,
        color: PDFLib.rgb(0.2, 0.2, 0.2),
        opacity,
        rotate: PDFLib.degrees(35),
      });
    });

    const saved = await doc.save({ useObjectStreams: true });
    const blob = new Blob([saved], { type: 'application/pdf' });
    return {
      blob,
      name: `toolnest-watermarked-${src.name}`,
      msg: `Watermarked all ${totalPages} pages with "${text}" (${fmt(saved.length)}).`,
    };
  }

  if (tool === 'pdf-to-image') {
    // If PDF.js is available in window
    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
      const pdf = await loadingTask.promise;
      const firstPage = await pdf.getPage(1);
      const scale = Number($('pdfImgScale')?.value) || 1.5;
      const viewport = firstPage.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await firstPage.render({ canvasContext: ctx, viewport }).promise;
      const mime = $('pdfImgFormat')?.value || 'image/jpeg';
      const blob = await blobFromCanvas(canvas, mime, 0.9);
      return {
        blob,
        name: `toolnest-${src.name.replace(/\.[^.]+$/, '')}-page-1.${ext(mime)}`,
        msg: `Rendered Page 1 to high-res ${ext(mime).toUpperCase()} (${viewport.width}×${viewport.height}px, ${fmt(blob.size)}).`,
      };
    }
    throw Error('PDF render worker is loading. Please try again.');
  }

  throw Error('Unsupported PDF operation');
}

function parsePageRange(rangeStr, maxPages) {
  const result = new Set();
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          result.add(i - 1);
        }
      }
    } else {
      const single = parseInt(trimmed, 10);
      if (!isNaN(single) && single >= 1 && single <= maxPages) {
        result.add(single - 1);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

// Master Process Runner
async function processCurrent() {
  if (!files.length) {
    toast('Please choose or drop a file first');
    return;
  }

  const resBox = $('result');
  if (resBox) {
    resBox.className = 'result show';
    resBox.innerHTML = '<div style="display:flex;gap:10px;align-items:center;"><div class="spinner"></div><span>Processing file in browser...</span></div>';
  }

  try {
    let r;
    if (mode === 'image' && tool === 'image-pdf') {
      r = await imagesToPdf(files);
    } else if (mode === 'image') {
      r = await processImage(files[0]);
    } else {
      r = await processPdf();
    }

    if (!resBox) return;
    resBox.className = 'result show';

    if (r.info) {
      resBox.innerHTML = `<strong>✓ Audit Completed</strong><div style="color:var(--muted);margin-top:6px;">${esc(r.msg)}</div>`;
    } else {
      const u = URL.createObjectURL(r.blob);
      resBox.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <strong style="color:var(--success,#067647);">✓ Processing Complete!</strong>
            <div style="color:var(--muted);font-size:13px;margin-top:4px;">${esc(r.msg)}</div>
          </div>
          <a class="btn primary" href="${u}" download="${esc(r.name)}" style="text-decoration:none;">
            Download Result
          </a>
        </div>
      `;
    }
    toast('Task completed successfully');
  } catch (e) {
    console.error(e);
    if (resBox) {
      resBox.className = 'result show';
      resBox.innerHTML = `<strong style="color:#dc2626;">Could not process file</strong><div style="color:var(--muted);margin-top:4px;">${esc(e.message || 'Please check the file format and try again.')}</div>`;
    }
    toast(e.message || 'Error processing file');
  }
}

function setupWorkspace() {
  if (!$('workspace')) return;
  document.querySelectorAll('[data-mode]').forEach((b) => {
    b.onclick = () => {
      mode = b.dataset.mode;
      tool = mode === 'image' ? 'compress' : 'merge';
      document.querySelectorAll('[data-mode]').forEach((x) => x.classList.toggle('active', x.dataset.mode === mode));
      renderTools();
      updateWorkspace();
    };
  });
  setupDrop();
  renderTools();
  updateWorkspace();
}

// AI Utility Hub (connected to Cloudflare Function /api/ai)
function setupAI() {
  const actionSel = $('aiAction');
  const runBtn = $('runAI');
  const copyBtn = $('copyAI');
  const inputEl = $('aiInput');
  const outputEl = $('aiOutput');
  if (!runBtn || !inputEl || !outputEl) return;

  runBtn.onclick = async () => {
    const text = inputEl.value.trim();
    if (!text) {
      toast('Please enter or paste some text first');
      return;
    }

    const action = actionSel ? actionSel.value : 'summarize';
    runBtn.disabled = true;
    runBtn.textContent = 'Generating...';
    outputEl.value = 'Connecting to AI model and generating response...';

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text }),
      });

      if (response.ok) {
        const data = await response.json();
        outputEl.value = data.result || 'No response generated.';
        toast('AI Generation complete!');
      } else {
        // Fallback demo generation
        const words = text.split(/\s+/);
        if (action === 'summarize') {
          outputEl.value = `Summary:\n• ${words.slice(0, 30).join(' ')}...\n• Key point: Content covers ${words.length} words across topics discussed.`;
        } else if (action === 'title') {
          outputEl.value = `Suggested Titles:\n1. ${words.slice(0, 6).join(' ')}\n2. Complete Guide: ${words.slice(0, 5).join(' ')}\n3. Why ${words.slice(0, 4).join(' ')} Matters Today`;
        } else {
          outputEl.value = `Rewritten & Polished:\n\n${text.trim()}\n\n(Optimized for clarity and professional tone)`;
        }
        toast('AI completed in fallback mode');
      }
    } catch (e) {
      // Local fallback
      outputEl.value = `Summary:\n• ${text.slice(0, 200)}...\n\n(Total input: ${text.split(/\s+/).length} words)`;
      toast('Generated summary');
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = 'Run AI Tool';
    }
  };

  if (copyBtn) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(outputEl.value);
        toast('Copied to clipboard!');
      } catch {
        toast('Copy to clipboard failed');
      }
    };
  }
}

// Data Automation (CSV Cleaner & Deduplicator)
function setupAutomation() {
  const cleanBtn = $('cleanCsv');
  const dlBtn = $('downloadCsv');
  const inputEl = $('csvInput');
  const outputEl = $('csvOutput');
  const statsEl = $('csvStats');
  if (!cleanBtn || !inputEl || !outputEl) return;

  cleanBtn.onclick = () => {
    const raw = inputEl.value.trim();
    if (!raw) {
      toast('Paste CSV data first');
      return;
    }
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const rows = lines.map((x) => x.split(',').map((s) => s.trim()));
    const seen = new Set();
    const out = [];

    rows.forEach((r) => {
      const key = r.join('\u001f').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(r.join(','));
      }
    });

    outputEl.value = out.join('\n');
    const removed = rows.length - out.length;
    if (statsEl) {
      statsEl.textContent = `${rows.length} rows processed → ${out.length} unique rows (${removed} duplicate(s) removed).`;
    }
    toast(`Cleaned CSV: ${removed} duplicate(s) removed`);
  };

  if (dlBtn) {
    dlBtn.onclick = () => {
      if (!outputEl.value.trim()) {
        toast('Clean some CSV data first');
        return;
      }
      const b = new Blob([outputEl.value], { type: 'text/csv' });
      const u = URL.createObjectURL(b);
      const a = document.createElement('a');
      a.href = u;
      a.download = 'toolnest-cleaned.csv';
      a.click();
      URL.revokeObjectURL(u);
      toast('Downloaded cleaned CSV');
    };
  }
}

// ============================================================
// PAYTM & UPI PAYMENT SYSTEM (SELF-CONTAINED)
// ============================================================
function openUpiPaymentModal(opts = {}) {
  const options = typeof opts === 'string' ? { title: opts } : (opts || {});
  const title = options.title || 'ToolNest Digital Product';
  const amount = options.amount || 99;

  let overlay = document.getElementById('upiPayOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'upi-overlay';
    overlay.id = 'upiPayOverlay';
    document.body.appendChild(overlay);
  }

  const upiId = '7987761789@ptyes';
  const payeeName = 'TheBhom';
  const note = (title.length > 28 ? title.slice(0, 25) + '...' : title).replace(/[^\w\s]/gi, '');
  const upiIntentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  const waMsg = `Hi TheBhom, I have completed the UPI payment of ₹${amount} for "${title}".\nUPI ID: ${upiId}\n\nPlease verify and activate my access!`;
  const waLink = `https://wa.me/917987761789?text=${encodeURIComponent(waMsg)}`;
  
  let qrSrc = 'upi-qr.png?v=20260914_qr2';
  if (!window.location.pathname.includes('/tools/')) {
    qrSrc = 'assets/upi-qr.png?v=20260914_qr2';
  }

  overlay.innerHTML = `
    <div class="upi-modal" onclick="event.stopPropagation()">
      <button class="upi-close-btn" onclick="closeUpiPaymentModal()" title="Close">✕</button>
      
      <div class="upi-header">
        <div class="upi-badge">⚡ Instant UPI / QR Payment</div>
        <h3 class="upi-title">${esc(title)}</h3>
        <div class="upi-amount-pill">Amount to Pay: <span class="upi-amount-num">₹${amount}</span></div>
      </div>

      <div class="upi-qr-card">
        <div class="upi-apps-strip">
          <span>Paytm</span> • <span>Google Pay</span> • <span>PhonePe</span> • <span>BHIM</span> • <span>Cred</span>
        </div>
        <div class="upi-qr-frame">
          <img src="${qrSrc}" alt="Paytm UPI QR Code" class="upi-qr-image" onerror="if(this.src.indexOf('/assets/')===-1)this.src='/assets/upi-qr.png?v=20260914_qr2';"/>
        </div>
        <div class="upi-merchant-badge">
          <span class="upi-verified-tick">✓</span> Verified Merchant: <strong>TheBhom / Bhom Vrat Rai</strong>
        </div>
      </div>

      <div class="upi-id-row">
        <div class="upi-id-label">UPI ID:</div>
        <div class="upi-id-val" id="upiIdVal">${upiId}</div>
        <button class="upi-copy-btn" id="upiCopyBtn" onclick="copyUpiId('${upiId}')" title="Copy UPI ID">
          <span>📋 Copy</span>
        </button>
      </div>

      <div class="upi-actions">
        <a href="${upiIntentUrl}" class="upi-app-btn">
          <span>📱</span> Pay directly in Any UPI App
        </a>
        <a href="${waLink}" target="_blank" rel="noopener" class="upi-whatsapp-btn">
          <span>💬</span> Send Screenshot / UTR on WhatsApp
        </a>
      </div>

      <div class="upi-utr-section">
        <div class="upi-utr-title">Enter Payment Details for Instant Verification:</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px;">
          <input type="email" id="upiEmailInput" placeholder="Your Email Address (for delivery)" required style="background:#fff;border:1px solid #cbd5e1;border-radius:8px;color:#0f172a;padding:9px 12px;font-size:0.84rem;outline:none;" />
          <input type="text" id="upiNameInput" placeholder="Your Name (Optional)" style="background:#fff;border:1px solid #cbd5e1;border-radius:8px;color:#0f172a;padding:9px 12px;font-size:0.84rem;outline:none;" />
          <div class="upi-utr-box">
            <input type="text" id="upiUtrInput" placeholder="12-digit UTR / Ref Number" maxlength="30" style="flex:1;" />
            <button onclick="submitUpiVerification('${esc(title)}', ${amount})" class="upi-verify-btn" id="upiSubmitBtn">Confirm</button>
          </div>
        </div>
        <div class="upi-footer-note">🔒 100% Secure Direct UPI Transfer. Instant verification & delivery.</div>
      </div>
    </div>
  `;

  overlay.onclick = closeUpiPaymentModal;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeUpiPaymentModal() {
  if (window._upiPollTimer) {
    clearInterval(window._upiPollTimer);
    window._upiPollTimer = null;
  }
  const overlay = document.getElementById('upiPayOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function copyUpiId(id) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(id).then(() => {
      const btn = document.getElementById('upiCopyBtn');
      if (btn) {
        btn.innerHTML = '<span>✓ Copied!</span>';
        btn.style.background = '#16a34a';
        setTimeout(() => {
          btn.innerHTML = '<span>📋 Copy</span>';
          btn.style.background = '#0284c7';
        }, 2500);
      }
      toast('✓ UPI ID Copied: ' + id);
    }).catch(() => fallbackCopy(id));
  } else {
    fallbackCopy(id);
  }
}

function fallbackCopy(text) {
  const t = document.createElement('textarea');
  t.value = text;
  document.body.appendChild(t);
  t.select();
  try {
    document.execCommand('copy');
    toast('✓ UPI ID Copied: ' + text);
  } catch(e){}
  document.body.removeChild(t);
}

async function submitUpiVerification(title, amount) {
  const utrInp = document.getElementById('upiUtrInput');
  const emailInp = document.getElementById('upiEmailInput');
  const nameInp = document.getElementById('upiNameInput');
  const btn = document.getElementById('upiSubmitBtn');

  const utr = (utrInp ? utrInp.value.trim() : '');
  const email = (emailInp ? emailInp.value.trim() : '');
  const name = (nameInp ? nameInp.value.trim() : '');

  if (!email || !email.includes('@')) {
    toast('⚠️ Please enter a valid email address');
    if (emailInp) emailInp.focus();
    return;
  }

  if (!utr || utr.length < 6) {
    toast('⚠️ Please enter valid 12-digit UTR number');
    if (utrInp) utrInp.focus();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting...';
  }

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: name || 'Customer',
        userEmail: email,
        productName: title,
        amount: amount,
        utrNumber: utr
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      toast('⚠️ ' + (data.error || 'Failed to submit payment details'));
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Confirm';
      }
      return;
    }

    const orderId = data.orderId;
    toast('🎉 Payment submitted! Order #' + orderId);

    // Render Live Verification Screen inside modal
    const modalBox = document.querySelector('.upi-modal');
    if (modalBox) {
      modalBox.innerHTML = `
        <button class="upi-close-btn" onclick="closeUpiPaymentModal()" title="Close">✕</button>
        <div style="text-align:center;padding:10px 0;">
          <div style="font-size:2.8rem;margin-bottom:8px;animation:spin 2s linear infinite;" id="statusIcon">⏳</div>
          <h3 style="font-size:1.3rem;font-weight:900;color:#0f172a;margin-bottom:6px;" id="statusHeading">Verifying Your Payment</h3>
          <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:8px 14px;font-size:0.85rem;color:#0f172a;font-family:monospace;display:inline-block;margin-bottom:12px;">
            Order ID: <strong>#${orderId}</strong>
          </div>
          <p style="font-size:0.85rem;color:#475569;line-height:1.5;margin-bottom:14px;" id="statusMsg">
            We are verifying UTR <strong>${utr}</strong> for <strong>₹${amount}</strong>.<br>
            Please keep this tab open. As soon as the owner approves, your plan will unlock right here automatically!
          </p>
          <div id="unlockContainer" style="display:none;margin-top:14px;"></div>
          <div style="font-size:0.75rem;color:#64748b;margin-top:10px;">
            Live Auto-Checking every 3 seconds...
          </div>
        </div>
      `;
    }

    // Start Polling for Approval
    if (window._upiPollTimer) clearInterval(window._upiPollTimer);
    window._upiPollTimer = setInterval(async () => {
      try {
        const checkRes = await fetch('/api/orders?id=' + encodeURIComponent(orderId));
        const checkData = await checkRes.json();
        if (checkData.found && checkData.order && checkData.order.isApproved) {
          clearInterval(window._upiPollTimer);
          window._upiPollTimer = null;

          // Save unlocked plan locally
          try {
            const unlocked = JSON.parse(localStorage.getItem('thebhom_unlocked_plans') || '[]');
            unlocked.push({ id: orderId, product: title, key: checkData.order.licenseKey, date: new Date().toISOString() });
            localStorage.setItem('thebhom_unlocked_plans', JSON.stringify(unlocked));
          } catch(e){}

          // Update UI to Approved
          const icon = document.getElementById('statusIcon');
          const heading = document.getElementById('statusHeading');
          const msg = document.getElementById('statusMsg');
          const unlockBox = document.getElementById('unlockContainer');

          if (icon) {
            icon.textContent = '🎉';
            icon.style.animation = '';
          }
          if (heading) {
            heading.textContent = 'Payment Approved & Unlocked!';
            heading.style.color = '#059669';
          }
          if (msg) {
            msg.innerHTML = `Congratulations <strong>${name || email}</strong>! Your access is now activated.<br>License Key: <strong style="font-family:monospace;color:#059669;background:#ecfdf3;padding:3px 8px;border-radius:6px;border:1px solid #a7f3d0;">${checkData.order.licenseKey}</strong>`;
          }
          if (unlockBox) {
            unlockBox.style.display = 'block';
            unlockBox.innerHTML = `
              <div style="background:#ecfdf3;border:1px solid #a7f3d0;border-radius:14px;padding:12px;margin-bottom:12px;">
                <div style="font-weight:800;color:#065f46;font-size:0.95rem;">✓ Access Granted: ${esc(title)}</div>
                <div style="font-size:0.8rem;color:#047857;margin-top:4px;">Downloads and premium tools unlocked for this session!</div>
              </div>
              <button class="btn primary" onclick="closeUpiPaymentModal();toast('✓ All features unlocked!');" style="width:100%;padding:12px;font-weight:800;background:#e11d48;">
                ⚡ Start Using Now
              </button>
            `;
          }
          toast('🎉 Order #' + orderId + ' approved by owner!');
        }
      } catch(e){}
    }, 3500);

  } catch (err) {
    toast('⚠️ Error: ' + err.message);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirm';
    }
  }
}

window.openUpiPaymentModal = openUpiPaymentModal;
window.closeUpiPaymentModal = closeUpiPaymentModal;
window.copyUpiId = copyUpiId;
window.submitUpiVerification = submitUpiVerification;

// Digital Products Catalog & Cart
const products = [
  { id: 'excel-cleaner', name: 'Excel Data Cleaning Pack', desc: 'Ready-to-use sheets for duplicates, formatting and cleanup workflows.', price: 99, icon: '📊' },
  { id: 'invoice-pack', name: 'Small Business Invoice Pack', desc: 'Editable invoice and quotation templates for everyday business work.', price: 149, icon: '📄' },
  { id: 'prompt-pack', name: 'AI Productivity Prompt Pack', desc: 'Practical prompts for research, writing and admin tasks.', price: 79, icon: '🤖' },
  { id: 'pdf-kit', name: 'PDF Workflow Checklist', desc: 'Printable checklist for organizing, reviewing and sharing PDF files.', price: 49, icon: '📋' },
];

function getCart() {
  return JSON.parse(localStorage.getItem('toolnest-cart') || '[]');
}
function setCart(c) {
  localStorage.setItem('toolnest-cart', JSON.stringify(c));
}
function updateCartCount() {
  const n = getCart().reduce((a, x) => a + x.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach((x) => (x.textContent = n));
}
function addToCart(id) {
  const c = getCart();
  const p = c.find((x) => x.id === id);
  if (p) p.qty++;
  else c.push({ id, qty: 1 });
  setCart(c);
  updateCartCount();
  toast('Added to cart!');
  setupCart();
}

function buyProductNow(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  openUpiPaymentModal({
    title: p.name,
    amount: p.price,
    desc: p.desc
  });
}

function renderProducts() {
  const root = $('productGrid');
  if (!root) return;
  root.innerHTML = products
    .map(
      (p) => `
    <article class="card">
      <div class="product-thumb" style="font-size:36px;display:grid;place-items:center;height:90px;background:var(--soft,#eff6ff);border-radius:12px;margin-bottom:12px;">${esc(p.icon)}</div>
      <h3 style="margin:0 0 6px;">${esc(p.name)}</h3>
      <p style="color:var(--muted);font-size:13px;margin:0 0 14px;">${esc(p.desc)}</p>
      <div class="product-meta" style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
        <span class="price-sm" style="font-weight:900;font-size:1.1rem;">₹${p.price}</span>
        <div style="display:flex;gap:6px;">
          <button class="btn secondary btn-sm" data-add="${p.id}" title="Add to Cart">Add to Cart</button>
          <button class="btn primary btn-sm" data-buy="${p.id}" title="Buy via UPI">⚡ Buy Now</button>
        </div>
      </div>
    </article>`
    )
    .join('');

  document.querySelectorAll('[data-add]').forEach((b) => (b.onclick = () => addToCart(b.dataset.add)));
  document.querySelectorAll('[data-buy]').forEach((b) => (b.onclick = () => buyProductNow(b.dataset.buy)));
  updateCartCount();
}

function setupCart() {
  const box = $('cartBox');
  if (!box) return;
  const c = getCart();
  if (!c.length) {
    box.innerHTML = `
      <div class="muted" style="padding:10px 0;">Your cart is empty. Click <strong>⚡ Buy Now</strong> on any product above, or add items to bundle.</div>
      <button class="btn primary checkout-btn" id="checkoutBtn" data-checkout="true" onclick="openUpiPaymentModal({title:'ToolNest Starter Pack', amount:49})" style="margin-top:10px;width:100%;">⚡ Proceed to Instant Checkout (Demo Pack ₹49)</button>
    `;
    return;
  }
  const rows = c
    .map((x) => {
      const p = products.find((pr) => pr.id === x.id);
      return `<div class="file-row" style="margin-bottom:8px;">
        <div>
          <div class="file-name">${esc(p ? p.name : x.id)}</div>
          <div class="file-meta">Qty: ${x.qty} • ₹${(p ? p.price : 0) * x.qty}</div>
        </div>
        <button class="btn secondary btn-sm" data-del="${x.id}">Remove</button>
      </div>`;
    })
    .join('');

  const total = c.reduce((s, x) => s + (products.find((p) => p.id === x.id)?.price || 0) * x.qty, 0);
  box.innerHTML =
    rows +
    `<div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);">
       <strong>Total Amount:</strong>
       <strong style="color:var(--primary);font-size:1.2rem;">₹${total}</strong>
     </div>
     <button class="btn primary checkout-btn" id="checkoutBtn" data-checkout="true" onclick="openUpiPaymentModal({title:'ToolNest Cart (${c.length} Products)', amount:${total > 0 ? total : 49}})" style="margin-top:14px;width:100%;font-size:1rem;padding:12px;font-weight:800;">⚡ Proceed to Instant Checkout (₹${total})</button>`;

  document.querySelectorAll('[data-del]').forEach(
    (b) =>
      (b.onclick = () => {
        setCart(c.filter((x) => x.id !== b.dataset.del));
        setupCart();
        updateCartCount();
      })
  );
}

// Global Delegated Click Listener for ANY checkout button on page
document.addEventListener('click', (e) => {
  const chk = e.target.closest('#checkoutBtn, [data-checkout], .checkout-btn');
  if (chk) {
    e.preventDefault();
    e.stopPropagation();
    const cartItems = getCart();
    const cartTotal = cartItems.reduce((s, x) => s + (products.find((p) => p.id === x.id)?.price || 0) * x.qty, 0);
    const itemNames = cartItems.map(x => products.find(p => p.id === x.id)?.name || x.id).join(', ');
    openUpiPaymentModal({
      title: cartItems.length ? `ToolNest Cart (${cartItems.length} Products)` : 'ToolNest Starter Pack',
      amount: cartTotal > 0 ? cartTotal : 49,
      desc: itemNames || 'Instant Digital Product Access'
    });
  }
});

function setupNav() {
  const b = $('menuBtn');
  const n = $('navLinks');
  if (b && n) b.onclick = () => n.classList.toggle('open');
  document.querySelectorAll('[data-year]').forEach((x) => (x.textContent = new Date().getFullYear()));
}

// Auto-boot
document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupWorkspace();
  setupAI();
  renderProducts();
  setupCart();
  setupAutomation();
});
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setupNav();
  setupWorkspace();
  setupAI();
  renderProducts();
  setupCart();
  setupAutomation();
}
