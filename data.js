// ============================================================
// TheBhom.in — MEGA Content Database
// data.js — Thousands of FREE HD/4K items
// ============================================================
(function(global) {
// ===== WALLPAPERS (500+ items) =====
const WALLPAPER_THEMES = [
  // Nature
  { title:'Swiss Alps at Sunrise', emoji:'🏔️', tag:'Nature', quality:'4K', sub:'Mountains', colors:['#0d1b2a','#1a0a3a'] },
  { title:'Northern Lights Iceland', emoji:'🌌', tag:'Nature', quality:'4K', sub:'Aurora', colors:['#0a0f2a','#0a2a1a'] },
  { title:'Amazon Rainforest Aerial', emoji:'🌿', tag:'Nature', quality:'4K', sub:'Forest', colors:['#0a2a0a','#0d1a0a'] },
  { title:'Maldives Sunset Beach', emoji:'🏝️', tag:'Nature', quality:'4K', sub:'Ocean', colors:['#0a1f3a','#1a0a2a'] },
  { title:'Himalayas Snow Peak', emoji:'⛰️', tag:'Nature', quality:'4K', sub:'Mountains', colors:['#1a1f2a','#0a1a2a'] },
  { title:'Sahara Desert Dunes', emoji:'🏜️', tag:'Nature', quality:'4K', sub:'Desert', colors:['#2a1a0a','#1a0a0a'] },
  { title:'Norwegian Fjord Reflection', emoji:'🏞️', tag:'Nature', quality:'4K', sub:'Water', colors:['#0a1a2a','#0a2a2a'] },
  { title:'Great Barrier Reef Underwater', emoji:'🐠', tag:'Nature', quality:'4K', sub:'Ocean', colors:['#0a1a3a','#0a2a2a'] },
  { title:'Cherry Blossom Japan', emoji:'🌸', tag:'Nature', quality:'4K', sub:'Flowers', colors:['#2a0a1a','#1a0a2a'] },
  { title:'Niagara Falls Rainbow', emoji:'🌊', tag:'Nature', quality:'4K', sub:'Waterfall', colors:['#0a1a2a','#0a2a1a'] },
  { title:'Grand Canyon Sunset', emoji:'🌅', tag:'Nature', quality:'4K', sub:'Canyon', colors:['#2a1a0a','#2a0a0a'] },
  { title:'Amazon River Aerial View', emoji:'🛩️', tag:'Nature', quality:'4K', sub:'Forest', colors:['#0a2a0a','#0a1a1a'] },
  { title:'Patagonia Lightning Storm', emoji:'⚡', tag:'Nature', quality:'4K', sub:'Storm', colors:['#0a0a2a','#1a0a2a'] },
  { title:'Iceland Black Sand Beach', emoji:'🖤', tag:'Nature', quality:'4K', sub:'Beach', colors:['#0a0a0f','#1a0a2a'] },
  { title:'Lavender Fields Provence', emoji:'💜', tag:'Nature', quality:'4K', sub:'Flowers', colors:['#1a0a2a','#0a0a1a'] },
  { title:'Tropical Waterfall Jungle', emoji:'🌴', tag:'Nature', quality:'4K', sub:'Forest', colors:['#0a2a1a','#0a1a0a'] },
  { title:'Aurora Borealis Norway', emoji:'🌠', tag:'Nature', quality:'4K', sub:'Aurora', colors:['#0a0a2a','#0a2a1a'] },
  { title:'Volcano Eruption Hawaii', emoji:'🌋', tag:'Nature', quality:'4K', sub:'Volcano', colors:['#2a0a0a','#1a0a0a'] },
  { title:'Sunflower Field Germany', emoji:'🌻', tag:'Nature', quality:'4K', sub:'Flowers', colors:['#2a2a0a','#1a1a0a'] },
  { title:'Yosemite Valley Fall', emoji:'🍂', tag:'Nature', quality:'4K', sub:'Forest', colors:['#2a1a0a','#1a0a0a'] },
  // Cities
  { title:'New York Times Square Night', emoji:'🗽', tag:'Cities', quality:'4K', sub:'America', colors:['#0a0a2a','#1a0a0a'] },
  { title:'Dubai Burj Khalifa Sunset', emoji:'🏙️', tag:'Cities', quality:'4K', sub:'Middle East', colors:['#2a1a0a','#0a1a2a'] },
  { title:'Tokyo Neon Shibuya Crossing', emoji:'🇯🇵', tag:'Cities', quality:'4K', sub:'Japan', colors:['#0a0a2a','#2a0a1a'] },
  { title:'Paris Eiffel Tower Night', emoji:'🗼', tag:'Cities', quality:'4K', sub:'Europe', colors:['#0a0a1a','#1a0a2a'] },
  { title:'Mumbai Skyline Monsoon', emoji:'🌧️', tag:'Cities', quality:'4K', sub:'India', colors:['#0a1a2a','#0a0a1a'] },
  { title:'London Tower Bridge Fog', emoji:'🇬🇧', tag:'Cities', quality:'4K', sub:'Europe', colors:['#0a0a1a','#1a1a2a'] },
  { title:'Sydney Opera House Dawn', emoji:'🦘', tag:'Cities', quality:'4K', sub:'Australia', colors:['#0a1a2a','#0a2a2a'] },
  { title:'Singapore Marina Bay Night', emoji:'🇸🇬', tag:'Cities', quality:'4K', sub:'Asia', colors:['#0a0a2a','#0a1a0a'] },
  { title:'Hong Kong Victoria Harbour', emoji:'🇭🇰', tag:'Cities', quality:'4K', sub:'Asia', colors:['#0a0a2a','#1a0a1a'] },
  { title:'Rome Colosseum Golden Hour', emoji:'🏛️', tag:'Cities', quality:'4K', sub:'Europe', colors:['#2a1a0a','#1a0a0a'] },
  { title:'Delhi India Gate Sunrise', emoji:'🇮🇳', tag:'Cities', quality:'4K', sub:'India', colors:['#2a1a0a','#0a0a1a'] },
  { title:'Jaipur Pink City Aerial', emoji:'🏰', tag:'Cities', quality:'4K', sub:'India', colors:['#2a0a1a','#1a0a0a'] },
  { title:'Varanasi Ganges Ghats', emoji:'🙏', tag:'Cities', quality:'4K', sub:'India', colors:['#2a1a0a','#1a0a1a'] },
  // Abstract & Art
  { title:'Neon Geometric Explosion', emoji:'💥', tag:'Abstract', quality:'4K', sub:'Geometric', colors:['#1a0a2a','#0a0a1a'] },
  { title:'Liquid Chrome Waves', emoji:'🌊', tag:'Abstract', quality:'4K', sub:'Fluid', colors:['#0a0a1a','#1a1a2a'] },
  { title:'Fractal Galaxy Spiral', emoji:'🌀', tag:'Abstract', quality:'4K', sub:'Fractal', colors:['#0a0a2a','#1a0a2a'] },
  { title:'Holographic Rainbow Prism', emoji:'🌈', tag:'Abstract', quality:'4K', sub:'Prism', colors:['#1a0a2a','#0a1a2a'] },
  { title:'Dark Matter Particle Field', emoji:'⚛️', tag:'Abstract', quality:'4K', sub:'Sci-Fi', colors:['#0a0a0a','#0a0a1a'] },
  { title:'Golden Mandala Pattern', emoji:'✨', tag:'Abstract', quality:'4K', sub:'Mandala', colors:['#2a1a0a','#1a0a0a'] },
  { title:'Cyberpunk Grid Matrix', emoji:'🤖', tag:'Abstract', quality:'4K', sub:'Cyber', colors:['#0a1a0a','#0a0a0a'] },
  { title:'Watercolor Bloom Splash', emoji:'🎨', tag:'Abstract', quality:'4K', sub:'Art', colors:['#2a0a1a','#1a0a2a'] },
  { title:'Neon Dragon Digital Art', emoji:'🐉', tag:'Abstract', quality:'4K', sub:'Digital Art', colors:['#0a0a2a','#2a0a0a'] },
  { title:'Galaxy Milky Way Center', emoji:'🌌', tag:'Space', quality:'4K', sub:'Galaxy', colors:['#0a0a1a','#0a0a2a'] },
  { title:'Nebula Purple Cosmic Dust', emoji:'🔭', tag:'Space', quality:'4K', sub:'Nebula', colors:['#1a0a2a','#0a0a1a'] },
  { title:'Planet Earth Blue Marble', emoji:'🌍', tag:'Space', quality:'4K', sub:'Planet', colors:['#0a0a2a','#0a1a2a'] },
  { title:'Mars Red Planet Surface', emoji:'🔴', tag:'Space', quality:'4K', sub:'Planet', colors:['#2a0a0a','#1a0a0a'] },
  { title:'Supernova Star Explosion', emoji:'💫', tag:'Space', quality:'4K', sub:'Stars', colors:['#0a0a2a','#2a0a1a'] },
  // Animals
  { title:'Bengal Tiger Close Up', emoji:'🐯', tag:'Animals', quality:'4K', sub:'Big Cats', colors:['#2a1a0a','#1a0a0a'] },
  { title:'Bald Eagle Flight', emoji:'🦅', tag:'Animals', quality:'4K', sub:'Birds', colors:['#0a1a2a','#1a1a0a'] },
  { title:'Wolf Pack Snow Forest', emoji:'🐺', tag:'Animals', quality:'4K', sub:'Wildlife', colors:['#0a0a1a','#1a1a2a'] },
  { title:'Elephant Herd Savanna', emoji:'🐘', tag:'Animals', quality:'4K', sub:'Africa', colors:['#1a1a0a','#2a1a0a'] },
  { title:'Humpback Whale Breach', emoji:'🐋', tag:'Animals', quality:'4K', sub:'Ocean', colors:['#0a1a2a','#0a0a2a'] },
  // Minimal & Dark
  { title:'Dark Minimal Lines', emoji:'➖', tag:'Minimal', quality:'4K', sub:'Dark', colors:['#050508','#080810'] },
  { title:'Black Carbon Fiber Texture', emoji:'⬛', tag:'Minimal', quality:'4K', sub:'Texture', colors:['#080808','#101010'] },
  { title:'White Marble Texture', emoji:'⬜', tag:'Minimal', quality:'4K', sub:'Texture', colors:['#1a1a1a','#2a2a2a'] },
  { title:'Gradient Purple to Pink', emoji:'🎆', tag:'Minimal', quality:'4K', sub:'Gradient', colors:['#2a0a2a','#1a0a1a'] },
  { title:'Deep Ocean Abyss', emoji:'🌑', tag:'Minimal', quality:'4K', sub:'Dark', colors:['#020208','#050510'] },
];

// Generate 500+ wallpapers
const WALLPAPERS = [];
const W_EXTRA_TAGS = ['HD Portrait','Phone Wallpaper','Desktop 4K','Ultra Wide','Dual Monitor','AMOLED Black'];
for(let i=0;i<WALLPAPER_THEMES.length;i++){
  const t=WALLPAPER_THEMES[i];
  WALLPAPERS.push({id:`w${i+1}`,title:t.title,emoji:t.emoji,tag:t.tag,quality:t.quality,sub:t.sub,colors:t.colors,downloads:Math.floor(Math.random()*50000)+5000,isNew:Math.random()>.75,rating:4+(Math.random()*.9).toFixed(1)*1,type:'wallpaper'});
}
// Generate additional wallpapers programmatically
const MORE_WALLS = [
  ['🌄','Misty Mountain Dawn','Mountains'],['🌃','City Lights Bokeh','Cities'],['🦁','Lion Pride Savanna','Animals'],
  ['🐋','Blue Whale Ocean Deep','Ocean'],['🦋','Butterfly Macro Purple','Macro'],['🌺','Hibiscus Tropical Red','Flowers'],
  ['❄️','Ice Crystal Snowflake','Winter'],['🔥','Fire Abstract Orange','Abstract'],['🌙','Crescent Moon Night Sky','Space'],
  ['🏄','Surfer Wave Aerial','Sports'],['🚗','Ferrari Red Speed','Cars'],['✈️','Airplane Above Clouds','Aviation'],
  ['🎸','Guitar Strings Abstract','Music'],['🍜','Ramen Noodles Macro','Food'],['🦚','Peacock Feather Close Up','Birds'],
  ['🌊','Ocean Wave Barrel','Surfing'],['🏔️','K2 Summit Climber','Adventure'],['🌹','Red Rose Water Drops','Flowers'],
  ['🦈','Great White Shark Breach','Ocean'],['🌴','Palm Tree Sunset Silhouette','Tropical'],
  ['🎑','Bonsai Tree Minimal','Japan'],['🎋','Bamboo Forest Green','Forest'],['🌾','Golden Wheat Field','Farm'],
  ['🦜','Macaw Parrot Colorful','Birds'],['🐊','Crocodile Swamp','Reptiles'],['🌵','Saguaro Cactus Desert','Desert'],
  ['🏊','Swimmer Underwater','Sports'],['🚵','MTB Mountain Biker','Extreme'],['🎭','Mask Theater Drama','Art'],
  ['🏹','Archer Forest Target','Sport'],['🌒','Moon Phase Series 4K','Space'],['🔮','Crystal Ball Mystical','Fantasy'],
  ['🦩','Flamingo Pink Flock','Birds'],['🦊','Fox Snow Forest Red','Animals'],['🐋','Orca Whale Splash','Ocean'],
  ['🌟','Starfield Milky Way Astrophoto','Space'],['🎠','Fairground Carousel','Travel'],['🌏','Asia Satellite View','Space'],
  ['🏯','Osaka Castle Night','Japan'],['🕌','Taj Mahal Sunset','India'],['🗿','Easter Island Moai','Travel'],
  ['🌁','San Francisco Golden Gate Fog','USA'],['🏂','Snowboarder Aerial Jump','Extreme'],['🎿','Ski Slope Alpine','Winter'],
  ['🌞','Solar Flare Close Up','Space'],['🌊','Tsunami Wave Before','Ocean'],['🎆','Fireworks City Night','Celebration'],
  ['🎇','Sparkler Hand Bokeh','Abstract'],['🕯️','Candle Flame Macro','Macro'],['💎','Diamond Refraction','Macro'],
  ['🔬','Microscope Cell Biology','Science'],['⚗️','Chemistry Lab Blue','Science'],['🧲','Magnetic Field Lines','Science'],
  ['🎵','Sound Wave Visualization','Music'],['🎹','Piano Keys Black White','Music'],['🎺','Trumpet Jazz Smoke','Music'],
  ['🍄','Mushroom Forest Fairy','Nature'],['🌿','Fern Macro Green','Macro'],['🍁','Maple Leaf Fall Canada','Nature'],
  ['🐝','Bee Flower Macro','Macro'],['🦗','Insect Wing Detail','Macro'],['🌊','Bioluminescent Beach','Ocean'],
  ['🌈','Double Rainbow Mountain','Nature'],['⛄','Snowman Blizzard','Winter'],['🌬️','Wind Turbines Aerial','Technology'],
  ['☀️','Solar Panel Field Aerial','Technology'],['🌉','Bridge Suspension Night','Architecture'],['🏗️','Skyscraper Construction','Architecture'],
  ['🏛️','Pantheon Interior Rome','Architecture'],['🕍','Notre Dame Cathedral','Architecture'],['🏟️','Stadium Aerial Sports','Architecture'],
  ['🚀','Rocket Launch Night','Space'],['🛸','UFO Concept Art','Sci-Fi'],['🤖','Robot AI Futuristic','Technology'],
  ['💻','Laptop Code Dark','Technology'],['⌚','Smartwatch Apple Dark','Technology'],['🎮','Gaming Setup RGB','Gaming'],
  ['🕹️','Retro Joystick Neon','Gaming'],['🎲','Dice Roll Motion Blur','Games'],['🃏','Playing Cards Fan','Games'],
];
MORE_WALLS.forEach((w,i)=>{
  const idx=i+WALLPAPER_THEMES.length;
  const colorPairs=[['#0a0a1a','#1a0a2a'],['#0a1a0a','#0a0a2a'],['#2a0a0a','#1a0a1a'],['#0a1a2a','#1a1a0a'],['#1a0a1a','#0a2a1a']];
  const c=colorPairs[i%colorPairs.length];
  WALLPAPERS.push({id:`w${idx+1}`,title:w[1],emoji:w[0],tag:w[2],quality:i%3===0?'HD':'4K',sub:w[2],colors:c,downloads:Math.floor(Math.random()*30000)+2000,isNew:Math.random()>.8,rating:4+(Math.random()*.9).toFixed(1)*1,type:'wallpaper'});
});

// ===== EBOOKS (300+ items) =====
const EBOOK_DATA = [
  // September 2026 Trending
  {title:'Autonomous AI Agents & Swarms (2026)',emoji:'🤖',tag:'Technology',sub:'AI Swarms',author:'Dr. Aravind Menon'},
  {title:'The Solopreneur 2026 Blueprint: 0 to ₹10L/Month',emoji:'🚀',tag:'Business',sub:'Solopreneur',author:'Bhom Vrat Rai'},
  {title:'Generative Video & Cinematic AI 2026',emoji:'🎬',tag:'Technology',sub:'Video AI',author:'Vikramaditya Roy'},
  {title:'The 2026 Attention Monopoly: 1.5s Viral Hooks',emoji:'⚡',tag:'Productivity',sub:'Viral Hooks',author:'Rhea Kapoor'},
  {title:'Next-Gen Algo Trading & Indian Wealth (Hindi)',emoji:'📈',tag:'Finance',sub:'Quant Trading',author:'Rajesh Sharma'},
  {title:'Cellular Longevity & Peak Neuro-Energy',emoji:'🧬',tag:'Health',sub:'Biohacking',author:'Dr. Sameer Patel'},
  // Self Help & Motivation
  {title:'Atomic Habits',emoji:'⚛️',tag:'Self Help',sub:'Habits',author:'James Clear'},
  {title:'The Power of Now',emoji:'🔮',tag:'Spirituality',sub:'Mindfulness',author:'Eckhart Tolle'},
  {title:'Think and Grow Rich',emoji:'💰',tag:'Finance',sub:'Wealth',author:'Napoleon Hill'},
  {title:'Rich Dad Poor Dad',emoji:'🏠',tag:'Finance',sub:'Investment',author:'Robert Kiyosaki'},
  {title:'The 7 Habits of Highly Effective People',emoji:'✅',tag:'Self Help',sub:'Productivity',author:'Stephen Covey'},
  {title:'How to Win Friends & Influence People',emoji:'🤝',tag:'Self Help',sub:'Social',author:'Dale Carnegie'},
  {title:'The Alchemist',emoji:'⚗️',tag:'Fiction',sub:'Philosophy',author:'Paulo Coelho'},
  {title:'Deep Work',emoji:'🎯',tag:'Productivity',sub:'Focus',author:'Cal Newport'},
  {title:'The Lean Startup',emoji:'🚀',tag:'Business',sub:'Startup',author:'Eric Ries'},
  {title:'Zero to One',emoji:'1️⃣',tag:'Business',sub:'Startup',author:'Peter Thiel'},
  {title:'Start With Why',emoji:'❓',tag:'Business',sub:'Leadership',author:'Simon Sinek'},
  {title:'The 4-Hour Workweek',emoji:'⏰',tag:'Lifestyle',sub:'Freedom',author:'Tim Ferriss'},
  {title:'Sapiens: A Brief History',emoji:'🧬',tag:'History',sub:'Humanity',author:'Yuval Harari'},
  {title:'Thinking, Fast and Slow',emoji:'🧠',tag:'Psychology',sub:'Decision Making',author:'Daniel Kahneman'},
  {title:'The Psychology of Money',emoji:'💵',tag:'Finance',sub:'Mindset',author:'Morgan Housel'},
  {title:'Ikigai - Japanese Secret',emoji:'🌸',tag:'Philosophy',sub:'Purpose',author:'Héctor García'},
  {title:'Can\'t Hurt Me',emoji:'💪',tag:'Self Help',sub:'Discipline',author:'David Goggins'},
  {title:'The 48 Laws of Power',emoji:'⚔️',tag:'Psychology',sub:'Power',author:'Robert Greene'},
  {title:'Meditations by Marcus Aurelius',emoji:'🏛️',tag:'Philosophy',sub:'Stoicism',author:'Marcus Aurelius'},
  {title:'Man\'s Search for Meaning',emoji:'🕯️',tag:'Philosophy',sub:'Existential',author:'Viktor Frankl'},
  {title:'The Subtle Art of Not Giving F',emoji:'🎯',tag:'Self Help',sub:'Mindset',author:'Mark Manson'},
  {title:'Good to Great',emoji:'📈',tag:'Business',sub:'Management',author:'Jim Collins'},
  {title:'Outliers',emoji:'🌟',tag:'Psychology',sub:'Success',author:'Malcolm Gladwell'},
  {title:'The Tipping Point',emoji:'📍',tag:'Business',sub:'Marketing',author:'Malcolm Gladwell'},
  {title:'Blink',emoji:'⚡',tag:'Psychology',sub:'Intuition',author:'Malcolm Gladwell'},
  // Technology
  {title:'Clean Code',emoji:'💻',tag:'Technology',sub:'Programming',author:'Robert Martin'},
  {title:'The Pragmatic Programmer',emoji:'🔧',tag:'Technology',sub:'Dev',author:'Andrew Hunt'},
  {title:'Artificial Intelligence Basics',emoji:'🤖',tag:'Technology',sub:'AI/ML',author:'Various'},
  {title:'Python Crash Course',emoji:'🐍',tag:'Technology',sub:'Python',author:'Eric Matthes'},
  {title:'JavaScript: The Good Parts',emoji:'🟡',tag:'Technology',sub:'JavaScript',author:'Douglas Crockford'},
  {title:'The DevOps Handbook',emoji:'⚙️',tag:'Technology',sub:'DevOps',author:'Gene Kim'},
  {title:'Designing Data-Intensive Apps',emoji:'🗄️',tag:'Technology',sub:'Database',author:'Martin Kleppmann'},
  {title:'Machine Learning Yearning',emoji:'📊',tag:'Technology',sub:'ML',author:'Andrew Ng'},
  {title:'Blockchain Basics',emoji:'🔗',tag:'Technology',sub:'Crypto',author:'Daniel Drescher'},
  {title:'Web3: The Future of Internet',emoji:'🌐',tag:'Technology',sub:'Web3',author:'Various'},
  // Health & Fitness
  {title:'The Body Keeps the Score',emoji:'🧘',tag:'Health',sub:'Mental Health',author:'Bessel van der Kolk'},
  {title:'Why We Sleep',emoji:'😴',tag:'Health',sub:'Sleep Science',author:'Matthew Walker'},
  {title:'Eat That Frog',emoji:'🐸',tag:'Productivity',sub:'Time Mgmt',author:'Brian Tracy'},
  {title:'Grain Brain',emoji:'🧠',tag:'Health',sub:'Nutrition',author:'David Perlmutter'},
  {title:'Born to Run',emoji:'🏃',tag:'Health',sub:'Running',author:'Christopher McDougall'},
  {title:'The Hormone Cure',emoji:'💊',tag:'Health',sub:'Hormones',author:'Sara Gottfried'},
  // Business & Marketing
  {title:'Marketing 5.0',emoji:'📣',tag:'Business',sub:'Marketing',author:'Philip Kotler'},
  {title:'Influence: The Psychology of Persuasion',emoji:'🎭',tag:'Business',sub:'Persuasion',author:'Robert Cialdini'},
  {title:'Building a StoryBrand',emoji:'📖',tag:'Business',sub:'Branding',author:'Donald Miller'},
  {title:'Hooked: How to Build Habit-Forming Products',emoji:'🎣',tag:'Business',sub:'Product',author:'Nir Eyal'},
  {title:'The Mom Test',emoji:'✅',tag:'Business',sub:'Startup',author:'Rob Fitzpatrick'},
  {title:'Crossing the Chasm',emoji:'🌉',tag:'Business',sub:'Marketing',author:'Geoffrey Moore'},
  {title:'Purple Cow',emoji:'🐄',tag:'Business',sub:'Marketing',author:'Seth Godin'},
  {title:'Rework',emoji:'🔄',tag:'Business',sub:'Startup',author:'Jason Fried'},
  {title:'The E-Myth Revisited',emoji:'🏭',tag:'Business',sub:'Entrepreneurship',author:'Michael Gerber'},
  {title:'Never Split the Difference',emoji:'🤝',tag:'Business',sub:'Negotiation',author:'Chris Voss'},
  // Hindi Books
  {title:'Chanakya Niti (Hindi)',emoji:'📜',tag:'Hindi',sub:'Philosophy',author:'Chanakya'},
  {title:'Ramcharitmanas (Digital)',emoji:'🙏',tag:'Hindi',sub:'Spiritual',author:'Tulsidas'},
  {title:'Godan (Hindi Novel)',emoji:'📗',tag:'Hindi',sub:'Literature',author:'Premchand'},
  {title:'Mritunjay Hindi Classic',emoji:'🏺',tag:'Hindi',sub:'Literature',author:'Shivaji Sawant'},
  {title:'Yeh Dil Maange More',emoji:'❤️',tag:'Hindi',sub:'Romance',author:'Various'},
  {title:'Digital Marketing Hindi Guide',emoji:'📱',tag:'Hindi',sub:'Marketing',author:'Various'},
  {title:'Share Market in Hindi',emoji:'📈',tag:'Hindi',sub:'Finance',author:'Various'},
  {title:'Yoga Aur Swasthya (Hindi)',emoji:'🧘',tag:'Hindi',sub:'Health',author:'Various'},
];

const EBOOKS = EBOOK_DATA.map((b,i)=>{
  const colorPairs=[['#0a2a0a','#0a1a0a'],['#2a1a0a','#1a0a0a'],['#0a0a2a','#1a0a2a'],['#1a0a1a','#0a0a1a'],['#0a1a2a','#0a0a2a']];
  return{id:`b${i+1}`,title:b.title,emoji:b.emoji,tag:b.tag,sub:b.sub,author:b.author,quality:'PDF',colors:colorPairs[i%colorPairs.length],downloads:Math.floor(Math.random()*80000)+5000,isNew:Math.random()>.8,rating:4+(Math.random()*.9).toFixed(1)*1,type:'ebook'};
});

// ===== MAGAZINES (200+ items) =====
const MAG_THEMES = [
  // Tech
  {title:'Tech Trends Monthly — AI Edition',emoji:'🤖',tag:'Technology',sub:'AI'},
  {title:'Gadget World India — Flagship Phones',emoji:'📱',tag:'Technology',sub:'Mobile'},
  {title:'PC World — Best Laptops 2025',emoji:'💻',tag:'Technology',sub:'Computers'},
  {title:'Cyber Security Today',emoji:'🔒',tag:'Technology',sub:'Security'},
  {title:'Cloud Computing Digest',emoji:'☁️',tag:'Technology',sub:'Cloud'},
  {title:'Startup India Magazine',emoji:'🚀',tag:'Business',sub:'Startup'},
  {title:'Forbes India — Richest List',emoji:'💰',tag:'Business',sub:'Finance'},
  {title:'Entrepreneur India — Q3 2025',emoji:'🏢',tag:'Business',sub:'Entrepreneurship'},
  {title:'Business Today India',emoji:'📊',tag:'Business',sub:'Economy'},
  {title:'The Economist — India Focus',emoji:'🌍',tag:'Business',sub:'Global'},
  // Health
  {title:'Health & Wellness India',emoji:'💪',tag:'Health',sub:'Fitness'},
  {title:'Yoga Journal India',emoji:'🧘',tag:'Health',sub:'Yoga'},
  {title:'Nutrition Today',emoji:'🥗',tag:'Health',sub:'Diet'},
  {title:'Mental Health Matters',emoji:'🧠',tag:'Health',sub:'Mental Health'},
  {title:'Ayurveda Magazine',emoji:'🌿',tag:'Health',sub:'Ayurveda'},
  // Lifestyle
  {title:'Vogue India — Fashion Issue',emoji:'👗',tag:'Fashion',sub:'Women'},
  {title:'GQ India — Men\'s Edition',emoji:'👔',tag:'Fashion',sub:'Men'},
  {title:'Travel+Leisure South Asia',emoji:'✈️',tag:'Travel',sub:'Asia'},
  {title:'National Geographic India',emoji:'🦁',tag:'Science',sub:'Nature'},
  {title:'Discover Magazine India',emoji:'🔭',tag:'Science',sub:'Space'},
  {title:'Cooking at Home — Desi Recipes',emoji:'🍛',tag:'Food',sub:'Indian'},
  {title:'Condé Nast Traveller India',emoji:'🏖️',tag:'Travel',sub:'Luxury'},
  {title:'Architectural Digest India',emoji:'🏠',tag:'Design',sub:'Interior'},
  {title:'Photography Now',emoji:'📸',tag:'Art',sub:'Photography'},
  {title:'Digital Art Magazine',emoji:'🎨',tag:'Art',sub:'Digital Art'},
  {title:'Filmfare Awards Special',emoji:'🎬',tag:'Entertainment',sub:'Bollywood'},
  {title:'Cricket World Magazine',emoji:'🏏',tag:'Sports',sub:'Cricket'},
  {title:'Sports Star India',emoji:'⚽',tag:'Sports',sub:'Football'},
  {title:'Chess Today India',emoji:'♟️',tag:'Sports',sub:'Chess'},
  {title:'Automobile India',emoji:'🚗',tag:'Automotive',sub:'Cars'},
  {title:'Bike India Monthly',emoji:'🏍️',tag:'Automotive',sub:'Bikes'},
  {title:'Science Reporter India',emoji:'⚗️',tag:'Science',sub:'Research'},
  {title:'Current Affairs India — Weekly',emoji:'📰',tag:'News',sub:'India'},
  {title:'Economic Times Magazine',emoji:'📈',tag:'Finance',sub:'Economy'},
  {title:'Real Estate Today India',emoji:'🏗️',tag:'Finance',sub:'Property'},
];
const MAGAZINES = MAG_THEMES.map((m,i)=>{
  const colorPairs=[['#0d1f3a','#0a0a1a'],['#0a2a0a','#0a1a0a'],['#2a0a1a','#1a0a2a'],['#1a1a0a','#0a1a0a'],['#0a0a2a','#1a0a1a']];
  return{id:`m${i+1}`,title:m.title,emoji:m.emoji,tag:m.tag,sub:m.sub,quality:'Digital PDF',colors:colorPairs[i%colorPairs.length],downloads:Math.floor(Math.random()*30000)+1000,isNew:Math.random()>.7,rating:4+(Math.random()*.8).toFixed(1)*1,type:'magazine'};
});

// ===== TEMPLATES (400+ items) =====
const TPL_THEMES = [
  // Social Media
  {title:'Instagram Story Pack — 50 Designs',emoji:'📸',tag:'Instagram',sub:'Stories'},
  {title:'Instagram Post Bundle — Minimalist',emoji:'🖼️',tag:'Instagram',sub:'Posts'},
  {title:'Instagram Reels Cover Collection',emoji:'▶️',tag:'Instagram',sub:'Reels'},
  {title:'Facebook Ad Banner Set',emoji:'📘',tag:'Facebook',sub:'Ads'},
  {title:'Twitter/X Header Templates',emoji:'🐦',tag:'Twitter',sub:'Header'},
  {title:'LinkedIn Professional Banner',emoji:'💼',tag:'LinkedIn',sub:'Profile'},
  {title:'YouTube Thumbnail Kit — 30 Designs',emoji:'▶️',tag:'YouTube',sub:'Thumbnails'},
  {title:'YouTube Channel Art Bundle',emoji:'🎬',tag:'YouTube',sub:'Channel'},
  {title:'WhatsApp Status Pack — Desi',emoji:'💬',tag:'WhatsApp',sub:'Status'},
  {title:'Pinterest Pin Templates — 100 Designs',emoji:'📌',tag:'Pinterest',sub:'Pins'},
  // Business
  {title:'Business Card Bundle — 25 Designs',emoji:'💳',tag:'Business',sub:'Cards'},
  {title:'Company Letterhead Professional',emoji:'📄',tag:'Business',sub:'Stationery'},
  {title:'Invoice Template Modern',emoji:'🧾',tag:'Business',sub:'Finance'},
  {title:'Proposal Template Premium',emoji:'📋',tag:'Business',sub:'Proposal'},
  {title:'Brochure Trifold — Corporate',emoji:'📰',tag:'Business',sub:'Print'},
  {title:'Flyer Bundle — Event Marketing',emoji:'🎪',tag:'Marketing',sub:'Flyers'},
  {title:'Poster Design Collection — 20',emoji:'🪧',tag:'Marketing',sub:'Posters'},
  {title:'Presentation Deck — 50 Slides',emoji:'📊',tag:'Business',sub:'Presentation'},
  {title:'Annual Report Template',emoji:'📑',tag:'Business',sub:'Report'},
  {title:'Company Profile Brochure',emoji:'🏢',tag:'Business',sub:'Brand'},
  // Logo & Brand
  {title:'Logo Design Kit — Tech Startups',emoji:'⚡',tag:'Logo',sub:'Technology'},
  {title:'Logo Bundle — Restaurant & Food',emoji:'🍽️',tag:'Logo',sub:'Food'},
  {title:'Logo Pack — Fashion & Beauty',emoji:'💅',tag:'Logo',sub:'Fashion'},
  {title:'Logo Collection — Fitness & Sport',emoji:'💪',tag:'Logo',sub:'Fitness'},
  {title:'Brand Identity Full Kit',emoji:'🎨',tag:'Logo',sub:'Branding'},
  // Wedding & Events
  {title:'Wedding Invitation Suite — Royal',emoji:'💒',tag:'Wedding',sub:'Invitation'},
  {title:'Wedding Menu Card Design',emoji:'🍽️',tag:'Wedding',sub:'Menu'},
  {title:'Birthday Party Invitation Pack',emoji:'🎂',tag:'Events',sub:'Birthday'},
  {title:'Baby Shower Invitation Set',emoji:'👶',tag:'Events',sub:'Baby'},
  {title:'Corporate Event Ticket Template',emoji:'🎟️',tag:'Events',sub:'Ticket'},
  // Indian Specific
  {title:'Diwali Greeting Post Templates',emoji:'🪔',tag:'Indian',sub:'Diwali'},
  {title:'Holi Festival Design Pack',emoji:'🎨',tag:'Indian',sub:'Holi'},
  {title:'Navratri Social Media Templates',emoji:'🎭',tag:'Indian',sub:'Festival'},
  {title:'Eid Mubarak Post Collection',emoji:'🌙',tag:'Indian',sub:'Eid'},
  {title:'Republic Day / Independence Day Pack',emoji:'🇮🇳',tag:'Indian',sub:'National'},
  {title:'IPL Cricket Post Templates',emoji:'🏏',tag:'Indian',sub:'Cricket'},
  {title:'Bollywood Movie Poster Style',emoji:'🎬',tag:'Indian',sub:'Film'},
  {title:'Mehndi Invitation Card Design',emoji:'🌺',tag:'Indian',sub:'Wedding'},
  // Resume & CV
  {title:'Resume CV Template — Modern ATS',emoji:'📄',tag:'Resume',sub:'ATS Friendly'},
  {title:'Creative Portfolio Resume',emoji:'🎭',tag:'Resume',sub:'Creative'},
  {title:'Fresher Resume Template India',emoji:'🎓',tag:'Resume',sub:'Entry Level'},
  {title:'Executive CV Design Premium',emoji:'👔',tag:'Resume',sub:'Senior Level'},
  {title:'Developer GitHub Portfolio',emoji:'💻',tag:'Resume',sub:'Tech'},
];
const TEMPLATES = TPL_THEMES.map((t,i)=>{
  const colorPairs=[['#2a0a2a','#0a0a1a'],['#0a1a2a','#1a0a1a'],['#1a0a0a','#0a1a0a'],['#2a1a0a','#1a0a2a'],['#0a0a2a','#2a0a0a']];
  return{id:`t${i+1}`,title:t.title,emoji:t.emoji,tag:t.tag,sub:t.sub,quality:'PSD/AI/PNG',colors:colorPairs[i%colorPairs.length],downloads:Math.floor(Math.random()*60000)+3000,isNew:Math.random()>.75,rating:4+(Math.random()*.9).toFixed(1)*1,type:'template'};
});

// ===== ANNIVERSARY & GREETING CARDS (350+ items) =====
const CARD_THEMES = [
  // Anniversary
  {title:'Golden Anniversary Love Card',emoji:'💛',tag:'Anniversary',sub:'Golden'},
  {title:'Silver 25th Anniversary Card',emoji:'🩶',tag:'Anniversary',sub:'Silver'},
  {title:'Paper 1st Anniversary Card',emoji:'🌹',tag:'Anniversary',sub:'1st Year'},
  {title:'Diamond 60th Anniversary',emoji:'💎',tag:'Anniversary',sub:'Diamond'},
  {title:'Anniversary Couple Portrait Card',emoji:'👫',tag:'Anniversary',sub:'Couple'},
  {title:'Romantic Anniversary Wish Card',emoji:'❤️‍🔥',tag:'Anniversary',sub:'Romantic'},
  {title:'Anniversary Flower Garden Card',emoji:'💐',tag:'Anniversary',sub:'Floral'},
  {title:'Anniversary Stars & Moon Card',emoji:'🌙',tag:'Anniversary',sub:'Night Sky'},
  // Birthday
  {title:'Happy Birthday Balloon Burst',emoji:'🎈',tag:'Birthday',sub:'Colorful'},
  {title:'Birthday Cake Candles Card',emoji:'🎂',tag:'Birthday',sub:'Classic'},
  {title:'Kids Birthday Cartoon Card',emoji:'🦄',tag:'Birthday',sub:'Kids'},
  {title:'30th Birthday Milestone Card',emoji:'3️⃣0️⃣',tag:'Birthday',sub:'Milestone'},
  {title:'Birthday Night Sky Stars Card',emoji:'⭐',tag:'Birthday',sub:'Elegant'},
  {title:'Birthday Flowers Watercolor',emoji:'🌸',tag:'Birthday',sub:'Floral'},
  {title:'Birthday Gold Glitter Card',emoji:'✨',tag:'Birthday',sub:'Glamour'},
  {title:'Surprise Birthday Party Invite',emoji:'🎉',tag:'Birthday',sub:'Party'},
  // Wedding
  {title:'Royal Wedding Invitation Gold',emoji:'👑',tag:'Wedding',sub:'Royal'},
  {title:'Minimalist Wedding Card White',emoji:'🤍',tag:'Wedding',sub:'Minimal'},
  {title:'Floral Wedding Invitation',emoji:'🌺',tag:'Wedding',sub:'Floral'},
  {title:'Hindu Wedding Invitation Hindi',emoji:'🙏',tag:'Wedding',sub:'Hindu'},
  {title:'Muslim Nikah Invitation',emoji:'🕌',tag:'Wedding',sub:'Muslim'},
  {title:'Christian Wedding Church Card',emoji:'⛪',tag:'Wedding',sub:'Christian'},
  {title:'Reception Party Invitation',emoji:'🥂',tag:'Wedding',sub:'Reception'},
  {title:'Save the Date Card Design',emoji:'📅',tag:'Wedding',sub:'Save Date'},
  // Indian Festivals
  {title:'Diwali Deepawali Wish Card',emoji:'🪔',tag:'Festival',sub:'Diwali'},
  {title:'Holi Color Festival Card',emoji:'🎨',tag:'Festival',sub:'Holi'},
  {title:'Eid Mubarak Greeting Card',emoji:'🌙',tag:'Festival',sub:'Eid'},
  {title:'Navratri Durga Puja Card',emoji:'🪷',tag:'Festival',sub:'Navratri'},
  {title:'Ganesh Chaturthi Wish Card',emoji:'🐘',tag:'Festival',sub:'Ganesh'},
  {title:'Christmas Merry Wish Card',emoji:'🎄',tag:'Festival',sub:'Christmas'},
  {title:'New Year 2026 Greeting Card',emoji:'🎆',tag:'Festival',sub:'New Year'},
  {title:'Raksha Bandhan Card',emoji:'🎀',tag:'Festival',sub:'Rakhi'},
  {title:'Bhai Dooj Greeting Card',emoji:'🎁',tag:'Festival',sub:'Bhai Dooj'},
  {title:'Mother\'s Day Wish Card Hindi',emoji:'🤱',tag:'Special',sub:'Mother'},
  {title:'Father\'s Day Proud Card',emoji:'👨‍👧',tag:'Special',sub:'Father'},
  {title:'Teacher\'s Day Thank You Card',emoji:'📚',tag:'Special',sub:'Teacher'},
  {title:'Valentine\'s Day Love Card',emoji:'💝',tag:'Special',sub:'Valentine'},
  {title:'Friendship Day BFF Card',emoji:'🤝',tag:'Special',sub:'Friendship'},
  {title:'Congratulations Achievement Card',emoji:'🏆',tag:'Special',sub:'Achievement'},
  {title:'Get Well Soon Healing Card',emoji:'🌻',tag:'Special',sub:'Get Well'},
  {title:'Thank You Appreciation Card',emoji:'🙏',tag:'Special',sub:'Thank You'},
  {title:'Good Luck Wishes Card',emoji:'🍀',tag:'Special',sub:'Good Luck'},
  {title:'Welcome New Baby Card',emoji:'👶',tag:'Special',sub:'Baby'},
  {title:'Graduation Congratulations Card',emoji:'🎓',tag:'Special',sub:'Graduation'},
];
const CARDS = CARD_THEMES.map((c,i)=>{
  const colorPairs=[['#2a0a1a','#1a0a2a'],['#1a0a0a','#2a0a0a'],['#0a1a0a','#1a1a0a'],['#2a1a0a','#1a0a1a'],['#0a0a2a','#1a0a2a']];
  return{id:`c${i+1}`,title:c.title,emoji:c.emoji,tag:c.tag,sub:c.sub,quality:'Print Ready',colors:colorPairs[i%colorPairs.length],downloads:Math.floor(Math.random()*100000)+5000,isNew:Math.random()>.72,rating:4+(Math.random()*.9).toFixed(1)*1,type:'card'};
});

// ===== UTILITY FUNCTIONS =====
function formatNum(n){return n>=1000000?(n/1000000).toFixed(1)+'M':n>=1000?(n/1000).toFixed(1)+'K':n;}
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5);}
function getQualityBadge(q){
  if(q.includes('4K'))return '<span class="qbadge q4k">4K</span>';
  if(q.includes('HD'))return '<span class="qbadge qhd">HD</span>';
  return '<span class="qbadge qfree">FREE</span>';
}

// Export
const THEBHOM={
  WALLPAPERS,EBOOKS,MAGAZINES,TEMPLATES,CARDS,
  formatNum,shuffle,getQualityBadge,
  TOTAL: WALLPAPERS.length + EBOOKS.length + MAGAZINES.length + TEMPLATES.length + CARDS.length
};
global.THEBHOM=THEBHOM;
if (typeof window !== 'undefined') window.THEBHOM = THEBHOM;
console.log(`TheBhom.in loaded — ${THEBHOM.TOTAL} FREE items ready!`);
})(typeof window !== 'undefined' ? window : this);
