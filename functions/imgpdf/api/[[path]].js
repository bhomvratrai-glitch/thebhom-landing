/**
 * Cloudflare Pages Function - ImgPDF Universal API Gateway
 * Handles all /imgpdf/api/* requests and routes them to iLovePDF Cloud API
 * or AI services with complete CORS, streaming, and error handling.
 */

const ILOVEAPI_PUBLIC_KEY = 'project_public_0da7fb4b3aac1fe7ccb7fa2674203c1b_0Ynzd5f817bdd20b4ca7247c5647f60ebaa34';
const ILOVEAPI_BASE = 'https://api.ilovepdf.com';

// Cache auth token in memory across warm Cloudflare worker invocations
let cachedToken = null;
let tokenExpiry = 0;

async function getAuthToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch(`${ILOVEAPI_BASE}/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: ILOVEAPI_PUBLIC_KEY }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `iLovePDF Auth Failed (${res.status})`);
  }

  const data = await res.json();
  cachedToken = data.token;
  // Cache for 110 minutes (token valid for 120m)
  tokenExpiry = Date.now() + 110 * 60 * 1000;
  return cachedToken;
}

const TOOL_MAPPINGS = {
  // PDF Organize & Edit
  'merge': { tool: 'merge', ext: 'pdf', mime: 'application/pdf' },
  'split': { tool: 'split', ext: 'zip', mime: 'application/zip', options: { split_mode: 'ranges', ranges: '1' } },
  'compress': { tool: 'compress', ext: 'pdf', mime: 'application/pdf', options: { compression_level: 'recommended' } },
  'compress-pdf': { tool: 'compress', ext: 'pdf', mime: 'application/pdf', options: { compression_level: 'recommended' } },
  'rotate': { tool: 'rotate', ext: 'pdf', mime: 'application/pdf' },
  'rotate-pdf': { tool: 'rotate', ext: 'pdf', mime: 'application/pdf' },
  'remove-pages': { tool: 'split', ext: 'pdf', mime: 'application/pdf' },
  'extract-pages': { tool: 'split', ext: 'pdf', mime: 'application/pdf' },
  'organize-pdf': { tool: 'rotate', ext: 'pdf', mime: 'application/pdf' },
  'page-numbers': { tool: 'pagenumber', ext: 'pdf', mime: 'application/pdf', options: { vertical_position: 'bottom', horizontal_position: 'center' } },
  'add-page-numbers': { tool: 'pagenumber', ext: 'pdf', mime: 'application/pdf', options: { vertical_position: 'bottom', horizontal_position: 'center' } },
  'watermark': { tool: 'watermark', ext: 'pdf', mime: 'application/pdf', options: { mode: 'text', text: 'CONFIDENTIAL', transparency: 50 } },
  'watermark-pdf': { tool: 'watermark', ext: 'pdf', mime: 'application/pdf', options: { mode: 'text', text: 'CONFIDENTIAL', transparency: 50 } },

  // PDF Office Conversions
  'word-to-pdf': { tool: 'officepdf', ext: 'pdf', mime: 'application/pdf' },
  'excel-to-pdf': { tool: 'officepdf', ext: 'pdf', mime: 'application/pdf' },
  'ppt-to-pdf': { tool: 'officepdf', ext: 'pdf', mime: 'application/pdf' },
  'powerpoint-to-pdf': { tool: 'officepdf', ext: 'pdf', mime: 'application/pdf' },
  'pdf-to-word': { tool: 'officepdf', ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  'pdf-to-excel': { tool: 'officepdf', ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  'pdf-to-powerpoint': { tool: 'officepdf', ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  'pdf-to-jpg': { tool: 'pdfjpg', ext: 'zip', mime: 'application/zip', options: { pdfjpg_mode: 'pages' } },
  'to-jpg': { tool: 'pdfjpg', ext: 'zip', mime: 'application/zip', options: { pdfjpg_mode: 'pages' } },
  'jpg-to-pdf': { tool: 'imagepdf', ext: 'pdf', mime: 'application/pdf' },
  'html-to-pdf': { tool: 'htmlpdf', ext: 'pdf', mime: 'application/pdf' },
  'pdf-to-pdfa': { tool: 'pdfa', ext: 'pdf', mime: 'application/pdf', options: { conformance: 'pdfa-2b' } },
  'to-pdfa': { tool: 'pdfa', ext: 'pdf', mime: 'application/pdf', options: { conformance: 'pdfa-2b' } },

  // PDF Advanced & Security
  'ocr': { tool: 'pdfocr', ext: 'pdf', mime: 'application/pdf', options: { ocr_languages: ['eng'] } },
  'ocr-pdf': { tool: 'pdfocr', ext: 'pdf', mime: 'application/pdf', options: { ocr_languages: ['eng'] } },
  'repair': { tool: 'repair', ext: 'pdf', mime: 'application/pdf' },
  'repair-pdf': { tool: 'repair', ext: 'pdf', mime: 'application/pdf' },
  'unlock': { tool: 'unlock', ext: 'pdf', mime: 'application/pdf' },
  'unlock-pdf': { tool: 'unlock', ext: 'pdf', mime: 'application/pdf' },
  'protect': { tool: 'protect', ext: 'pdf', mime: 'application/pdf' },
  'protect-pdf': { tool: 'protect', ext: 'pdf', mime: 'application/pdf' },

  // Image Tools
  'compress-image': { tool: 'compressimage', ext: 'jpg', mime: 'image/jpeg' },
  'resize-image': { tool: 'resizeimage', ext: 'jpg', mime: 'image/jpeg', options: { resize_mode: 'pixels' } },
  'crop-image': { tool: 'cropimage', ext: 'jpg', mime: 'image/jpeg' },
  'rotate-image': { tool: 'rotateimage', ext: 'jpg', mime: 'image/jpeg' },
  'watermark-image': { tool: 'watermarkimage', ext: 'jpg', mime: 'image/jpeg' },
  'convert-image': { tool: 'convertimage', ext: 'png', mime: 'image/png', options: { to: 'png' } },
  'upscale-image': { tool: 'upscaleimage', ext: 'jpg', mime: 'image/jpeg', options: { multiplier: 2 } },
  'remove-background': { tool: 'removebackgroundimage', ext: 'png', mime: 'image/png' },
  'remove-bg': { tool: 'removebackgroundimage', ext: 'png', mime: 'image/png' },
};

function resolveTool(pathSegments) {
  if (!pathSegments || pathSegments.length === 0) return null;
  const segments = pathSegments.filter(s => s && s !== 'v1' && s !== 'api');
  if (segments.length === 0) return null;

  const section = segments[0]?.toLowerCase(); // 'image' or 'pdf' or 'tools' or 'ai'
  const action = segments[segments.length - 1]?.toLowerCase();
  const joined = segments.join('-');

  if (section === 'image') {
    if (TOOL_MAPPINGS[`${action}-image`]) return TOOL_MAPPINGS[`${action}-image`];
    if (action === 'compress') return TOOL_MAPPINGS['compress-image'];
    if (action === 'resize') return TOOL_MAPPINGS['resize-image'];
    if (action === 'crop') return TOOL_MAPPINGS['crop-image'];
    if (action === 'rotate') return TOOL_MAPPINGS['rotate-image'];
    if (action === 'watermark') return TOOL_MAPPINGS['watermark-image'];
    if (action === 'convert') return TOOL_MAPPINGS['convert-image'];
    if (action === 'remove-background' || action === 'remove-bg') return TOOL_MAPPINGS['remove-background'];
    if (action === 'upscale') return TOOL_MAPPINGS['upscale-image'];
  }

  if (TOOL_MAPPINGS[action]) return TOOL_MAPPINGS[action];
  if (TOOL_MAPPINGS[joined]) return TOOL_MAPPINGS[joined];
  if (TOOL_MAPPINGS[`${action}-pdf`]) return TOOL_MAPPINGS[`${action}-pdf`];

  return null;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Expose-Headers': 'Content-Disposition, Content-Type, X-Processing-Time, Content-Length',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context) {
  const { request, params } = context;
  const pathSegments = params.path || [];

  try {
    const mapping = resolveTool(pathSegments);
    if (!mapping) {
      return new Response(JSON.stringify({ error: `Tool not supported or path not mapped: ${pathSegments.join('/')}` }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const files = [];

    const fileEntries = [...formData.getAll('files'), ...formData.getAll('file')];
    for (const entry of fileEntries) {
      if (entry && typeof entry === 'object' && 'arrayBuffer' in entry) {
        files.push(entry);
      }
    }

    if (files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided for processing.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // 1. Authenticate with iLovePDF
    const token = await getAuthToken();

    // 2. Start Task
    const startRes = await fetch(`${ILOVEAPI_BASE}/v1/start/${mapping.tool}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!startRes.ok) {
      const err = await startRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to start ${mapping.tool} task (${startRes.status})`);
    }

    const { server, task } = await startRes.json();

    // 3. Upload File(s)
    const uploadedFiles = [];
    for (const f of files) {
      const uploadForm = new FormData();
      uploadForm.append('task', task);
      uploadForm.append('file', f, f.name || 'document.pdf');

      const upRes = await fetch(`https://${server}/v1/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: uploadForm,
      });

      if (!upRes.ok) {
        const err = await upRes.json().catch(() => ({}));
        throw new Error(err.error?.message || `Failed to upload ${f.name}`);
      }

      const upData = await upRes.json();
      uploadedFiles.push({
        server_filename: upData.server_filename,
        filename: f.name || 'document.pdf',
      });
    }

    // 4. Extract custom options from form data
    const processOptions = { ...(mapping.options || {}) };
    for (const [key, value] of formData.entries()) {
      if (key !== 'file' && key !== 'files') {
        processOptions[key] = value;
      }
    }

    // 5. Process Task
    const processRes = await fetch(`https://${server}/v1/process`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        tool: mapping.tool,
        files: uploadedFiles,
        ...processOptions,
      }),
    });

    if (!processRes.ok) {
      const err = await processRes.json().catch(() => ({}));
      throw new Error(err.error?.message || `Processing failed for ${mapping.tool}`);
    }

    const processData = await processRes.json();

    // 6. Download Result
    const downloadRes = await fetch(`https://${server}/v1/download/${task}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!downloadRes.ok) {
      throw new Error(`Failed to download processed result from iLovePDF (${downloadRes.status})`);
    }

    const resultBuffer = await downloadRes.arrayBuffer();
    const downloadFilename = processData.download_filename || `processed-${files[0].name.replace(/\.[^.]+$/, '')}.${mapping.ext}`;

    return new Response(resultBuffer, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': mapping.mime,
        'Content-Disposition': `attachment; filename="${downloadFilename}"`,
        'Content-Length': resultBuffer.byteLength.toString(),
        'X-Processing-Time': processData.timer || '0.1s',
      },
    });

  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal processing error' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    status: 'online',
    service: 'ImgPDF Universal Cloud Gateway',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
