"""Builds the Suyog Enterprises site assets: brand images from the logo files, and
placeholder bag illustrations for products, services and gallery (to be replaced
with real photos from /edit)."""
import json, math, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import qrcode

DL = Path(r"C:\Users\prath\Downloads")
OUT = DL / "suyog" / "assets"
COLLECTION = DL / "Suyog Enterprises Luxury Logo Collection.png"
MONOGRAM = DL / "suyog Monogram Logo.png"
WA = sys.argv[1] if len(sys.argv) > 1 else "910000000000"
FONTS = Path(r"C:\Windows\Fonts")

def font(name, size): return ImageFont.truetype(str(FONTS / name), size)
def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
def save(im, path, q=86):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert("RGB").save(path, "JPEG", quality=q, optimize=True, progressive=True)

# ---------------- brand ----------------
col = Image.open(COLLECTION).convert("RGB")
mono = Image.open(MONOGRAM).convert("RGB")
W, H = col.size
quads = [col.crop(b) for b in [(6, 6, W // 2 - 3, H // 2 - 3), (W // 2 + 3, 6, W - 6, H // 2 - 3),
                                (6, H // 2 + 3, W // 2 - 3, H - 6), (W // 2 + 3, H // 2 + 3, W - 6, H - 6)]]
save(col, OUT / "brand/hero.jpg", 88)
save(quads[0].resize((1440, round(1440 * quads[0].height / quads[0].width)), Image.LANCZOS), OUT / "brand/banner-wide.jpg", 88)
sq = mono.crop((60, 60, 1194, 1194))
save(sq.resize((900, 900), Image.LANCZOS), OUT / "brand/banner-square.jpg", 88)
save(mono.resize((512, 512), Image.LANCZOS), OUT / "brand/logo.jpg", 90)
icon = mono.crop((230, 130, 1130, 1030))  # the SE monogram without the wordmark
for name, s in [("favicon.png", 64), ("apple-touch-icon.png", 180), ("icon-192.png", 192)]:
    icon.resize((s, s), Image.LANCZOS).save(OUT / "brand" / name)

qr = qrcode.QRCode(border=2, box_size=12, error_correction=qrcode.constants.ERROR_CORRECT_M)
qr.add_data(f"https://wa.me/{WA}"); qr.make(fit=True)
qr.make_image(fill_color="#173A2F", back_color="white").convert("RGB").resize((520, 520), Image.NEAREST).save(OUT / "brand/qr-whatsapp.png")

# ---------------- bag illustrations ----------------
SS = 3  # supersample
BG_TOP, BG_BOT = hexrgb("#F6F0E6"), hexrgb("#E7DCCB")
GOLD = hexrgb("#C9A45C")

def backdrop(w, h, top=BG_TOP, bot=BG_BOT):
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=mix(top, bot, y / h))
    return im

def shaded(size, base, light=0.18, dark=0.28):
    w, h = size
    g = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(g)
    hi, lo = mix(base, (255, 255, 255), light), mix(base, (0, 0, 0), dark)
    for x in range(w):
        t = x / max(w - 1, 1)
        c = mix(hi, base, t / .45) if t < .45 else mix(base, lo, (t - .45) / .55)
        d.line([(x, 0), (x, h)], fill=c)
    return g

def fill(canvas, mask_poly_fn, base, light=0.18, dark=0.28):
    m = Image.new("L", canvas.size, 0)
    mask_poly_fn(ImageDraw.Draw(m))
    canvas.paste(shaded(canvas.size, base, light, dark), (0, 0), m)

def stitch(d, pts, color, width, dash, closed=False):
    pts = list(pts) + ([pts[0]] if closed else [])
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        L = math.hypot(x2 - x1, y2 - y1); n = int(L // (dash * 2))
        for k in range(n):
            a, b = (2 * k * dash) / L, ((2 * k + 1) * dash) / L
            d.line([(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a), (x1 + (x2 - x1) * b, y1 + (y2 - y1) * b)], fill=color, width=width)

def shadow(canvas, cx, cy, rx, ry):
    sh = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(sh).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(ry * .9))
    canvas.paste((60, 42, 30), (0, 0), sh)

def bag(canvas, kind, cx, cy, s, color):
    """Draw one bag centred at (cx, cy); s is its width in px."""
    d = ImageDraw.Draw(canvas)
    base = hexrgb(color); dark = mix(base, (0, 0, 0), .45); st = mix(base, (255, 255, 255), .35)
    lw = max(2, round(s * .012)); dash = s * .018
    if kind == "tote":
        w, h = s, s * .82; top, bot = cy - h * .35, cy + h * .5
        shadow(canvas, cx, bot, w * .55, s * .04)
        for dx in (-.22, .22):
            d.arc([cx + dx * w - w * .16, top - h * .55, cx + dx * w + w * .16, top + h * .25], 180, 360, fill=dark, width=round(s * .035))
        poly = [(cx - w * .5, top), (cx + w * .5, top), (cx + w * .44, bot), (cx - w * .44, bot)]
        fill(canvas, lambda m: m.polygon(poly, fill=255), base)
        stitch(d, [(cx - w * .46, top + s * .03), (cx + w * .46, top + s * .03)], st, lw, dash)
        d.ellipse([cx - s * .03, top + h * .12, cx + s * .03, top + h * .12 + s * .06], fill=GOLD)
    elif kind == "satchel":
        w, h = s, s * .7; top, bot = cy - h * .3, cy + h * .5
        shadow(canvas, cx, bot, w * .55, s * .04)
        d.arc([cx - w * .22, top - h * .55, cx + w * .22, top + h * .35], 180, 360, fill=dark, width=round(s * .045))
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=s * .09, fill=255), base)
        flap = [(cx - w * .5, top + s * .02), (cx + w * .5, top + s * .02), (cx + w * .5, top + h * .38), (cx, top + h * .55), (cx - w * .5, top + h * .38)]
        fill(canvas, lambda m: m.polygon(flap, fill=255), mix(base, (0, 0, 0), .12))
        stitch(d, flap[2:] + [flap[0]], st, lw, dash)
        d.rounded_rectangle([cx - s * .06, top + h * .48, cx + s * .06, top + h * .6], radius=s * .02, fill=GOLD)
    elif kind == "bucket":
        w, h = s * .82, s * .9; top, bot = cy - h * .4, cy + h * .5
        shadow(canvas, cx, bot, w * .6, s * .04)
        d.arc([cx - w * .45, top - h * .5, cx + w * .45, top + h * .5], 200, 340, fill=dark, width=round(s * .03))
        poly = [(cx - w * .4, top), (cx + w * .4, top), (cx + w * .52, bot - s * .05), (cx + w * .45, bot), (cx - w * .45, bot), (cx - w * .52, bot - s * .05)]
        fill(canvas, lambda m: m.polygon(poly, fill=255), base)
        d.ellipse([cx - w * .4, top - s * .03, cx + w * .4, top + s * .05], fill=mix(base, (0, 0, 0), .35))
        for dx in (-.08, .06):
            d.line([(cx + dx * s, top + s * .02), (cx + dx * s * 1.4, top + h * .4)], fill=dark, width=round(s * .012))
            d.ellipse([cx + dx * s * 1.4 - s * .025, top + h * .4, cx + dx * s * 1.4 + s * .025, top + h * .4 + s * .05], fill=GOLD)
    elif kind == "sling":
        w, h = s * .78, s * .58; top, bot = cy - h * .1, cy + h * .7
        shadow(canvas, cx, bot, w * .55, s * .035)
        d.line([(cx - w * .46, top + s * .03), (cx + w * .1, cy - s * .75), (cx + w * .46, top + s * .03)], fill=dark, width=round(s * .03), joint="curve")
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=s * .1, fill=255), base)
        flap = [cx - w * .5, top, cx + w * .5, top + h * .62]
        fill(canvas, lambda m: m.rounded_rectangle(flap, radius=s * .1, fill=255), mix(base, (0, 0, 0), .1))
        stitch(d, [(flap[0] + s * .04, flap[3] - s * .03), (flap[2] - s * .04, flap[3] - s * .03)], st, lw, dash)
        d.ellipse([cx - s * .035, flap[3] - s * .06, cx + s * .035, flap[3] + s * .01], fill=GOLD)
        for x in (cx - w * .46, cx + w * .46):
            d.ellipse([x - s * .02, top - s * .01, x + s * .02, top + s * .05], fill=GOLD)
    elif kind == "clutch":
        w, h = s, s * .55; top, bot = cy - h * .5, cy + h * .5
        shadow(canvas, cx, bot, w * .55, s * .035)
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=s * .04, fill=255), base)
        flap = [(cx - w * .5, top), (cx + w * .5, top), (cx, top + h * .62)]
        fill(canvas, lambda m: m.polygon(flap, fill=255), mix(base, (0, 0, 0), .14))
        stitch(d, [flap[0], flap[2], flap[1]], st, lw, dash)
        d.polygon([(cx, top + h * .54), (cx + s * .05, top + h * .64), (cx, top + h * .74), (cx - s * .05, top + h * .64)], fill=GOLD)
    elif kind == "backpack":
        w, h = s * .72, s * 1.0; top, bot = cy - h * .45, cy + h * .5
        shadow(canvas, cx, bot, w * .6, s * .04)
        d.arc([cx - s * .1, top - s * .12, cx + s * .1, top + s * .1], 180, 360, fill=dark, width=round(s * .03))
        for dx in (-1, 1):
            d.line([(cx + dx * w * .42, top + s * .1), (cx + dx * w * .58, bot - s * .12)], fill=dark, width=round(s * .05))
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=s * .16, fill=255), base)
        pocket = [cx - w * .36, cy + h * .02, cx + w * .36, bot - s * .06]
        fill(canvas, lambda m: m.rounded_rectangle(pocket, radius=s * .08, fill=255), mix(base, (0, 0, 0), .1))
        stitch(d, [(pocket[0] + s * .04, pocket[1] + s * .05), (pocket[2] - s * .04, pocket[1] + s * .05)], st, lw, dash)
        d.arc([cx - w * .4, top + s * .05, cx + w * .4, top + h * .5], 200, 340, fill=st, width=lw)
        d.rounded_rectangle([cx - s * .02, pocket[1] + s * .02, cx + s * .02, pocket[1] + s * .1], radius=s * .01, fill=GOLD)
    elif kind == "duffel":
        w, h = s * 1.15, s * .5; top, bot = cy - h * .4, cy + h * .6
        shadow(canvas, cx, bot, w * .55, s * .04)
        for dx in (-.16, .16):
            d.arc([cx + dx * w - s * .14, top - h * .7, cx + dx * w + s * .14, top + h * .4], 180, 360, fill=dark, width=round(s * .035))
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=h * .45, fill=255), base)
        for x in (cx - w * .5, cx + w * .5 - h * .5):
            fill(canvas, lambda m, x=x: m.rounded_rectangle([x, top, x + h * .5, bot], radius=h * .25, fill=255), mix(base, (0, 0, 0), .2))
        d.line([(cx - w * .32, top + s * .04), (cx + w * .32, top + s * .04)], fill=dark, width=lw * 2)
        d.rounded_rectangle([cx + w * .2, top + s * .025, cx + w * .26, top + s * .09], radius=s * .01, fill=GOLD)
        stitch(d, [(cx - w * .3, bot - s * .05), (cx + w * .3, bot - s * .05)], st, lw, dash)
    elif kind == "briefcase":
        w, h = s * 1.05, s * .72; top, bot = cy - h * .35, cy + h * .55
        shadow(canvas, cx, bot, w * .55, s * .04)
        d.rounded_rectangle([cx - s * .15, top - s * .14, cx + s * .15, top + s * .03], radius=s * .06, outline=dark, width=round(s * .04))
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, bot], radius=s * .05, fill=255), base)
        fill(canvas, lambda m: m.rounded_rectangle([cx - w * .5, top, cx + w * .5, top + h * .42], radius=s * .05, fill=255), mix(base, (0, 0, 0), .1))
        stitch(d, [(cx - w * .46, top + h * .38), (cx + w * .46, top + h * .38)], st, lw, dash)
        for dx in (-.25, .25):
            d.rounded_rectangle([cx + dx * w - s * .04, top + h * .34, cx + dx * w + s * .04, top + h * .48], radius=s * .01, fill=GOLD)

def scene(w, h, bags, top=BG_TOP, bot=BG_BOT):
    c = backdrop(w * SS, h * SS, top, bot)
    for kind, fx, fy, fs, color in bags:
        bag(c, kind, fx * w * SS, fy * h * SS, fs * w * SS, color)
    return c.resize((w, h), Image.LANCZOS)

# [name, category, kind, colour, note, price]
PRODUCTS = [
    ["Aria Tote", "H", "tote", "#B07A45", "Tan · Vegan leather", 1499],
    ["Mira Satchel", "H", "satchel", "#8A5A2F", "Cognac · Top handle", 1899],
    ["Noor Top-Handle", "H", "satchel", "#2B2522", "Black · Gold hardware", 2199],
    ["Leela Bucket Bag", "H", "bucket", "#6E2C2C", "Oxblood · Drawstring", 1699],
    ["Ira Shopper", "H", "tote", "#5E6B45", "Olive · Everyday size", 1299],
    ["Tara Bucket Bag", "H", "bucket", "#C39A6B", "Camel · Soft grain", 1599],
    ["Zoya Sling", "S", "sling", "#A8743F", "Tan · Adjustable strap", 999],
    ["Kiara Crossbody", "S", "sling", "#1F4D3D", "Emerald · Flap closure", 1199],
    ["Rhea Clutch", "S", "clutch", "#CDB48A", "Champagne · Party wear", 899],
    ["Sia Envelope Clutch", "S", "clutch", "#26211E", "Black · Evening", 949],
    ["Anya Mini Sling", "S", "sling", "#8C7B6B", "Taupe · Compact", 899],
    ["Voyager Duffel", "T", "duffel", "#6B4428", "Brown · Weekend size", 2999],
    ["Nomad Duffel", "T", "duffel", "#B9874F", "Tan · Cabin size", 2799],
    ["Weekender", "T", "duffel", "#22324A", "Navy · Canvas & leather", 2499],
    ["Trek Backpack", "T", "backpack", "#56603F", "Olive · 25 litre", 1799],
    ["City Backpack", "T", "backpack", "#24201D", "Black · Water resistant", 1999],
    ["Executive Briefcase", "O", "briefcase", "#3B2A20", "Espresso · Fits 15.6\" laptop", 3499],
    ["Metro Laptop Bag", "O", "briefcase", "#1F1D1C", "Black · Padded sleeve", 2499],
    ["Classic Messenger", "O", "briefcase", "#8A5A2F", "Cognac · Shoulder strap", 2299],
    ["Pro Laptop Backpack", "O", "backpack", "#3C3F44", "Charcoal · USB port", 2199],
]
CAT = {"H": "Handbags", "S": "Slings & Clutches", "T": "Travel & Backpacks", "O": "Office & Laptop"}
SCALE = {"tote": .58, "satchel": .6, "bucket": .62, "sling": .66, "clutch": .62, "backpack": .58, "duffel": .56, "briefcase": .58}

serif, serif_b, sans = "georgia.ttf", "georgiab.ttf", "segoeui.ttf"
for i, (name, cat, kind, color, note, price) in enumerate(PRODUCTS):
    fy = .6 if kind in ("sling",) else .55
    save(scene(480, 640, [(kind, .5, fy, SCALE[kind], color)]), OUT / f"products/p{i:02d}.jpg")
    # detail card shown in the zoom viewer
    card = scene(1200, 1500, [(kind, .5, .4, SCALE[kind] * .82, color)])
    d = ImageDraw.Draw(card)
    d.rectangle([0, 1080, 1200, 1500], fill=hexrgb("#173A2F"))
    d.line([(520, 1120), (680, 1120)], fill=GOLD, width=3)
    def ctext(y, txt, f, fillc):
        bw = d.textlength(txt, font=f); d.text(((1200 - bw) / 2, y), txt, font=f, fill=fillc)
    ctext(1150, name, font(serif, 76), hexrgb("#F6F0E6"))
    ctext(1260, f"{CAT[cat]}  ·  {note}", font(sans, 38), hexrgb("#D9CBB5"))
    ctext(1340, f"\u20b9{price:,}", font(serif_b, 64), GOLD)
    ctext(40, "SUYOG ENTERPRISES", font(serif, 34), hexrgb("#8A6A3E"))
    save(card, OUT / f"catalogue/c{i:02d}.jpg", 84)

SERVICES = [
    ("svc-wholesale", [("tote", .3, .55, .36, "#B07A45"), ("satchel", .7, .58, .36, "#2B2522"), ("clutch", .5, .82, .34, "#CDB48A")]),
    ("svc-corporate", [("briefcase", .5, .5, .62, "#3B2A20")]),
    ("svc-custom", [("tote", .5, .52, .6, "#1F4D3D")]),
    ("svc-retail", [("satchel", .32, .55, .38, "#8A5A2F"), ("bucket", .7, .55, .36, "#6E2C2C")]),
    ("svc-wedding", [("clutch", .5, .4, .5, "#CDB48A"), ("clutch", .5, .72, .44, "#26211E")]),
    ("svc-travel", [("duffel", .5, .62, .6, "#6B4428"), ("backpack", .5, .3, .3, "#56603F")]),
    ("svc-school", [("backpack", .34, .55, .4, "#22324A"), ("backpack", .7, .58, .36, "#3C3F44")]),
    ("svc-delivery", [("duffel", .5, .5, .62, "#B9874F")]),
]
for fname, bags in SERVICES:
    save(scene(800, 1000, bags), OUT / f"gallery/thumb/{fname}.jpg")

# gallery: the four logo artworks, the monogram, and bag still-lifes
GAL = []
for k, (q, bg) in enumerate(zip(quads, ["#F3EBDD", "#0E1626", "#123526", "#F2EFEA"])):
    save(q.resize((1200, round(1200 * q.height / q.width)), Image.LANCZOS), OUT / f"gallery/full/logo{k}.jpg", 88)
    save(q.resize((640, round(640 * q.height / q.width)), Image.LANCZOS), OUT / f"gallery/thumb/logo{k}.jpg", 84)
    GAL.append({"id": f"logo{k}", "alt": "Suyog Enterprises logo", "fit": "contain", "bg": bg})
save(mono.resize((1200, 1200), Image.LANCZOS), OUT / "gallery/full/monogram.jpg", 88)
save(mono.resize((640, 640), Image.LANCZOS), OUT / "gallery/thumb/monogram.jpg", 84)
GAL.insert(1, {"id": "monogram", "alt": "Suyog Enterprises monogram", "fit": "contain", "bg": "#F7F2EA"})
STILLS = [
    [("tote", .32, .5, .34, "#B07A45"), ("sling", .7, .58, .3, "#1F4D3D")],
    [("duffel", .5, .62, .58, "#6B4428")],
    [("satchel", .5, .55, .56, "#2B2522")],
    [("clutch", .3, .45, .3, "#CDB48A"), ("clutch", .68, .62, .3, "#26211E")],
    [("backpack", .34, .52, .34, "#56603F"), ("backpack", .7, .56, .3, "#24201D")],
    [("bucket", .5, .55, .52, "#6E2C2C")],
    [("briefcase", .5, .55, .58, "#3B2A20")],
    [("tote", .5, .55, .56, "#5E6B45")],
]
for k, bags in enumerate(STILLS):
    big = scene(960, 1280, bags)
    save(big, OUT / f"gallery/full/b{k:02d}.jpg")
    save(big.resize((480, 640), Image.LANCZOS), OUT / f"gallery/thumb/b{k:02d}.jpg")
    GAL.insert(2 + k * 2 if k < 4 else len(GAL), {"id": f"b{k:02d}", "alt": "Suyog Enterprises bag collection", "fit": "cover", "bg": ""})

print(json.dumps({"products": [[p[0], p[1], p[4], p[5]] for p in PRODUCTS], "gallery": GAL}, ensure_ascii=False))
