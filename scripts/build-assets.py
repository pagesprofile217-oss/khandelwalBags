"""Builds assets/ and js/content-defaults.js for the Suyog Enterprises site from img/ and logo/.

WARNING: js/content-defaults.js has since been edited by hand (categories, testimonials, hours, contact,
product order). Re-running this overwrites those; copy them back afterwards. Day-to-day changes belong in /edit."""
import json, sys
from pathlib import Path
from PIL import Image, ImageOps
import qrcode

ROOT = Path(r"S:\Projects\khandelwalBags")
SRC = ROOT / "img"
A = ROOT / "assets"
FILES = sorted(p for p in SRC.iterdir() if p.is_file())
WA = "919371814999"

def rgb(p):
    im = Image.open(p); im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA"); bg = Image.new("RGB", im.size, "white"); bg.paste(im, mask=im.split()[-1]); return bg
    return im.convert("RGB")

def save(im, path, q=84):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=q, optimize=True, progressive=True)

def corner_bg(im):
    px = [im.getpixel(xy) for xy in [(2, 2), (im.width - 3, 2), (2, im.height - 3), (im.width - 3, im.height - 3)]]
    return tuple(sum(c[i] for c in px) // 4 for i in range(3))

def fit_pad(im, w, h, margin=.06):
    """Whole product visible on a w x h card, padded with the photo's own background."""
    bg = corner_bg(im)
    iw, ih = int(w * (1 - 2 * margin)), int(h * (1 - 2 * margin))
    t = im.copy(); t.thumbnail((iw, ih), Image.LANCZOS)
    if t.width < iw * .7 and t.height < ih * .7:  # small source: scale up a little
        k = min(iw / im.width, ih / im.height); t = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    c = Image.new("RGB", (w, h), bg); c.paste(t, ((w - t.width) // 2, (h - t.height) // 2)); return c

def cover(im, w, h, cy=.5):
    return ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(.5, cy))

def limit(im, side):
    t = im.copy(); t.thumbnail((side, side), Image.LANCZOS); return t

# ---------- brand ----------
poster = rgb(ROOT / "logo/Suyog Enterprises Luxury Bag Collection.png")
logo = rgb(ROOT / "logo/logo.png")
save(limit(poster, 1400), A / "brand/hero.jpg", 86)
save(limit(poster, 1800), A / "gallery/full/poster.jpg", 86)
save(cover(poster, 480, 640, .3), A / "gallery/thumb/poster.jpg", 82)
save(logo.resize((900, 900), Image.LANCZOS), A / "brand/banner.jpg", 88)
save(logo.resize((512, 512), Image.LANCZOS), A / "brand/logo.jpg", 90)
mono = logo.crop((150, 110, 1150, 1010))  # the SE monogram without "since 1989"
for name, s in [("favicon.png", 64), ("apple-touch-icon.png", 180), ("icon-192.png", 192)]:
    mono.resize((s, s), Image.LANCZOS).save(A / "brand" / name)
qr = qrcode.QRCode(border=2, box_size=12, error_correction=qrcode.constants.ERROR_CORRECT_M)
qr.add_data(f"https://wa.me/{WA}"); qr.make(fit=True)
qr.make_image(fill_color="#14382C", back_color="white").convert("RGB").resize((520, 520), Image.NEAREST).save(A / "brand/qr-whatsapp.png")

# ---------- products: [img index, category, name, note] ----------
# categories: S School, C College, T Travel, O Office, L Laptop, G Gym & Sports, Y Lifestyle
P = [
    # school
    (104, "S", "Spider-Man School Bag", "Red · Kids backpack"), (93, "S", "Barbie School Bag", "Pink · Kids backpack"),
    (113, "S", "Unicorn School Bag", "Lilac · Kids backpack"), (106, "S", "Spider-Man School Bag", "Grey & red"),
    (96, "S", "Snow White School Bag", "Disney Princess"), (97, "S", "Barbie High School Bag", "Pastel pink"),
    (122, "S", "Unicorn School Bag", "Teal & pink"), (107, "S", "Spider-Man School Bag", "Red & navy"),
    (101, "S", "Princess School Bag", "Pink · Kids backpack"), (108, "S", "Spider-Man School Bag", "Red · 3D print"),
    (119, "S", "Unicorn School Bag", "Pink · Holographic"), (95, "S", "Barbie School Bag", "Pink & teal"),
    (111, "S", "Spider-Man School Bag", "Navy"), (121, "S", "Unicorn Print School Bag", "Navy"),
    (102, "S", "Barbie School Bag", "Blue & pink"), (116, "S", "Unicorn School Bag", "Mint & lilac"),
    (112, "S", "Spider-Man Junior Bag", "Blue & red"), (94, "S", "Barbie School Bag", "Pink"),
    (100, "S", "Barbie School Bag", "Pastel"), (16, "S", "Unicorn Kids Bag", "Pink · Pre-school"),
    (9, "S", "Spider-Man Kids Bag", "Pre-school"), (117, "S", "Plush Unicorn Bag", "White · Pre-school"),
    # college
    (37, "C", "College Backpack", "Black & orange"), (31, "C", "College Backpack", "Blue"),
    (52, "C", "Graphic College Backpack", "Grey · Tiger print"), (56, "C", "College Backpack", "Red & yellow"),
    (51, "C", "College Backpack", "Tan"), (46, "C", "College Backpack", "Black · Camo panel"),
    (57, "C", "College Backpack", "Grey & orange"), (49, "C", "College Backpack", "Teal blue"),
    (36, "C", "Printed College Backpack", "Mountain print"), (53, "C", "College Backpack", "Navy"),
    (48, "C", "Printed College Backpack", "Grey & yellow"), (33, "C", "College Backpack", "Grey · Printed"),
    (34, "C", "College Backpack", "Light grey"), (58, "C", "Daypack", "Red"), (39, "C", "Daypack", "Black & orange"),
    (24, "C", "College Backpack", "Black & red"), (38, "C", "College Backpack", "Black"),
    (44, "C", "College Backpack", "Black"), (45, "C", "College Backpack", "Black & grey"),
    (55, "C", "College Backpack", "Black · Textured"), (41, "C", "College Backpack", "Black · Printed"),
    (42, "C", "College Backpack", "Black"),
    # travel
    (7, "T", "Trolley Set of 3", "Sage green · Hard shell"), (13, "T", "Trolley Set of 3", "Navy · Hard shell"),
    (22, "T", "Trolley Set of 3", "Champagne · Hard shell"), (132, "T", "Trolley Set of 3", "Yellow · Hard shell"),
    (0, "T", "Trolley Set of 3", "Lilac · Hard shell"), (26, "T", "Trolley Set of 3", "Teal · Hard shell"),
    (32, "T", "Trolley Set of 3", "Red · Hard shell"), (1, "T", "Trolley Set of 3", "Black · Hard shell"),
    (2, "T", "Trolley Set of 3", "Aqua · Hard shell"), (10, "T", "Soft Trolley Set of 3", "Brown · Fabric"),
    (43, "T", "Trolley Set with Backpack", "Blue"), (76, "T", "Trolley Set of 3", "Olive · Hard shell"),
    (19, "T", "Trolley Set of 3", "Teal blue"), (20, "T", "Trolley Set of 3", "Maroon"),
    (82, "T", "Trolley Set of 3", "Turquoise"), (84, "T", "Trolley Set of 3", "Sky blue"),
    (83, "T", "Soft Trolley Set of 3", "Red · Fabric"), (28, "T", "Trolley Set of 3", "White"),
    (131, "T", "Trolley Set of 3", "Powder blue"), (54, "T", "Printed Trolley Set of 3", "Graphic print"),
    (27, "T", "Trolley Set with Pouches", "Red"), (3, "T", "Trolley Set of 3", "Black · Textured"),
    (4, "T", "Trolley Set of 3", "Grey · Diamond pattern"), (5, "T", "Cabin Trolley", "Black · Diamond pattern"),
    (6, "T", "Trolley Set of 2", "Charcoal"), (8, "T", "Trolley Set of 3", "Black · Ribbed"),
    (11, "T", "Trolley Set of 3", "Gunmetal"), (15, "T", "Trolley Set of 3", "Navy · Ribbed"),
    (18, "T", "Soft Trolley Set of 3", "Black & blue"), (21, "T", "Trolley Set of 3", "Slate grey"),
    (25, "T", "Trolley Set of 2", "Black · Spinner wheels"), (81, "T", "Trolley Set of 3", "Grey · Ribbed"),
    (86, "T", "Trolley Set of 3", "Red"),
    # office
    (71, "O", "Leather Office Bag", "Brown · Multi-pocket"), (17, "O", "Leather Office Bag", "Tan · Multi-pocket"),
    (69, "O", "Leather Briefcase", "Maroon"), (78, "O", "Leather Office Bag", "Brown · Expandable"),
    (75, "O", "Leather Briefcase", "Brown"), (79, "O", "Leather Office Bag", "Black · Multi-pocket"),
    (74, "O", "Leather Messenger Bag", "Tan"), (80, "O", "Leather Messenger Bag", "Dark brown"),
    (68, "O", "Leather Office Bag", "Dark brown"), (77, "O", "Leather Office Bag", "Brown"),
    (70, "O", "Office Bag", "Black"), (73, "O", "Leather Briefcase", "Maroon · Slim"),
    (72, "O", "Leather Work Tote", "Brown"), (98, "O", "Leather Duffel Briefcase", "Tan"),
    # laptop
    (125, "L", "Croc-texture Laptop Bag", "Tan"), (126, "L", "Croc-texture Laptop Bag", "Wine"),
    (120, "L", "Slim Laptop Bag", "Black"), (88, "L", "Laptop Bag", "Navy"), (89, "L", "Croc-texture Laptop Bag", "Brown"),
    (130, "L", "Laptop Tote", "Tan"), (109, "L", "Croc-texture Laptop Bag", "Dark brown"),
    (133, "L", "Croc-texture Laptop Bag", "Plum"), (87, "L", "Laptop Bag", "Navy · Zip top"),
    (85, "L", "Laptop Bag", "Black"), (128, "L", "Croc-texture Laptop Bag", "Cognac"),
    (50, "L", "Laptop Backpack", "Black · Reflective"), (30, "L", "Laptop Backpack", "Black · Slim"),
    # gym & sports
    (29, "G", "Wheeled Duffel Bag", "Purple"), (35, "G", "Trekking Rucksack", "Navy"),
    # lifestyle
    (64, "Y", "Leather Sling Bag", "Brown"), (61, "Y", "Chest Sling Bag", "Grey"),
    (63, "Y", "Mini Sling Bag", "Black"), (59, "Y", "Waist Pouch", "Black"),
    (66, "Y", "Waist Pouch", "Black · Multi-zip"), (60, "Y", "Waist Pouch", "Black"),
    (62, "Y", "Travel Money Belt", "Black & beige"),
]
assert len({p[0] for p in P}) == len(P), "duplicate image"
products = []
for k, (i, cat, name, note) in enumerate(P):
    im = rgb(FILES[i])
    save(fit_pad(im, 600, 800), A / f"products/p{k:03d}.jpg", 82)
    save(fit_pad(im, 1000, 1000, .04) if im.width < 800 and im.height < 800 else limit(im, 1200), A / f"catalogue/c{k:03d}.jpg", 80)
    products.append({"name": name, "cat": cat, "note": note, "price": 0,
                     "img": f"assets/products/p{k:03d}.jpg", "detail": f"assets/catalogue/c{k:03d}.jpg"})

# ---------- gallery: lifestyle shots first ----------
G = [("poster", None), (71, .5), (111, .5), (94, .5), (74, .5), (39, .7), (68, .5), (58, .7), (98, .5),
     (72, .5), (50, .5), (7, .5), (56, .5), (17, .5), (125, .5), (13, .5), (113, .5), (64, .5), (22, .5), (36, .5)]
gallery = []
for n, (i, cy) in enumerate(G):
    gid = "poster" if i == "poster" else f"g{n:02d}"
    if i != "poster":
        im = rgb(FILES[i])
        save(limit(im, 1600), A / f"gallery/full/{gid}.jpg", 85)
        save(fit_pad(im, 480, 640, .04) if corner_bg(im) > (235, 235, 235) else cover(im, 480, 640, cy), A / f"gallery/thumb/{gid}.jpg", 82)
    gallery.append({"thumb": f"assets/gallery/thumb/{gid}.jpg", "full": f"assets/gallery/full/{gid}.jpg",
                    "alt": "Suyog Enterprises bag collection poster" if gid == "poster" else "Bag from Suyog Enterprises",
                    "fit": "contain" if gid == "poster" else "cover", "bg": "#F3EADB" if gid == "poster" else ""})

# ---------- services ----------
S = [("Corporate Gifting", "Branded bags for clients, teams and events, packed and delivered on time.", 71),
     ("Institutions & Schools", "School, college and uniform bags supplied in bulk to institutions.", 111),
     ("Customized Bags", "Your colours, your logo and your design, made to order.", 56),
     ("Private Labeling", "Our quality bags under your brand name, made to your specification.", 51),
     ("Bulk Orders & Pan India Delivery", "Wholesale quantities supplied and delivered across India.", 26),
     ("School & College Bags", "Durable, comfortable backpacks for every age and every class.", 104),
     ("Travel & Luggage", "Trolleys, duffels and travel sets for every journey.", 7),
     ("Office & Laptop Bags", "Leather office bags, briefcases and laptop bags for work.", 75)]
services = []
for k, (t, d, i) in enumerate(S):
    im = rgb(FILES[i])
    save(fit_pad(im, 640, 800, .05) if corner_bg(im) > (235, 235, 235) else cover(im, 640, 800), A / f"services/s{k}.jpg", 82)
    services.append({"t": t, "d": d, "img": f"assets/services/s{k}.jpg"})

js = f"""/* Built-in website content. Used when nothing has been saved from /edit yet,
   or when the database can't be reached. The admin editor starts from this too. */
window.SITE_DEFAULTS = (() => {{
  const texts = {{
    heroEyebrow: 'Bags for every journey · Since 1989',
    heroTitle1: 'Bags for every journey.',
    heroTitle2: 'Built for every need.',
    heroLead: 'Suyog Enterprises has been manufacturing and supplying bags since 1989. School, college, travel, office, laptop, gym and lifestyle bags, with corporate gifting, custom bags, private labeling and bulk orders across India.',
    aboutText: 'Suyog Enterprises is a manufacturer and supplier of bags, trusted since 1989. From school backpacks and college bags to trolley sets, leather office bags and laptop bags, we supply retail buyers, schools, institutions and companies, with custom branding, private labeling and pan India delivery for bulk orders.',
    tagline: 'Bags for every journey, since 1989.',
    servicesIntro: 'Corporate solutions and bag supply for schools, businesses and retailers.',
    productsIntro: 'Our product range. Tap a bag for a closer look, then enquire on WhatsApp for price and stock.',
    footerTagline: 'Premium quality. Durable. Custom made. Wide range.',
    locationTitle: 'Pune',
    locationAddress: 'FV5H+C6P, Kondhwa Budruk, Pune, Maharashtra 411048'
  }};

  const services = {json.dumps(services, ensure_ascii=False, indent=2)};

  // cat: S School, C College, T Travel, O Office, L Laptop, G Gym & Sports, Y Lifestyle. price 0 = ask for price
  const products = {json.dumps(products, ensure_ascii=False)};

  const gallery = {json.dumps(gallery, ensure_ascii=False, indent=2)};

  return {{ texts, services, products, gallery }};
}})();
"""
(ROOT / "js/content-defaults.js").write_text(js, encoding="utf-8")
print(len(products), "products,", len(gallery), "gallery,", len(services), "services")
