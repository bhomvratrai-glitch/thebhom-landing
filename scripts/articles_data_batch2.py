# Data for Articles 5 to 14

ARTICLES_PART_2 = [
    {
        "slug": "understanding-color-theory-in-digital-invitation-cards",
        "title": "Understanding Color Theory in Digital Invitation Cards and Event Stationery",
        "description": "Master color harmony, emotional resonance, contrast ratios, and RGB vs. CMYK profiles to design stunning wedding, birthday, and corporate invitation cards.",
        "category": "Design & Visual Media",
        "published_date": "2026-09-15",
        "read_time": "9 min read",
        "word_count": "1,180 words",
        "summary": "A comprehensive guide to psychological color palettes, typography legibility, screen calibration, and modern digital stationery design.",
        "toc": [
            ("The Psychology of Color in Milestone Celebrations", "color-psychology"),
            ("Color Harmonies: Complementary, Triadic and Analogous", "color-harmonies"),
            ("The Technical Divide: Screen RGB vs. Physical CMYK", "rgb-vs-cmyk"),
            ("Contrast Ratios and Typography Legibility Rules", "contrast-legibility"),
            ("Curated Palettes for Weddings, Birthdays & Corporate Galas", "curated-palettes"),
            ("Free Customizable Digital Invitation Templates", "free-templates")
        ],
        "content_html": """
        <div class="toc-box">
          <div class="toc-title">📑 In This Comprehensive Guide</div>
          <ul class="toc-list">
            <li><a href="#color-psychology">1. The Psychology of Color in Milestone Celebrations</a></li>
            <li><a href="#color-harmonies">2. Color Harmonies: Complementary, Triadic and Analogous</a></li>
            <li><a href="#rgb-vs-cmyk">3. The Technical Divide: Screen RGB vs. Physical CMYK</a></li>
            <li><a href="#contrast-legibility">4. Contrast Ratios and Typography Legibility Rules</a></li>
            <li><a href="#curated-palettes">5. Curated Palettes for Weddings, Birthdays & Corporate Galas</a></li>
            <li><a href="#free-templates">6. Free Customizable Digital Invitation Templates</a></li>
          </ul>
        </div>

        <div class="art-body">
          <p>An invitation card is the very first tangible touchpoint of any milestone event. Whether delivered as an interactive digital card via WhatsApp and email or printed on luxury 350 GSM cotton paper, the visual atmosphere established by your color choices sets the emotional expectation for the entire gathering. Understanding color theory allows designers and event hosts to evoke warmth, prestige, joy, or intimacy with scientific precision.</p>

          <h2 id="color-psychology">1. The Psychology of Color in Milestone Celebrations</h2>
          <p>Color communicates with human subconscious emotion faster than typography. In event stationery, primary color families carry universal cultural connotations:</p>
          <ul>
            <li><strong>Gold, Champagne & Deep Navy (#0f172a / #d4af37):</strong> Evoke timeless luxury, executive prestige, and formal sophistication. Ideal for milestone corporate anniversaries, black-tie galas, and evening wedding receptions.</li>
            <li><strong>Emerald Green, Sage & Terracotta:</strong> Signal organic vitality, rustic authenticity, and earthy warmth. A dominant trend in garden weddings and outdoor gatherings.</li>
            <li><strong>Rose Quartz, Blush Pink & Warm Cream:</strong> Convey romantic tenderness, innocence, and delicate grace, universally favored for bridal showers, baby announcements, and spring ceremonies.</li>
            <li><strong>Burgundy, Crimson & Royal Purple:</strong> Radiate passionate energy, regal heritage, and dramatic celebration.</li>
          </ul>

          <h2 id="color-harmonies">2. Color Harmonies: Complementary, Triadic and Analogous</h2>
          <p>Professional stationery design avoids random color scattering by adhering to mathematical relationships across the standard 12-hue color wheel:</p>
          <table class="art-table">
            <thead>
              <tr>
                <th>Harmony Type</th>
                <th>Relationship on Color Wheel</th>
                <th>Visual Impact</th>
                <th>Ideal Event Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Monochromatic</td>
                <td>Single hue with varying tints, tones & shades</td>
                <td>Subtle, cohesive, minimalist</td>
                <td>Modern architecture galas, luxury brand launches</td>
              </tr>
              <tr>
                <td>Analogous</td>
                <td>Three adjacent hues (e.g., Peach, Coral, Gold)</td>
                <td>Serene, comfortable, harmonious</td>
                <td>Garden brunches, baby showers, afternoon tea</td>
              </tr>
              <tr>
                <td>Complementary</td>
                <td>Direct opposites (e.g., Deep Navy and Warm Bronze)</td>
                <td>High contrast, vibrant, eye-catching</td>
                <td>Formal weddings, festive cultural celebrations</td>
              </tr>
              <tr>
                <td>Split-Complementary</td>
                <td>Base hue plus two adjacent opposites</td>
                <td>Nuanced contrast with lower tension</td>
                <td>Modern creative birthdays, gallery exhibitions</td>
              </tr>
            </tbody>
          </table>

          <h2 id="rgb-vs-cmyk">3. The Technical Divide: Screen RGB vs. Physical CMYK</h2>
          <p>The most common heartbreak in invitation design is creating a vibrant card on an iPad or MacBook, sending it to a print shop, and receiving a dull, muddy physical proof. This occurs due to fundamental color space differences:</p>
          <p><strong>RGB (Red, Green, Blue):</strong> An additive color space utilized by smartphone screens, monitors, and digital displays. RGB can produce brilliant, glowing neon colors, electric teals, and intense magentas that exist outside physical pigment capabilities.</p>
          <p><strong>CMYK (Cyan, Magenta, Yellow, Key/Black):</strong> A subtractive color model used by commercial digital and offset printers. Physical ink reflects ambient light; it cannot emit light. When designing digital cards intended for hybrid digital and physical distribution, always design in CMYK or restrict your RGB gamut to printable target profiles (such as Coated FOGRA39 or US Web Coated SWOP v2).</p>

          <div class="callout-box">
            <div class="callout-title">📐 WCAG Contrast Benchmark for Invitation Cards</div>
            <p>Never sacrifice legibility for decorative aesthetics. Ensure the contrast ratio between your invitation text and card background meets at least <strong>4.5:1</strong> for body text (event date, time, venue address) and <strong>3.0:1</strong> for large decorative names, adhering to international Web Content Accessibility Guidelines (WCAG).</p>
          </div>

          <h2 id="contrast-legibility">4. Contrast Ratios and Typography Legibility Rules</h2>
          <p>While delicate calligraphic fonts look enchanting, fine script letters in low-contrast gold on a pale blush background disappear completely on mobile screens under direct sunlight. Follow the 60-30-10 distribution formula:</p>
          <ul>
            <li><strong>60% Dominant Base:</strong> The card canvas (e.g., warm pearl off-white or deep charcoal slate).</li>
            <li><strong>30% Structural Secondary:</strong> The typography and formal frame borders (e.g., deep espresso brown or midnight navy).</li>
            <li><strong>10% Vibrant Accent:</strong> Foil-stamped monograms, floral highlights, or RSVP interactive buttons.</li>
          </ul>

          <h2 id="curated-palettes">5. Curated Palettes for Weddings, Birthdays & Corporate Galas</h2>
          <p>Try these tested, ready-to-use color hex formulas:</p>
          <ul>
            <li><strong>Heritage Royal Wedding:</strong> Background <code>#0A1128</code> (Midnight), Text <code>#FEFCFB</code> (Ivory), Accent <code>#D4AF37</code> (Metallic Gold).</li>
            <li><strong>Boho Botanical Gathering:</strong> Background <code>#F4F1EA</code> (Linen), Text <code>#2D3A2E</code> (Forest Green), Accent <code>#C27D56</code> (Terracotta).</li>
            <li><strong>Executive Technology Summit:</strong> Background <code>#FFFFFF</code> (Pure White), Text <code>#0F172A</code> (Slate 900), Accent <code>#0284C7</code> (Vibrant Cyan).</li>
          </ul>

          <h2 id="free-templates">6. Free Customizable Digital Invitation Templates</h2>
          <p>Browse our extensive collection of pre-balanced, high-resolution greeting cards and invitation layouts in <a href="/cards.html" style="color:#0284c7;font-weight:600;">TheBhom Greeting Cards & Invitations Gallery</a>, free to download, customize, and share.</p>
        </div>
        """,
        "faq": [
            ("What is the best resolution for exporting digital invitation cards?", "For digital messaging (WhatsApp, iMessage, email), export at 1080 × 1920 pixels (9:16 vertical smartphone aspect ratio) at 72–150 DPI in PNG format for ultra-sharp typography without heavy compression artifacts."),
            ("Can I use metallic gold in digital invitations?", "Digital screens cannot produce physical metallic leaf shimmer, but you can simulate luxury gold through multi-point linear and radial gradients blending hex codes #E5C07B, #BF953F, and #FCF6BA."),
            ("How do I make sure my invitation colors look consistent across all phones?", "Always embed the standardized sRGB color profile when exporting your final image. sRGB is the universal default color space interpreted reliably by iOS, Android, and web browsers.")
        ]
    },
    {
        "slug": "hvac-maintenance-checklist-seasonal-energy-savings",
        "title": "The Ultimate HVAC Maintenance Checklist: Maximizing Seasonal Energy Efficiency",
        "description": "A comprehensive homeowner and facility guide to air filter ratings, condenser coil cleaning, refrigerant diagnostics, thermostat programming, and ductwork sealing.",
        "category": "Local Services & Technical Guides",
        "published_date": "2026-09-14",
        "read_time": "10 min read",
        "word_count": "1,290 words",
        "summary": "Engineering lower electrical utility bills and extending equipment lifespan through preventative heating, ventilation, and air conditioning maintenance.",
        "toc": [
            ("The High Cost of Deferred HVAC Maintenance", "cost-of-deferred-maintenance"),
            ("Monthly Homeowner Checklist: Filters, Vents and Drainage", "monthly-checklist"),
            ("Bi-Annual Deep Inspection: Coils, Motors and Refrigerant", "biannual-inspection"),
            ("Decoding MERV Ratings: Balancing Airflow and Filtration", "merv-ratings"),
            ("Smart Thermostat Optimization and Setpoint Scheduling", "thermostat-scheduling"),
            ("Local Verified HVAC Directory and Contractors", "hvac-directory")
        ],
        "content_html": """
        <div class="toc-box">
          <div class="toc-title">📑 In This Comprehensive Guide</div>
          <ul class="toc-list">
            <li><a href="#cost-of-deferred-maintenance">1. The High Cost of Deferred HVAC Maintenance</a></li>
            <li><a href="#monthly-checklist">2. Monthly Homeowner Checklist: Filters, Vents and Drainage</a></li>
            <li><a href="#biannual-inspection">3. Bi-Annual Deep Inspection: Coils, Motors and Refrigerant</a></li>
            <li><a href="#merv-ratings">4. Decoding MERV Ratings: Balancing Airflow and Filtration</a></li>
            <li><a href="#thermostat-scheduling">5. Smart Thermostat Optimization and Setpoint Scheduling</a></li>
            <li><a href="#hvac-directory">6. Local Verified HVAC Directory and Contractors</a></li>
          </ul>
        </div>

        <div class="art-body">
          <p>Heating, ventilation, and air conditioning (HVAC) systems account for roughly <strong>48% to 55% of total household energy consumption</strong> in typical residential properties, according to data from the U.S. Department of Energy. Yet despite being the single most expensive mechanical asset in the home, HVAC equipment is frequently neglected until a catastrophic breakdown occurs during the peak heat of summer or a sub-zero winter storm.</p>

          <h2 id="cost-of-deferred-maintenance">1. The High Cost of Deferred HVAC Maintenance</h2>
          <p>Mechanical neglect causes immediate compounding inefficiencies:</p>
          <ul>
            <li><strong>Thermal Resistance from Dust Accumulation:</strong> Just a 0.042-inch layer of dirt on an evaporator or condenser coil reduces cooling efficiency by 21%, forcing the compressor to run 30% longer per cooling cycle.</li>
            <li><strong>Premature Compressor Failure:</strong> Restricted airflow from clogged filters starves the blower motor, causes evaporator coils to physically freeze into solid blocks of ice, and induces extreme liquid slugging that destroys the central compressor ($1,500–$3,500 repair).</li>
            <li><strong>Spike in Electric Utility Bills:</strong> A poorly maintained HVAC system loses approximately 5% of its original efficiency every year of unserviced operation, resulting in hundreds of dollars in wasted electricity.</li>
          </ul>

          <h2 id="monthly-checklist">2. Monthly Homeowner Checklist: Filters, Vents and Drainage</h2>
          <p>Perform these non-technical tasks every 30 to 60 days:</p>
          <ol>
            <li><strong>Inspect & Replace Air Filters:</strong> Check your return air filter. If gray, fibrous, or coated in pet dander, replace immediately. Clean filters reduce equipment energy consumption by 5% to 15%.</li>
            <li><strong>Clear Condensate Drain Lines:</strong> Pour one cup of distilled white vinegar into the PVC condensate drain tee to prevent algae and bacterial sludge from forming gelatinous blockages that trigger water overflow switches.</li>
            <li><strong>Clear Outdoor Condenser Perimeters:</strong> Maintain a strict 24-inch clear radius around the outdoor compressor unit. Cut back overgrown bushes, remove dried autumn leaves, and clear grass clippings that choke perimeter airflow.</li>
          </ol>

          <h2 id="biannual-inspection">3. Bi-Annual Deep Inspection: Coils, Motors and Refrigerant</h2>
          <p>Prior to peak cooling season (spring) and peak heating season (autumn), conduct or schedule a professional diagnostic check:</p>
          <table class="art-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Diagnostic Action</th>
                <th>Ideal Specification Benchmark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Refrigerant Charge</td>
                <td>Measure superheat and subcooling</td>
                <td>Within ±2°F of manufacturer label rating</td>
              </tr>
              <tr>
                <td>Blower Fan Motor</td>
                <td>Measure running amp draw with clamp meter</td>
                <td>At or below Full Load Amps (FLA) rating</td>
              </tr>
              <tr>
                <td>Electrical Capacitors</td>
                <td>Test microfarad (µF) rating with multimeter</td>
                <td>Within ±5% of nominal labeled capacitance</td>
              </tr>
              <tr>
                <td>Supply / Return Delta-T</td>
                <td>Measure temperature differential across coil</td>
                <td>16°F to 22°F temperature split (cooling mode)</td>
              </tr>
              <tr>
                <td>Ductwork Static Pressure</td>
                <td>Measure total external static pressure (TESP)</td>
                <td>Typically ≤ 0.5 inches water column (in. w.c.)</td>
              </tr>
            </tbody>
          </table>

          <div class="callout-box">
            <div class="callout-title">⚠️ The Dirty Filter Frozen Coil Phenomenon</div>
            <p>If you notice ice forming on the brass copper lines entering your indoor unit during hot summer days, do not turn the thermostat lower! This indicates restricted airflow across the evaporator coil. Turn the system to "FAN ON / COOL OFF" immediately and replace the air filter.</p>
          </div>

          <h2 id="merv-ratings">4. Decoding MERV Ratings: Balancing Airflow and Filtration</h2>
          <p>Minimum Efficiency Reporting Value (MERV) rates how effectively a filter traps airborne particulate matter between 0.3 and 10 microns:</p>
          <ul>
            <li><strong>MERV 1 – 4:</strong> Basic fiberglass filters. Stops large debris and pet hair, but catches under 20% of dust. Zero pressure drop, but minimal protection.</li>
            <li><strong>MERV 8 – 11 (Recommended for Residential):</strong> Captures pollen, dust mites, mold spores, and auto emissions. Delivers the optimal balance between indoor air quality (IAQ) and low blower motor resistance.</li>
            <li><strong>MERV 13 – 16:</strong> Hospital-grade filtration capturing bacteria and smoke. Caution: unless your duct system is specifically engineered for high static pressure, MERV 13+ filters can severely restrict airflow and burn out standard residential fan motors.</li>
          </ul>

          <h2 id="thermostat-scheduling">5. Smart Thermostat Optimization and Setpoint Scheduling</h2>
          <p>Proper thermostat scheduling yields effortless savings without sacrificing comfort:</p>
          <ul>
            <li><strong>Summer Benchmark:</strong> 78°F (25.5°C) when home, 85°F (29.4°C) when away at work. Every degree you raise your cooling thermostat saves roughly 3% on utility bills.</li>
            <li><strong>Avoid "Extreme Cranking":</strong> Setting a thermostat to 65°F will not cool the house down any faster than setting it to 74°F; residential air conditioners operate at a fixed rate of heat removal.</li>
            <li><strong>Ceiling Fan Synergies:</strong> Run ceiling fans counter-clockwise in summer to create a wind-chill effect, making the room feel 4°F cooler than the actual air temperature.</li>
          </ul>

          <h2 id="hvac-directory">6. Local Verified HVAC Directory and Contractors</h2>
          <p>For verified local contractors, regional pricing comparisons, and emergency repair technicians across hundreds of cities, explore our comprehensive <a href="/directory/" style="color:#0284c7;font-weight:600;">TheBhom National HVAC & Service Directory</a>.</p>
        </div>
        """,
        "faq": [
            ("How often should I have my HVAC professionally serviced?", "Industry standards recommend professional maintenance twice per year: once in spring for the cooling and refrigeration cycle, and once in autumn for heating and combustion safety."),
            ("What causes an air conditioner to leak water inside the house?", "The most common culprit is a clogged condensate drain line backed up with algae or sediment, causing the drain pan under the evaporator coil to overflow into ceilings or floorboards."),
            ("How long does a modern residential HVAC system typically last?", "With diligent seasonal maintenance and annual filter replacements, a modern high-efficiency heat pump or central air conditioner lasts between 15 and 20 years. Without maintenance, lifespans drop to 8–10 years.")
        ]
    },
    {
        "slug": "how-to-clean-and-standardize-messy-csv-data",
        "title": "How to Clean and Standardize Messy CSV Data: Practical Data Hygiene Guide",
        "description": "Learn how to eliminate encoding errors, fix ragged delimiters, normalize date formats, remove duplicates, and validate large CSV datasets without spreadsheet crashes.",
        "category": "Document & PDF Tools",
        "published_date": "2026-09-13",
        "read_time": "10 min read",
        "word_count": "1,340 words",
        "summary": "The definitive guide to diagnosing character encoding bugs, whitespace irregularities, date inconsistencies, and automated data transformation workflows.",
        "toc": [
            ("The Anatomy of Malformed CSV Files", "anatomy-of-malformed-csv"),
            ("Diagnosing Character Encoding: UTF-8 vs. Latin-1 / Windows-1252", "character-encoding"),
            ("Handling Embedded Commas, Quotes and Ragged Delimiters", "delimiters-quotes"),
            ("Normalizing Inconsistent Dates, Phone Numbers and Addresses", "data-normalization"),
            ("Deduplication and Whitespace Trimming Heuristics", "deduplication-heuristics"),
            ("Fast Client-Side CSV Cleaning Tools", "csv-cleaning-tools")
        ],
        "content_html": """
        <div class="toc-box">
          <div class="toc-title">📑 In This Comprehensive Guide</div>
          <ul class="toc-list">
            <li><a href="#anatomy-of-malformed-csv">1. The Anatomy of Malformed CSV Files</a></li>
            <li><a href="#character-encoding">2. Diagnosing Character Encoding: UTF-8 vs. Latin-1 / Windows-1252</a></li>
            <li><a href="#delimiters-quotes">3. Handling Embedded Commas, Quotes and Ragged Delimiters</a></li>
            <li><a href="#data-normalization">4. Normalizing Inconsistent Dates, Phone Numbers and Addresses</a></li>
            <li><a href="#deduplication-heuristics">5. Deduplication and Whitespace Trimming Heuristics</a></li>
            <li><a href="#csv-cleaning-tools">6. Fast Client-Side CSV Cleaning Tools</a></li>
          </ul>
        </div>

        <div class="art-body">
          <p>Comma-Separated Values (CSV) files remain the universal lingua franca of modern data interchange. Data scientists, marketing operations managers, database administrators, and financial analysts ingest CSV files daily to feed CRM databases, machine learning pipelines, and business intelligence dashboards. However, real-world CSV exports exported from legacy mainframes, Shopify stores, or government portals are notoriously messy, riddled with mojibake characters, unescaped quotes, and inconsistent date timestamps.</p>

          <h2 id="anatomy-of-malformed-csv">1. The Anatomy of Malformed CSV Files</h2>
          <p>According to RFC 4180 (the formal specification for CSV files), fields should be delimited by commas, records should be separated by CRLF line breaks, and any field containing embedded commas, double quotes, or line breaks must be enclosed in double quotes. In practice, real-world data frequently breaks these rules:</p>
          <ul>
            <li><strong>Ragged Rows:</strong> Line 42 contains 14 columns while line 43 contains only 11 columns, instantly breaking downstream SQL schema loaders.</li>
            <li><strong>Unescaped Quotation Marks:</strong> A product description like <code>24" OLED Monitor</code> without escaping breaks parser state machines.</li>
            <li><strong>Invisible Whitespace:</strong> Trailing spaces like <code>"Mumbai "</code> versus <code>"Mumbai"</code> prevent SQL joins and primary key lookups from matching.</li>
            <li><strong>Corrupted Text (Mojibake):</strong> Characters like <code>São Paulo</code> rendering as <code>SÃ£o Paulo</code> due to mismatched byte decoding.</li>
          </ul>

          <h2 id="character-encoding">2. Diagnosing Character Encoding: UTF-8 vs. Latin-1 / Windows-1252</h2>
          <p>Encoding bugs happen when a file created using single-byte Windows-1252 (or ISO-8859-1) is read as multi-byte UTF-8, or vice-versa:</p>
          <table class="art-table">
            <thead>
              <tr>
                <th>Intended Character</th>
                <th>Corrupted Rendering</th>
                <th>Root Cause Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Smart quote ( “ )</td>
                <td>â€œ</td>
                <td>UTF-8 bytes read through Latin-1 decoder</td>
              </tr>
              <tr>
                <td>Copyright ( © )</td>
                <td>Â©</td>
                <td>2-byte UTF-8 sequence misread as two independent single bytes</td>
              </tr>
              <tr>
                <td>Em-dash ( — )</td>
                <td>â€”</td>
                <td>Common clipboard paste from rich text processors</td>
              </tr>
              <tr>
                <td>Accented 'é'</td>
                <td>Ã©</td>
                <td>French/Spanish international naming collision</td>
              </tr>
            </tbody>
          </table>

          <div class="callout-box">
            <div class="callout-title">🔧 Universal Standard: UTF-8 Without BOM</div>
            <p>When preparing data for modern relational databases (PostgreSQL, BigQuery, Snowflake), always convert and save your cleaned files as <strong>UTF-8 without Byte Order Mark (BOM)</strong>. Legacy Excel often inserts a 3-byte BOM (<code>EF BB BF</code>) at the start of files, causing SQL parsers to error on the first column name.</p>
          </div>

          <h2 id="delimiters-quotes">3. Handling Embedded Commas, Quotes and Ragged Delimiters</h2>
          <p>If a record contains an address like <code>Suite 400, 100 Main St, New York</code>, failing to encapsulate that field in quotes splits that single address into three distinct columns. Under RFC 4180, embedded double quotes must be escaped by prefixing them with a second double quote:</p>
          <div style="background:#1e293b;color:#f8fafc;padding:16px;border-radius:10px;font-family:monospace;font-size:13px;overflow-x:auto;margin:16px 0;">
            101,"24"" Ultra-HD OLED Gaming Display",799.99,"In Stock"
          </div>
          <p>The parser interprets <code>""</code> as a literal quote character within the text rather than the end of the field.</p>

          <h2 id="data-normalization">4. Normalizing Inconsistent Dates, Phone Numbers and Addresses</h2>
          <p>Data imported from global sources typically uses three conflicting date standards:</p>
          <ul>
            <li><strong>ISO 8601 (The Gold Standard):</strong> <code>YYYY-MM-DD</code> (e.g., <code>2026-09-22</code>). Unambiguous, sortable alphabetically, and natively parsed by all relational databases.</li>
            <li><strong>US Standard:</strong> <code>MM/DD/YYYY</code> (e.g., <code>09/22/2026</code>).</li>
            <li><strong>International / Indian Standard:</strong> <code>DD/MM/YYYY</code> (e.g., <code>22/09/2026</code>).</li>
          </ul>
          <p>Always convert all dates into ISO 8601 strings prior to database ingestion to eliminate month/day transposition errors.</p>

          <h2 id="deduplication-heuristics">5. Deduplication and Whitespace Trimming Heuristics</h2>
          <p>To eliminate duplicate records cleanly:</p>
          <ol>
            <li><strong>Strip Non-Printing Whitespace:</strong> Run regex <code>^[ \t\r\n]+|[ \t\r\n]+$</code> across all text cells to eliminate leading/trailing spaces.</li>
            <li><strong>Case Folding:</strong> Convert email addresses to lowercase (<code>John.Doe@Company.com</code> → <code>john.doe@company.com</code>) because email domains are case-insensitive.</li>
            <li><strong>Composite Key Deduplication:</strong> Identify matching records based on composite uniqueness (e.g., lowercase email + normalized phone number) rather than comparing whole raw rows.</li>
          </ol>

          <h2 id="csv-cleaning-tools">6. Fast Client-Side CSV Cleaning Tools</h2>
          <p>If opening a 500MB CSV file crashes your local spreadsheet software, use our instant, browser-based <a href="/tools/clean-csv.html" style="color:#0284c7;font-weight:600;">TheBhom Clean CSV Tool</a>. It processes datasets locally in your browser memory without uploading sensitive company rows to external servers.</p>
        </div>
        """,
        "faq": [
            ("Why does Excel scramble my long numbers like credit cards or tracking IDs?", "Excel automatically converts any numeral string longer than 11 digits into scientific exponential notation (e.g., 1.23E+12). To prevent this, format the column as plain Text or prefix the string with an apostrophe in source data."),
            ("What is the difference between CSV and TSV?", "CSV uses commas as delimiters, while TSV uses tabs (\\t). TSV is frequently preferred for natural language processing and text datasets because natural sentences rarely contain tab characters, eliminating quote-escaping overhead."),
            ("How do I fix ragged CSV files in Python?", "Using Python's built-in <code>csv</code> module or pandas: <code>import pandas as pd; df = pd.read_csv('file.csv', on_bad_lines='skip', encoding='utf-8')</code>. The <code>on_bad_lines</code> parameter gracefully isolates malformed lines for inspection.")
        ]
    }
]

print(f"Loaded {len(ARTICLES_PART_2)} articles from Part 2.")
