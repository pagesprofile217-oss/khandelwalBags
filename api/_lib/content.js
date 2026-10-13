// Validates website content sent from /edit before it is saved.

const TEXT_KEYS = ['heroEyebrow', 'heroTitle1', 'heroTitle2', 'heroLead', 'aboutText', 'tagline', 'servicesIntro', 'productsIntro', 'footerTagline', 'locationTitle', 'locationAddress'];
const DEFAULT_CATS = ['S', 'C', 'T', 'O', 'L', 'G', 'Y']; // used when no categories are saved
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const IMG_RE = /^(assets\/[\w\-/. ]+\.(jpe?g|png|webp)|\/api\/img\?id=[a-f0-9]{24})$/i;

function bad(msg) { return Object.assign(new Error(msg), { status: 400 }); }
const str = (v, max, name) => {
  if (typeof v !== 'string') throw bad(`${name} must be text`);
  const s = v.trim();
  if (s.length > max) throw bad(`${name} is too long (max ${max} characters)`);
  return s;
};
const img = (v, name, optional) => {
  if (optional && (v === '' || v == null)) return '';
  if (typeof v !== 'string' || !IMG_RE.test(v)) throw bad(`${name}: invalid image`);
  return v;
};
const int = (v, min, max, name) => {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw bad(`${name} must be a whole number between ${min} and ${max}`);
  return n;
};
const list = (v, max, name) => {
  if (!Array.isArray(v)) throw bad(`${name} must be a list`);
  if (v.length > max) throw bad(`Too many ${name} (max ${max})`);
  return v;
};

function validate(input) {
  if (!input || typeof input !== 'object') throw bad('Missing content');

  const texts = {};
  const t = input.texts || {};
  for (const k of TEXT_KEYS) if (t[k] != null) texts[k] = str(t[k], 1500, `Text "${k}"`);

  const services = list(input.services || [], 30, 'services').map((s, i) => ({
    t: str(s.t, 80, `Service ${i + 1} title`) || 'Service',
    d: str(s.d || '', 300, `Service ${i + 1} description`),
    img: img(s.img, `Service ${i + 1}`)
  }));

  // categories (optional for older saves)
  let categories;
  if (input.categories != null) {
    const seen = new Set();
    categories = list(input.categories, 40, 'categories').map((c, i) => {
      const id = String(c.id || '');
      if (!/^[A-Za-z0-9_-]{1,24}$/.test(id) || seen.has(id)) throw bad(`Category ${i + 1}: invalid id`);
      seen.add(id);
      const name = str(c.name, 30, `Category ${i + 1} name`);
      if (!name) throw bad(`Category ${i + 1}: name is required`);
      return { id, name };
    });
    if (!categories.length) throw bad('Keep at least one category');
  }
  const CATS = categories ? categories.map(c => c.id) : DEFAULT_CATS;

  const products = list(input.products || [], 1000, 'bags').map((p, i) => {
    const n = `Bag ${i + 1}`;
    const cat = String(p.cat || '');
    if (!CATS.includes(cat)) throw bad(`${n}: choose a category`);
    const name = str(p.name, 60, `${n} name`);
    if (!name) throw bad(`${n}: name is required`);
    return {
      name,
      cat,
      note: str(p.note || '', 60, `${n} colour/details`),
      price: int(p.price === '' ? 0 : p.price, 0, 10000000, `${n} price`),
      img: img(p.img, `${n} photo`),
      detail: img(p.detail, `${n} detail photo`, true)
    };
  });

  const gallery = list(input.gallery || [], 1000, 'gallery photos').map((g, i) => ({
    thumb: img(g.thumb, `Gallery photo ${i + 1}`),
    full: img(g.full, `Gallery photo ${i + 1}`),
    alt: str(g.alt || '', 200, `Gallery photo ${i + 1} description`) || 'Bag from Suyog Enterprises',
    fit: g.fit === 'contain' ? 'contain' : 'cover',
    bg: /^#[0-9a-f]{3,8}$/i.test(g.bg || '') ? g.bg : ''
  }));

  const out = { texts, services, products, gallery };
  if (categories) out.categories = categories;

  if (input.testimonials != null) {
    out.testimonials = list(input.testimonials, 30, 'reviews').map((t, i) => {
      const n = str(t.n, 60, `Review ${i + 1} name`), q = str(t.q, 400, `Review ${i + 1} text`);
      if (!n || !q) throw bad(`Review ${i + 1}: name and review text are required`);
      return { n, q, r: int(t.r == null ? 5 : t.r, 1, 5, `Review ${i + 1} stars`) };
    });
  }

  if (input.hours != null) {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (!Array.isArray(input.hours) || input.hours.length !== 7) throw bad('Opening hours must list all 7 days');
    out.hours = input.hours.map((h, i) => {
      const closed = !!h.closed, open = String(h.open || ''), close = String(h.close || '');
      if (!TIME_RE.test(open) || !TIME_RE.test(close)) throw bad(`${DAYS[i]}: enter opening and closing times`);
      if (!closed && close <= open) throw bad(`${DAYS[i]}: closing time must be after opening time`);
      return { closed, open, close };
    });
  }

  if (input.contact != null) {
    const c = input.contact, num = (v, name) => {
      let d = String(v || '').replace(/\D/g, '');
      if (d.length === 10) d = '91' + d;
      if (d.length < 11 || d.length > 15) throw bad(`${name}: enter a valid mobile number`);
      return d;
    };
    const email = str(c.email || '', 120, 'Email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw bad('Email: enter a valid email address');
    out.contact = { whatsapp: num(c.whatsapp, 'WhatsApp number'), phone: num(c.phone, 'Call number'), email };
  }

  return out;
}

// ids of uploaded images (/api/img?id=...) used anywhere in the content
function referencedImageIds(c) {
  const ids = new Set();
  const add = u => { const m = /id=([a-f0-9]{24})$/i.exec(u || ''); if (m) ids.add(m[1].toLowerCase()); };
  c.services.forEach(s => add(s.img));
  c.products.forEach(p => { add(p.img); add(p.detail); });
  c.gallery.forEach(g => { add(g.thumb); add(g.full); });
  return ids;
}

module.exports = { validate, referencedImageIds };
