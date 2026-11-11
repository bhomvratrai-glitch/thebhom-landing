# -*- coding: utf-8 -*-
"""100% unique, topic-specific editorial content for Flagship Guides (Part 2: 12 guides)."""

GUIDES_PART_2 = [
    {
        "fname": "bluetooth-audio-codecs-guide-sbc-aac-aptx-ldac-lhdc.html",
        "cat": "audio",
        "badge": "Audio Codecs",
        "emoji": "🎵",
        "gradient": "linear-gradient(135deg, #8b5cf6, #5b21b6)",
        "read_time": "9 min read",
        "title": "Bluetooth Audio Codecs Explained: SBC vs AAC vs aptX vs LDAC vs LHDC",
        "desc": "Does LDAC actually sound better on Spotify and Apple Music? Compare bitrates, Android vs iPhone AAC encoders, and wireless latency across Bluetooth codecs.",
        "table_headers": ["Codec", "Bitrate Range", "OS Support", "Real-World Verdict"],
        "table_rows": [
            ["SBC", "192 – 328 kbps", "Every Bluetooth device", "Universal fallback; slight high-treble compression"],
            ["AAC", "256 kbps", "Best on iOS; mixed on Android", "Transparent on iPhones; varies by Android SoC"],
            ["aptX / aptX Adaptive", "352 – 420 kbps", "Qualcomm Snapdragon phones", "Low latency (~80ms) & stable crowded-metro link"],
            ["LDAC", "330 / 660 / 990 kbps", "All Android 8+ phones", "Highest lossless-tier detail; 990kbps drops in crowds"],
            ["LHDC 5.0", "400 – 1,000 kbps", "OnePlus, Xiaomi, Nothing, Realme", "Great hi-res bitrate with lower gaming lag than LDAC"],
        ],
        "sections": [
            (
                "Why Your Streaming App Matters More Than the Codec",
                "<p>Spotify streams at max 320kbps Ogg Vorbis and YouTube Music caps at 256kbps AAC. Feeding a 256kbps stream through a 990kbps LDAC pipe does <strong>not</strong> magically create extra musical detail—though it avoids double-compression artifacts on Android phones whose built-in AAC encoder underperforms iPhone's CoreAudio AAC.</p>"
            ),
            (
                "When LDAC / LHDC Actually Makes an Audible Difference",
                "<ul>"
                "<li>You listen to <strong>Apple Music Lossless / FLAC / Tidal</strong> with wired-grade IEMs or ₹5,000+ planar/multi-driver earbuds.</li>"
                "<li><strong>Battery & Range Trade-off:</strong> Locking LDAC to 990kbps in Developer Options drains earbud battery ~20% faster and causes micro-stutters near railway stations or microwave ovens. Set LDAC to <em>Best Effort (Adaptive)</em> or 660kbps for rock-solid walking playback.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("Do iPhones support LDAC or aptX?", "No. Apple strictly uses AAC (up to 256kbps) over Bluetooth on all iPhones and AirPods, though Apple's AAC encoder is noticeably cleaner than older Android AAC implementations."),
            ("Which codec is best for BGMI/CODM wireless gaming?", "Codecs alone aren't enough—you need your earbuds' dedicated 'Game Mode / Low Latency Mode' (40–60ms) or aptX Adaptive, because standard LDAC introduces 180–250ms audio lag."),
            ("How do I check which codec my Android phone is currently using?", "Enable Developer Options (tap Build Number 7 times) and check 'Bluetooth Audio Codec' while audio is actively playing."),
            ("Is Hi-Res Audio Wireless certification worth paying extra for?", "Only if the earbuds also have properly tuned acoustic drivers—a well-tuned AAC earbud beats a harsh, muddy driver running LDAC 990kbps every time."),
        ],
    },
    {
        "fname": "best-soundbars-with-dolby-atmos-under-10000-india.html",
        "cat": "audio",
        "badge": "Home Audio",
        "emoji": "🔊",
        "gradient": "linear-gradient(135deg, #0ea5e9, #1e40af)",
        "read_time": "9 min read",
        "title": "Best Soundbars Under ₹10,000 in India: HDMI eARC, Subwoofers & Dolby Atmos Reality",
        "desc": "What you actually get under ₹10,000 for TV soundbars in India—why HDMI ARC beats Bluetooth/AUX, real 2.1 vs fake '5.1', and clear movie dialogue tips.",
        "table_headers": ["Channel Layout", "Hardware Inside", "Under ₹10,000 Reality"],
        "table_rows": [
            ["2.0 Compact Bar", "Left + Right drivers (no subwoofer)", "Clearer TV dialogue than stock speakers, thin movie explosions"],
            ["2.1 with Wired/Wireless Sub", "L/R bar + dedicated 5.25\"–6.5\" bass box", "Best value under ₹10k for Netflix, cricket & music"],
            ["Virtual Dolby Atmos (2.1 / 3.1)", "DSP height virtualization (no physical ceiling drivers)", "Wider soundstage via HDMI eARC; not true overhead Atmos"],
        ],
        "sections": [
            (
                "HDMI ARC / eARC vs Optical vs Bluetooth: Use the Right Cable",
                "<p>Never connect a TV soundbar over Bluetooth if your TV sits 2 feet away—Bluetooth compresses audio and causes lip-sync drift. Plug an <strong>HDMI High-Speed cable into your TV's HDMI ARC/eARC port</strong>. One TV remote will automatically power on the soundbar and control its volume (CEC) while passing uncompressed PCM/Dolby Digital+.</p>"
            ),
            (
                "3 Things That Matter Most Under ₹10,000",
                "<ul>"
                "<li><strong>Dedicated Center Channel (3.1) or Clear Voice EQ:</strong> Prevents background explosions from drowning out whispered movie dialogues on Prime Video and Hotstar.</li>"
                "<li><strong>Subwoofer Driver Size:</strong> Look for at least a 5.25-inch or 6.5-inch subwoofer (60W+ RMS) rather than inflated '500W PMPO' peak numbers.</li>"
                "<li><strong>Wall-Mount & IR Pass-Through Height:</strong> Check soundbar height (< 65mm) so it doesn't block your Smart TV's bottom IR remote sensor on a TV cabinet.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("Do ₹8,000 'Dolby Atmos' soundbars have real overhead speakers?", "Almost never—at ₹8k–₹10k, Atmos decoding uses DSP psychoacoustic widening on front-firing drivers. True physical up-firing Atmos bars typically start around ₹18,000–₹25,000+."),
            ("What does RMS wattage mean vs PMPO?", "Always compare RMS (Root Mean Square) continuous wattage (e.g., 120W–160W RMS), never peak marketing PMPO numbers."),
            ("Wired subwoofer vs wireless subwoofer under ₹10k?", "A wireless subwoofer lets you place the bass box next to your sofa without running cables across the living room, though wired subwoofers never suffer wireless pairing interference."),
            ("Why is dialogue volume so low on 5.1 movies when using a 2.1 soundbar?", "Set your TV audio output to 'PCM' or turn on the soundbar's 'News / Voice / Night' EQ mode so the center dialogue track isn't buried."),
        ],
    },
    {
        "fname": "gan-chargers-explained-gallium-nitride-vs-silicon-chargers.html",
        "cat": "smart-home",
        "badge": "GaN Power",
        "emoji": "⚡",
        "gradient": "linear-gradient(135deg, #0d9488, #0f766e)",
        "read_time": "8 min read",
        "title": "GaN Chargers Explained: Gallium Nitride vs Silicon, USB-PD PPS & Multi-Port Wattage",
        "desc": "How GaN (Gallium Nitride) packs 65W–100W laptop + phone fast charging into pocket-sized bricks, what PPS means for Samsung/Pixel, and BIS safety checks.",
        "table_headers": ["Charger Type", "Size & Heat Efficiency", "Protocol Support", "Best Use Case"],
        "table_rows": [
            ["Traditional Silicon 65W", "Bulky brick, warmer shell", "Often single-port PD or proprietary", "Home desk where size doesn't matter"],
            ["GaN 65W (2C + 1A)", "40–50% smaller, cooler switching", "USB-PD 3.0 + PPS + QC4+", "One travel brick for MacBook/laptop + phone + earbuds"],
            ["GaN 100W–140W (PD 3.1)", "Compact travel block", "EPR 28V/5A + multi-port smart split", "Powering 14–16\" MacBook Pro + tablet simultaneously"],
        ],
        "sections": [
            (
                "Why Gallium Nitride Runs Cooler in Smaller Housings",
                "<p>Traditional silicon transistors lose energy as heat when switching high AC wall voltage down to 5V–20V DC. <strong>Gallium Nitride (GaN)</strong> has a wider semiconductor bandgap, switching at higher frequencies with lower resistance—cutting wasted heat and shrinking internal transformers by nearly half.</p>"
            ),
            (
                "Understanding Multi-Port Power Splitting & PPS",
                "<ul>"
                "<li><strong>65W ≠ 65W on Every Port Simultaneously:</strong> Plugging a phone into Port C2 while your laptop charges on Port C1 usually splits output to <strong>45W + 20W</strong> (and briefly disconnects for 1 second during PD renegotiation).</li>"
                "<li><strong>USB-PD PPS (Programmable Power Supply):</strong> Essential for Samsung Galaxy 25W/45W Super Fast Charging, Google Pixel, and Nothing phones—PPS dynamically adjusts voltage in 20mV steps so the phone stays cool.</li>"
                "<li><strong>BIS CRS R-Number:</strong> Never buy uncertified ₹699 '100W GaN' bricks without an official Indian BIS registration mark and grounded/surge-protected prongs.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("Can a 65W GaN charger safely charge a 15W pair of earbuds or smartwatch?", "Yes! USB-C Power Delivery negotiates voltage from 5V upward—the charger never forces 65W into small accessories."),
            ("Will a 65W GaN charger trigger Xiaomi 67W/120W HyperCharge or OnePlus SuperVOOC?", "Usually no—OnePlus/Realme/Vivo SuperVOOC and Xiaomi HyperCharge use proprietary high-amperage protocols, so generic PD GaN chargers will charge them safely at 18W–27W instead."),
            ("Why does my 65W GaN charger still feel warm to the touch?", "Warmth (45–55°C outer shell) during full 65W laptop loads is normal thermal dissipation because the surface area is compact—not a defect unless it smells or trips."),
            ("Do I need a special cable for 100W USB-PD?", "Yes. Standard 60W (3A) USB-C cables cap charging at 60W; you need an E-Marker chip 100W (5A) or 240W cable to unlock 65W–140W speeds."),
        ],
    },
    {
        "fname": "fast-charging-battery-health-degradation-myth-vs-reality.html",
        "cat": "smart-home",
        "badge": "Battery Science",
        "emoji": "🔋",
        "gradient": "linear-gradient(135deg, #65a30d, #3f6212)",
        "read_time": "9 min read",
        "title": "Fast Charging vs Battery Health: Myths, Dual-Cell Split Tech & Heat Science",
        "desc": "Does 80W–120W fast charging ruin smartphone batteries? Learn what really degrades lithium-ion cells—heat, 100% trickle, and deep 0% drains—plus smart habits.",
        "table_headers": ["Charging Factor", "Impact on 800-Cycle Capacity", "What Actually Happens Inside the Cell"],
        "table_rows": [
            ["Heat (> 40°C while charging)", "High degradation", "Accelerates SEI layer growth & electrolyte breakdown"],
            ["Dual-Cell Split Charging (80W–120W)", "Low–Moderate (if cool)", "Splits 100W into two 50W cells, cutting internal resistance heat"],
            ["Gaming while fast-charging", "Severe degradation", "Combined CPU + charging heat keeps battery at 44–47°C"],
            ["20%–80% / 85% Charge Limit", "Extends lifespan ~1.6x", "Avoids high-voltage crystal stress above 4.35V"],
        ],
        "sections": [
            (
                "Why Speed Isn't the Enemy—Temperature Is",
                "<p>Modern 67W–120W phones do <strong>not</strong> push raw 100W straight into a single battery cell for 30 minutes. They use <strong>dual-cell series architectures</strong> (each cell receiving half the voltage/current) and taper wattage sharply above 60–70% state-of-charge. Most modern batteries remain rated for <strong>80% capacity after 800–1,600 cycles</strong>.</p>"
            ),
            (
                "3 Habits That Actually Destroy Indian Phone Batteries",
                "<ol>"
                "<li><strong>Charging on a Car Dashboard or Under a Pillow in May/June:</strong> Ambient 40°C Indian summers leave zero thermal headroom. Remove thick rubberized cases during rapid 80W+ top-ups if the phone feels hot.</li>"
                "<li><strong>Playing BGMI While Plugged In Without Bypass Charging:</strong> Running a 6W GPU load simultaneously with 30W charging cooks the lithium pouch continuously.</li>"
                "<li><strong>Leaving Phone at 0% Dead for Days:</strong> Deep discharge below 2.5V triggers permanent copper dissolution inside the anode.</li>"
                "</ol>"
            ),
        ],
        "faqs": [
            ("Is overnight slow 5W/10W charging better than 65W fast charging?", "Using your phone's built-in 'Adaptive / Optimized Night Charging' (which pauses at 80% until 1 hour before your alarm) keeps the battery healthy regardless of brick wattage."),
            ("Should I enable the 'Stop charging at 80%/85%' setting?", "Yes, if you work near a desk/charger all day. Only disable it before long travel days when you genuinely need the extra 20% runtime."),
            ("Does wireless charging degrade battery faster than wired fast charging?", "Cheap non-Qi2 wireless pads waste 25–35% power as heat right against the glass back, warming the battery more than wired 25W PD charging."),
            ("When is the right time to replace a smartphone battery?", "Once battery health drops below 78–80% or you experience unexpected shutdowns below 15%, an official ₹1,500–₹3,500 service-center battery swap restores like-new endurance."),
        ],
    },
    {
        "fname": "best-4k-smart-tvs-under-30000-in-india.html",
        "cat": "smart-home",
        "badge": "Smart TVs",
        "emoji": "📺",
        "gradient": "linear-gradient(135deg, #2563eb, #1e3a8a)",
        "read_time": "10 min read",
        "title": "Best 4K Smart TVs Under ₹30,000 in India: VA vs IPS Panels, QLED & Google TV Guide",
        "desc": "How to pick a great 43-inch or 50-inch 4K TV under ₹30,000 in India—panel contrast (VA vs IPS/ADS), real QLED vs marketing, Google TV RAM, and HDMI 2.1.",
        "table_headers": ["Spec Area", "What to Target Under ₹30,000", "Marketing Trap to Ignore"],
        "table_rows": [
            ["Panel Type", "VA (deep contrast for dark-room movies) or IPS/ADS (wide living room angles)", "Fake '10-bit' claims on 8-bit+FRC 60Hz panels"],
            ["Backlight & Brightness", "300–400 nits Direct-LED / QLED film", "'HDR10 / Dolby Vision' badges on dim 220-nit screens"],
            ["Smart OS Hardware", "Google TV with at least 2GB RAM + 16GB/32GB storage", "1GB/1.5GB RAM TVs that lag within 6 months"],
            ["Motion & Ports", "MEMC + 3 HDMI ports (1 eARC) + Dual-Band 5GHz Wi-Fi", "'120Hz Gaming' via half-vertical-res DLG trick"],
        ],
        "sections": [
            (
                "VA vs IPS/ADS Panels: Match the TV to Your Living Room",
                "<p>If your family watches IPL cricket or daily soaps from side sofas with room lights on, an <strong>IPS / ADS panel</strong> keeps colors accurate up to 178° off-angle. If you watch Netflix and movies in a dimly lit bedroom sitting straight in front, a <strong>VA panel</strong> delivers 3–4x deeper blacks without washed-out grey letterbox bars.</p>"
            ),
            (
                "Why Smart TV RAM Matters—or Just Add a ₹3,500 Streaming Stick Later",
                "<p>Budget ₹22k–₹30k TVs often pack slow quad-core A53/A55 chips and 2GB RAM. Keep unnecessary apps uninstalled, switch off home-screen video autoplay, or plug an Apple TV / Fire TV Stick 4K into HDMI later if the UI slows down after 3 years—<strong>buy the TV for its panel quality and warranty, not its smart OS!</strong></p>"
            ),
        ],
        "faqs": [
            ("Is a ₹26,000 'QLED' TV much better than a regular 4K LED TV?", "Quantum-dot film boosts color volume (greens and reds pop nicely in animation/sports), though without local dimming zones contrast and HDR peak brightness remain similar to standard Direct-LED TVs."),
            ("43-inch vs 50/55-inch under ₹30,000?", "If your sofa is 7–9 feet away, stretch to a 50-inch model during festive sales—screen size creates more cinematic immersion than minor picture-processing tweaks."),
            ("Why does cricket motion look blurry on cheap 4K TVs?", "Turn off excessive 'Noise Reduction' and set MEMC / Motion Smoothing to 'Low' (or Off for 24fps films to avoid the soap-opera effect)."),
            ("Is an extended warranty worth buying on budget Smart TVs in India?", "Yes—out-of-warranty 43\"–50\" display panel replacements cost 70–80% of a new TV, so a 2-year or 3-year brand extended warranty offers genuine peace of mind."),
        ],
    },
    {
        "fname": "inverter-ac-buying-guide-1-ton-vs-1-5-ton-star-ratings.html",
        "cat": "smart-home",
        "badge": "Home Appliances",
        "emoji": "❄️",
        "gradient": "linear-gradient(135deg, #0284c7, #075985)",
        "read_time": "10 min read",
        "title": "Inverter AC Buying Guide India: 1 Ton vs 1.5 Ton, 3-Star vs 5-Star & Electricity Bill Math",
        "desc": "Calculate whether a 5-Star AC actually pays back its extra price over a 3-Star AC in India, plus room-size tonnage rules, 100% copper coils, and 52°C ambient cooling.",
        "table_headers": ["Room Size (Sq Ft)", "Recommended Tonnage", "3-Star vs 5-Star Decision"],
        "table_rows": [
            ["Up to 110 sq ft (shaded bedroom)", "1.0 Ton Inverter", "3-Star saves upfront if used < 5 hrs/day"],
            ["120 – 170 sq ft (standard bedroom)", "1.5 Ton Inverter", "5-Star pays back in ~2.5 summers if used 8+ hrs/day"],
            ["Top floor / direct West sun / 180+ sq ft", "1.5 Ton Heavy Duty or 2.0 Ton", "Don't undersize—undersized 1T runs at 100% max power nonstop"],
        ],
        "sections": [
            (
                "3-Star vs 5-Star ISEER Electricity Bill Math (At ₹8/Unit)",
                "<p>A 1.5-Ton 3-Star AC (ISEER ~3.9) uses roughly <strong>950–1,050 units/year</strong> under BEE standard testing, while a 5-Star AC (ISEER ~5.1) uses <strong>750–800 units/year</strong>. At ₹8 per electricity unit, 5-Star saves about <strong>₹1,800–₹2,200 per year</strong> on 8-hour daily summer operation—meaning a ₹6,000 price gap pays back in roughly 3 years. If you run the AC only 3–4 hours at night for 4 months, a 3-Star 100% copper model is actually smarter value.</p>"
            ),
            (
                "Must-Have Features for Indian Summers",
                "<ul>"
                "<li><strong>100% Grooved Copper Condenser & Evaporator Coils with Anti-Corrosion Coating:</strong> Crucial near coastal cities or open drains (nallas) where hydrogen sulfide causes gas leaks in aluminum/uncoated coils.</li>"
                "<li><strong>52°C+ High Ambient Cooling Rating:</strong> Prevents compressor thermal tripping on 46°C May/June afternoons in North/Central India.</li>"
                "<li><strong>Stabilizer-Free Operation Range (130V–290V) + Cleanable PM2.5 Filter:</strong> Still add an external digital voltage stabilizer with 3-minute delay cutoff if your area faces heavy voltage spikes.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("Do 'Convertible 5-in-1 / 6-in-1' ACs actually save electricity?", "All true inverter ACs naturally vary compressor speed based on room temperature—the convertible button simply caps maximum power (e.g., 40%/60%/80%) when only 1 person is sleeping, preventing full-ramp spikes."),
            ("Which refrigerant is standard and safest in India?", "R-32 is the standard eco-friendly single-component refrigerant across LG, Daikin, Voltas, Blue Star, and Panasonic—easy to top up and higher cooling efficiency than older R-410A."),
            ("Should I pay extra for a voltage stabilizer if the AC says 'Stabilizer-Free'?", "In metro apartments with stable power, built-in protection handles minor dips. In areas with frequent 160V low-voltage or DG/generator switchovers, a ₹2,200–₹3,000 external stabilizer protects the expensive inverter PCB."),
            ("How much does official installation + copper pipe extra cost in India?", "Standard box includes 3 meters (10 ft) of copper piping. Budget ₹1,500–₹2,000 for installation plus ₹700–₹900 per extra meter of piping and outdoor wall brackets."),
        ],
    },
    {
        "fname": "water-purifier-buying-guide-ro-vs-uv-vs-uf-tds-levels.html",
        "cat": "smart-home",
        "badge": "Water Quality",
        "emoji": "💧",
        "gradient": "linear-gradient(135deg, #06b6d4, #0369a1)",
        "read_time": "9 min read",
        "title": "Water Purifier Buying Guide India: RO vs UV vs UF Based on Your Home TDS Level",
        "desc": "Stop buying unnecessary RO purifiers for low-TDS municipal water—learn exact TDS thresholds, RO wastage traps, mineralizer cartridges, and annual filter AMC costs.",
        "table_headers": ["Home Tap TDS (ppm)", "Recommended Technology", "Why This Choice Is Healthiest"],
        "table_rows": [
            ["< 200 ppm (Municipal/River tap)", "UV + UF (No RO needed)", "Kills bacteria/viruses without stripping essential calcium/magnesium or wasting water"],
            ["200 – 500 ppm (Mixed supply)", "RO + UV + TDS Controller / Alkaline", "Brings TDS down safely to ~70–120 ppm while preserving taste"],
            ["> 500 ppm (Borewell/Hard tanker)", "Full RO + UV + UF + Mineralizer", "Removes dissolved heavy metals, arsenic, fluoride, and hardness"],
        ],
        "sections": [
            (
                "Step 1: Spend ₹250 on a Digital TDS Meter Before Buying",
                "<p>Do not guess what purifier you need. Measure your kitchen tap water with a ₹250 TDS meter. If your municipal supply already reads <strong>80–180 ppm</strong>, installing a pure RO membrane strips water down to tasteless 15–20 ppm and wastes 2–3 liters of water for every 1 liter purified—a <strong>Gravity or Electric UV+UF purifier</strong> is healthier and saves thousands in annual membrane replacements.</p>"
            ),
            (
                "Watch Out for the Annual Filter & AMC Cost Trap",
                "<ul>"
                "<li>A ₹7,000 budget purifier with locked proprietary RFID cartridges that force ₹5,500/year brand-only service kits costs more over 4 years than a ₹14,000 standard purifier with ₹1,800 sediment/carbon replacements.</li>"
                "<li>Look for <strong>high-recovery RO membranes</strong> (claiming 45–60% water recovery instead of 25%) and route reject water into a bucket for mopping or washing floors.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("What is the ideal drinking water TDS level according to BIS/WHO?", "Water between 50 ppm and 150 ppm tastes crisp and retains balanced minerals. Anything up to 300 ppm from clean municipal sources is considered safe by BIS standards."),
            ("Do 'Copper' or 'Alkaline' RO cartridges provide real benefits?", "They marginally raise pH from slightly acidic post-RO (~6.5) back toward ~7.5–8.0 and add trace minerals, improving taste—just make sure they are replaced on schedule so they don't harbor biofilm."),
            ("How often do RO sediment and carbon filters need changing in India?", "Every 6–12 months depending on mud/chlorine load in your water; the core RO membrane itself typically lasts 18–24 months."),
            ("Does a UV+UF purifier work without electricity?", "UF (hollow-fiber ultrafiltration) works purely on gravity/water pressure and removes bacteria/cysts, while the UV lamp requires electricity to neutralize viruses."),
        ],
    },
    {
        "fname": "best-refurbished-phones-buying-guide-india-cashify-amazon.html",
        "cat": "shopping",
        "badge": "Refurbished Tech",
        "emoji": "♻️",
        "gradient": "linear-gradient(135deg, #2563eb, #1e40af)",
        "read_time": "9 min read",
        "title": "Refurbished Phones Buying Guide India: Amazon Renewed vs Cashify & Inspection Checklist",
        "desc": "How to safely buy a renewed iPhone or Android flagship in India—grading tiers, Sanchar Saathi IMEI checks, battery health rules, and return-window inspection.",
        "table_headers": ["Platform / Grade", "Typical Warranty", "What to Expect", "Best For"],
        "table_rows": [
            ["Cashify Superb", "6 Months (Brand/Cashify)", "Minimal micro-scratches, 80%+ battery", "Offline store inspection + instant replacement"],
            ["Cashify Good / Fair", "6 Months", "Visible frame/back wear; lower battery", "Tight budgets where a case hides scuffs"],
            ["Amazon Renewed", "6 Months Seller Warranty", "Clean cosmetic check; accessory box varies", "Bank card discounts + 7-day return window"],
        ],
        "sections": [
            (
                "The 6-Step Inspection Within 24 Hours of Delivery",
                "<ol>"
                "<li><strong>Sanchar Saathi / CEIR IMEI Check:</strong> Verify both IMEI 1 & IMEI 2 on the government Sanchar Saathi portal to confirm the phone is never blacklisted or stolen.</li>"
                "<li><strong>iPhone 'Parts & Service History':</strong> Go to <em>Settings → General → About</em>. Check if Display or Battery shows 'Unknown Part' (non-genuine aftermarket replacement) and ensure Battery Maximum Capacity is <strong>≥ 85%</strong>.</li>"
                "<li><strong>True Tone & Face ID / Fingerprint Test:</strong> Missing True Tone on iPhones usually signals a cheap aftermarket LCD/OLED screen swap.</li>"
                "<li><strong>Camera OIS & Dust Check:</strong> Shoot a plain white wall at 1x, 0.5x, and 2x/3x to catch lens dust spots or shaky focus motors.</li>"
                "<li><strong>SIM Call + Speaker + Mic Loopback:</strong> Make a 5-minute voice call and record a voice note to check earpiece mesh and noise-cancelling mics.</li>"
                "</ol>"
            ),
        ],
        "faqs": [
            ("Are refurbished phones waterproof (IP67/IP68)?", "Never assume water resistance on a refurbished phone—if it was opened for a battery or screen swap, factory adhesive seals are rarely restored to IP68 standard."),
            ("Do Amazon Renewed or Cashify phones come with original chargers?", "Usually they include a generic compatible USB cable/adapter rather than the original retail box brick—check the listing notes carefully."),
            ("Is buying a refurbished iPhone better than a new ₹25,000 Android phone?", "For video recording and social media apps, a clean renewed iPhone 13/14 shoots cleaner 4K HDR video; for 120Hz OLED, fast 67W charging, and 2-day battery, a new ₹25,000 Android wins."),
            ("Should I buy offline from Cashify stores or online?", "Visiting a physical Cashify store lets you check the exact screen, battery health %, and frame condition in your hand before paying."),
        ],
    },
    {
        "fname": "how-to-identify-fake-counterfeit-products-on-amazon-flipkart.html",
        "cat": "shopping",
        "badge": "Anti-Counterfeit",
        "emoji": "🔍",
        "gradient": "linear-gradient(135deg, #e11d48, #9f1239)",
        "read_time": "9 min read",
        "title": "How to Identify Fake & Counterfeit Products on Amazon & Flipkart (2026 Checklist)",
        "desc": "Protect yourself from fake SanDisk pendrives, duplicate Sony/JBL earbuds, and swapped cosmetics—verify authorized sellers, BIS R-numbers, and serial checks.",
        "table_headers": ["High-Risk Category", "Common Fake Trick", "Exact Verification Step"],
        "table_rows": [
            ["Memory Cards & SSDs (SanDisk/Samsung)", "2TB microSD for ₹799 (hacked 16GB firmware)", "Buy only from Clicktech / RetailNet; run H2testw / Samsung Magician"],
            ["Audio & Accessories (Apple/JBL/Sony)", "1:1 clone AirPods / JBL Charge with missing app link", "Pair with official JBL Portable / Sony Sound Connect app—clones fail"],
            ["Chargers & Power Banks", "Fake Apple 20W / Samsung 45W bricks", "Verify 8-digit BIS CRS R-number in BIS Care app"],
            ["Skincare & Fragrances", "Refilled bottles sold by brand-new 0-rating sellers", "Check brand's official 'Authorized Online Seller' list"],
        ],
        "sections": [
            (
                "Rule #1: Always Inspect the 'Sold By' Seller Name First",
                "<p>Even when a product page looks official (like Apple, SanDisk, or Minimalist), third-party marketplace sellers can attach their cheaper offer onto the same Buy Box. Before clicking Buy Now, verify the seller is an authorized distributor—such as <strong>Clicktech Retail, Cocoblu Retail, RK World Infocom, SuperComNet, or RetailNet</strong>—or the brand's own verified storefront.</p>"
            ),
            (
                "3 Instant Hardware & Legal Checks After Delivery",
                "<ul>"
                "<li><strong>Official BIS Care App Check:</strong> Every power adapter, power bank, smartwatch, and earbud imported or sold legally in India carries an <strong>R-XXXXXXXX</strong> registration number. Enter it in the free BIS Care app to verify the brand and factory match.</li>"
                "<li><strong>Official Companion App Handshake:</strong> Counterfeit TWS earbuds and headphones look identical outside, but cheap JL/Bluetrum clone chips cannot connect to Sony Sound Connect, JBL Headphones, or Samsung Wearable apps.</li>"
                "<li><strong>Fake Capacity Test for Flash Drives:</strong> Run <em>ValiDrive</em> or <em>H2testw</em> on Windows immediately on any newly bought microSD card or pendrive before storing family photos on it.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("If a listing says 'Amazon Fulfilled' or 'Flipkart Assured', can it still be fake?", "Yes—rarely, 'commingled' or returned stock swapped by a previous dishonest buyer can slip into fulfillment bins. Always record an unboxing video and inspect seals."),
            ("Why are 'Apple 20W Adapters' sold for ₹599 on marketplaces?", "Original Apple 20W USB-C adapters never sell for ₹599—anything drastically below ₹1,500–₹1,900 from unverified sellers is almost certainly counterfeit and lacks safe surge isolation."),
            ("What should I do if a product fails brand serial-number verification?", "Do not open or use it aggressively—photograph the serial sticker, raise a return under 'Counterfeit / Fake Product' immediately, and escalate to National Consumer Helpline (1915) if rejected."),
            ("Are 'Import / Open-Box Unboxed' deals safe?", "Only from authorized brand-refurbished partners; random seller 'imported unboxed' Apple/Samsung accessories are overwhelmingly high-grade clones."),
        ],
    },
    {
        "fname": "return-and-replacement-policy-hacks-open-box-delivery.html",
        "cat": "shopping",
        "badge": "Consumer Rights",
        "emoji": "📦",
        "gradient": "linear-gradient(135deg, #059669, #065f46)",
        "read_time": "9 min read",
        "title": "Open Box Delivery (OBD) & Return Policy Rules in India: Protect High-Value Orders",
        "desc": "Master Flipkart Open Box Delivery and Amazon OTP rules so you never get stuck with a broken screen, brick-in-box scam, or 'Brand Replacement Only' rejection.",
        "table_headers": ["Policy Type", "How It Works Now", "Smart Buyer Action"],
        "table_rows": [
            ["Open Box Delivery (OBD)", "Agent opens outer + brand seal in front of you BEFORE OTP", "Never share OTP before powering on phone/laptop & checking IMEI"],
            ["Service Center Replacement", "No doorstep return on phones/laptops—brand must issue DOA slip", "Report defects within 24–48 hrs to get Dead-On-Arrival job sheet"],
            ["7-Day / 10-Day Return", "Standard on fashion, cables, accessories", "Keep tags, barcode stickers & original inner polybag intact"],
        ],
        "sections": [
            (
                "The Golden Rule of Open Box Delivery (OBD): Never Give OTP Early",
                "<p>Some delivery agents ask for the 4-digit OTP first 'so the app lets me open the box.' <strong>Refuse politely.</strong> Once you share the OTP, the order marks as 'Accepted in good condition' and seller liability ends for physical damage or missing items.</p>"
                "<ul>"
                "<li>Check that the outer shipping label matches your order ID and shows zero retaping.</li>"
                "<li>Inspect the laptop/phone screen under bright light for hairline cracks, dead pixels, or missing charger bricks.</li>"
                "<li>Verify the <strong>IMEI / Serial Number on the phone (`*#06#`)</strong> matches the box and tax invoice before sharing the OTP.</li>"
                "</ul>"
            ),
            (
                "How to Film a Bulletproof Unboxing Video for Amazon/Flipkart",
                "<p>For non-OBD high-value orders (SSDs, GPUs, monitors, watches), record one <strong>continuous, unedited video</strong> in good light: first show all 6 sides of the sealed parcel and shipping label clearly, then cut the tape on camera, pull out the item, and verify serial/power-on without ever letting the box leave the frame.</p>"
            ),
        ],
        "faqs": [
            ("What if the delivery agent refuses to wait while I inspect an OBD package?", "Show them the Flipkart/Amazon OBD policy screen in your order page; if they still refuse to open or let you check, decline delivery and let the OTP expire so your refund processes automatically."),
            ("What does '7 Days Service Center Replacement' mean on Amazon/Flipkart?", "It means if the phone or laptop has a hardware defect (not physical damage), the delivery boy won't pick it up—you must visit the brand's authorized service center (Apple/Samsung/HP/Lenovo) to get a DOA certificate, after which the marketplace replaces or refunds it."),
            ("What if my return pickup keeps getting cancelled or rejected?", "Escalate via the platform's Grievance Officer email listed on their website, and file a free complaint on the Government National Consumer Helpline (consumerhelpline.gov.in or 1915 / WhatsApp 8800001915)."),
            ("Can I return an item just because I didn't like the color or performance on electronics?", "No—most electronics in India are now Replacement-only for defects, not 'change of mind' returns, so finalize specs before ordering."),
        ],
    },
    {
        "fname": "best-credit-cards-for-online-shopping-and-utility-bills.html",
        "cat": "shopping",
        "badge": "Smart Finance",
        "emoji": "💳",
        "gradient": "linear-gradient(135deg, #10b981, #047857)",
        "read_time": "10 min read",
        "title": "Best Credit Cards for Online Shopping & Utility Bills in India: Cashback & Traps",
        "desc": "Compare real cashback caps, MCC exclusions, and fee-waiver traps on SBI Cashback, HDFC Millennia/Swiggy, Amazon Pay ICICI, and Airtel Axis cards in India.",
        "table_headers": ["Card Category", "Real Cashback Rate", "Monthly Cap & Hidden Catch"],
        "table_rows": [
            ["Amazon Pay ICICI (LTF)", "5% Amazon (Prime) / 3% (Non-Prime)", "Uncapped; excludes instant 10% ICICI sale discounts on non-Pay cards"],
            ["SBI Cashback Card", "5% across almost all online merchants", "₹5,000/month cap; excludes utilities, rent, fuel, jewelry, EMI"],
            ["HDFC Swiggy / Millennia", "5%–10% on partner apps/online", "₹1,000–₹1,500 monthly cap; check MCC exclusions"],
            ["Airtel Axis / Ace", "10%–25% Airtel/utilities, 5% GPay bills", "Strict ₹250–₹500 monthly caps per category + convenience fees"],
        ],
        "sections": [
            (
                "Why 'Instant Bank Sale Discounts' Beat Cashback Cards During BBD/GIF",
                "<p>Many shoppers don't realize that <strong>Amazon Pay ICICI</strong> and <strong>co-branded cashback cards</strong> are often excluded from Amazon Great Indian Festival and Flipkart Big Billion Days 10% instant discount banners (which require core ICICI, SBI, HDFC, or Axis credit cards). Keeping one Lifetime-Free core bank card alongside a 5% online cashback card covers both daily shopping and mega-sales.</p>"
            ),
            (
                "4 Credit Card Traps That Wipe Out Your Cashback",
                "<ul>"
                "<li><strong>No-Cost EMI Interest + GST + ₹199–₹299 Processing Fee:</strong> Banks still charge 18% GST on the interest component plus processing fees, and most cards award <strong>zero cashback on EMI conversions</strong>.</li>"
                "<li><strong>Merchant Category Code (MCC) Surprise:</strong> Buying Amazon Pay Gift Cards via third-party portals often triggers Wallet/Gift MCCs that earn 0% cashback.</li>"
                "<li><strong>1% Utility Surcharge Over ₹15,000–₹50,000:</strong> Several banks now add a 1% + GST surcharge on high monthly utility or education payments.</li>"
                "<li><strong>Paying Only 'Minimum Amount Due':</strong> Attracts 36%–44% APR interest immediately on the full balance—always enable Auto-Pay for <strong>Total Amount Due</strong>.</li>"
                "</ul>"
            ),
        ],
        "faqs": [
            ("Does checking my credit card eligibility hurt my CIBIL score?", "Checking pre-approved offers inside your bank app is a soft check (no impact), whereas submitting formal applications triggers hard inquiries—avoid applying for 3+ cards in the same month."),
            ("Is Lifetime Free (LTF) better than a ₹999 annual-fee card?", "Only pay an annual fee if your guaranteed yearly cashback exceeds the fee by at least 4–5x (or if your annual spend easily hits the fee-waiver threshold, e.g., ₹2 lakh/year)."),
            ("Can I get cashback on UPI payments via RuPay Credit Cards?", "Yes, RuPay credit cards linked to BHIM/GPay/PhonePe earn rewards on merchant QR scans above ₹100–₹200, though P2P transfers to friends are blocked."),
            ("Should I close an old Lifetime-Free credit card I rarely use?", "Keep your oldest LTF card open with 1 small recurring bill on autopay—closing old accounts shrinks average credit history age and can dip your CIBIL score."),
        ],
    },
    {
        "fname": "upi-fraud-prevention-rules-and-safety-features-india.html",
        "cat": "shopping",
        "badge": "Digital Security",
        "emoji": "🛡️",
        "gradient": "linear-gradient(135deg, #ef4444, #991b1b)",
        "read_time": "9 min read",
        "title": "UPI Fraud Prevention in India: Collect Request Traps, UPI Lite & 1930 Golden Hour",
        "desc": "Practical guide to stopping OLX/QR/APK UPI scams in India—the 1-second PIN rule, disabling risky permissions, UPI Lite isolation, and 1930 cybercrime reporting.",
        "table_headers": ["Common Scam", "How Victims Get Tricked", "100% Foolproof Defense"],
        "table_rows": [
            ["OLX / Facebook Marketplace QR Scam", "Buyer sends QR or 'Collect Request' claiming you'll receive ₹5,000", "You NEVER enter your UPI PIN or scan a QR to RECEIVE money"],
            ["Fake Courier / KYC APK Link", "WhatsApp '.apk' file ('IndiaPost_Update.apk') steals SMS OTPs", "Never install APK files outside Play Store/App Store"],
            ["Screen-Sharing Support Scam", "Fake bank executive asks you to install AnyDesk / TeamViewer", "Banks never ask for remote screen control or OTPs"],
            ["Wrong-Number 'Sent by Mistake' Call", "Scammer asks for immediate refund via new UPI link", "Tell them to raise an official bank chargeback; never click links"],
        ],
        "sections": [
            (
                "The Unbreakable UPI Rule: PIN = Money Leaving Your Account",
                "<p>Every single UPI transaction in India works on one rule: <strong>you only enter your 4-digit or 6-digit UPI PIN when money goes OUT of your bank account</strong>. Receiving a refund, prize, salary, or OLX payment NEVER requires scanning a QR code, approving a Collect Request, or typing your PIN.</p>"
            ),
            (
                "Use UPI Lite & Smart Bank Limits to Minimize Exposure",
                "<ul>"
                "<li><strong>Enable UPI Lite for Daily Chai/Auto/Grocery Scans:</strong> Keep ₹500–₹1,000 in your on-device UPI Lite wallet for small PIN-less payments under ₹500—your main savings balance stays unexposed in crowded markets.</li>"
                "<li><strong>Cap Daily UPI & Debit Card Limits:</strong> Inside your bank's mobile app, lower your default domestic e-commerce/UPI transfer limit to what you actually spend weekly, and raise it temporarily only before big purchases.</li>"
                "<li><strong>Disable 'Unknown Sources' APK Installs:</strong> Keep Play Protect active and never grant Accessibility or SMS-read permissions to random loan/delivery apps.</li>"
                "</ul>"
            ),
            (
                "Golden Hour Protocol: What to Do Within 30 Minutes of Fraud",
                "<p>If money is fraudulently debited, immediately call India's National Cyber Crime Helpline <strong>1930</strong> (or file on <strong>cybercrime.gov.in</strong>) with the UTR/Transaction ID, date, time, and recipient VPA. Fast reporting inside the first 1–2 hours lets cyber police put a lien/freeze on the fraudster's mule bank account before funds are withdrawn at ATMs.</p>"
            ),
        ],
        "faqs": [
            ("Can someone empty my bank account just by knowing my UPI ID or phone number?", "No. Knowing your UPI ID (`name@okaxis`) or phone number only lets people send money TO you—without your physical SIM/device binding and secret UPI PIN, nobody can debit your account."),
            ("What if I accidentally sent money to the wrong UPI ID?", "Contact your bank immediately with the 12-digit UTR number to raise a 'Wrong Credit / Beneficiary Reversal' request under NPCI guidelines (and call 1930 if fraud is suspected)."),
            ("Is paying via GPay/PhonePe safer than entering debit card details on small websites?", "Yes—UPI keeps your 16-digit card number and CVV off third-party merchant servers entirely."),
            ("Should I keep my primary salary/savings account linked to UPI?", "For extra peace of mind, link a secondary zero-balance or low-balance savings account to daily UPI apps and keep long-term savings in a separate non-UPI account."),
        ],
    },
]

