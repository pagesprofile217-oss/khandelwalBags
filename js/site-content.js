/* Loads the live website content saved from /edit (MongoDB via /api/content).
   Falls back to the built-in SITE_DEFAULTS if nothing is saved or the server can't be reached. */
window.SiteContent = (() => {
  'use strict';
  const D = window.SITE_DEFAULTS;
  let pending = null;

  function merge(saved) {
    if (!saved || typeof saved !== 'object') return D;
    return {
      texts: Object.assign({}, D.texts, saved.texts || {}),
      services: Array.isArray(saved.services) ? saved.services : D.services,
      products: Array.isArray(saved.products) ? saved.products : D.products,
      gallery: Array.isArray(saved.gallery) ? saved.gallery : D.gallery,
      categories: Array.isArray(saved.categories) && saved.categories.length ? saved.categories : D.categories,
      testimonials: Array.isArray(saved.testimonials) ? saved.testimonials : D.testimonials,
      hours: Array.isArray(saved.hours) && saved.hours.length === 7 ? saved.hours : D.hours,
      contact: Object.assign({}, D.contact, saved.contact || {})
    };
  }

  function load() {
    if (pending) return pending;
    const ctrl = 'AbortController' in window ? new AbortController() : null;
    const timer = setTimeout(() => ctrl && ctrl.abort(), 4000);
    pending = fetch('/api/content', { signal: ctrl && ctrl.signal, headers: { Accept: 'application/json' } })
      .then(r => (r.ok ? r.json() : null))
      .then(j => merge(j && j.content))
      .catch(() => D)
      .finally(() => clearTimeout(timer));
    return pending;
  }

  // fill every element marked data-k="<text key>" and data-calc="count"
  function applyTexts(c) {
    document.querySelectorAll('[data-k]').forEach(el => {
      const v = c.texts[el.dataset.k];
      if (typeof v === 'string' && v.trim()) el.textContent = v;
    });
    const calc = { count: String(c.products.length) };
    document.querySelectorAll('[data-calc]').forEach(el => {
      const v = calc[el.dataset.calc];
      if (v) el.textContent = v;
    });
  }

  // "+91 93718 14999" style display of a digits-only number
  function prettyPhone(d) {
    d = String(d || '');
    return d.length === 12 && d.startsWith('91') ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : '+' + d;
  }

  // point every WhatsApp / call / email link and number label at the saved contact details
  function applyContact(c) {
    const k = c.contact || D.contact;
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
      a.href = a.getAttribute('href').replace(/^https:\/\/wa\.me\/\d+/, 'https://wa.me/' + k.whatsapp);
    });
    document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = 'tel:+' + k.phone; });
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = 'mailto:' + k.email; });
    document.querySelectorAll('[data-contact]').forEach(el => {
      const t = el.dataset.contact;
      el.textContent = t === 'email' ? k.email : prettyPhone(t === 'wa' ? k.whatsapp : k.phone);
    });
  }

  return { load, applyTexts, applyContact, prettyPhone, defaults: D };
})();
