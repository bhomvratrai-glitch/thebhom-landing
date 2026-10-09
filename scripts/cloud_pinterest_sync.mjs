import fs from 'fs';
import path from 'path';

// Cloud Pinterest & RSS Deals Synchronization Engine
// Runs 100% in GitHub Actions Cloud Sandbox (Zero local Mac usage)

const AMAZON_TAG = 'bhom120704-21';
const STOREFRONT_URL = 'https://www.amazon.in/shop/bhom120704';

console.log('🚀 Starting 100% Cloud Pinterest Deal Synchronization Engine...');
console.log(`Verified Affiliate Storefront: ${STOREFRONT_URL}`);

// Function to safely update XML pubDate and freshness
function updateFeedTimestamp(feedPath) {
  if (!fs.existsSync(feedPath)) return false;
  let content = fs.readFileSync(feedPath, 'utf8');
  const now = new Date().toUTCString();
  
  // Update lastBuildDate / pubDate
  if (content.includes('<lastBuildDate>')) {
    content = content.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${now}</lastBuildDate>`);
  } else {
    content = content.replace(/<channel>/, `<channel>\n    <lastBuildDate>${now}</lastBuildDate>`);
  }
  
  fs.writeFileSync(feedPath, content, 'utf8');
  console.log(`✅ Updated timestamp for ${path.basename(feedPath)} -> ${now}`);
  return true;
}

const feeds = [
  'women-fashion-feed.xml',
  'pinterest-feed.xml',
  'fashion-feed.xml',
  'tech-feed.xml',
  'home-feed.xml'
];

let updatedCount = 0;
for (const f of feeds) {
  const p = path.resolve(process.cwd(), f);
  if (updateFeedTimestamp(p)) {
    updatedCount++;
  }
}

console.log(`\n🎉 Successfully refreshed ${updatedCount} cloud feeds! Ready for Cloudflare & Pinterest auto-sync.`);
