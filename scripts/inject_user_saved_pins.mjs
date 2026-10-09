import fs from 'fs';
import path from 'path';

const REPO_DIR = '/Users/bhomvratrai/Documents/GitHub/thebhom-landing';
const STOREFRONT_URL = 'https://www.amazon.in/shop/bhom120704';

const USER_SAVED_PINS = [
  {
    guid: 'thebhom-fashion-pin-1-spiderman-streetwear',
    title: 'Spider-Man Aesthetic Streetwear Outfit Inspo & Lookbook 🕷️✨',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_1.jpg',
    description: `Casual Spider-Man cosplay & Y2K streetwear outfit lookbook. Red cropped graphic spider baby tee paired with baggy parachute cargo pants, red canvas sneakers, maroon dad cap & silver spider charms.

✨ OUTFIT PIECES & STYLING:
• Top: Red Spider Graphic Baby Tee / Crop Top
• Bottom: Relaxed Baggy Black Parachute Cargo Pants with Piping
• Shoes: High-Top Red Canvas Retro Sneakers
• Accessories: Maroon Los Angeles Washed Baseball Cap & Over-Ear Headphones

👉 TAP TO SHOP THE LOOK & VERIFIED PICKS ON OUR AMAZON STOREFRONT:
amazon.in/shop/bhom120704

#spidermanoutfit #streetwearinspo #y2kaesthetic #cargopants #parachutepants #casualcosplay #outfitideas`
  },
  {
    guid: 'thebhom-fashion-pin-2-ribbed-spider-crop-top',
    title: 'Y2K Grunge Red Ribbed Spider Crop Top Styling 🕸️🖤',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_2.jpg',
    description: `Deep wine red ribbed knit ringer baby tee with embroidered spider graphic and lettuce hem detail. Perfect grunge fairycore and 90s alt fashion look.

✨ STYLE HIGHLIGHTS:
• Silhouette: Fitted ribbed baby crop tee with contrast black neckline
• Details: Centered 3D spider embroidery and playful lettuce ruffle hem
• Pairing: Style with low-rise baggy denim or pleated cargo mini skirt

👉 TAP FOR DIRECT LINKS & VERIFIED OUTFIT FINDS ON OUR STOREFRONT:
amazon.in/shop/bhom120704

#grungeaesthetic #babytee #croptop #spiderweb #y2kfashion #altoutfit #thriftlook`
  },
  {
    guid: 'thebhom-fashion-pin-3-oversized-spider-tee',
    title: 'Oversized Maroon Spider Graphic T-Shirt Outfit Inspo 🕷️💙',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_3.jpg',
    description: `Aesthetic oversized washed maroon spiderweb graphic tee tucked into wide-leg light wash baggy jeans with a mini shoulder baguette bag.

✨ LOOKBOOK DETAILS:
• Vibe: Effortless Korean street fashion & casual college campus outfit
• Fit: Boxy oversized drop-shoulder graphic t-shirt
• Bottom: High-waisted wide-leg puddle jeans
• Jewelry: Silver dainty layered chain & dark plum shoulder bag

👉 TAP TO EXPLORE DIRECT CURATED PICKS ON OUR AMAZON STOREFRONT:
amazon.in/shop/bhom120704

#oversizedtshirt #koreanfashion #baggyjeans #streetwearlookbook #casualoutfit #collegeoutfit`
  },
  {
    guid: 'thebhom-fashion-pin-4-corset-bustier-top',
    title: 'Vintage Racing Patch Ribbed Corset Bustier Crop Top 🏎️✨',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_4.jpg',
    description: `Grey ribbed sweetheart neckline corset bustier top with gathered scrunchie straps and sporty racing embroidered patches.

✨ DESIGN HIGHLIGHTS:
• Cut: Structured boned corset shape with sweetheart curved bust
• Straps: Thick black ruched elastic shoulder straps
• Aesthetic: Biker streetwear meets coquette corset trend

👉 TAP TO SHOP VERIFIED PICKS & OUTFITS ON OUR STOREFRONT:
amazon.in/shop/bhom120704

#corsettop #bustier #racercore #bikerstyle #y2kcorset #streetstyle #partytop`
  },
  {
    guid: 'thebhom-fashion-pin-5-spiderman-baggy-denim',
    title: 'Spider-Girl Aesthetic Baggy Denim Moodboard & Lookbook 🕸️🧢',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_5.jpg',
    description: `Full Spider aesthetic outfit inspiration: long-sleeve spider print fitted top, extreme wide-leg washed denim with back pocket web stitching, distressed cap & crochet web accessories.

✨ MOODBOARD HIGHLIGHTS:
• Denim: Washed vintage black baggy skater jeans
• Details: Hand-crochet spiderweb fingerless mittens & headphone ear muffs
• Accessories: Vintage washed Spider embroidery ballcap

👉 TAP TO EXPLORE DIRECT STOREFRONT FINDS & LOOKBOOKS:
amazon.in/shop/bhom120704

#aestheticoutfit #spidergirlaesthetic #baggydenim #moodboardfashion #outfitinspo #y2k`
  },
  {
    guid: 'thebhom-fashion-pin-6-gwen-stacy-hoodie',
    title: 'Gwen Stacy White & Hot Pink Spider Full-Zip Fleece Hoodie 💖🕷️',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_6.jpg',
    description: `Viral oversized white zip-up hoodie featuring 3D hot pink spider embroidery and cobweb hood lining. Inspired by Gwen Stacy Ghost-Spider aesthetics.

✨ HOODIE HIGHLIGHTS:
• Material: Heavyweight brushed cotton fleece
• Design: Full front zipper with dual pouch pockets and sleeve web accents
• Aesthetic: Spider-Verse & pastel grunge winter essential

👉 TAP TO EXPLORE VERIFIED STREETWEAR FINDS ON OUR STOREFRONT:
amazon.in/shop/bhom120704

#gwenstacy #spidermanhoodie #zipuphoodie #pinkandwhite #oversizedhoodie #winterfashion`
  },
  {
    guid: 'thebhom-fashion-pin-7-savana-athletic-top',
    title: 'Savana Aesthetic Off-Shoulder Athletic Baby Tee & Denim Skirt 🌸⚾',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_10.jpg',
    description: `Trending Savana style off-the-shoulder sporty baby tees (Bulls 98 & Atlanta 1999) paired with micro pleated denim skirts, grommet belts & charm belly chains.

✨ OUTFIT HIGHLIGHTS:
• Tops: Fitted boatneck / off-shoulder athletic graphic print tops
• Skirts: Low-rise vintage wash pleated micro denim skirts
• Accessories: Y2K multi-grommet belt, silver heart chain belt & nylon shoulder bags

👉 TAP FOR VERIFIED SHOPPING LINKS ON OUR AMAZON STOREFRONT:
amazon.in/shop/bhom120704

#savana #babytee #denimskirt #y2koutfit #sportychic #offshouldertop #microjeanskirt`
  },
  {
    guid: 'thebhom-fashion-pin-8-red-skort-boots',
    title: 'Trending Crimson Red Mini Skort with Platform Boots Look 👠❤️',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_8.jpg',
    description: `Aesthetic side-slit asymmetrical mini skort in deep crimson red styled with sheer black sleeves and over-the-knee black platform chunky boots.

✨ OUTFIT HIGHLIGHTS:
• Bottom: High-waisted structured skort with modern side split
• Footwear: Ultra-sleek thigh-high platform block heel boots
• Occasion: Night out, clubbing, concert, and autumn aesthetic

👉 TAP TO SHOP DIRECT OUTFIT FINDS ON OUR AMAZON STOREFRONT:
amazon.in/shop/bhom120704

#miniskort #platformboots #nightoutoutfit #thighhighboots #redskirt #partylook`
  },
  {
    guid: 'thebhom-fashion-pin-9-pink-spider-sherpa',
    title: 'Pastel Baby Pink Spider Sherpa Embroidered Zip Jacket 🎀✨',
    link: STOREFRONT_URL,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_9.jpg',
    description: `Super cozy white plush zip hoodie with baby pink fluffy spider embroidery and web hood details. The ultimate soft-girl meets streetwear winter hoodie.

✨ JACKET HIGHLIGHTS:
• Texture: Soft plush fleece lining with textured bouclé spider patch
• Cut: Relaxed oversized silhouette with ribbed cuffs
• Vibe: Coquette streetwear aesthetic

👉 TAP TO EXPLORE DIRECT FINDS ON OUR AMAZON STOREFRONT:
amazon.in/shop/bhom120704

#pastelaesthetic #coquettestreetwear #pinkhoodie #softgirlaesthetic #winteroutfit`
  }
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateItemXml(item) {
  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <enclosure url="${escapeXml(item.image)}" type="image/jpeg" length="250000" />
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
      <pubDate>Sat, 10 Oct 2026 00:30:00 GMT</pubDate>
    </item>`;
}

function updateFeed(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Clean existing copies of these guids if present
  for (const item of USER_SAVED_PINS) {
    const guidRegex = new RegExp(`<item>[\\s\\S]*?<guid[^>]*>${item.guid}<\\/guid>[\\s\\S]*?<\\/item>`, 'g');
    content = content.replace(guidRegex, '');
  }

  const itemsXml = USER_SAVED_PINS.map(generateItemXml).join('\n');
  const insertMarker = '<atom:link href="';
  const markerIdx = content.indexOf(insertMarker);
  
  if (markerIdx !== -1) {
    const endOfTag = content.indexOf('/>', markerIdx) + 2;
    content = content.slice(0, endOfTag) + '\n' + itemsXml + content.slice(endOfTag);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Successfully injected saved pins into: ${filePath}`);
  } else {
    console.error(`Marker not found in ${filePath}`);
  }
}

updateFeed(path.join(REPO_DIR, 'women-fashion-feed.xml'));
updateFeed(path.join(REPO_DIR, 'fashion-feed.xml'));
updateFeed(path.join(REPO_DIR, 'pinterest-feed.xml'));

console.log('🎉 Done injecting all saved user pins with Amazon Storefront links into live RSS feeds!');
