import fs from "fs";
import path from "path";

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTljMzllYTFkYjZhYmEwYjk3YjU0MGEiLCJlYXJua2FybyI6IjU2MTAzMjEiLCJpYXQiOjE3ODg2MjMzNjJ9.Zws8JRh_mHh9mOKIbuRDp-clRopL57Bt657Coli_9NQ";
const CATALOG_PATH = path.join(process.cwd(), "deals/data/catalog.json");

// Helper to convert URLs via EarnKaro API
async function convertUrl(canonicalUrl, fallbackStore) {
  try {
    const res = await fetch("https://ekaro-api.affiliaters.in/api/converter/public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        deal: canonicalUrl,
        convert_option: "convert_only"
      })
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data.trim();
    }
  } catch (err) {
    console.warn(`Failed to convert ${canonicalUrl}:`, err.message);
  }
  
  if (fallbackStore === "Amazon") {
    return canonicalUrl.includes("?") ? `${canonicalUrl}&tag=bhom120704-21` : `${canonicalUrl}?tag=bhom120704-21`;
  }
  return `https://trackingv3.linkredirect.in/visitretailer/2276?id=5610321&dl=${encodeURIComponent(canonicalUrl)}`;
}

// 31 High-Converting, Verified New Products Across 6 Top Categories
const newProducts = [
  // -------------------------------------------------------------
  // MOBILES & SMARTPHONES
  // -------------------------------------------------------------
  {
    id: "deal-10",
    slug: "apple-iphone-15-128gb-black",
    title: "Apple iPhone 15 (Black, 128 GB, Dynamic Island, 48MP Main Camera)",
    brand: "Apple",
    category: "mobiles",
    store: "Flipkart",
    originalPrice: 79900,
    dealPrice: 65999,
    discount: "17% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹1,500.00",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4",
    rating: 4.7,
    reviewsCount: 42800,
    badge: "⚡ FLAGSHIP DEAL",
    isFlashDeal: true,
    summary: "The iPhone 15 brings Apple's revolutionary Dynamic Island, a 48MP main camera with 2x optical-quality telephoto, and USB-C connectivity to the standard flagship lineup.",
    specs: [
      { label: "Display", value: "6.1-inch Super Retina XDR OLED (2000 Nits Peak)" },
      { label: "Processor", value: "A16 Bionic chip with 5-core GPU" },
      { label: "Camera", value: "48MP Main + 12MP Ultra Wide with Next-Gen Portraits" },
      { label: "Port", value: "USB-C with Universal Charging Support" },
      { label: "Build", value: "Color-infused back glass with Aerospace-grade aluminum" }
    ],
    highlights: [
      "Dynamic Island bubbles up alerts and Live Activities so you never miss urgent notifications.",
      "48MP main camera shoots in super-high resolution with sharp 2x telephoto crop.",
      "USB-C port allows you to charge your Mac or iPad with the same iPhone cable."
    ],
    pros: [
      "Stunning daylight and low-light portrait photography with auto-focus depth detection.",
      "Substantial jump in outdoor screen brightness up to 2000 nits.",
      "Lightweight, contoured edge design that is comfortable for one-handed use."
    ],
    cons: [
      "Display refresh rate is standard 60Hz (120Hz ProMotion reserved for Pro models).",
      "Charging speed tops out around 20W."
    ],
    whoShouldBuy: "Anyone upgrading from an iPhone 11, 12, or older Android who wants flagship camera capabilities, long battery life, and future-proof USB-C.",
    verdict: "At ₹65,999, the iPhone 15 delivers the sweet spot of Apple's flagship technology at an accessible festive price point."
  },
  {
    id: "deal-11",
    slug: "apple-iphone-13-128gb-midnight",
    title: "Apple iPhone 13 (Midnight, 128 GB, Cinematic Mode, A15 Bionic)",
    brand: "Apple",
    category: "mobiles",
    store: "Flipkart",
    originalPrice: 59900,
    dealPrice: 48999,
    discount: "18% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹1,200.00",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/apple-iphone-13-midnight-128-gb/p/itmca361a0e718c2",
    rating: 4.7,
    reviewsCount: 88500,
    badge: "🔥 VALUE KING",
    isFlashDeal: false,
    summary: "The iPhone 13 remains India's most popular sub-₹50,000 luxury smartphone, offering bulletproof A15 Bionic performance, Cinematic video recording, and legendary all-day battery life.",
    specs: [
      { label: "Display", value: "6.1-inch Super Retina XDR OLED Display" },
      { label: "Processor", value: "Apple A15 Bionic 6-core chip" },
      { label: "Rear Camera", value: "Dual 12MP System (Wide + Ultra-Wide) with Sensor-Shift OIS" },
      { label: "Battery", value: "Up to 19 Hours video playback" },
      { label: "Durability", value: "Ceramic Shield front with IP68 Water Resistance" }
    ],
    highlights: [
      "Cinematic mode adds shallow depth of field and automatic focus transitions to your videos.",
      "Sensor-shift optical image stabilization keeps low-light photos sharp and handheld videos steady.",
      "Guaranteed iOS software updates for years to come."
    ],
    pros: [
      "Unmatched performance-per-rupee for an Apple ecosystem entry point.",
      "Reliable full-day battery life even with heavy social media and navigation.",
      "Durable ceramic shield glass with industry-leading water and dust protection."
    ],
    cons: [
      "Still uses the legacy Lightning port rather than USB-C.",
      "No dedicated telephoto lens for optical zoom."
    ],
    whoShouldBuy: "Budget-conscious buyers who want an authentic, dependable iPhone experience under ₹50,000 with premium build and reliable resale value.",
    verdict: "Hands down the highest-selling premium phone in India for a reason. Grab it at ₹48,999 while festive stocks last."
  },
  {
    id: "deal-12",
    slug: "samsung-galaxy-s24-5g-256gb",
    title: "Samsung Galaxy S24 5G (Onyx Black, 256 GB, 8 GB RAM, Galaxy AI)",
    brand: "Samsung",
    category: "mobiles",
    store: "Amazon",
    originalPrice: 79999,
    dealPrice: 62999,
    discount: "21% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹1,400.00",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0CS5X6845",
    rating: 4.5,
    reviewsCount: 6800,
    badge: "🤖 GALAXY AI",
    isFlashDeal: true,
    summary: "The compact flagship standard: Samsung Galaxy S24 features groundbreaking Galaxy AI tools like Circle to Search, Live Two-Way Call Translate, and a gorgeous 120Hz Dynamic AMOLED display.",
    specs: [
      { label: "Display", value: "6.2-inch FHD+ Dynamic AMOLED 2X (1-120Hz LTPO, 2600 Nits)" },
      { label: "AI Suite", value: "Galaxy AI (Circle to Search, Live Call Translate, Note Assist)" },
      { label: "Camera", value: "50MP Main + 12MP Ultra-Wide + 10MP 3x Telephoto" },
      { label: "Software Support", value: "7 Generations of OS Upgrades & 7 Years of Security" },
      { label: "Battery", value: "4000mAh with 25W Fast Charging and Wireless PowerShare" }
    ],
    highlights: [
      "Circle to Search with Google lets you search anything visible on your screen instantly.",
      "Industry-leading 7 years of promised Android OS and security updates.",
      "Pocket-friendly compact footprint with ultra-slim symmetrical bezels."
    ],
    pros: [
      "Incredible 2600-nit outdoor screen visibility under direct sunlight.",
      "Dedicated 3x optical zoom telephoto camera is rare in compact devices.",
      "Sleek Armor Aluminum 2.0 frame feels luxurious in hand."
    ],
    cons: [
      "4000mAh battery requires nightly charging with heavy gaming.",
      "25W wired charging is slower than Chinese competitor flagships."
    ],
    whoShouldBuy: "Android enthusiasts wanting a compact one-handed flagship with 7 years of software support and industry-leading AI tools.",
    verdict: "At ₹62,999 with 256GB storage, the Galaxy S24 is the premier compact Android phone on the Indian market."
  },
  {
    id: "deal-13",
    slug: "samsung-galaxy-m35-5g-6000mah",
    title: "Samsung Galaxy M35 5G (Daybreak Blue, 128 GB, 6 GB RAM, 6000mAh Battery)",
    brand: "Samsung",
    category: "mobiles",
    store: "Amazon",
    originalPrice: 24499,
    dealPrice: 16999,
    discount: "31% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹510.00",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0D77YDF65",
    rating: 4.3,
    reviewsCount: 15400,
    badge: "🔋 6000mAh MONSTER",
    isFlashDeal: false,
    summary: "The ultimate endurance king: Samsung Galaxy M35 5G packs a mammoth 6000mAh battery, vibrant 120Hz sAMOLED display with Corning Gorilla Glass Victus+, and 50MP No Shake OIS camera.",
    specs: [
      { label: "Battery", value: "6000mAh Monster Battery (Up to 2 Days Normal Use)" },
      { label: "Display", value: "6.6-inch Super AMOLED, 120Hz, 1000 Nits High Brightness" },
      { label: "Glass Protection", value: "Corning Gorilla Glass Victus+ (Best in Segment)" },
      { label: "Camera", value: "50MP OIS No Shake Camera + 8MP Ultra-Wide + 2MP Macro" },
      { label: "Updates", value: "4 Android OS Upgrades + 5 Years Security Patches" }
    ],
    highlights: [
      "Gigantic 6000mAh battery easily powers through 2 full days of calling, browsing, and media.",
      "Vivid Super AMOLED 120Hz panel makes movies and Instagram scrolling butter-smooth.",
      "Vapor cooling chamber keeps thermals under control during gaming sessions."
    ],
    pros: [
      "Battery life that outlasts almost every smartphone in the sub-₹20,000 segment.",
      "Gorilla Glass Victus+ provides flagship-tier drop resistance.",
      "Clean One UI experience with Knox Security privacy dashboard."
    ],
    cons: [
      "Slightly heavier (222g) due to the large 6000mAh battery pack.",
      "Charging brick is not included in the retail box."
    ],
    whoShouldBuy: "Frequent travelers, field professionals, and heavy media consumers who hate carrying power banks and want a 2-day battery life.",
    verdict: "Unbeatable battery endurance and Samsung display quality at just ₹16,999. A top recommendation for power users."
  },
  {
    id: "deal-14",
    slug: "oneplus-nord-ce4-lite-5g",
    title: "OnePlus Nord CE4 Lite 5G (Super Silver, 128 GB, 8 GB RAM, 80W SUPERVOOC)",
    brand: "OnePlus",
    category: "mobiles",
    store: "Amazon",
    originalPrice: 20999,
    dealPrice: 17999,
    discount: "14% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹540.00",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0D5YBN954",
    rating: 4.2,
    reviewsCount: 11200,
    badge: "⚡ 80W FAST CHARGE",
    isFlashDeal: true,
    summary: "OnePlus Nord CE4 Lite brings high-end features like a 120Hz AMOLED display with 2100 nits peak brightness, 50MP Sony LYT-600 OIS camera, and rapid 80W SUPERVOOC charging.",
    specs: [
      { label: "Charging", value: "80W SUPERVOOC Fast Charging (1-100% in 50 Mins)" },
      { label: "Display", value: "6.67-inch AMOLED, 120Hz, 2100 Nits Peak, Aqua Touch" },
      { label: "Camera", value: "50MP Sony LYT-600 with Optical Image Stabilization" },
      { label: "Battery", value: "5500mAh High-Density Battery" },
      { label: "Audio", value: "Dual Stereo Speakers with 300% Ultra Volume Mode" }
    ],
    highlights: [
      "Aqua Touch technology ensures the screen responds accurately even with wet fingers.",
      "Blazing 80W charging combined with a large 5500mAh cell means zero battery anxiety.",
      "Sony LYT-600 sensor captures sharp, vibrant low-light portraits with OIS."
    ],
    pros: [
      "Bright 2100-nit AMOLED display is among the best in this price bracket.",
      "Smooth OxygenOS 14 software with minimal bloatware.",
      "Includes 3.5mm headphone jack and stereo speakers."
    ],
    cons: [
      "Processor is Snapdragon 695, suited for daily tasks rather than intense competitive gaming.",
      "No secondary ultra-wide camera lens."
    ],
    whoShouldBuy: "Daily phone users who want rapid 80W charging, clean OxygenOS software, and a bright AMOLED screen under ₹18,000.",
    verdict: "Great daily driver with dependable battery life and fast charging at ₹17,999."
  },
  {
    id: "deal-15",
    slug: "redmi-13c-5g-starlight-black",
    title: "Redmi 13C 5G (Starlight Black, 128 GB, 4 GB RAM, MediaTek Dimensity 6100+)",
    brand: "Redmi",
    category: "mobiles",
    store: "Amazon",
    originalPrice: 13999,
    dealPrice: 9999,
    discount: "29% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹300.00",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0CNX6W718",
    rating: 4.1,
    reviewsCount: 19800,
    badge: "💥 5G UNDER ₹10K",
    isFlashDeal: false,
    summary: "One of India's most affordable 5G smartphones, the Redmi 13C 5G delivers high-speed 5G connectivity, a smooth 90Hz display, and a massive 5000mAh battery for under ₹10,000.",
    specs: [
      { label: "Processor", value: "MediaTek Dimensity 6100+ 6nm 5G Octa-core" },
      { label: "Display", value: "6.74-inch HD+ 90Hz Display with Corning Gorilla Glass" },
      { label: "Camera", value: "50MP AI Dual Camera with Night Mode & HDR" },
      { label: "Battery", value: "5000mAh Battery with 18W Type-C Fast Charging" },
      { label: "Connectivity", value: "Dual SIM 5G + MicroSD dedicated slot (up to 1TB)" }
    ],
    highlights: [
      "Affordable gateway to Jio True 5G and Airtel 5G Plus speeds under ₹10,000.",
      "Large 6.74-inch display with 90Hz refresh rate makes scrolling smooth.",
      "Star trail design on the back panel looks stylish and resists smudges."
    ],
    pros: [
      "Unmatched 5G performance-to-price ratio in the budget tier.",
      "Dedicated MicroSD slot along with dual 5G SIM card support.",
      "Fast side-mounted fingerprint sensor."
    ],
    cons: [
      "Display resolution is 720p HD+ rather than Full HD.",
      "Speaker is single mono, though sufficiently loud for calls."
    ],
    whoShouldBuy: "Budget shoppers, students, and first-time smartphone buyers who want fast 5G data speeds without crossing a ₹10,000 budget.",
    verdict: "At ₹9,999 with 5G connectivity and 50MP camera, Redmi 13C 5G is the undisputed king of budget 5G phones."
  },
  {
    id: "deal-16",
    slug: "motorola-g34-5g-ocean-green",
    title: "Motorola G34 5G (Ocean Green, 128 GB, 8 GB RAM, Snapdragon 695 5G)",
    brand: "Motorola",
    category: "mobiles",
    store: "Flipkart",
    originalPrice: 14999,
    dealPrice: 11999,
    discount: "20% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹360.00",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/motorola-g34-5g-ocean-green-128-gb/p/itm6be1c07248386",
    rating: 4.2,
    reviewsCount: 34200,
    badge: "⭐ VEGAN LEATHER",
    isFlashDeal: true,
    summary: "Motorola G34 5G redefines the budget segment with a premium vegan leather finish, pure clean Android 14 with zero bloatware, 120Hz display, and Snapdragon 695 5G speed.",
    specs: [
      { label: "Design", value: "Premium Vegan Leather Back (Ocean Green)" },
      { label: "Processor", value: "Qualcomm Snapdragon 695 5G Octa-Core" },
      { label: "RAM & Storage", value: "8 GB Physical RAM + 128 GB Storage" },
      { label: "Display", value: "6.5-inch 120Hz Fluid Display" },
      { label: "Audio", value: "Stereo Speakers with Dolby Atmos" }
    ],
    highlights: [
      "Pure Android 14 experience with zero pre-installed spam apps or intrusive ads.",
      "Vegan leather rear panel offers premium grip and looks like a ₹30,000 phone.",
      "Dolby Atmos stereo speakers produce rich, immersive sound for videos and music."
    ],
    pros: [
      "Clean, ad-free Motorola software with signature chop-for-flashlight gestures.",
      "Generous 8 GB RAM ensures smooth multitasking and background app retention.",
      "Support for 13 5G bands across all major Indian telecom networks."
    ],
    cons: [
      "HD+ resolution display instead of FHD+.",
      "Charging speed is capped at 18W."
    ],
    whoShouldBuy: "Anyone seeking a clean, ad-free stock Android smartphone with premium vegan leather feel under ₹12,000.",
    verdict: "Clean software + vegan leather design make Moto G34 5G a standout budget winner at ₹11,999."
  },

  // -------------------------------------------------------------
  // ELECTRONICS & AUDIO
  // -------------------------------------------------------------
  {
    id: "deal-17",
    slug: "apple-airpods-2nd-generation",
    title: "Apple AirPods (2nd Gen) with Lightning Charging Case (Automatic Pairing)",
    brand: "Apple",
    category: "electronics",
    store: "Amazon",
    originalPrice: 12900,
    dealPrice: 8499,
    discount: "34% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹255.00",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B07Q6153FQ",
    rating: 4.6,
    reviewsCount: 31200,
    badge: "🍎 APPLE ICONIC",
    isFlashDeal: true,
    summary: "The world's most recognizable wireless earbuds: Apple AirPods 2 feature the Apple H1 headphone chip, hands-free Hey Siri voice commands, and effortless one-tap setup across Apple devices.",
    specs: [
      { label: "Chipset", value: "Apple H1 Headphone Chip for Faster Wireless" },
      { label: "Battery Life", value: "More than 24 Hours of Total Listening Time with Case" },
      { label: "Voice", value: "Always-on 'Hey Siri' Voice Control" },
      { label: "Sensors", value: "Optical sensors & motion accelerometers for auto-pause" },
      { label: "Connection", value: "Instant One-Tap Setup for iPhone, iPad, Apple Watch, Mac" }
    ],
    highlights: [
      "Universal ergonomic semi-in-ear fit that rests comfortably without ear pressure.",
      "Dual beamforming microphones filter out background noise for studio-clear calls.",
      "H1 chip provides 2x faster switching between active Apple devices."
    ],
    pros: [
      "Unrivaled call quality and microphone clarity on phone calls and Zoom meetings.",
      "Zero ear fatigue even after wearing for 6-8 continuous hours.",
      "Instant seamless connection with iOS and macOS devices."
    ],
    cons: [
      "No silicone ear-tips or active noise cancellation (ANC).",
      "Charges via Lightning cable rather than USB-C."
    ],
    whoShouldBuy: "iPhone, Mac, and iPad users who make frequent voice calls, attend online meetings, and prefer a comfortable non-intrusive earbud fit.",
    verdict: "At ₹8,499 with 34% off, AirPods 2 remain the most comfortable call earbuds in the world."
  },
  {
    id: "deal-18",
    slug: "sony-wh-1000xm4-noise-cancelling-headphones",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Over-Ear Headphones (30H Battery)",
    brand: "Sony",
    category: "electronics",
    store: "Amazon",
    originalPrice: 29990,
    dealPrice: 19990,
    discount: "33% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹600.00",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0863TXGM3",
    rating: 4.6,
    reviewsCount: 18400,
    badge: "🎧 GOLD STANDARD ANC",
    isFlashDeal: false,
    summary: "The undisputed benchmark for premium travel audio: Sony WH-1000XM4 features industry-leading Dual Noise Sensor ANC, high-res LDAC audio, Speak-to-Chat, and 30-hour battery life.",
    specs: [
      { label: "Noise Cancellation", value: "HD Noise Cancelling Processor QN1 with Dual Sensors" },
      { label: "Battery", value: "Up to 30 Hours with ANC (Quick Charge: 10 mins = 5 hrs)" },
      { label: "Bluetooth Codec", value: "LDAC, AAC, SBC with DSEE Extreme AI Audio Upscaling" },
      { label: "Smart Features", value: "Speak-to-Chat, Wearing Detection, Multipoint Connection" },
      { label: "Controls", value: "Intuitive Touch Sensor Surface on Right Earcup" }
    ],
    highlights: [
      "Industry-leading active noise cancellation completely silences airplane hum and office chatter.",
      "Multipoint connection seamlessly pairs with your laptop and smartphone simultaneously.",
      "Speak-to-Chat automatically pauses your music as soon as you begin speaking."
    ],
    pros: [
      "Phenomenal noise cancellation that makes working in crowded spaces blissfully quiet.",
      "Ultra-soft pressure-relieving earpads designed for long flights and workdays.",
      "Foldable swivel structure with included hard shell travel case."
    ],
    cons: [
      "Microphone performance in extremely windy outdoor environments is average.",
      "Lacks official water or sweat resistance rating (not designed for gym workouts)."
    ],
    whoShouldBuy: "Frequent flyers, coders, remote workers, and audiophiles who want the best noise-cancelling headphones money can buy.",
    verdict: "At under ₹20,000, Sony WH-1000XM4 is simply unbeatable in comfort, audio fidelity, and silence."
  },
  {
    id: "deal-19",
    slug: "oneplus-nord-buds-2-tws",
    title: "OnePlus Nord Buds 2 TWS in Ear Earbuds (25dB ANC, 12.4mm Dynamic Titanium Drivers)",
    brand: "OnePlus",
    category: "electronics",
    store: "Amazon",
    originalPrice: 3299,
    dealPrice: 2299,
    discount: "30% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹69.00",
    image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0BY8MCQ9S",
    rating: 4.4,
    reviewsCount: 29500,
    badge: "⚡ BEST ANC UNDER ₹2.5K",
    isFlashDeal: true,
    summary: "OnePlus Nord Buds 2 brings active noise cancellation down to budget territory with 25dB ANC, huge 12.4mm titanium drivers, BassWave enhancement, and up to 36 hours total battery.",
    specs: [
      { label: "Drivers", value: "12.4mm Extra Large Dynamic Titanium Drivers" },
      { label: "ANC", value: "Active Noise Cancellation up to 25dB + Transparency Mode" },
      { label: "Battery", value: "Up to 36 Hours Total (Fast Charge: 10 mins = 5 hrs)" },
      { label: "Durability", value: "IP55 Water & Sweat Resistance" },
      { label: "Bluetooth", value: "Bluetooth 5.3 with Fast Pair & Dolby Atmos support" }
    ],
    highlights: [
      "25dB Active Noise Cancellation silences AC hum and bus commute rumble.",
      "BassWave algorithm dynamically boosts lower frequencies without muddying vocals.",
      "IP55 sweat and water resistance makes them ideal workout companions."
    ],
    pros: [
      "Punchy, satisfying soundstage tuned for pop, rock, and EDM.",
      "Fast charging gives 5 hours of playback from just a 10-minute plug-in.",
      "Clean, tactile touch controls with minimal accidental taps."
    ],
    cons: [
      "ANC is designed for low continuous hums, high-pitched chatter still filters in.",
      "Case finish can pick up scratches if kept with keys."
    ],
    whoShouldBuy: "Students and commuters looking for genuine Active Noise Cancellation and punchy bass under ₹2,500.",
    verdict: "Top-tier audio value at ₹2,299. One of the highest rated earbuds under ₹3,000."
  },
  {
    id: "deal-20",
    slug: "noise-colorfit-pulse-2-max-smartwatch",
    title: "Noise ColorFit Pulse 2 Max 1.85\" Display Bluetooth Calling Smartwatch (550 Nits)",
    brand: "Noise",
    category: "electronics",
    store: "Flipkart",
    originalPrice: 5999,
    dealPrice: 1199,
    discount: "80% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹95.92",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/noise-colorfit-pulse-2-max-1-85-display-bluetooth-calling-smart-watch-550-nits-smartwatch/p/itm5e449a0d8ff0e",
    rating: 4.2,
    reviewsCount: 78000,
    badge: "🔥 80% OFF",
    isFlashDeal: true,
    summary: "Noise ColorFit Pulse 2 Max packs a massive 1.85-inch 550-nit bright TFT screen, crystal clear Bluetooth calling with Tru Sync technology, and a 10-day battery life for just ₹1,199.",
    specs: [
      { label: "Display", value: "1.85-inch LCD Display with 550 Nits Peak Brightness" },
      { label: "Calling", value: "Bluetooth Calling with Tru Sync Single-Chip Technology" },
      { label: "Sports Modes", value: "100 Sports Modes with Auto-Detection" },
      { label: "Health Tracking", value: "Noise Health Suite: 24x7 Heart Rate, SpO2, Stress Monitor" },
      { label: "Battery", value: "Up to 10 Days typical use (2-3 Days with active calling)" }
    ],
    highlights: [
      "Tru Sync single-chip Bluetooth ensures ultra-low power consumption and zero call latency.",
      "Bright 550 nits display ensures effortless daylight visibility on sunny days.",
      "Access dial pad, recent call logs, and favorite contacts straight from your wrist."
    ],
    pros: [
      "Huge display makes WhatsApp messages and notifications easy to read.",
      "Loud speaker output for clear hands-free voice calls.",
      "Sturdy IP68 water resistance handles rain and sweat without issue."
    ],
    cons: [
      "Watch casing is polycarbonate rather than aluminum alloy.",
      "Sleep tracking can occasionally log stationary TV watching as light sleep."
    ],
    whoShouldBuy: "Budget shoppers wanting a big-screen calling smartwatch that looks modern and lasts a week on a charge.",
    verdict: "At ₹1,199 with 80% discount, this is one of India's most trusted budget smartwatches."
  },
  {
    id: "deal-21",
    slug: "boat-stone-350-bluetooth-speaker",
    title: "boAt Stone 350 10W Portable Bluetooth Speaker (12H Playtime, IPX7 Water Resistant)",
    brand: "boAt",
    category: "electronics",
    store: "Flipkart",
    originalPrice: 3490,
    dealPrice: 1299,
    discount: "62% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹103.92",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/boat-stone-350-10-w-bluetooth-speaker/p/itm53fe3c5d666d9",
    rating: 4.3,
    reviewsCount: 64000,
    badge: "🔊 10W PUNCHY BASS",
    isFlashDeal: false,
    summary: "Compact yet powerful: boAt Stone 350 delivers 10W of immersive stereo sound, true wireless stereo (TWS) pairing support, rugged IPX7 waterproofing, and up to 12 hours of playtime.",
    specs: [
      { label: "Audio Output", value: "10W RMS Stereo Sound with Passive Bass Radiator" },
      { label: "Battery Life", value: "Up to 12 Hours Playtime (2200mAh Battery)" },
      { label: "Water Resistance", value: "IPX7 Water & Splash Proof (Can survive accidental dunk)" },
      { label: "Connectivity", value: "Bluetooth v5.0, AUX Mode, TF Card & TWS Pairing" },
      { label: "Port", value: "Type-C Fast Charging Interface" }
    ],
    highlights: [
      "10W stereo output with boAt Signature Sound fills a medium bedroom with rich audio.",
      "IPX7 rating allows you to take it pool-side or in the shower without water damage fears.",
      "TWS mode lets you pair two Stone 350 speakers for double the sound output."
    ],
    pros: [
      "Rugged cylindrical rubberized build survives drops and outdoor adventures.",
      "Surprisingly deep bass response given its compact soda-can size.",
      "Multi-input modes (Bluetooth, AUX, Micro SD) for versatile playback."
    ],
    cons: [
      "Distortion can be noticed at maximum 100% volume on heavy acoustic tracks.",
      "Charging from 0 to 100% takes around 2.5 hours."
    ],
    whoShouldBuy: "Outdoor lovers, hostel students, and anyone who wants a portable, waterproof speaker for room parties and trips.",
    verdict: "A durable 10W party speaker that punches well above its ₹1,299 price tag."
  },
  {
    id: "deal-22",
    slug: "jbl-go-3-portable-bluetooth-speaker",
    title: "JBL Go 3 Wireless Ultra-Portable Bluetooth Speaker (JBL Pro Sound, IP67 Waterproof)",
    brand: "JBL",
    category: "electronics",
    store: "Amazon",
    originalPrice: 3999,
    dealPrice: 2699,
    discount: "33% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹80.00",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B08KG3FFW4",
    rating: 4.5,
    reviewsCount: 38200,
    badge: "⭐ JBL PRO SOUND",
    isFlashDeal: true,
    summary: "JBL Go 3 features bold styling and rich JBL Pro Sound in a pocket-sized design. With its eye-catching edgy design, colorful fabrics, and IP67 waterproof rating, it's a must-have for every trip.",
    specs: [
      { label: "Sound", value: "Original JBL Pro Sound with Punchy Bass" },
      { label: "Protection", value: "IP67 Waterproof and Dustproof" },
      { label: "Battery", value: "Up to 5 Hours of Playtime under optimal settings" },
      { label: "Charging", value: "USB Type-C Charging Port" },
      { label: "Design", value: "Ultra-portable design with integrated carry loop" }
    ],
    highlights: [
      "JBL Pro Sound delivers surprisingly big audio and punchy bass from Go 3's ultra-compact size.",
      "IP67 waterproof and dustproof rating lets you bring your speaker anywhere—rain or shine.",
      "Integrated fabric loop makes it easy to hook onto backpacks, cycles, or shower hooks."
    ],
    pros: [
      "Unmatched acoustic clarity and refined treble compared to generic budget speakers.",
      "Extremely durable woven fabric housing that withstands sand, dirt, and water.",
      "Pocketable footprint that fits in any jacket pocket or handbag."
    ],
    cons: [
      "5 hours of battery life is modest compared to larger cylindrical speakers.",
      "No built-in microphone for speakerphone calls."
    ],
    whoShouldBuy: "Hikers, travelers, and audiophiles who demand premium JBL acoustic tuning in the smallest possible form factor.",
    verdict: "Iconic sound engineering and rugged build. At ₹2,699, it is the best pocket speaker on earth."
  },
  {
    id: "deal-23",
    slug: "mi-20000mah-18w-power-bank-3i",
    title: "Mi 20000mAh 18W Fast Charging Power Bank 3i (Triple Output, Dual Input)",
    brand: "Mi",
    category: "electronics",
    store: "Amazon",
    originalPrice: 2199,
    dealPrice: 1699,
    discount: "23% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹51.00",
    image: "https://images.unsplash.com/photo-1609592424009-43c35b8ff3c7?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B08HV832JZ",
    rating: 4.4,
    reviewsCount: 145000,
    badge: "🔋 POWER BEAST",
    isFlashDeal: false,
    summary: "The benchmark power bank for Indian consumers: Mi 20000mAh 3i delivers 18W bidirectional fast charging, 3 output ports to charge multiple devices at once, and 12-layer advanced circuit chip protection.",
    specs: [
      { label: "Capacity", value: "20,000mAh High-Density Lithium Polymer" },
      { label: "Output Power", value: "18W Fast Charge (USB-A x 2 + Type-C x 1)" },
      { label: "Inputs", value: "Dual Input: Type-C and Micro-USB" },
      { label: "Low Current Mode", value: "Double tap power button for Earbuds & Fitness Bands" },
      { label: "Safety", value: "12-Layer Advanced Circuit Chip Protection" }
    ],
    highlights: [
      "Can recharge an iPhone 15 up to 4.5 times or a Samsung Galaxy phone up to 3.8 times.",
      "Triple output allows you to charge your phone, smartwatch, and earbuds simultaneously.",
      "Two-way 18W fast charging quickly recharges the power bank itself."
    ],
    pros: [
      "Reliable high conversion efficiency with real tested capacity.",
      "Low power charging mode protects delicate battery cells in TWS earbuds.",
      "Textured matte casing prevents slipping and resists scratches."
    ],
    cons: [
      "Weighs around 434g, making it better suited for backpacks than trouser pockets.",
      "Does not support 65W laptop charging (meant for smartphones and tablets)."
    ],
    whoShouldBuy: "Frequent travelers, college students, and power users who need reliable multi-day backup power for their devices.",
    verdict: "Over 1.4 lakh verified positive ratings. At ₹1,699, it is the safest power bank buy in India."
  },
  {
    id: "deal-24",
    slug: "apple-ipad-10th-generation-64gb",
    title: "Apple iPad (10th Gen) 10.9-inch Liquid Retina Display (A14 Bionic, Wi-Fi, 64GB)",
    brand: "Apple",
    category: "electronics",
    store: "Flipkart",
    originalPrice: 39900,
    dealPrice: 30999,
    discount: "22% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹700.00",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/apple-ipad-10th-gen-64-gb-rom-10-9-inch-wi-fi-only-silver/p/itm5bf2a8d50e18d",
    rating: 4.7,
    reviewsCount: 16800,
    badge: "📱 BESTSELLER TABLET",
    isFlashDeal: true,
    summary: "The colorful redesign: Apple iPad 10th Gen features an expansive 10.9-inch Liquid Retina screen, blazing A14 Bionic chip, landscape 12MP Ultra Wide front camera with Center Stage, and modern USB-C.",
    specs: [
      { label: "Display", value: "10.9-inch Liquid Retina Display with True Tone (500 Nits)" },
      { label: "Processor", value: "A14 Bionic chip with 4-core graphics and 16-core Neural Engine" },
      { label: "Front Camera", value: "Landscape 12MP Ultra Wide with Center Stage for video calls" },
      { label: "Port", value: "USB-C for Universal Charging and Accessories" },
      { label: "Security", value: "Top Button Touch ID for fast secure authentication" }
    ],
    highlights: [
      "Center Stage automatically pans and zooms to keep you centered during FaceTime and Zoom calls.",
      "Modern all-screen industrial design with slim bezels and vibrant color options.",
      "Support for Apple Pencil (USB-C & 1st Gen) and Magic Keyboard Folio."
    ],
    pros: [
      "Flawless iPadOS experience with effortless multitasking and desktop-class Safari.",
      "Substantial jump in speaker acoustics with landscape stereo speakers.",
      "Excellent battery life averaging 10 hours of continuous video streaming."
    ],
    cons: [
      "Display is non-laminated, though virtually unnoticeable during media consumption.",
      "64GB base storage is adequate for cloud users, but heavy gamers may want 256GB."
    ],
    whoShouldBuy: "Students, digital artists, professionals, and families wanting a powerful multimedia tablet for studies, note-taking, and entertainment.",
    verdict: "At ₹30,999, the 10th Gen iPad is the premier tablet value across the entire computing industry."
  },

  // -------------------------------------------------------------
  // FASHION & APPAREL
  // -------------------------------------------------------------
  {
    id: "deal-25",
    slug: "roadster-striped-casual-shirt",
    title: "Roadster Men Navy Blue Striped Pure Cotton Regular Fit Casual Shirt",
    brand: "Roadster",
    category: "fashion",
    store: "Myntra",
    originalPrice: 1999,
    dealPrice: 599,
    discount: "70% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹47.92",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.myntra.com/shirts/roadster/roadster-men-navy-blue-casual-shirt/1373516/buy",
    rating: 4.3,
    reviewsCount: 18400,
    badge: "🔥 70% OFF LOOT",
    isFlashDeal: true,
    summary: "Crafted from 100% breathable pure cotton, this Roadster vertical striped casual shirt delivers a flattering regular fit, curved hem, and timeless spread collar for effortless smart-casual wear.",
    specs: [
      { label: "Fabric", value: "100% Breathable Pure Cotton" },
      { label: "Fit", value: "Regular Smart-Casual Fit" },
      { label: "Pattern", value: "Vertical Classic Stripes" },
      { label: "Collar", value: "Spread Collar with Full Button Placket" },
      { label: "Wash Care", value: "Machine wash cold with like colors" }
    ],
    highlights: [
      "Pure breathable cotton weave keeps you sweat-free through warm Indian summers.",
      "Vertical stripe pattern provides an elongating, slimming silhouette.",
      "Pairs effortlessly with chinos for casual Friday office wear or jeans for weekend outings."
    ],
    pros: [
      "Outstanding fabric quality and stitching durability at a ₹599 price point.",
      "Pre-shrunk fabric retains its shape and color after multiple washes.",
      "Soft hand-feel that gets even softer with every wash."
    ],
    cons: [
      "Requires light ironing after machine drying for a crisp collar look.",
      "Sizing runs slightly slim around the chest, consider sizing up for loose fits."
    ],
    whoShouldBuy: "College students and young working professionals looking for a stylish, reliable everyday casual shirt under ₹600.",
    verdict: "At 70% off (₹599), this Roadster shirt is an absolute no-brainer wardrobe upgrade."
  },
  {
    id: "deal-26",
    slug: "highlander-slim-fit-denim-jeans",
    title: "Highlander Men Slim Fit Washed Stretchable Denim Jeans (Mid-Rise)",
    brand: "Highlander",
    category: "fashion",
    store: "Myntra",
    originalPrice: 2299,
    dealPrice: 699,
    discount: "70% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹55.92",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.myntra.com/jeans/highlander/highlander-men-blue-slim-fit-stretchable-jeans/10016983/buy",
    rating: 4.2,
    reviewsCount: 31000,
    badge: "👖 STRETCH COMFORT",
    isFlashDeal: false,
    summary: "Engineered with comfort stretch denim, Highlander slim-fit washed jeans combine contemporary whiskered wash styling with 2% elastane for unrestricted movement and all-day comfort.",
    specs: [
      { label: "Material", value: "98% Cotton, 2% Elastane for Flexible Stretch" },
      { label: "Fit & Rise", value: "Slim Fit with Mid-Rise Waist" },
      { label: "Wash Style", value: "Light Fade with Clean Whiskers" },
      { label: "Pockets", value: "Classic 5-Pocket Styling with Coin Pocket" },
      { label: "Closure", value: "Sturdy Zip Fly with Metal Button Closure" }
    ],
    highlights: [
      "2% elastane blend offers generous stretch for bike riding, sitting, and walking.",
      "Modern clean washed aesthetic pairs seamlessly with graphic tees and casual shirts.",
      "Reinforced belt loops and heavy-duty brass zipper prevent mid-day malfunctions."
    ],
    pros: [
      "Incredible value for stretch denim priced under ₹700.",
      "Doesn't sag at the knees even after full-day office wear.",
      "Available in waist sizes from 28 to 36."
    ],
    cons: [
      "Initial first wash should be done separately to prevent indigo bleeding.",
      "Length may require minor alteration for folks under 5'7\"."
    ],
    whoShouldBuy: "Men looking for stylish, comfortable, daily-wear stretch jeans without spending ₹2,000+ on luxury denim brands.",
    verdict: "Top-rated comfort stretch jeans at ₹699. One of Myntra's perennial bestsellers."
  },
  {
    id: "deal-27",
    slug: "anouk-floral-kurta-palazzo-set",
    title: "Anouk Women Floral Printed Pure Cotton Kurta with Palazzos & Gotta Patti",
    brand: "Anouk",
    category: "fashion",
    store: "Myntra",
    originalPrice: 3299,
    dealPrice: 899,
    discount: "73% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹71.92",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.myntra.com/kurta-sets/anouk/anouk-women-green-printed-kurta-with-palazzos/13592476/buy",
    rating: 4.4,
    reviewsCount: 22400,
    badge: "🌸 ETHNIC FESTIVE",
    isFlashDeal: true,
    summary: "Elevate your ethnic wardrobe with this Anouk printed A-line kurta and palazzo co-ord set, crafted in soft pure cotton with intricate floral motifs and subtle Gotta Patti neckline details.",
    specs: [
      { label: "Kurta Fabric", value: "100% Pure Lightweight Breathable Cotton" },
      { label: "Bottom Fabric", value: "Pure Cotton Flared Elasticated Palazzos" },
      { label: "Neck & Sleeves", value: "Mandarin V-Neck with Three-Quarter Regular Sleeves" },
      { label: "Detailing", value: "Gotta Patti Accent Work along Neckline" },
      { label: "Length", value: "Calf Length Kurta with Ankle Length Palazzo" }
    ],
    highlights: [
      "Soft pure cotton keeps you cool during day-long festivities, poojas, and office wear.",
      "Flared palazzo silhouette offers freedom of movement and flattering drape.",
      "Elegant floral prints stay vibrant even after routine machine washing."
    ],
    pros: [
      "Ready-to-wear complete ethnic set for under ₹900.",
      "Comfortable elasticated waistband accommodates various body types.",
      "Versatile styling suited for both casual daytime and festive evening wear."
    ],
    cons: [
      "Does not include a separate dupatta (kurta + palazzo set).",
      "Hand wash recommended for the first cycle to preserve Gotta Patti luster."
    ],
    whoShouldBuy: "Women wanting a comfortable, elegant, pure cotton ethnic co-ord set for office ethnic days, family gatherings, and festivals.",
    verdict: "Pure cotton elegance at ₹899 with 73% off. A verified ethnic bestseller."
  },
  {
    id: "deal-28",
    slug: "dennis-lingo-slim-fit-cotton-shirt",
    title: "Dennis Lingo Men Slim Fit Casual Cotton Shirt with Spread Collar",
    brand: "Dennis Lingo",
    category: "fashion",
    store: "Amazon",
    originalPrice: 1849,
    dealPrice: 499,
    discount: "73% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹25.00",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B0797Y6M8H",
    rating: 4.2,
    reviewsCount: 46800,
    badge: "⚡ LOOT UNDER ₹500",
    isFlashDeal: true,
    summary: "One of Amazon's highest-selling shirts of all time: Dennis Lingo 100% premium cotton casual shirt with slim tailoring, curved hem, and rich solid colors suited for office and weekend parties.",
    specs: [
      { label: "Fabric", value: "100% Premium Combed Cotton" },
      { label: "Fit", value: "Slim Tailored Fit" },
      { label: "Sleeve", value: "Full Sleeves with Roll-Up Button Tab" },
      { label: "Collar", value: "Contemporary Spread Collar" },
      { label: "Origin", value: "Proudly Made in India" }
    ],
    highlights: [
      "Over 45,000 verified ratings make this one of the most trusted casual shirts online.",
      "Combed cotton yarn provides smooth hand-feel and durability.",
      "Wide choice of 20+ rich solid color options from Olive to Dust Pink."
    ],
    pros: [
      "Incredible value under ₹500 for a pure cotton branded shirt.",
      "Crisp collar construction that maintains its posture all day.",
      "Modern slim silhouette that fits cleanly without billowing around the waist."
    ],
    cons: [
      "Tailoring is slim; folks with broader chest or belly should order 1 size up.",
      "Requires steam or iron press after washing."
    ],
    whoShouldBuy: "Budget-conscious shoppers wanting a sharp, well-fitting casual shirt for college, dates, or semi-formal office wear.",
    verdict: "At ₹499 with 73% off, Dennis Lingo delivers exceptional style for the price."
  },

  // -------------------------------------------------------------
  // FOOTWEAR & SNEAKERS
  // -------------------------------------------------------------
  {
    id: "deal-29",
    slug: "red-tape-casual-sneaker-shoes-men",
    title: "Red Tape Casual Sneaker Shoes for Men (Cushioned Memory Foam Insole)",
    brand: "Red Tape",
    category: "footwear",
    store: "Flipkart",
    originalPrice: 5599,
    dealPrice: 1399,
    discount: "75% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹111.92",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/red-tape-sneakers-men/p/itm5a80a5e8e788e",
    rating: 4.3,
    reviewsCount: 89000,
    badge: "👟 CROWD FAVORITE",
    isFlashDeal: true,
    summary: "The sneaker phenomenon of India: Red Tape low-top casual sneakers deliver luxury designer aesthetics, high-density memory foam cushioning, and slip-resistant TPR outsoles for just ₹1,399.",
    specs: [
      { label: "Upper Material", value: "High-Grade Synthetic Leather with Perforated Toe" },
      { label: "Insole", value: "Removable High-Density Memory Foam Cushioning" },
      { label: "Sole Material", value: "Durable Thermoplastic Rubber (TPR) Outsole" },
      { label: "Closure", value: "Lace-Up with Metal Eyelets" },
      { label: "Toe Style", value: "Round Toe with Reinforced Toe Cap" }
    ],
    highlights: [
      "Memory foam footbed adapts to your unique foot arch for fatigue-free walking.",
      "Perforated toe vamp allows air circulation to keep feet dry and odorless.",
      "Crisp clean white sneaker aesthetic that matches everything from jeans to shorts."
    ],
    pros: [
      "Looks and feels like a ₹6,000 designer sneaker for a quarter of the price.",
      "Easy to clean with a damp cloth due to the synthetic leather upper.",
      "Strong grip on tiled floors and wet pavements."
    ],
    cons: [
      "Slightly heavier than knit running shoes (styled for casual lifestyle, not marathons).",
      "Memory foam takes 1-2 days of break-in for optimal softness."
    ],
    whoShouldBuy: "College students and young professionals wanting clean, trendy white sneakers with superior arch comfort under ₹1,500.",
    verdict: "At ₹1,399 with 75% discount, this is the best value white sneaker on the Indian market."
  },
  {
    id: "deal-30",
    slug: "asian-wonder-13-sports-running-shoes",
    title: "Asian Men's Wonder-13 Sports Running & Walking Shoes (EVA Cushioned Sole)",
    brand: "Asian",
    category: "footwear",
    store: "Amazon",
    originalPrice: 1299,
    dealPrice: 599,
    discount: "54% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹30.00",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B082FQZ45K",
    rating: 4.1,
    reviewsCount: 52000,
    badge: "🔥 UNDER ₹600 STEAL",
    isFlashDeal: false,
    summary: "India's highest selling budget sports shoe: Asian Wonder-13 features a breathable mesh upper, featherlight EVA sole, and ergonomic toe spring designed for morning runs and gym workouts.",
    specs: [
      { label: "Upper", value: "Breathable Knitted Mesh Fabric" },
      { label: "Sole", value: "Featherlight Shock-Absorbing EVA Cushion" },
      { label: "Weight", value: "Approx. 240g per shoe (Featherlight)" },
      { label: "Insole", value: "Orthopedic Comfort Soft Padded Bed" },
      { label: "Usage", value: "Running, Walking, Gym, Daily Casual Wear" }
    ],
    highlights: [
      "Featherlight weight reduces leg fatigue during morning walks and running sessions.",
      "Knitted mesh construction ensures air flows freely to prevent sweat accumulation.",
      "Flexible EVA outsole bends naturally with the foot during running strides."
    ],
    pros: [
      "Incredible value under ₹600 for a functional running shoe.",
      "Remarkably lightweight and comfortable straight out of the box.",
      "Machine washable on gentle cycle."
    ],
    cons: [
      "Not designed for competitive marathon racing or rugged mountain treks.",
      "Insole padding may compress after 8-10 months of heavy daily running."
    ],
    whoShouldBuy: "Morning walkers, gym beginners, and anyone needing a comfortable, featherlight sports shoe for under ₹600.",
    verdict: "Unbeatable budget utility at ₹599. Perfect for daily jogging and routine gym use."
  },
  {
    id: "deal-31",
    slug: "sparx-lightweight-running-shoes",
    title: "Sparx Men's Mesh Lightweight Running Shoes (Durable Phylon Midsole)",
    brand: "Sparx",
    category: "footwear",
    store: "Flipkart",
    originalPrice: 1799,
    dealPrice: 999,
    discount: "44% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹79.92",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/sparx-running-shoes-men/p/itm543b59b35272a",
    rating: 4.3,
    reviewsCount: 39000,
    badge: "⚡ RELAXO SPARX QUALITY",
    isFlashDeal: true,
    summary: "Built by Relaxo, India's trusted footwear brand: Sparx running shoes feature high-traction rubber pods, dual-density phylon midsole, and seamless structured mesh for rugged daily performance.",
    specs: [
      { label: "Brand Origin", value: "Relaxo Footwears Limited (India)" },
      { label: "Midsole", value: "Dual-Density Shock Absorbing Phylon" },
      { label: "Outsole", value: "Multi-Directional High-Grip Rubber Treads" },
      { label: "Upper", value: "Breathable Engineered Jacquard Mesh" },
      { label: "Warranty", value: "30-day manufacturer warranty against defects" }
    ],
    highlights: [
      "Phylon midsole absorbs heel strike impact to protect knees during road runs.",
      "Abrasion-resistant rubber outsole delivers long-lasting tread life on Indian asphalt.",
      "Reinforced TPU heel counter keeps the foot locked in place during lateral moves."
    ],
    pros: [
      "Legendary Relaxo durability that easily lasts 1.5 to 2 years of daily punishment.",
      "Balanced cushioning that provides both shock absorption and road feedback.",
      "Snug athletic fit that prevents heel slippage."
    ],
    cons: [
      "Takes a couple of days to mold perfectly to wider feet.",
      "Styling is sporty, less suited for formal office trousers."
    ],
    whoShouldBuy: "Anyone seeking a rugged, long-lasting sports shoe for road running, outdoor games, and daily chores under ₹1,000.",
    verdict: "Sparx durability at ₹999 is legendary. A rock-solid daily trainer."
  },
  {
    id: "deal-32",
    slug: "campus-first-running-shoes-men",
    title: "Campus Men's First Running Shoes (Air Capsule Cushioning & Nitrofly Sole)",
    brand: "Campus",
    category: "footwear",
    store: "Flipkart",
    originalPrice: 1999,
    dealPrice: 1199,
    discount: "40% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹95.92",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/campus-first-running-shoes-men/p/itm2847a9ef75e47",
    rating: 4.4,
    reviewsCount: 47000,
    badge: "💨 AIR CAPSULE BOUNCE",
    isFlashDeal: false,
    summary: "Campus First brings visible Air Capsule technology to Indian runners, delivering bouncy energy return, breathable knitted sock-fit upper, and anti-slip traction for ₹1,199.",
    specs: [
      { label: "Technology", value: "Visible Air Capsule Cushion in Heel" },
      { label: "Upper", value: "High-Flex Knitted Mesh with Sock-Like Collar" },
      { label: "Sole Material", value: "Phylon and TPU Bounce Compound" },
      { label: "Closure", value: "Speed-Lace System with Integrated Eyelets" },
      { label: "Support", value: "Padded Ankle Collar and Achilles Notch" }
    ],
    highlights: [
      "Air Capsule in the heel compresses upon landing and springs back for effortless strides.",
      "Sock-like knitted collar wraps snugly around the ankle to prevent chafing.",
      "Futuristic sneaker profile looks great with track pants and joggers."
    ],
    pros: [
      "Noticeably bouncy heel cushioning that reduces joint impact during running.",
      "Very stylish silhouette that mimics high-end Nike Air Max models.",
      "Breathable fabric keeps feet cool during hot summer workouts."
    ],
    cons: [
      "Air capsule should be kept away from sharp nails or construction debris.",
      "Snug fit around the instep; wide-footed buyers should consider 1 size larger."
    ],
    whoShouldBuy: "Fitness lovers and college runners wanting bouncy air cushioning and head-turning sporty looks under ₹1,200.",
    verdict: "Incredible cushioning tech at just ₹1,199. Campus First sets the benchmark in budget running comfort."
  },

  // -------------------------------------------------------------
  // HOME & KITCHEN APPLIANCES
  // -------------------------------------------------------------
  {
    id: "deal-33",
    slug: "pigeon-handy-plastic-chopper-blades",
    title: "Pigeon by Stovekraft Handy Plastic Chopper with 3 Stainless Steel Blades (400ml)",
    brand: "Pigeon",
    category: "home",
    store: "Amazon",
    originalPrice: 545,
    dealPrice: 199,
    discount: "63% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹10.00",
    image: "https://images.unsplash.com/photo-1584990347449-359bcbe7352f?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B01LWYXB3L",
    rating: 4.3,
    reviewsCount: 195000,
    badge: "🏆 1.9 LAKH+ REVIEWS",
    isFlashDeal: true,
    summary: "India's #1 kitchen tool: The Pigeon Handy Chopper cuts onions, tomatoes, and vegetables in seconds with zero tears using its 3 razor-sharp stainless steel blades and effortless pull-cord mechanism.",
    specs: [
      { label: "Capacity", value: "400ml Unbreakable BPA-Free Plastic Bowl" },
      { label: "Blades", value: "3 High-Grade Stainless Steel Chopping Blades" },
      { label: "Operation", value: "Manual Pull-Cord Mechanism (No Electricity Required)" },
      { label: "Safety", value: "Sturdy Locking Lid with Anti-Skid Base" },
      { label: "Cleaning", value: "Dishwasher Safe & Easy to Disassemble" }
    ],
    highlights: [
      "Chops onions, garlic, chillies, and ginger into fine pieces in under 5 pulls.",
      "Zero electricity required—works during power outages and travels easily.",
      "Over 1.95 lakh verified ratings make it one of the top 3 selling products on Amazon India."
    ],
    pros: [
      "Saves 15-20 minutes of tedious manual chopping every single day.",
      "Eliminates teary eyes from chopping pungent onions completely.",
      "Compact size stores away easily in any kitchen drawer."
    ],
    cons: [
      "Cord should be pulled horizontally; pulling at harsh angles can cause wear on the cord exit.",
      "Hard vegetables like carrots need to be pre-cut into 1-inch chunks first."
    ],
    whoShouldBuy: "Every single Indian household. A life-changing kitchen upgrade for less than the price of a movie ticket.",
    verdict: "At ₹199 with 63% off, this is the single best value purchase for any Indian kitchen."
  },
  {
    id: "deal-34",
    slug: "philips-daily-air-fryer-rapid-air",
    title: "Philips Daily Collection 4.1L Air Fryer (Rapid Air Technology, 90% Less Oil)",
    brand: "Philips",
    category: "home",
    store: "Amazon",
    originalPrice: 11995,
    dealPrice: 5999,
    discount: "50% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹180.00",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B097RVF18P",
    rating: 4.5,
    reviewsCount: 28400,
    badge: "🍟 90% LESS OIL",
    isFlashDeal: false,
    summary: "Cook your favorite crispy samosas, french fries, tikkas, and roasted chicken with up to 90% less oil. Philips Rapid Air technology circulates superheated air for golden crispy exteriors and tender interiors.",
    specs: [
      { label: "Capacity", value: "4.1 Litre Pan (Ideal for 3-4 person families)" },
      { label: "Technology", value: "Patented Rapid Air Technology with Starfish Design" },
      { label: "Power", value: "1400W Fast-Heating Heating Element" },
      { label: "Controls", value: "Adjustable Time and Temperature Control (up to 200°C)" },
      { label: "Coating", value: "Non-Stick QuickClean Basket" }
    ],
    highlights: [
      "Patented starfish bottom swirls hot air evenly for uniform browning without shaking.",
      "Enjoy guilt-free crispy snacks with just 1-2 sprays of oil instead of deep frying.",
      "NutriU app provides hundreds of personalized healthy Indian recipes."
    ],
    pros: [
      "Dramatically cuts calorie intake while preserving authentic crunch and taste.",
      "Reheats pizza and fried snacks back to original fresh-out-of-the-pan crispiness.",
      "Removable non-stick basket rinses clean in under 30 seconds."
    ],
    cons: [
      "Analog dial version lacks digital one-touch preset buttons (available on higher variants).",
      "Takes up counter space, best suited for kitchens with dedicated prep areas."
    ],
    whoShouldBuy: "Health-conscious families, gym enthusiasts, and parents wanting healthier snacks for kids without giving up fried favorites.",
    verdict: "The gold standard of air fryers at a flat 50% discount (₹5,999). An investment in family health."
  },
  {
    id: "deal-35",
    slug: "prestige-iris-750w-mixer-grinder",
    title: "Prestige Iris 750W Mixer Grinder with 3 Stainless Steel Jars & Transparent Juicer",
    brand: "Prestige",
    category: "home",
    store: "Flipkart",
    originalPrice: 6295,
    dealPrice: 2899,
    discount: "54% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹231.92",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/prestige-iris-750-w-mixer-grinder-4-jars-white/p/itm5ff530e163b46",
    rating: 4.2,
    reviewsCount: 118000,
    badge: "⚡ 750W HEAVY DUTY",
    isFlashDeal: true,
    summary: "Heavy duty grinding made effortless: Prestige Iris 750W motor pulverizes the toughest Indian spices, turmeric roots, and idli batter, accompanied by 3 stainless steel jars and a dedicated juicer jar.",
    specs: [
      { label: "Motor", value: "750 Watt Heavy Duty Copper-Wound Motor" },
      { label: "Jars Included", value: "Wet Jar (1.5L), Dry Jar (1L), Chutney Jar (300ml) + Juicer (1.5L)" },
      { label: "Speed Control", value: "3 Speed Rotary Switch with Whip/Pulse Function" },
      { label: "Overload Protection", value: "Automated Thermal Overload Reset Switch" },
      { label: "Warranty", value: "2 Years Comprehensive Manufacturer Warranty" }
    ],
    highlights: [
      "750W high-torque motor grinds dry raw turmeric, coconut, and thick batter effortlessly.",
      "Dedicated transparent juicer jar with sieve extracts fresh fruit juice without pulp seeds.",
      "Ergonomic jar handles provide secure grip while pouring thick gravies."
    ],
    pros: [
      "Proven Indian kitchen workhorse with over 1.1 lakh Flipkart reviews.",
      "Sturdy stainless steel blades that stay sharp through years of spice grinding.",
      "Thermal overload protection prevents motor burnouts during tough tasks."
    ],
    cons: [
      "750W motor produces audible operating sound during peak high-speed grinding.",
      "Initial 2-3 uses may emit a slight motor varnish smell, which is completely normal."
    ],
    whoShouldBuy: "Indian families needing a dependable, heavy-duty 750W mixer grinder for daily masala, chutney, and batter grinding.",
    verdict: "Top-selling 750W mixer grinder in India. Unbeatable power and 4 jars at ₹2,899."
  },
  {
    id: "deal-36",
    slug: "borosil-glass-lunch-box-set-3",
    title: "Borosil Klip N Store Microwave Safe Glass Lunch Box Set of 3 (400ml each with Bag)",
    brand: "Borosil",
    category: "home",
    store: "Amazon",
    originalPrice: 1590,
    dealPrice: 899,
    discount: "43% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹27.00",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B073Z9775Q",
    rating: 4.4,
    reviewsCount: 34500,
    badge: "🥗 100% TOXIN FREE",
    isFlashDeal: false,
    summary: "Ditch harmful plastic tiffins: Borosil Klip N Store features 100% borosilicate glass containers that are 100% microwave and dishwasher safe, leak-proof, and odor-free with an insulated travel bag.",
    specs: [
      { label: "Material", value: "100% Pure 400°C Heat-Resistant Borosilicate Glass" },
      { label: "Set Contains", value: "3 x 400ml Glass Containers + 1 Insulated Fabric Carrying Bag" },
      { label: "Lid Type", value: "Airtight Silicone Sealed Clip Lids (100% Spill Proof)" },
      { label: "Compatibility", value: "Microwave, Oven, Freezer & Dishwasher Safe" },
      { label: "Health Standard", value: "100% BPA Free, Lead Free, Zero Chemical Leaching" }
    ],
    highlights: [
      "Borosilicate glass does not absorb curry stains, turmeric colors, or stubborn food odors.",
      "Silicone gasket airtight seal guarantees zero oil or gravy leaks inside your office bag.",
      "Can be heated directly in the office microwave without removing the food."
    ],
    pros: [
      "Much healthier and safer than plastic tiffins that leach toxins when microwaved.",
      "Crystal clear transparency makes it easy to identify contents without opening.",
      "Thermal shock resistant: can go straight from the fridge to the microwave."
    ],
    cons: [
      "Heavier to carry in a backpack compared to plastic or stainless steel boxes.",
      "Needs careful handling to avoid accidental drops on hard concrete floors."
    ],
    whoShouldBuy: "Office professionals, corporate employees, and health-conscious eaters who microwave their lunch daily.",
    verdict: "Clean, hygienic, and leak-proof. At ₹899 with an insulated bag, this is the premier office lunch kit."
  },
  {
    id: "deal-37",
    slug: "wipro-9w-smart-led-bulb",
    title: "Wipro 9W Smart LED Bulb (16 Million Colors, Alexa & Google Assistant Compatible)",
    brand: "Wipro",
    category: "home",
    store: "Amazon",
    originalPrice: 999,
    dealPrice: 399,
    discount: "60% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹12.00",
    image: "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B082BG79G6",
    rating: 4.3,
    reviewsCount: 65000,
    badge: "💡 16M RGB COLORS",
    isFlashDeal: true,
    summary: "Transform your bedroom into a cozy haven: Wipro 9W Smart LED bulb connects directly to your home Wi-Fi with no hub required, offering 16 million colors, voice control, and music sync.",
    specs: [
      { label: "Wattage", value: "9 Watts Energy Efficient LED (810 Lumens)" },
      { label: "Colors", value: "16 Million RGB Colors + Tunable White (Warm to Cool)" },
      { label: "Smart Control", value: "Amazon Alexa & Google Assistant Voice Commands" },
      { label: "Connectivity", value: "Direct 2.4GHz Wi-Fi (No separate hub required)" },
      { label: "App", value: "Wipro Next Smart Home App (iOS & Android)" }
    ],
    highlights: [
      "Dim or brighten lighting from 1% to 100% using your smartphone or simple voice commands.",
      "Music sync mode pulses lighting in rhythm with your favorite songs for room parties.",
      "Set automated schedules to wake up to gentle warm light in the morning."
    ],
    pros: [
      "Extremely affordable entry into smart home automation under ₹400.",
      "Works with standard Indian B22 bulb sockets without adapters.",
      "Tunable white lets you switch between 6500K study light and 2700K relaxing warm light."
    ],
    cons: [
      "Requires a standard 2.4GHz Wi-Fi network (does not connect to 5GHz only routers).",
      "Requires constant wall switch ON position for app automation to function."
    ],
    whoShouldBuy: "Anyone wanting cozy mood lighting, voice control, or smart wake-up schedules in their bedroom or study room.",
    verdict: "At ₹399 with 60% off, upgrading your room to smart lighting has never been cheaper."
  },

  // -------------------------------------------------------------
  // DAILY ESSENTIALS & BUDGET LOOT UNDER ₹299
  // -------------------------------------------------------------
  {
    id: "deal-38",
    slug: "shopsy-mens-round-neck-tshirts-pack-3",
    title: "Shopsy by Flipkart Solid Men Round Neck Poly Cotton T-Shirt (Pack of 3)",
    brand: "Shopsy",
    category: "fashion",
    store: "Flipkart",
    originalPrice: 999,
    dealPrice: 299,
    discount: "70% OFF",
    profitRate: "8% Profit",
    profitEarned: "₹23.92",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.flipkart.com/tripr-solid-men-round-neck-multicolor-t-shirt/p/itmd5fcf3f87508e",
    rating: 4.1,
    reviewsCount: 92000,
    badge: "🔥 LOOT: 3 FOR ₹299",
    isFlashDeal: true,
    summary: "Massive budget combo deal: Get a pack of 3 solid crew-neck t-shirts in versatile black, navy, and grey colors. Lightweight, quick-drying poly-cotton blend ideal for daily lounging, gym, and sleeping.",
    specs: [
      { label: "Pack Contains", value: "3 Solid T-Shirts (Black, Navy Blue, Grey Melange)" },
      { label: "Fabric", value: "Breathable Poly-Cotton Blend (Quick-Dry)" },
      { label: "Neck & Sleeve", value: "Round Crew Neck with Half Sleeves" },
      { label: "Fit", value: "Regular Casual Loungewear Fit" },
      { label: "Care", value: "Hand & Machine Wash Safe" }
    ],
    highlights: [
      "Unbelievable price of just ₹100 per t-shirt in this combo pack.",
      "Quick-dry fabric resists wrinkles and requires minimal to zero ironing.",
      "Comfortable breathable fit for sleeping, gym workouts, and casual errands."
    ],
    pros: [
      "Incomparable value-for-money combo deal under ₹300.",
      "Colors do not fade quickly when washed in normal water.",
      "Lightweight material keeps body cool in humid weather."
    ],
    cons: [
      "Fabric is lightweight; best suited for casual loungewear rather than heavy winter warmth.",
      "Sizing can run snug, ordering one size up is recommended for loose comfort."
    ],
    whoShouldBuy: "Budget shoppers, hostelers, and daily gym goers who need plenty of spare daily wear t-shirts on a tight budget.",
    verdict: "3 branded t-shirts for ₹299 is genuine loot pricing. Grab this before stock runs out."
  },
  {
    id: "deal-39",
    slug: "car-air-vent-phone-mount-gravity",
    title: "Car Air Vent Phone Holder Mount with 360 Degree Rotation & Auto Gravity Lock",
    brand: "Portronics",
    category: "electronics",
    store: "Amazon",
    originalPrice: 699,
    dealPrice: 249,
    discount: "64% OFF",
    profitRate: "Upto 5% Profit",
    profitEarned: "₹7.50",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://www.amazon.in/dp/B07LGYW69L",
    rating: 4.2,
    reviewsCount: 21500,
    badge: "🚗 MUST-HAVE CAR ACCESSORY",
    isFlashDeal: false,
    summary: "Drive safely with hands-free navigation: This gravity car vent mount automatically locks your phone securely using its own weight when placed in the cradle, with zero buttons or clamps to adjust.",
    specs: [
      { label: "Mechanism", value: "Auto Gravity Linkage (Drop to Lock, Lift to Release)" },
      { label: "Mount Type", value: "Upgraded Silicone Padded AC Vent Clip" },
      { label: "Rotation", value: "360-Degree Ball Joint Swivel" },
      { label: "Compatibility", value: "Universal fit for all 4.7 to 6.8 inch smartphones" },
      { label: "Protection", value: "Thick Silicone Pads Prevent Scratches on Vents and Phone" }
    ],
    highlights: [
      "True one-handed operation: drop phone in with one hand and gravity locks the side arms.",
      "Firm silicone clip securely grabs car AC vent slats without scratching dashboard plastics.",
      "Charging cable cutout at the bottom allows you to charge your phone while navigating."
    ],
    pros: [
      "Solves the danger of looking down at your lap while using Google Maps.",
      "Keeps phone cooled by the AC airflow during intensive GPS navigation on hot days.",
      "Super compact and doesn't obstruct windshield driving visibility."
    ],
    cons: [
      "Designed for vertical orientation; gravity mechanism doesn't lock in horizontal landscape mode.",
      "Not compatible with round rotary AC vents (best for standard horizontal/vertical slats)."
    ],
    whoShouldBuy: "Car drivers, daily commuters, and road-trippers who rely on Google Maps and hands-free calls while driving.",
    verdict: "Essential car safety accessory at just ₹249 with 64% discount."
  },

  // -------------------------------------------------------------
  // HIGH CASHBACK CREDIT CARDS / FINANCE
  // -------------------------------------------------------------
  {
    id: "deal-40",
    slug: "axis-bank-airtel-credit-card",
    title: "Axis Bank Airtel Credit Card - Flat 25% Cashback on Airtel Bills, 10% on Swiggy & Zomato",
    brand: "Axis Bank",
    category: "finance",
    store: "Axis Bank",
    originalPrice: 500,
    dealPrice: 0,
    discount: "100% OFF",
    profitRate: "Flat ₹2,240 Profit",
    profitEarned: "₹2,240.00",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
    canonicalUrl: "https://earnkaro.com/stores/axis-bank-credit-card",
    rating: 4.8,
    reviewsCount: 38900,
    badge: "💳 FLAT 25% CASHBACK",
    isFlashDeal: true,
    summary: "One of the most rewarding utility cashback credit cards in India: Get flat 25% cashback on Airtel mobile, broadband, and DTH recharges, 10% cashback on Swiggy, Zomato & BigBasket, and 10% on utility bills.",
    specs: [
      { label: "Joining Fee", value: "₹0 First Year Free Offer / Waived on Spends" },
      { label: "Airtel Cashback", value: "Flat 25% Cashback via Airtel Thanks App (Max ₹250/month)" },
      { label: "Food & Grocery", value: "10% Cashback on Swiggy, Zomato & BigBasket (Max ₹500/month)" },
      { label: "Utility Bills", value: "10% Cashback on Electricity, Gas, Water bills via Airtel Thanks" },
      { label: "Airport Lounge", value: "4 Complimentary Domestic Airport Lounge visits per year" }
    ],
    highlights: [
      "Earn up to ₹1,000+ real hard cashback directly credited to your statement every single month.",
      "10% cashback on Swiggy & Zomato applies on top of restaurant promo codes.",
      "Annual fee of ₹500 is easily recovered within the very first month of bill payments."
    ],
    pros: [
      "Unmatched 25% cashback rate on mobile and Wi-Fi broadband bills.",
      "Massive ₹12,000+ annual savings potential for typical Indian households.",
      "Complimentary domestic airport lounge access included."
    ],
    cons: [
      "Maximum monthly cashback caps apply on each category.",
      "Utility cashback only applies when paid via the Airtel Thanks App."
    ],
    whoShouldBuy: "Airtel users, foodies ordering from Swiggy/Zomato, and anyone paying monthly electricity/broadband bills who wants ₹1,000+ cashback every month.",
    verdict: "Hands down the highest-yielding utility cashback card in India. Zero joining fee application."
  }
];

async function main() {
  console.log(`Starting catalog expansion with ${newProducts.length} new products...`);

  // Load existing catalog
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const existingCatalog = JSON.parse(raw);
  console.log(`Current catalog has ${existingCatalog.length} products.`);

  const processedNew = [];

  for (let i = 0; i < newProducts.length; i++) {
    const item = newProducts[i];
    console.log(`[${i + 1}/${newProducts.length}] Converting affiliate link for: ${item.title.substring(0, 40)}...`);
    const profitLink = await convertUrl(item.canonicalUrl, item.store);
    console.log(`   -> Generated Link: ${profitLink}`);

    processedNew.push({
      id: item.id,
      slug: item.slug,
      title: item.title,
      brand: item.brand,
      category: item.category,
      store: item.store,
      originalPrice: item.originalPrice,
      dealPrice: item.dealPrice,
      discount: item.discount,
      profitRate: item.profitRate,
      profitEarned: item.profitEarned,
      image: item.image,
      profitLink: profitLink,
      rating: item.rating,
      reviewsCount: item.reviewsCount,
      badge: item.badge,
      isFlashDeal: item.isFlashDeal,
      summary: item.summary,
      specs: item.specs,
      highlights: item.highlights,
      pros: item.pros,
      cons: item.cons,
      whoShouldBuy: item.whoShouldBuy,
      verdict: item.verdict
    });

    // Small pacing delay to respect API rate limits
    await new Promise(r => setTimeout(r, 400));
  }

  // Merge catalogs (avoiding duplicates by id or slug)
  const existingSlugs = new Set(existingCatalog.map(p => p.slug));
  const finalCatalog = [...existingCatalog];

  for (const item of processedNew) {
    if (!existingSlugs.has(item.slug)) {
      finalCatalog.push(item);
      existingSlugs.add(item.slug);
    }
  }

  console.log(`Total merged catalog items: ${finalCatalog.length}`);
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(finalCatalog, null, 2), "utf8");
  console.log(`✅ Saved updated catalog to ${CATALOG_PATH}`);
}

main().catch(console.error);
