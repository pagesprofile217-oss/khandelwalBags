/* /edit — website editor for Suyog Enterprises.
   Log in, change bags, categories, services, gallery photos, reviews, texts, contact details and opening hours,
   then "Save changes" writes to MongoDB and the live website shows the new content within a few seconds. */
(() => {
  'use strict';

  const D = window.SITE_DEFAULTS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const TABS = ['products', 'categories', 'services', 'gallery', 'reviews', 'texts', 'contact'];

  // [label, help, long text?, max length]
  const TEXT_FIELDS = {
    heroEyebrow: ['Small heading', 'Above the main title. On phones it shows under the logo.', false, 120],
    heroTitle1: ['Main title, line 1', 'The big heading at the top of the website.', false, 80],
    heroTitle2: ['Main title, line 2', 'Shown under line 1 in the accent colour.', false, 80],
    heroLead: ['Intro paragraph', 'Under the main title on computer screens.', true, 600],
    tagline: ['About tagline', 'The large quote at the top of the About section.', false, 120],
    aboutText: ['About paragraph', 'Tell visitors who you are and what you make.', true, 1000],
    servicesIntro: ['Services subtitle', 'Under the "Our Services" heading.', false, 200],
    productsIntro: ['Products subtitle', 'Under the "Our Product Range" heading.', false, 200],
    locationTitle: ['Location title', 'Bold line on the location card.', false, 60],
    locationAddress: ['Address', 'Shown under the location title.', false, 200],
    footerTagline: ['Footer line', 'The short line at the bottom of the page.', false, 160]
  };
  const TEXT_GROUPS = [
    { title: 'Top of the page', note: 'The first thing visitors see.', preview: 'hero', keys: ['heroEyebrow', 'heroTitle1', 'heroTitle2', 'heroLead'] },
    { title: 'About section', note: 'Who you are, in a line and a paragraph.', preview: 'about', keys: ['tagline', 'aboutText'] },
    { title: 'Section subtitles', note: 'Short lines under the section headings.', keys: ['servicesIntro', 'productsIntro'] },
    { title: 'Location card', note: 'In "Get in Touch". The map link does not change.', keys: ['locationTitle', 'locationAddress'] },
    { title: 'Footer', note: 'Bottom of every page.', keys: ['footerTagline'] }
  ];

  let state = null;       // content being edited
  let savedSnap = '';     // what is in the database
  let busy = 0;           // uploads in progress
  let saving = false;
  let sameCall = true;    // call number follows the WhatsApp number

  /* ---------- helpers ---------- */
  let toastT;
  function toast(msg, ms = 2800) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms);
  }
  const snap = () => JSON.stringify(state, (k, v) => (k.startsWith('_') ? undefined : v));
  const isDirty = () => !!state && snap() !== savedSnap;

  async function api(url, { method = 'GET', json, raw } = {}) {
    const headers = {};
    if (json) headers['Content-Type'] = 'application/json';
    if (raw) headers['Content-Type'] = 'application/octet-stream';
    const r = await fetch(url, { method, headers, credentials: 'same-origin', body: raw || (json ? JSON.stringify(json) : undefined) });
    let j = {};
    try { j = await r.json(); } catch {}
    if (r.status === 401 && url !== '/api/auth') {
      showLogin('Your session ended. Please log in again. Your changes are kept.');
      throw new Error('Please log in again');
    }
    if (!r.ok) throw new Error(j.error || `Something went wrong (${r.status})`);
    return j;
  }

  function show(view) {
    $('#loadingView').hidden = view !== 'loading';
    $('#loginView').hidden = view !== 'login';
    $('#appView').hidden = view !== 'app';
  }

  // "#" box that sets an item's position (1 = first)
  const posBox = (i, n, extra = '') =>
    `<label class="adm-pos" title="Type a number to move this to that position"><span>#</span><input type="number" data-pos min="1" max="${n}" value="${i + 1}" inputmode="numeric" aria-label="Position (1 to ${n})">${extra}</label>`;

  // move list[from] to 1-based position `pos`; returns the new index (or -1 if nothing moved)
  function moveTo(list, from, pos) {
    const to = clamp(Math.round(+pos) || 1, 1, list.length) - 1;
    if (to === from) return -1;
    const [item] = list.splice(from, 1);
    list.splice(to, 0, item);
    return to;
  }
  function flash(container, i) {
    const card = $(`[data-i="${i}"]`, container);
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  }
  // wire the "#" boxes in a list container
  function wirePositions(container, getList, render, noun) {
    container.addEventListener('change', e => {
      if (!e.target.matches('[data-pos]')) return;
      const list = getList(), from = +e.target.closest('[data-i]').dataset.i;
      const to = moveTo(list, from, e.target.value);
      if (to < 0) { e.target.value = from + 1; return; }
      render(); flash(container, to);
      toast(`${noun} moved to #${to + 1}. Remember to save.`);
    });
    container.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('[data-pos]')) { e.preventDefault(); e.target.blur(); }
    });
  }

  /* ---------- images: shrink in the browser, then upload ---------- */
  function decode(file) {
    if ('createImageBitmap' in window) {
      return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => decodeViaImg(file));
    }
    return decodeViaImg(file);
  }
  function decodeViaImg(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = () => { URL.revokeObjectURL(url); resolve(im); };
      im.onerror = () => { URL.revokeObjectURL(url); reject(new Error(`Couldn't read "${file.name}". Please use a JPG or PNG photo.`)); };
      im.src = url;
    });
  }
  async function resize(file, maxSide) {
    const src = await decode(file);
    const w0 = src.width, h0 = src.height;
    const k = Math.min(1, maxSide / Math.max(w0, h0));
    const w = Math.round(w0 * k), h = Math.round(h0 * k);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
    ctx.drawImage(src, 0, 0, w, h);
    if (src.close) src.close();
    let q = 0.86, blob;
    do {
      blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q));
      q -= 0.12;
    } while (blob && blob.size > 2.8 * 1024 * 1024 && q > 0.4);
    if (!blob) throw new Error('Could not process this photo');
    return blob;
  }
  async function upload(file, maxSide) {
    const blob = await resize(file, maxSide);
    const j = await api('/api/upload', { method: 'POST', raw: blob });
    return j.url;
  }
  function pickFiles(multiple) {
    return new Promise(resolve => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = !!multiple;
      inp.addEventListener('change', () => resolve(Array.from(inp.files || [])));
      inp.click();
    });
  }
  async function withBusy(fn) {
    busy++; updateStatus();
    try { return await fn(); }
    finally { busy--; updateStatus(); }
  }

  /* ---------- status + save ---------- */
  function updateStatus() {
    const st = $('#saveStatus'), btn = $('#saveBtn');
    const dirty = isDirty();
    st.classList.toggle('dirty', dirty || busy > 0);
    st.textContent = busy > 0 ? 'Uploading photo…' : saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved';
    btn.disabled = !dirty || busy > 0 || saving;
    $('#nProducts').textContent = state ? state.products.length : '';
    $('#nCategories').textContent = state ? state.categories.length : '';
    $('#nServices').textContent = state ? state.services.length : '';
    $('#nGallery').textContent = state ? state.gallery.length : '';
    $('#nReviews').textContent = state ? state.testimonials.length : '';
  }

  function goTo(tab, container, i, msg) {
    setTab(tab);
    if (container && i > -1) setTimeout(() => flash(container, i), 60);
    toast(msg, 4500);
  }

  async function save() {
    // friendly checks before the server's own validation
    const catIds = new Set(state.categories.map(c => c.id));
    const badCat = state.categories.findIndex(c => !String(c.name).trim());
    if (badCat > -1) return goTo('categories', $('#categoryList'), badCat, `Category #${badCat + 1} needs a name.`);
    const missing = state.products.findIndex(p => !p.img || !String(p.name || '').trim());
    if (missing > -1) {
      $('#pSearch').value = ''; $('#pCat').value = ''; renderProducts();
      return goTo('products', $('#productList'), missing, `Bag #${missing + 1} needs a photo and a name before saving.`);
    }
    const noCat = state.products.findIndex(p => !catIds.has(p.cat));
    if (noCat > -1) {
      $('#pSearch').value = ''; $('#pCat').value = ''; renderProducts();
      return goTo('products', $('#productList'), noCat, `Choose a category for bag #${noCat + 1}.`);
    }
    const badPrice = state.products.findIndex(p => !(+p.price >= 0) || p.price === '');
    if (badPrice > -1) {
      $('#pSearch').value = ''; $('#pCat').value = ''; renderProducts();
      return goTo('products', $('#productList'), badPrice, `Check the price of bag #${badPrice + 1} (use 0 for "price on request").`);
    }
    const svc = state.services.findIndex(s => !s.img || !String(s.t).trim());
    if (svc > -1) return goTo('services', $('#serviceList'), svc, `Service #${svc + 1} needs a photo and a title before saving.`);
    const rev = state.testimonials.findIndex(t => !String(t.n).trim() || !String(t.q).trim());
    if (rev > -1) return goTo('reviews', $('#reviewList'), rev, `Review #${rev + 1} needs a name and the review text.`);
    const c = state.contact;
    if (!/^\d{11,15}$/.test(c.whatsapp)) return goTo('contact', null, -1, 'Enter a valid WhatsApp number (10 digits).');
    if (!/^\d{11,15}$/.test(c.phone)) return goTo('contact', null, -1, 'Enter a valid call number (10 digits).');
    if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) return goTo('contact', null, -1, 'Enter a valid email address.');
    const badDay = state.hours.findIndex(h => !h.closed && (!h.open || !h.close || h.close <= h.open));
    if (badDay > -1) return goTo('contact', null, -1, `${DAY_NAMES[badDay]}: the closing time must be after the opening time.`);

    saving = true; updateStatus();
    try {
      const content = JSON.parse(snap());
      await api('/api/content', { method: 'PUT', json: { content } });
      savedSnap = snap();
      [state.products, state.services, state.testimonials].forEach(l => l.forEach(x => delete x._new));
      renderProducts(); renderServices(); renderReviews();
      toast('Saved. The website now shows your changes.');
    } catch (e) {
      toast(e.message, 5000);
    } finally {
      saving = false; updateStatus();
    }
  }

  /* ---------- tabs ---------- */
  function setTab(name) {
    $$('.adm-tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
    $$('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== name; });
    const active = $(`.adm-tabs [data-tab="${name}"]`);
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    history.replaceState(null, '', '#' + name);
  }
  $('.adm-tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });

  /* ---------- bags ---------- */
  const catName = id => (state.categories.find(c => c.id === id) || {}).name || '';
  function productCard(p, i) {
    const n = state.products.length, known = state.categories.some(c => c.id === p.cat);
    return `
      <article class="card adm-item${p._new ? ' is-new' : ''}" data-i="${i}">
        <div class="adm-photo${p.img ? '' : ' empty'}">
          ${p.img ? `<img src="${esc(p._preview || p.img)}" alt="" loading="lazy">` : '<span>No photo yet.<br>Tap “Add photo”.</span>'}
          ${posBox(i, n)}
          ${p._busy ? '<span class="adm-busy">Uploading…</span>' : ''}
          <div class="adm-photo-tools">
            <button type="button" class="adm-chip" data-act="photo">${p.img ? 'Change photo' : 'Add photo'}</button>
            <button type="button" class="adm-chip" data-act="detail" title="Shown when a visitor taps the bag">${p.detail ? `<img src="${esc(p.detail)}" alt="">` : ''}Detail photo</button>
          </div>
        </div>
        <div class="adm-body">
          <div class="field"><label>Bag name</label><input data-f="name" value="${esc(p.name)}" maxlength="60" placeholder="e.g. Trolley Set of 3"></div>
          <div class="adm-row">
            <div class="field"><label>Category</label><select data-f="cat">${known ? '' : '<option value="" selected>Choose…</option>'}${state.categories.map(c => `<option value="${esc(c.id)}"${p.cat === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
            <div class="field"><label>Price (0 = ask)</label><div class="adm-price"><span>₹</span><input data-f="price" type="number" min="0" step="1" inputmode="numeric" value="${esc(p.price)}"></div></div>
          </div>
          <div class="field"><label>Colour / details</label><input data-f="note" value="${esc(p.note)}" maxlength="60" placeholder="e.g. Navy · Hard shell"></div>
        </div>
        <div class="adm-actions">
          <button type="button" data-act="del" class="adm-del">Delete bag</button>
        </div>
      </article>`;
  }
  function renderCatFilter() {
    const sel = $('#pCat'), cur = sel.value;
    const count = id => state.products.filter(p => p.cat === id).length;
    sel.innerHTML = `<option value="">All categories (${state.products.length})</option>` +
      state.categories.map(c => `<option value="${esc(c.id)}">${esc(c.name)} (${count(c.id)})</option>`).join('');
    sel.value = state.categories.some(c => c.id === cur) ? cur : '';
  }
  function renderProducts() {
    renderCatFilter();
    const q = $('#pSearch').value.trim().toLowerCase(), cat = $('#pCat').value;
    const items = state.products.map((p, i) => [p, i])
      .filter(([p]) => (!cat || p.cat === cat) && (!q || `${p.name} ${p.note} ${catName(p.cat)}`.toLowerCase().includes(q)));
    $('#productList').innerHTML = items.length
      ? items.map(([p, i]) => productCard(p, i)).join('')
      : '<p class="adm-empty">No bags match. Try another category or search.</p>';
    updateStatus();
  }
  $('#pSearch').addEventListener('input', renderProducts);
  $('#pCat').addEventListener('change', renderProducts);
  wirePositions($('#productList'), () => state.products, renderProducts, 'Bag');

  $('#productList').addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    const i = +e.target.closest('[data-i]').dataset.i;
    const v = e.target.value;
    state.products[i][f] = f === 'price' ? (v === '' ? '' : Math.round(+v)) : v;
    updateStatus();
  });
  $('#productList').addEventListener('change', e => { if (e.target.dataset.f === 'cat') renderCatFilter(); });

  $('#productList').addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const i = +b.closest('[data-i]').dataset.i;
    const list = state.products, p = list[i];
    const act = b.dataset.act;

    if (act === 'del') {
      if (!confirm(`Delete bag "${p.name || 'new bag'}"? It will disappear from the website after you save.`)) return;
      list.splice(i, 1); renderProducts();
    } else if (act === 'photo' || act === 'detail') {
      const [file] = await pickFiles(false); if (!file) return;
      const key = act === 'photo' ? 'img' : 'detail';
      p._busy = true; renderProducts();
      try {
        const url = await withBusy(() => upload(file, act === 'photo' ? 1200 : 1800));
        p[key] = url;
        toast(act === 'photo' ? 'Photo updated. Remember to save.' : 'Detail photo updated. Remember to save.');
      } catch (err) { toast(err.message, 5000); }
      finally { delete p._busy; renderProducts(); }
    }
  });

  $('#addProduct').addEventListener('click', () => {
    const cat = $('#pCat').value || (state.categories[0] || {}).id || '';
    state.products.unshift({ name: '', cat, note: '', price: 0, img: '', detail: '', _new: true });
    $('#pSearch').value = '';
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const inp = $('#productList [data-i="0"] input[data-f="name"]'); if (inp) inp.focus();
    toast('New bag added at #1. Add a photo, name and category, then save.', 4000);
  });

  /* ---------- categories ---------- */
  function renderCategories() {
    const n = state.categories.length;
    const count = id => state.products.filter(p => p.cat === id).length;
    $('#categoryList').innerHTML = state.categories.map((c, i) => {
      const k = count(c.id);
      return `
        <div class="adm-cat-row" data-i="${i}">
          ${posBox(i, n)}
          <input class="adm-cat-name" data-f="name" value="${esc(c.name)}" maxlength="30" aria-label="Category name">
          <button type="button" class="adm-cat-count" data-act="view" title="Show these bags">${k} bag${k === 1 ? '' : 's'}</button>
          <button type="button" class="adm-icon-btn adm-del" data-act="del" aria-label="Delete category ${esc(c.name)}">Delete</button>
        </div>`;
    }).join('');
    updateStatus();
  }
  wirePositions($('#categoryList'), () => state.categories, () => { renderCategories(); renderProducts(); }, 'Category');
  $('#categoryList').addEventListener('input', e => {
    if (e.target.dataset.f !== 'name') return;
    state.categories[+e.target.closest('[data-i]').dataset.i].name = e.target.value;
    updateStatus();
  });
  $('#categoryList').addEventListener('change', e => { if (e.target.dataset.f === 'name') renderProducts(); });
  $('#categoryList').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const i = +b.closest('[data-i]').dataset.i, c = state.categories[i];
    if (b.dataset.act === 'view') {
      $('#pSearch').value = ''; renderProducts(); $('#pCat').value = c.id; renderProducts(); setTab('products');
      return;
    }
    if (state.categories.length === 1) return toast('Keep at least one category.', 3500);
    const bags = state.products.filter(p => p.cat === c.id);
    const other = state.categories.find(x => x.id !== c.id);
    const msg = bags.length
      ? `Delete "${c.name}"? Its ${bags.length} bag${bags.length === 1 ? '' : 's'} will move to "${other.name}". You can change them later.`
      : `Delete the empty category "${c.name}"?`;
    if (!confirm(msg)) return;
    bags.forEach(p => { p.cat = other.id; });
    state.categories.splice(i, 1);
    renderCategories(); renderProducts();
    toast('Category deleted. Remember to save.');
  });
  $('#addCategoryForm').addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('#newCategory'), name = inp.value.trim().replace(/\s+/g, ' ');
    if (!name) { inp.focus(); return toast('Type a name for the new category.'); }
    if (state.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return toast(`"${name}" already exists.`);
    if (state.categories.length >= 40) return toast('You can have up to 40 categories.');
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'cat';
    let id = base, k = 2;
    while (state.categories.some(c => c.id === id)) id = `${base}-${k++}`;
    state.categories.push({ id, name });
    inp.value = '';
    renderCategories(); renderProducts();
    flash($('#categoryList'), state.categories.length - 1);
    toast(`"${name}" added. Choose it on a bag in the Bags tab, then save.`, 4000);
  });

  /* ---------- services ---------- */
  function serviceCard(s, i) {
    const n = state.services.length;
    return `
      <article class="card adm-item${s._new ? ' is-new' : ''}" data-i="${i}">
        <div class="adm-photo${s.img ? '' : ' empty'}">
          ${s.img ? `<img src="${esc(s.img)}" alt="" loading="lazy">` : '<span>No photo yet.<br>Tap “Add photo”.</span>'}
          ${posBox(i, n)}
          ${s._busy ? '<span class="adm-busy">Uploading…</span>' : ''}
          <div class="adm-photo-tools">
            <button type="button" class="adm-chip" data-act="photo">${s.img ? 'Change photo' : 'Add photo'}</button>
          </div>
        </div>
        <div class="adm-body">
          <div class="field"><label>Title</label><input data-f="t" value="${esc(s.t)}" maxlength="80" placeholder="e.g. Corporate Gifting"></div>
          <div class="field"><label>Description</label><textarea data-f="d" maxlength="300" placeholder="One or two short lines about this service">${esc(s.d)}</textarea></div>
        </div>
        <div class="adm-actions">
          <button type="button" data-act="del" class="adm-del">Delete service</button>
        </div>
      </article>`;
  }
  function renderServices() {
    $('#serviceList').innerHTML = state.services.length
      ? state.services.map(serviceCard).join('')
      : '<p class="adm-empty">No services. The Services section is hidden on the website until you add one.</p>';
    updateStatus();
  }
  wirePositions($('#serviceList'), () => state.services, renderServices, 'Service');

  $('#serviceList').addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    state.services[+e.target.closest('[data-i]').dataset.i][f] = e.target.value;
    updateStatus();
  });

  $('#serviceList').addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const i = +b.closest('[data-i]').dataset.i;
    const list = state.services, s = list[i];
    const act = b.dataset.act;

    if (act === 'del') {
      if (s._busy) return;
      if (!confirm(`Delete service "${s.t || 'new service'}"? It will disappear from the website after you save.`)) return;
      list.splice(i, 1); renderServices();
    } else if (act === 'photo') {
      const [file] = await pickFiles(false); if (!file) return;
      s._busy = true; renderServices();
      try {
        s.img = await withBusy(() => upload(file, 1000));
        toast('Photo updated. Remember to save.');
      } catch (err) { toast(err.message, 5000); }
      finally { delete s._busy; renderServices(); }
    }
  });

  $('#addService').addEventListener('click', () => {
    if (state.services.length >= 30) return toast('You can have up to 30 services. Delete one to add another.', 4000);
    state.services.unshift({ t: '', d: '', img: '', _new: true });
    renderServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const inp = $('#serviceList [data-i="0"] input[data-f="t"]'); if (inp) inp.focus();
    toast('New service added at #1. Add a photo, title and description, then save.', 4000);
  });

  /* ---------- gallery ---------- */
  function galleryCard(g, i) {
    const n = state.gallery.length;
    const bg = /^#[0-9a-f]{3,8}$/i.test(g.bg || '') ? `background:${g.bg}` : '';
    return `
      <article class="card adm-item" data-i="${i}">
        <div class="adm-photo" style="${bg}">
          <img src="${esc(g._preview || g.thumb)}" alt="" loading="lazy" style="object-fit:${g.fit === 'contain' ? 'contain' : 'cover'}">
          ${posBox(i, n, i < 10 ? '<em>home</em>' : '')}
          ${g._busy ? '<span class="adm-busy">Uploading…</span>' : ''}
          <div class="adm-photo-tools">
            <button type="button" class="adm-chip" data-act="fit">${g.fit === 'contain' ? 'Whole photo' : 'Fill frame'}</button>
          </div>
        </div>
        <div class="adm-body">
          <div class="field"><label>Description</label><input data-f="alt" value="${esc(g.alt)}" maxlength="200" placeholder="What is in the photo"></div>
        </div>
        <div class="adm-actions">
          <button type="button" data-act="del" class="adm-del">Delete photo</button>
        </div>
      </article>`;
  }
  function renderGallery() {
    $('#galleryList').innerHTML = state.gallery.length
      ? state.gallery.map(galleryCard).join('')
      : '<p class="adm-empty">No photos yet. Use “Add photos”.</p>';
    updateStatus();
  }
  wirePositions($('#galleryList'), () => state.gallery, renderGallery, 'Photo');
  $('#galleryList').addEventListener('input', e => {
    if (e.target.dataset.f !== 'alt') return;
    state.gallery[+e.target.closest('[data-i]').dataset.i].alt = e.target.value;
    updateStatus();
  });
  $('#galleryList').addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const i = +b.closest('[data-i]').dataset.i, list = state.gallery;
    const act = b.dataset.act;
    if (act === 'del') {
      if (list[i]._busy) return;
      if (!confirm('Delete this photo from the gallery? It will disappear from the website after you save.')) return;
      list.splice(i, 1);
    } else if (act === 'fit') {
      list[i].fit = list[i].fit === 'contain' ? 'cover' : 'contain';
    }
    renderGallery();
  });

  $('#galleryFiles').addEventListener('change', async e => {
    const files = Array.from(e.target.files || []); e.target.value = '';
    if (!files.length) return;
    // new photos go first, so they show on the home page
    const items = files.map(f => ({ thumb: '', full: '', alt: 'Bag from Suyog Enterprises', fit: 'cover', bg: '', _busy: true, _preview: URL.createObjectURL(f), _file: f }));
    state.gallery.unshift(...items);
    renderGallery();
    let ok = 0;
    for (const it of items) {
      try {
        await withBusy(async () => {
          it.thumb = await upload(it._file, 640);
          it.full = await upload(it._file, 1800);
        });
        ok++;
      } catch (err) {
        state.gallery.splice(state.gallery.indexOf(it), 1);
        toast(err.message, 5000);
      }
      URL.revokeObjectURL(it._preview);
      delete it._busy; delete it._preview; delete it._file;
      renderGallery();
    }
    if (ok) toast(`${ok} photo${ok > 1 ? 's' : ''} added at the start. Remember to save.`, 3500);
  });

  /* ---------- reviews ---------- */
  function reviewCard(t, i) {
    const n = state.testimonials.length, r = t.r || 5;
    return `
      <article class="card adm-item adm-review${t._new ? ' is-new' : ''}" data-i="${i}">
        <div class="adm-review-top">
          ${posBox(i, n)}
          <div class="adm-stars" role="group" aria-label="Stars">
            ${[1, 2, 3, 4, 5].map(k => `<button type="button" data-star="${k}" class="${k <= r ? 'on' : ''}" aria-label="${k} star${k > 1 ? 's' : ''}" aria-pressed="${k === r}">★</button>`).join('')}
          </div>
        </div>
        <div class="adm-body">
          <div class="field"><label>Customer name</label><input data-f="n" value="${esc(t.n)}" maxlength="60" placeholder="e.g. Rahul, Pune"></div>
          <div class="field"><label>Review <span class="adm-count" data-count>${String(t.q || '').length} / 400</span></label><textarea data-f="q" maxlength="400" placeholder="What did they say about your bags?">${esc(t.q)}</textarea></div>
        </div>
        <div class="adm-actions">
          <button type="button" data-act="del" class="adm-del">Delete review</button>
        </div>
      </article>`;
  }
  function renderReviews() {
    $('#reviewList').innerHTML = state.testimonials.length
      ? state.testimonials.map(reviewCard).join('')
      : '<p class="adm-empty">No reviews. The Testimonials section is hidden on the website until you add one.</p>';
    updateStatus();
  }
  wirePositions($('#reviewList'), () => state.testimonials, renderReviews, 'Review');
  $('#reviewList').addEventListener('input', e => {
    const f = e.target.dataset.f; if (!f) return;
    const card = e.target.closest('[data-i]');
    state.testimonials[+card.dataset.i][f] = e.target.value;
    if (f === 'q') $('[data-count]', card).textContent = `${e.target.value.length} / 400`;
    updateStatus();
  });
  $('#reviewList').addEventListener('click', e => {
    const star = e.target.closest('[data-star]'), b = e.target.closest('[data-act]');
    if (!star && !b) return;
    const i = +e.target.closest('[data-i]').dataset.i, t = state.testimonials[i];
    if (star) { t.r = +star.dataset.star; renderReviews(); return; }
    if (!confirm(`Delete the review from "${t.n || 'this customer'}"?`)) return;
    state.testimonials.splice(i, 1); renderReviews();
  });
  $('#addReview').addEventListener('click', () => {
    if (state.testimonials.length >= 30) return toast('You can have up to 30 reviews.', 4000);
    state.testimonials.unshift({ n: '', q: '', r: 5, _new: true });
    renderReviews();
    const inp = $('#reviewList [data-i="0"] input[data-f="n"]'); if (inp) inp.focus();
    toast('New review added at #1. Add the name and review, then save.', 4000);
  });

  /* ---------- texts ---------- */
  const textValue = k => state.texts[k] ?? '';
  const shown = k => (textValue(k).trim() || D.texts[k]);   // what the website shows (empty = original)
  function textField(k) {
    const [label, help, long, max] = TEXT_FIELDS[k], v = textValue(k);
    const changed = v.trim() !== '' && v !== D.texts[k];
    const input = long
      ? `<textarea id="t-${k}" data-k="${k}" maxlength="${max}" rows="4" placeholder="${esc(D.texts[k])}">${esc(v)}</textarea>`
      : `<input id="t-${k}" data-k="${k}" maxlength="${max}" value="${esc(v)}" placeholder="${esc(D.texts[k])}">`;
    return `
      <div class="adm-tfield${long ? ' long' : ''}">
        <div class="adm-tfield-top">
          <label for="t-${k}">${esc(label)}</label>
          <span class="adm-count" data-count="${k}">${v.length} / ${max}</span>
          <button type="button" class="adm-reset" data-reset="${k}"${changed ? '' : ' hidden'}>Reset</button>
        </div>
        ${input}
        <small>${esc(help)}</small>
      </div>`;
  }
  function previewHtml(kind) {
    if (kind === 'hero') return `
      <div class="adm-preview adm-preview-hero" aria-hidden="true">
        <span class="adm-preview-label">Preview</span>
        <span class="pv-eyebrow">${esc(shown('heroEyebrow'))}</span>
        <p class="pv-title">${esc(shown('heroTitle1'))}<br><em>${esc(shown('heroTitle2'))}</em></p>
        <p class="pv-lead">${esc(shown('heroLead'))}</p>
      </div>`;
    if (kind === 'about') return `
      <div class="adm-preview adm-preview-about" aria-hidden="true">
        <span class="adm-preview-label">Preview</span>
        <span class="pv-eyebrow">About us</span>
        <p class="pv-tagline">${esc(shown('tagline'))}</p>
        <p class="pv-lead">${esc(shown('aboutText'))}</p>
      </div>`;
    return '';
  }
  function renderTexts() {
    $('#textList').innerHTML = TEXT_GROUPS.map((g, gi) => `
      <section class="card adm-tgroup${g.preview ? ' has-preview' : ''}" data-group="${gi}">
        <header class="adm-tgroup-head"><h3>${esc(g.title)}</h3><p>${esc(g.note)}</p></header>
        <div class="adm-tgroup-body">
          <div class="adm-tfields">${g.keys.map(textField).join('')}</div>
          ${g.preview ? `<div class="adm-preview-slot" data-preview="${g.preview}">${previewHtml(g.preview)}</div>` : ''}
        </div>
      </section>`).join('');
  }
  function refreshText(k) {
    const v = textValue(k), max = TEXT_FIELDS[k][3];
    $(`[data-count="${k}"]`).textContent = `${v.length} / ${max}`;
    $(`[data-reset="${k}"]`).hidden = !(v.trim() !== '' && v !== D.texts[k]);
    $$('[data-preview]').forEach(slot => { slot.innerHTML = previewHtml(slot.dataset.preview); });
  }
  $('#textList').addEventListener('input', e => {
    const k = e.target.dataset.k; if (!k) return;
    state.texts[k] = e.target.value; refreshText(k); updateStatus();
  });
  $('#textList').addEventListener('click', e => {
    const b = e.target.closest('[data-reset]'); if (!b) return;
    const k = b.dataset.reset;
    state.texts[k] = D.texts[k];
    $(`#t-${k}`).value = D.texts[k];
    refreshText(k); updateStatus();
    toast('Original text restored. Remember to save.');
  });

  /* ---------- contact & hours ---------- */
  const local = d => (/^91\d{10}$/.test(d) ? d.slice(2) : d);          // 919371814999 -> 9371814999
  const full = v => { const d = String(v).replace(/\D/g, ''); return d.length === 10 ? '91' + d : d; };
  const pretty = d => (/^91\d{10}$/.test(d) ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : d ? '+' + d : '');
  function renderContact() {
    const c = state.contact;
    $('#contactPanel').innerHTML = `
      <h3>Contact details</h3>
      <div class="adm-cfield">
        <label for="cWa">WhatsApp number</label>
        <div class="adm-phone"><span>+91</span><input id="cWa" data-c="whatsapp" type="tel" inputmode="tel" maxlength="16" value="${esc(local(c.whatsapp))}" placeholder="10-digit mobile number"></div>
        <small>Every WhatsApp button, the floating menu and the QR code use this number.</small>
        <a class="adm-test" id="waTest" href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">Test on WhatsApp: ${esc(pretty(c.whatsapp))} →</a>
      </div>
      <label class="adm-check"><input type="checkbox" id="cSame"${sameCall ? ' checked' : ''}> Use the same number for calls</label>
      <div class="adm-cfield"${sameCall ? ' hidden' : ''} id="cPhoneWrap">
        <label for="cPhone">Call number</label>
        <div class="adm-phone"><span>+91</span><input id="cPhone" data-c="phone" type="tel" inputmode="tel" maxlength="16" value="${esc(local(c.phone))}" placeholder="10-digit mobile number"></div>
        <small>Used by the Call buttons and shown in "Get in Touch".</small>
      </div>
      <div class="adm-cfield">
        <label for="cEmail">Email</label>
        <input id="cEmail" data-c="email" type="email" maxlength="120" value="${esc(c.email)}" placeholder="name@example.com">
      </div>`;
  }
  $('#contactPanel').addEventListener('input', e => {
    const k = e.target.dataset.c;
    if (k === 'email') state.contact.email = e.target.value.trim();
    else if (k) {
      state.contact[k] = full(e.target.value);
      if (k === 'whatsapp' && sameCall) state.contact.phone = state.contact.whatsapp;
      if (k === 'whatsapp') {
        const a = $('#waTest'); a.href = `https://wa.me/${state.contact.whatsapp}`; a.textContent = `Test on WhatsApp: ${pretty(state.contact.whatsapp)} →`;
      }
    }
    updateStatus();
  });
  $('#contactPanel').addEventListener('change', e => {
    if (e.target.id !== 'cSame') return;
    sameCall = e.target.checked;
    if (sameCall) state.contact.phone = state.contact.whatsapp;
    renderContact(); updateStatus();
  });

  function renderHours() {
    const row = d => {
      const h = state.hours[d];
      return `
        <div class="adm-hours-row${h.closed ? ' closed' : ''}" data-d="${d}">
          <span class="adm-day">${DAY_NAMES[d]}</span>
          <label class="adm-switch"><input type="checkbox" data-h="open-toggle"${h.closed ? '' : ' checked'}><span class="adm-switch-ui"></span><span class="adm-switch-txt">${h.closed ? 'Closed' : 'Open'}</span></label>
          <span class="adm-times">
            <input type="time" data-h="open" value="${esc(h.open)}" step="900" aria-label="${DAY_NAMES[d]} opens"${h.closed ? ' disabled' : ''}>
            <span>to</span>
            <input type="time" data-h="close" value="${esc(h.close)}" step="900" aria-label="${DAY_NAMES[d]} closes"${h.closed ? ' disabled' : ''}>
          </span>
        </div>`;
    };
    $('#hoursPanel').innerHTML = `
      <div class="adm-hours-head"><h3>Opening hours</h3><button type="button" class="adm-chip" id="copyMon">Copy Monday to all open days</button></div>
      <p class="adm-muted">Used for the hours list, the "Open now" badge and the times offered in "Book a Visit".</p>
      <div class="adm-hours">${[1, 2, 3, 4, 5, 6, 0].map(row).join('')}</div>`;
  }
  $('#hoursPanel').addEventListener('change', e => {
    const r = e.target.closest('[data-d]'); if (!r) return;
    const h = state.hours[+r.dataset.d], k = e.target.dataset.h;
    if (k === 'open-toggle') { h.closed = !e.target.checked; renderHours(); }
    else if (k === 'open' || k === 'close') {
      h[k] = e.target.value;
      if (!h.closed && h.close <= h.open) toast(`${DAY_NAMES[+r.dataset.d]}: the closing time must be after the opening time.`, 3500);
    }
    updateStatus();
  });
  $('#hoursPanel').addEventListener('click', e => {
    if (e.target.id !== 'copyMon') return;
    const m = state.hours[1];
    state.hours.forEach((h, d) => { if (d !== 1 && !h.closed) { h.open = m.open; h.close = m.close; } });
    renderHours(); updateStatus();
    toast("Monday's hours copied to every open day. Remember to save.");
  });

  /* ---------- load editor ---------- */
  async function loadEditor() {
    if (state && isDirty()) { show('app'); return; } // came back after a re-login: keep unsaved edits
    show('loading');
    let content = null;
    try { content = (await api('/api/content?fresh=1')).content; }
    catch (e) { show('app'); toast('Could not load saved content: ' + e.message, 6000); }
    const base = clone(D), c = content || {};
    state = {
      texts: Object.assign({}, base.texts, c.texts || {}),
      services: Array.isArray(c.services) ? c.services : base.services,
      products: Array.isArray(c.products) ? c.products : base.products,
      gallery: Array.isArray(c.gallery) ? c.gallery : base.gallery,
      categories: Array.isArray(c.categories) && c.categories.length ? c.categories : base.categories,
      testimonials: Array.isArray(c.testimonials) ? c.testimonials : base.testimonials,
      hours: Array.isArray(c.hours) && c.hours.length === 7 ? c.hours : base.hours,
      contact: Object.assign({}, base.contact, c.contact || {})
    };
    sameCall = state.contact.phone === state.contact.whatsapp;
    // nothing saved yet (or saved before these settings existed): count as unsaved so Save stores everything
    savedSnap = content && c.categories && c.hours && c.contact && c.testimonials ? snap() : '';
    renderProducts(); renderCategories(); renderServices(); renderGallery(); renderReviews(); renderTexts(); renderContact(); renderHours();
    const tab = location.hash.slice(1);
    setTab(TABS.includes(tab) ? tab : 'products');
    show('app');
    updateStatus();
  }

  /* ---------- login / logout ---------- */
  function showLogin(msg) {
    const err = $('#loginError');
    err.hidden = !msg; err.textContent = msg || '';
    show('login');
    setTimeout(() => $('#lPhone').focus(), 50);
  }
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const phone = $('#lPhone').value, password = $('#lPass').value;
    const err = $('#loginError'), btn = $('#loginBtn');
    if (!phone.trim() || !password) { err.textContent = 'Enter your mobile number and password.'; err.hidden = false; return; }
    btn.disabled = true; btn.textContent = 'Logging in…'; err.hidden = true;
    try {
      await api('/api/auth', { method: 'POST', json: { phone, password } });
      $('#lPass').value = '';
      await loadEditor();
    } catch (ex) {
      err.textContent = ex.message; err.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = 'Log in';
    }
  });
  $('#logoutBtn').addEventListener('click', async () => {
    if (isDirty() && !confirm('You have unsaved changes. Log out anyway and lose them?')) return;
    try { await api('/api/auth', { method: 'DELETE' }); } catch {}
    state = null; savedSnap = '';
    showLogin();
  });
  $('#saveBtn').addEventListener('click', save);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && state) { e.preventDefault(); if (!$('#saveBtn').disabled) save(); }
  });
  window.addEventListener('beforeunload', e => { if (isDirty() || busy) { e.preventDefault(); e.returnValue = ''; } });

  /* ---------- start ---------- */
  (async () => {
    try {
      const { admin } = await api('/api/auth');
      if (admin) await loadEditor(); else showLogin();
    } catch { showLogin('Could not reach the server. Check your internet connection and reload.'); }
  })();
})();
