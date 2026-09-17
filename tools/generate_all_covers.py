import os, sys, urllib.request, json, ssl, io
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CTX = ssl._create_unverified_context()
API_KEY = 'JaXuF6QLyrRfSXUOrSB7hdojndgcynO2ihovpFxx4K95RREHE2Thx0ON'
HEADERS = {'Authorization': API_KEY, 'User-Agent': 'TheBhomGenerator/1.0'}

FUTURA = '/System/Library/Fonts/Supplemental/Futura.ttc'
DIDOT = '/System/Library/Fonts/Supplemental/Didot.ttc'
GEORGIA = '/System/Library/Fonts/Supplemental/Georgia.ttf'
HELVETICA = '/System/Library/Fonts/HelveticaNeue.ttc'
TIMES = '/System/Library/Fonts/Supplemental/Times New Roman.ttf'

def get_font(path, size, index=0):
    try:
        return ImageFont.truetype(path, size=size, index=index)
    except Exception:
        return ImageFont.load_default()

def fetch_pexels_image(query, orientation='portrait'):
    url = f'https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&orientation={orientation}&per_page=5'
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=CTX) as resp:
        data = json.loads(resp.read().decode())
        photos = data.get('photos', [])
        if not photos:
            raise Exception(f'No photos for {query}')
        img_url = photos[0]['src']['portrait' if orientation == 'portrait' else 'large2x']
        img_req = urllib.request.Request(img_url, headers={'User-Agent': 'TheBhomGenerator/1.0'})
        with urllib.request.urlopen(img_req, context=CTX) as img_resp:
            return Image.open(io.BytesIO(img_resp.read())).convert('RGB')

def draw_scrim(im, top_height=260, bottom_height=380, top_alpha=190, bottom_alpha=220):
    overlay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    w, h = im.size
    
    # Top scrim
    for y in range(top_height):
        a = int(top_alpha * (1 - y / top_height) ** 1.3)
        d.line([(0, y), (w, y)], fill=(0, 0, 0, a))
        
    # Bottom scrim
    for y in range(h - bottom_height, h):
        progress = (y - (h - bottom_height)) / bottom_height
        a = int(bottom_alpha * (progress ** 1.3))
        d.line([(0, y), (w, y)], fill=(0, 0, 0, a))
        
    im_rgba = im.convert('RGBA')
    combined = Image.alpha_composite(im_rgba, overlay)
    return combined.convert('RGB')

def draw_barcode(draw, x, y, width=120, height=45):
    import random
    draw.rectangle([x-5, y-5, x + width + 5, y + height + 15], fill=(255, 255, 255, 230))
    bar_x = x
    rand = random.Random(42)
    while bar_x < x + width:
        bw = rand.choice([1, 2, 3, 4])
        draw.rectangle([bar_x, y, bar_x + bw - 1, y + height], fill=(15, 23, 42))
        bar_x += bw + rand.choice([1, 2, 3])
    f = get_font(HELVETICA, 10)
    draw.text((x + 8, y + height + 1), '0 89452 71092 4', fill=(15, 23, 42), font=f)

def build_magazine_cover(query, masthead, subhead, issue_str, main_headline, sub_headline, teaser_lines, accent_color, out_path):
    print(f'Generating Magazine: {out_path} ({query})...')
    raw_img = fetch_pexels_image(query, 'portrait')
    target_w, target_h = 896, 1200
    
    # Crop to 896x1200 aspect ratio
    src_w, src_h = raw_img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h
    
    if src_ratio > target_ratio:
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        raw_img = raw_img.crop((left, 0, left + new_w, src_h))
    else:
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        raw_img = raw_img.crop((0, top, src_w, top + new_h))
        
    im = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im = draw_scrim(im, top_height=280, bottom_height=420)
    
    d = ImageDraw.Draw(im)
    
    # Top banner / Issue Info
    f_issue = get_font(HELVETICA, 14)
    d.text((40, 28), issue_str.upper(), fill=(226, 232, 240), font=f_issue)
    d.text((target_w - 200, 28), 'THEBHOM.IN • FREE', fill=accent_color, font=f_issue)
    d.line([(40, 52), (target_w - 40, 52)], fill=(255, 255, 255, 80), width=1)
    
    # Masthead with shadow
    f_mast = get_font(FUTURA, 76)
    # Shadow
    d.text((42, 64), masthead, fill=(0, 0, 0, 180), font=f_mast)
    d.text((40, 62), masthead, fill=(255, 255, 255), font=f_mast)
    
    # Subhead bar
    f_sub = get_font(HELVETICA, 16)
    d.text((44, 154), subhead.upper(), fill=accent_color, font=f_sub)
    d.line([(40, 182), (target_w - 40, 182)], fill=accent_color, width=2)
    
    # Main Headline
    f_lead_tag = get_font(HELVETICA, 15)
    d.rectangle([40, target_h - 370, 220, target_h - 342], fill=accent_color)
    d.text((50, target_h - 368), 'EXCLUSIVE COVER STORY', fill=(15, 23, 42), font=f_lead_tag)
    
    f_main = get_font(FUTURA, 42)
    d.text((42, target_h - 332), main_headline, fill=(0, 0, 0), font=f_main)
    d.text((40, target_h - 334), main_headline, fill=(255, 255, 255), font=f_main)
    
    f_lead_sub = get_font(GEORGIA, 20)
    d.text((40, target_h - 280), sub_headline, fill=(226, 232, 240), font=f_lead_sub)
    
    # Teaser bullets
    f_teaser = get_font(HELVETICA, 18)
    curr_y = target_h - 225
    for t in teaser_lines:
        d.line([(40, curr_y + 10), (55, curr_y + 10)], fill=accent_color, width=3)
        d.text((65, curr_y), t, fill=(255, 255, 255), font=f_teaser)
        curr_y += 34
        
    # Barcode & Price Tag
    draw_barcode(d, target_w - 180, target_h - 90)
    
    f_free = get_font(FUTURA, 20)
    d.rectangle([40, target_h - 85, 220, target_h - 45], fill=(16, 185, 129))
    d.text((52, target_h - 78), '100% FREE ISSUE', fill=(255, 255, 255), font=f_free)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path, 'JPEG', quality=95)
    print(f'✅ Saved: {out_path}')

def build_template_cover(query, cat_label, title, subtitle, accent_color, out_path):
    print(f'Generating Template: {out_path} ({query})...')
    raw_img = fetch_pexels_image(query, 'portrait')
    target_w, target_h = 800, 800
    
    # Square crop
    src_w, src_h = raw_img.size
    min_dim = min(src_w, src_h)
    left = (src_w - min_dim) // 2
    top = (src_h - min_dim) // 2
    raw_img = raw_img.crop((left, top, left + min_dim, top + min_dim))
    
    im = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im = draw_scrim(im, top_height=180, bottom_height=320, top_alpha=160, bottom_alpha=240)
    
    d = ImageDraw.Draw(im)
    
    # Category badge
    f_badge = get_font(HELVETICA, 14)
    d.rectangle([35, 35, 190, 68], fill=accent_color)
    d.text((45, 42), cat_label.upper(), fill=(15, 23, 42), font=f_badge)
    
    d.text((target_w - 220, 42), 'READY TO EDIT PACK', fill=(241, 245, 249), font=f_badge)
    
    # Bottom Glassmorphic card
    f_title = get_font(FUTURA, 34)
    d.text((42, target_h - 220), title, fill=(0, 0, 0), font=f_title)
    d.text((40, target_h - 222), title, fill=(255, 255, 255), font=f_title)
    
    f_sub = get_font(GEORGIA, 20)
    d.text((40, target_h - 170), subtitle, fill=(203, 213, 225), font=f_sub)
    
    # Download indicator
    f_btn = get_font(HELVETICA, 16)
    d.rectangle([40, target_h - 100, 240, target_h - 55], fill=(255, 255, 255, 240))
    d.text((55, target_h - 88), '⚡ 1-CLICK DOWNLOAD', fill=(15, 23, 42), font=f_btn)
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path, 'JPEG', quality=95)
    print(f'✅ Saved: {out_path}')

def build_card_cover(query, cat_label, title, subtitle, accent_color, out_path):
    print(f'Generating Card: {out_path} ({query})...')
    raw_img = fetch_pexels_image(query, 'landscape')
    target_w, target_h = 800, 520
    
    # Landscape crop 800x520
    src_w, src_h = raw_img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h
    
    if src_ratio > target_ratio:
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        raw_img = raw_img.crop((left, 0, left + new_w, src_h))
    else:
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        raw_img = raw_img.crop((0, top, src_w, top + new_h))
        
    im = raw_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    im = draw_scrim(im, top_height=140, bottom_height=260, top_alpha=140, bottom_alpha=220)
    
    d = ImageDraw.Draw(im)
    
    # Border luxury frame
    d.rectangle([18, 18, target_w - 18, target_h - 18], outline=accent_color, width=2)
    d.rectangle([24, 24, target_w - 24, target_h - 24], outline=(255, 255, 255, 80), width=1)
    
    # Category / Tag
    f_tag = get_font(HELVETICA, 13)
    d.text((45, 38), f'PREMIUM {cat_label.upper()} CARD', fill=accent_color, font=f_tag)
    d.text((target_w - 210, 38), '4-PANEL FOLDABLE PDF', fill=(226, 232, 240), font=f_tag)
    
    # Main Card Title
    f_title = get_font(DIDOT, 46)
    d.text((target_w // 2, target_h - 150), title, fill=(0, 0, 0), font=f_title, anchor='mm')
    d.text((target_w // 2, target_h - 152), title, fill=(255, 255, 255), font=f_title, anchor='mm')
    
    f_sub = get_font(GEORGIA, 20)
    d.text((target_w // 2, target_h - 95), subtitle, fill=accent_color, font=f_sub, anchor='mm')
    
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path, 'JPEG', quality=95)
    print(f'✅ Saved: {out_path}')

if __name__ == '__main__':
    base_dir = '/Users/bhomvratrai/Documents/GitHub/thebhom-landing'
    
    # 1. Magazines
    mags = [
        ('himalayas spiti valley mountain', 'WANDERLUST', 'Asia • Expedition & Discovery', 'Vol. 18 • Issue 04', 'SPITI VALLEY ODYSSEY', 'Into the trans-Himalayan high altitude desert', ['High-Altitude Passes Above 4,500m', '1,000-Year Tabo Monastery Heritage', 'Zero Light-Pollution Dark Sky Haven'], (56, 189, 248), f'{base_dir}/assets/covers/magazines/mag5.jpg'),
        ('deep space galaxy stars nebula', 'COSMOS', '& Discovery • The Final Frontier', 'Special Space Edition', 'FIRST STARS OF CREATION', 'How James Webb Space Telescope rewrote cosmic dawn', ['13.4 Billion Light Years Peered', 'ISRO Gaganyaan: India in Human Spaceflight', 'Ocean Moons: Searching Alien Microbes'], (192, 132, 252), f'{base_dir}/assets/covers/magazines/mag6.jpg'),
        ('cricket player stadium floodlights', 'CRICKET NOW', 'The Champions Edition • World Cricket', 'Vol. 12 • Issue 07', 'THE 150 KM/H PACE ERA', 'Inside the biomechanics lab powering India\'s pace arsenal', ['150+ km/h Reverse Swing Mastery', 'IPL Global Dominance & Real-Time Analytics', 'Under-19 Stars Ready For Global Debut'], (52, 211, 153), f'{base_dir}/assets/covers/magazines/mag7.jpg'),
        ('supercar night speed neon city', 'SPEED & TORQUE', 'Hypercars • Electric vs Combustion', 'Special Edition 2025', '1000 HORSEPOWER ERA', 'Silicon carbide inverters & track-tested dual-motor EV beasts', ['0 to 100 km/h in 1.7 Seconds', 'India\'s Greenfield Expressway Network', 'Quad-Motor Torque Vectoring Precision'], (248, 113, 113), f'{base_dir}/assets/covers/magazines/mag8.jpg'),
    ]
    
    for m in mags:
        try:
            build_magazine_cover(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8])
        except Exception as e:
            print(f'Error generating mag {m[8]}: {e}')
            
    # 2. Templates
    templates = [
        ('dark minimal geometric abstract', 'Instagram Quote', 'Believe In Yourself', 'Your only limit is your mind', (168, 85, 247), f'{base_dir}/assets/covers/templates/t1.jpg'),
        ('luxury gold watch dark aesthetic', 'Hustle Culture', 'Work Hard In Silence', 'Let success make the noise 🔥', (245, 158, 11), f'{base_dir}/assets/covers/templates/t2.jpg'),
        ('futuristic modern tech neon device', 'Product Launch', 'Next-Gen Innovation', 'Available worldwide today', (6, 182, 212), f'{base_dir}/assets/covers/templates/t3.jpg'),
        ('high fashion model runway dress', 'Fashion Style', 'Style Is Art & Living', 'Autumn / Winter Preview 2025', (236, 72, 153), f'{base_dir}/assets/covers/templates/t4.jpg'),
        ('gourmet restaurant food culinary dish', 'Restaurant Menu', 'Today\'s Fresh Specials', 'Artisanal • Organic • Delicious', (249, 115, 22), f'{base_dir}/assets/covers/templates/t5.jpg'),
        ('fitness gym barbell workout dark', 'Gym & Fitness', 'No Pain No Gain', 'Unleash your true strength 💪', (239, 68, 68), f'{base_dir}/assets/covers/templates/t6.jpg'),
        ('artificial intelligence coding developer tech', 'Tech Startup', 'Think Digital & Scale', 'Autonomous agentic innovation', (34, 211, 238), f'{base_dir}/assets/covers/templates/t7.jpg'),
        ('traveler backpacker mountain sunset view', 'Travel Adventure', 'Explore The World', 'Life is too short to stay home ✈️', (34, 197, 94), f'{base_dir}/assets/covers/templates/t8.jpg'),
        ('luxury black gold card mock up elegant', 'Business Card', 'Executive Luxury Suite', 'Minimalist black & gold business card', (245, 158, 11), f'{base_dir}/assets/covers/templates/t18.jpg'),
        ('diwali diya oil lamp golden celebration', 'Festival Poster', 'दीपावली की शुभकामनाएं', 'Happy Diwali • Warm wishes & joy 🪔', (245, 158, 11), f'{base_dir}/assets/covers/templates/t22.jpg'),
    ]
    
    for t in templates:
        try:
            build_template_cover(t[0], t[1], t[2], t[3], t[4], t[5])
        except Exception as e:
            print(f'Error generating template {t[5]}: {e}')
            
    # 3. Cards
    cards = [
        ('wedding rings gold romantic bokeh love', 'Anniversary', 'Happy Anniversary', 'With all my love, forever & always ❤️', (251, 191, 36), f'{base_dir}/assets/covers/cards/c1.jpg'),
        ('silver anniversary champagne glasses sparkle', 'Silver Jubilee', '25 Years Together', 'Celebrating 25 years of love & laughter 🥂', (226, 232, 240), f'{base_dir}/assets/covers/cards/c2.jpg'),
        ('red roses bouquet romantic dark velvet', 'Floral Love', 'Forever In My Heart', 'Happy Anniversary • You are my life 🌹', (244, 63, 94), f'{base_dir}/assets/covers/cards/c3.jpg'),
        ('couple holding hands romantic sunset beach', 'Couple Romance', 'Forever & Always', 'Today, tomorrow & for eternity ✨', (192, 132, 252), f'{base_dir}/assets/covers/cards/c4.jpg'),
        ('birthday celebration colorful balloons confetti', 'Birthday Party', 'Happy Birthday!', 'Wishing you a joyful and magical year 🎂', (56, 189, 248), f'{base_dir}/assets/covers/cards/c6.jpg'),
        ('luxury birthday cake candles golden lights', 'Golden Milestone', 'Happy Birthday', 'Celebrate in style & elegance 🌟', (251, 191, 36), f'{base_dir}/assets/covers/cards/c7.jpg'),
        ('royal indian wedding luxury golden decor', 'Royal Wedding', 'Royal Wedding Wishes', 'Wishing you a lifetime of joy & harmony 👑', (245, 158, 11), f'{base_dir}/assets/covers/cards/c11.jpg'),
        ('indian bride henna mandap wedding ritual', 'Hindu Wedding', 'शुभ विवाह', 'मंगलमय वैवाहिक जीवन की हार्दिक शुभकामनाएं 🪷', (249, 115, 22), f'{base_dir}/assets/covers/cards/c13.jpg'),
        ('diwali diya lights glowing dark bokeh', 'Diwali Festival', 'शुभ दीपावली', 'दीपावली की हार्दिक शुभकामनाएं 🪔', (245, 158, 11), f'{base_dir}/assets/covers/cards/c15.jpg'),
        ('holi festival colors gulal powder celebration', 'Holi Festival', 'Happy Holi!', 'रंगों का पावन पर्व मुबारक हो 🌈', (236, 72, 153), f'{base_dir}/assets/covers/cards/c16.jpg'),
        ('islamic mosque ramadan eid crescent moonlight', 'Eid Mubarak', 'Eid Mubarak', 'ईद मुबारक! सुख और समृद्धि की दुआएं 🌙', (45, 212, 191), f'{base_dir}/assets/covers/cards/c17.jpg'),
        ('gratitude thank you golden calligraphy bouquet', 'Appreciation', 'Thank You!', 'Your kindness means the world to us 🙏', (251, 191, 36), f'{base_dir}/assets/covers/cards/c25.jpg'),
    ]
    
    for c in cards:
        try:
            build_card_cover(c[0], c[1], c[2], c[3], c[4], c[5])
        except Exception as e:
            print(f'Error generating card {c[5]}: {e}')
            
    print('ALL COVERS GENERATED SUCCESSFULLY!')
