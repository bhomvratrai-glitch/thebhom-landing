import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baileysDir = path.join(__dirname, 'node_modules', '@whiskeysockets', 'baileys');

if (fs.existsSync(baileysDir)) {
  console.log('[Patch] Patching Baileys for WhatsApp Newsletter media uploads...');

  // 1. Defaults/index.js
  const defaultsPath = path.join(baileysDir, 'lib', 'Defaults', 'index.js');
  if (fs.existsSync(defaultsPath)) {
    let code = fs.readFileSync(defaultsPath, 'utf-8');
    if (!code.includes('NEWSLETTER_MEDIA_PATH_MAP')) {
      const addition = `
export const NEWSLETTER_MEDIA_PATH_MAP = {
    image: '/newsletter/newsletter-image',
    video: '/newsletter/newsletter-video',
    document: '/newsletter/newsletter-document',
    audio: '/newsletter/newsletter-audio',
    sticker: '/newsletter/newsletter-image',
    'thumbnail-link': '/newsletter/newsletter-thumbnail-link'
};
`;
      code += addition;
      fs.writeFileSync(defaultsPath, code, 'utf-8');
      console.log('✅ Patched Defaults/index.js');
    }
  }

  // 2. Utils/messages.js
  const messagesPath = path.join(baileysDir, 'lib', 'Utils', 'messages.js');
  if (fs.existsSync(messagesPath)) {
    let code = fs.readFileSync(messagesPath, 'utf-8');
    if (!code.includes('newsletter: true')) {
      code = code.replace(
        'mediaType: mediaType,\n            timeoutMs: options.mediaUploadTimeoutMs',
        'mediaType: mediaType,\n            timeoutMs: options.mediaUploadTimeoutMs,\n            newsletter: true'
      );
      fs.writeFileSync(messagesPath, code, 'utf-8');
      console.log('✅ Patched Utils/messages.js');
    }
  }

  // 3. Utils/messages-media.js
  const messagesMediaPath = path.join(baileysDir, 'lib', 'Utils', 'messages-media.js');
  if (fs.existsSync(messagesMediaPath)) {
    let code = fs.readFileSync(messagesMediaPath, 'utf-8');
    if (!code.includes('NEWSLETTER_MEDIA_PATH_MAP')) {
      code = `import { NEWSLETTER_MEDIA_PATH_MAP } from '../Defaults/index.js';\n` + code;
      code = code.replace(
        'const url = `https://${hostname}${MEDIA_PATH_MAP[mediaType]}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`;',
        `const pathMap = options?.newsletter ? NEWSLETTER_MEDIA_PATH_MAP : MEDIA_PATH_MAP;
            const uploadPath = pathMap[mediaType] || MEDIA_PATH_MAP[mediaType];
            const serverThumb = options?.newsletter ? '&server_thumb_gen=1' : '';
            const url = \`https://\${hostname}\${uploadPath}/\${fileEncSha256B64}?auth=\${auth}&token=\${fileEncSha256B64}\${serverThumb}\`;`
      );
      fs.writeFileSync(messagesMediaPath, code, 'utf-8');
      console.log('✅ Patched Utils/messages-media.js');
    }
  }

  // 4. Socket/messages-send.js
  const messagesSendPath = path.join(baileysDir, 'lib', 'Socket', 'messages-send.js');
  if (fs.existsSync(messagesSendPath)) {
    let code = fs.readFileSync(messagesSendPath, 'utf-8');
    if (!code.includes("...(mediaType ? { mediatype: mediaType } : {})")) {
      code = code.replace(
        'type: getMessageType(message),\n                        ...(additionalAttributes || {})',
        'type: getMessageType(message),\n                        ...(mediaType ? { mediatype: mediaType } : {}),\n                        ...(additionalAttributes || {})'
      );
      fs.writeFileSync(messagesSendPath, code, 'utf-8');
      console.log('✅ Patched Socket/messages-send.js');
    }
  }
}
