import os, sys, urllib.request, urllib.parse, ssl, time, io
from PIL import Image

CTX = ssl._create_unverified_context()

def generate_ai_cover(prompt, target_w, target_h, out_path):
    fname = os.path.basename(out_path)
    print(f"[{fname}] Starting AI Generation...")
    
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width={target_w}&height={target_h}&model=turbo&nologo=true"
    
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=CTX, timeout=30) as resp:
                data = resp.read()
                if len(data) > 5000 and not data.startswith(b'{"error"'):
                    im = Image.open(io.BytesIO(data))
                    im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
                    os.makedirs(os.path.dirname(out_path), exist_ok=True)
                    im.save(out_path, 'JPEG', quality=95)
                    print(f"  [{fname}] ✅ SUCCESS: Saved ({im.size})")
                    return True
                else:
                    print(f"  [{fname}] Attempt {attempt+1}: retry in 3s...")
                    time.sleep(3)
        except Exception as e:
            print(f"  [{fname}] Attempt {attempt+1} error: {e}. Retrying in 3s...")
            time.sleep(3)
            
    print(f"  [{fname}] ❌ FAILED after 4 attempts.")
    return False

if __name__ == '__main__':
    base_dir = '/Users/bhomvratrai/Documents/GitHub/thebhom-landing'

    # Templates - 800x800
    template_tasks = [
        ("Hyper-realistic 3D Instagram template mockup 'Believe in Yourself' inspirational quote, floating 3D minimalist dark card, glowing violet neon backlight, frosted glassmorphic card frame, elegant modern typography, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t1.jpg"),
        ("Hyper-realistic 3D Instagram business template mockup 'Work Hard in Silence' hustle culture, luxury black and molten gold theme, floating gold coins and watch, dramatic volumetric lighting, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t2.jpg"),
        ("Hyper-realistic 3D tech product launch template mockup 'NEW LAUNCH 2026', sleek futuristic cyan neon gadget, holographic interface, dark slate background, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t3.jpg"),
        ("Hyper-realistic 3D fashion editorial template mockup 'STYLE IS ART', high-fashion Indian model in designer silk couture, vibrant magenta and rose gold aesthetic, minimalist luxury layout, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t4.jpg"),
        ("Hyper-realistic 3D restaurant gourmet food template mockup 'TODAY'S SPECIAL', artisanal pizza and pasta with steaming fresh herbs, warm golden bistro lighting, wooden table, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t5.jpg"),
        ("Hyper-realistic 3D fitness gym workout template mockup 'NO PAIN NO GAIN', heavy iron dumbbells with chalk dust, fiery red and charcoal black lighting, energetic bodybuilding aesthetic, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t6.jpg"),
        ("Hyper-realistic 3D artificial intelligence tech startup template 'THINK DIGITAL', glowing neural network brain mesh, electric cyan and deep navy blue aesthetic, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t7.jpg"),
        ("Hyper-realistic 3D travel adventure template 'EXPLORE THE WORLD', traveler standing on mountain cliff at golden sunset, wanderlust aesthetic, emerald green and sunlit tones, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t8.jpg"),
        ("Hyper-realistic 3D luxury business card mockup, matte black card with embossed foil gold calligraphy, resting on dark textured marble with soft studio lighting, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t18.jpg"),
        ("Hyper-realistic 3D Diwali festival social media post template, glowing golden brass diyas with flickering flames, marigold flowers, festive golden bokeh, deep royal crimson background, 1:1 square.",
         800, 800, f"{base_dir}/assets/covers/templates/t22.jpg"),
    ]

    # Cards (Anniversary & Celebrations) - 800x520
    card_tasks = [
        ("A hyper-realistic 3D luxury golden wedding anniversary greeting card titled 'Happy Anniversary — Golden Love'. Two interlocking diamond wedding rings, sparkling champagne flutes, glowing golden bokeh particles, warm romantic velvet lighting, premium greeting card mockup.",
         800, 520, f"{base_dir}/assets/covers/cards/c1.jpg"),
        ("A hyper-realistic 3D luxury silver jubilee 25th anniversary greeting card titled '25 Years Together'. Polished sterling silver ribbons, sparkling crystals, white orchids, soft icy silver and lavender lighting, elegant folded greeting card.",
         800, 520, f"{base_dir}/assets/covers/cards/c2.jpg"),
        ("A hyper-realistic 3D romantic anniversary greeting card with lush deep velvet red roses bouquet, glowing golden fairy lights, red silk ribbon, 'Happy Anniversary My Love' golden calligraphy, luxury card mockup.",
         800, 520, f"{base_dir}/assets/covers/cards/c3.jpg"),
        ("A hyper-realistic 3D romantic couple love greeting card titled 'Forever & Always'. Silhouette of loving couple holding hands at magical sunset beach, golden hour light reflecting on ocean, warm purple and amber sky, elegant card.",
         800, 520, f"{base_dir}/assets/covers/cards/c4.jpg"),
        ("A hyper-realistic 3D colorful birthday celebration card titled 'Happy Birthday!'. Vibrant glossy 3D pastel balloons floating, metallic confetti explosion, festive party poppers, cheerful joyful lighting.",
         800, 520, f"{base_dir}/assets/covers/cards/c6.jpg"),
        ("A hyper-realistic 3D luxury golden birthday cake greeting card. Triple-tier chocolate and gold leaf cake with glowing candles, sparkling sparklers, dark background with golden fairy lights.",
         800, 520, f"{base_dir}/assets/covers/cards/c7.jpg"),
        ("A hyper-realistic 3D royal Indian wedding invitation card. Royal golden palace backdrop, marigold floral arches, royal elephants, gold foil embossed paisley motifs, deep maroon and turmeric gold luxury card.",
         800, 520, f"{base_dir}/assets/covers/cards/c11.jpg"),
        ("A hyper-realistic 3D traditional Hindu wedding Shubh Vivah card titled 'शुभ विवाह'. Sacred Agni kund holy fire, mangalsutra, red bridal chura with henna mehndi hands, auspicious marigold flowers, deep saffron and red sacred glow.",
         800, 520, f"{base_dir}/assets/covers/cards/c13.jpg"),
        ("A hyper-realistic 3D Diwali greeting card titled 'दीपावली की हार्दिक शुभकामनाएं'. Traditional glowing clay diyas in Rangoli pattern, sparkling golden sparklers, festive warm festive ambient glow.",
         800, 520, f"{base_dir}/assets/covers/cards/c15.jpg"),
        ("A hyper-realistic 3D Holi festival greeting card titled 'Happy Holi!'. Dynamic explosion of vibrant gulal organic color powders (magenta, cyan, sunny yellow, emerald), smiling playful celebration.",
         800, 520, f"{base_dir}/assets/covers/cards/c16.jpg"),
        ("A hyper-realistic 3D Eid Mubarak greeting card titled 'Eid Mubarak'. Golden glowing crescent moon, ornate Islamic lantern with flickering candlelight, mosque dome silhouette against midnight blue starry sky.",
         800, 520, f"{base_dir}/assets/covers/cards/c17.jpg"),
        ("A hyper-realistic 3D premium thank you card titled 'Thank You'. Elegant gold foil embossed calligraphy on cream handmade cotton paper, delicate white peonies, luxury gift box with satin ribbon.",
         800, 520, f"{base_dir}/assets/covers/cards/c25.jpg"),
    ]

    all_tasks = template_tasks + card_tasks
    print(f"Processing {len(all_tasks)} items sequentially with backoff...")
    
    success = 0
    for prompt, w, h, out in all_tasks:
        if generate_ai_cover(prompt, w, h, out):
            success += 1
        time.sleep(2) # Safe inter-request delay
        
    print(f"\n🎉 DONE: {success}/{len(all_tasks)} generated successfully!")
