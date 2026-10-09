import fs from 'fs';
import path from 'path';

const REPO_DIR = '/Users/bhomvratrai/Documents/GitHub/thebhom-landing';
const STOREFRONT_URL = 'https://www.amazon.in/shop/bhom120704';
const TAG = 'bhom120704-21';

const ALL_CURATED_PINS = [
  // 5 Festive Pins
  {
    guid: 'thebhom-festive-pin-1-karwachauth-anarkali',
    title: 'Trending Red Anarkali Kurti Set For Karwa Chauth & Diwali 🪔✨',
    link: `https://www.amazon.in/s?k=anarkali+kurti+set+women+festive&tag=${TAG}`,
    image: 'https://thebhom.in/assets/festive/festive_pin_1.jpg',
    description: `Royal Crimson Red Embroidered Anarkali Kurti Set with Zari gold border & dupatta lookbook for Karwa Chauth, Diwali Pooja & Festive Parties.

✨ OUTFIT HIGHLIGHTS:
• Silhouette: Flared Floor-Length Anarkali with intricate Zari neckline
• Fabric: Rich Silk Blend with lightweight embroidered organza dupatta
• Matching Jewellery: Kundan jhumkas and traditional golden mojris

👉 DIRECT AMAZON PRODUCT FINDS:
• Buy Matching Anarkali Suits: https://www.amazon.in/s?k=anarkali+kurti+set+women+festive&tag=${TAG}
• Explore Our Complete Lookbook on Amazon Storefront: ${STOREFRONT_URL}

#diwalilook #karwachauthoutfit #anarkalisuit #redkurti #festivewear #indianethnicwear #amazonfinds`
  },
  {
    guid: 'thebhom-festive-pin-2-tissue-silk-saree',
    title: 'Viral Golden Tissue Silk Saree Lookbook for Diwali Pooja ✨🪔',
    link: `https://www.amazon.in/s?k=tissue+silk+saree+party+wear&tag=${TAG}`,
    image: 'https://thebhom.in/assets/festive/festive_pin_2.jpg',
    description: `Aesthetic Golden Beige Tissue Silk Saree paired with contrast festive green embroidered blouse styling for Diwali night & wedding guests.

✨ SAREE HIGHLIGHTS:
• Fabric: Premium shimmering Tissue Silk with scalloped Zari border
• Blouse: Contrast Emerald Green handcrafted zardozi embroidery
• Draping: Light, crisp structure that holds pleats effortlessly

👉 DIRECT AMAZON PRODUCT FINDS:
• Buy Tissue Silk Sarees: https://www.amazon.in/s?k=tissue+silk+saree+party+wear&tag=${TAG}
• Explore Complete Storefront Collection: ${STOREFRONT_URL}

#diwalisaree #tissuesaree #festivesaree #ethniclookbook #sareelover #festivefashion`
  },
  {
    guid: 'thebhom-festive-pin-3-pastel-organza-kurti',
    title: 'Chic Pastel Organza Floral Kurti Set Lookbook 🌸✨',
    link: `https://www.amazon.in/s?k=organza+kurti+set+women&tag=${TAG}`,
    image: 'https://thebhom.in/assets/festive/festive_pin_3.jpg',
    description: `Aesthetic Pastel Blush Pink Floral Embroidered Organza Kurti Pant Set with light dupatta for daytime Diwali gatherings & festive brunches.

✨ OUTFIT HIGHLIGHTS:
• Material: Semi-sheer Organza with delicate floral threadwork
• Fit: Straight comfort-cut kurti with matching cropped trousers
• Vibe: Soft girl aesthetic meets traditional Indian festive wear

👉 DIRECT AMAZON PRODUCT FINDS:
• Buy Pastel Organza Suits: https://www.amazon.in/s?k=organza+kurti+set+women&tag=${TAG}
• View Full Amazon Storefront: ${STOREFRONT_URL}

#organzakurti #diwalioutfit #pastelfashion #festivelook #kurtiset #ethnicwear`
  },
  {
    guid: 'thebhom-festive-pin-4-navy-velvet-kurti',
    title: 'Trending Royal Blue Velvet Festive Kurti Set Styling 🪔💙',
    link: `https://www.amazon.in/s?k=velvet+kurti+set+women+festive&tag=${TAG}`,
    image: 'https://thebhom.in/assets/festive/festive_pin_4.jpg',
    description: `Rich Royal Navy Blue Velvet Embroidered Straight Kurti with Mustard Gold Zari border dupatta lookbook for winter weddings & Diwali nights.

✨ VELVET SUIT HIGHLIGHTS:
• Texture: Heavy plush micro-velvet with antique gold neck yoke
• Dupatta: Rich woven Banarasi silk in mustard gold
• Season: Perfect for November-December cool evening celebrations

👉 DIRECT AMAZON PRODUCT FINDS:
• Buy Velvet Festive Suits: https://www.amazon.in/s?k=velvet+kurti+set+women+festive&tag=${TAG}
• Verified Picks on Amazon Storefront: ${STOREFRONT_URL}

#velvetkurti #winterfestive #diwalifashion #ethnicchic #indianoutfits #bhaidooj`
  },
  {
    guid: 'thebhom-festive-pin-5-wine-georgette-suit',
    title: 'Aesthetic Wine Festive Suit Set Under ₹799 - Diwali Lookbook 🍷✨',
    link: `https://www.amazon.in/s?k=georgette+kurti+palazzo+set+under+799&tag=${TAG}`,
    image: 'https://thebhom.in/assets/festive/festive_pin_5.jpg',
    description: `Deep Wine Plum Georgette Festive Kurti Palazzo Set with Gotta Patti details for Karwa Chauth evening and Diwali gatherings.

✨ BUDGET FESTIVE HIGHLIGHTS:
• Work: Classic Rajasthani Gota Patti neck yoke & border
• Fabric: Breathable faux Georgette with inner lining
• Price Sweet Spot: Under ₹799 verified festive budget find

👉 DIRECT AMAZON PRODUCT FINDS:
• Buy Georgette Palazzo Suits: https://www.amazon.in/s?k=georgette+kurti+palazzo+set+under+799&tag=${TAG}
• Explore Storefront: ${STOREFRONT_URL}

#budgetdiwali #festivekurti #gotapatti #karwachauthlook #amazonfashion #ethnicwear`
  },

  // User-Saved Aesthetic Pins
  {
    guid: 'thebhom-fashion-pin-1-spiderman-streetwear',
    title: 'Spider-Man Aesthetic Streetwear Outfit Inspo & Lookbook 🕷️✨',
    link: `https://www.amazon.in/s?k=parachute+cargo+pants+women&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_1.jpg',
    description: `Casual Spider-Man cosplay & Y2K streetwear outfit lookbook. Red cropped graphic spider baby tee paired with baggy parachute cargo pants, red canvas sneakers, maroon dad cap & silver spider charms.

✨ OUTFIT PIECES & DIRECT LINKS:
• Parachute Cargo Pants: https://www.amazon.in/s?k=parachute+cargo+pants+women&tag=${TAG}
• Red High-Top Sneakers: https://www.amazon.in/s?k=red+high+top+canvas+sneakers&tag=${TAG}
• Spider Graphic Baby Tees: https://www.amazon.in/s?k=spider+graphic+baby+tee&tag=${TAG}
• Complete Aesthetic Lookbook: ${STOREFRONT_URL}

#spidermanoutfit #streetwearinspo #y2kaesthetic #cargopants #parachutepants`
  },
  {
    guid: 'thebhom-fashion-pin-2-ribbed-spider-crop-top',
    title: 'Y2K Grunge Red Ribbed Spider Crop Top Styling 🕸️🖤',
    link: `https://www.amazon.in/s?k=ribbed+crop+top+women&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_2.jpg',
    description: `Deep wine red ribbed knit ringer baby tee with embroidered spider graphic and lettuce hem detail. Perfect grunge fairycore and 90s alt fashion look.

✨ DIRECT AMAZON FINDS:
• Ribbed Crop Tops: https://www.amazon.in/s?k=ribbed+crop+top+women&tag=${TAG}
• Pleated Cargo Skirts: https://www.amazon.in/s?k=pleated+cargo+mini+skirt&tag=${TAG}
• Complete Storefront Collection: ${STOREFRONT_URL}

#grungeaesthetic #babytee #croptop #spiderweb #y2kfashion #altoutfit`
  },
  {
    guid: 'thebhom-fashion-pin-3-oversized-spider-tee',
    title: 'Oversized Maroon Spider Graphic T-Shirt Outfit Inspo 🕷️💙',
    link: `https://www.amazon.in/s?k=oversized+graphic+tshirt+women&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_3.jpg',
    description: `Aesthetic oversized washed maroon spiderweb graphic tee tucked into wide-leg light wash baggy jeans with a mini shoulder baguette bag.

✨ DIRECT AMAZON FINDS:
• Oversized Graphic T-Shirts: https://www.amazon.in/s?k=oversized+graphic+tshirt+women&tag=${TAG}
• Wide-Leg Baggy Jeans: https://www.amazon.in/s?k=wide+leg+baggy+jeans+women&tag=${TAG}
• Tap Storefront for Direct Outfit: ${STOREFRONT_URL}

#oversizedtshirt #koreanfashion #baggyjeans #streetwearlookbook #casualoutfit`
  },
  {
    guid: 'thebhom-fashion-pin-4-corset-bustier-top',
    title: 'Vintage Racing Patch Ribbed Corset Bustier Crop Top 🏎️✨',
    link: `https://www.amazon.in/s?k=corset+crop+top+women&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_4.jpg',
    description: `Grey ribbed sweetheart neckline corset bustier top with gathered scrunchie straps and sporty racing embroidered patches.

✨ DIRECT AMAZON FINDS:
• Sweetheart Corset Tops: https://www.amazon.in/s?k=corset+crop+top+women&tag=${TAG}
• Biker Cargo Pants: https://www.amazon.in/s?k=biker+cargo+pants+women&tag=${TAG}
• Tap Storefront for Verified Picks: ${STOREFRONT_URL}

#corsettop #bustier #racercore #bikerstyle #y2kcorset #streetstyle`
  },
  {
    guid: 'thebhom-fashion-pin-6-gwen-stacy-hoodie',
    title: 'Gwen Stacy White & Hot Pink Spider Full-Zip Fleece Hoodie 💖🕷️',
    link: `https://www.amazon.in/s?k=spiderman+zip+up+hoodie&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_6.jpg',
    description: `Viral oversized white zip-up hoodie featuring 3D hot pink spider embroidery and cobweb hood lining. Inspired by Gwen Stacy Ghost-Spider aesthetics.

✨ DIRECT AMAZON FINDS:
• Spider Zip-Up Hoodies: https://www.amazon.in/s?k=spiderman+zip+up+hoodie&tag=${TAG}
• Baggy White Fleece Hoodies: https://www.amazon.in/s?k=oversized+white+fleece+hoodie&tag=${TAG}
• Tap Storefront for Streetwear Picks: ${STOREFRONT_URL}

#gwenstacy #spidermanhoodie #zipuphoodie #pinkandwhite #oversizedhoodie`
  },
  {
    guid: 'thebhom-fashion-pin-7-savana-athletic-top',
    title: 'Savana Aesthetic Off-Shoulder Athletic Baby Tee & Denim Skirt 🌸⚾',
    link: `https://www.amazon.in/s?k=off+shoulder+top+women+y2k&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_10.jpg',
    description: `Trending Savana style off-the-shoulder sporty baby tees (Bulls 98 & Atlanta 1999) paired with micro pleated denim skirts, grommet belts & charm belly chains.

✨ DIRECT AMAZON FINDS:
• Off-Shoulder Baby Tops: https://www.amazon.in/s?k=off+shoulder+top+women+y2k&tag=${TAG}
• Pleated Denim Skirts: https://www.amazon.in/s?k=pleated+denim+skirt+women&tag=${TAG}
• Explore on Storefront: ${STOREFRONT_URL}

#savana #babytee #denimskirt #y2koutfit #sportychic #offshouldertop`
  },
  {
    guid: 'thebhom-fashion-pin-8-red-skort-boots',
    title: 'Trending Crimson Red Mini Skort with Platform Boots Look 👠❤️',
    link: `https://www.amazon.in/s?k=thigh+high+boots+women+platform&tag=${TAG}`,
    image: 'https://thebhom.in/assets/women_fashion/saved_pin_8.jpg',
    description: `Aesthetic side-slit asymmetrical mini skort in deep crimson red styled with sheer black sleeves and over-the-knee black platform chunky boots.

✨ DIRECT AMAZON FINDS:
• Thigh-High Platform Boots: https://www.amazon.in/s?k=thigh+high+boots+women+platform&tag=${TAG}
• High-Waisted Mini Skorts: https://www.amazon.in/s?k=mini+skort+women+high+waist&tag=${TAG}
• Complete Storefront Looks: ${STOREFRONT_URL}

#miniskort #platformboots #nightoutoutfit #thighhighboots #redskirt`
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
      <enclosure url="${escapeXml(item.image)}" type="image/jpeg" length="500000" />
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
      <pubDate>Sat, 10 Oct 2026 01:00:00 GMT</pubDate>
    </item>`;
}

function updateFeed(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  for (const item of ALL_CURATED_PINS) {
    const guidRegex = new RegExp(`<item>[\\s\\S]*?<guid[^>]*>${item.guid}<\\/guid>[\\s\\S]*?<\\/item>`, 'g');
    content = content.replace(guidRegex, '');
  }

  const itemsXml = ALL_CURATED_PINS.map(generateItemXml).join('\n');
  const insertMarker = '<atom:link href="';
  const markerIdx = content.indexOf(insertMarker);
  
  if (markerIdx !== -1) {
    const endOfTag = content.indexOf('/>', markerIdx) + 2;
    content = content.slice(0, endOfTag) + '\n' + itemsXml + content.slice(endOfTag);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Synced products & storefront to: ${filePath}`);
  }
}

updateFeed(path.join(REPO_DIR, 'women-fashion-feed.xml'));
updateFeed(path.join(REPO_DIR, 'fashion-feed.xml'));
updateFeed(path.join(REPO_DIR, 'pinterest-feed.xml'));
console.log('🎉 All pins are now directly connected to exact Amazon products & Storefront!');
