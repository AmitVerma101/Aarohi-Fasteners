// ── PRODUCT DATA ──
const products = [
  { id: 1,  name: 'Hex Bolts',         category: 'Bolts',          badge: 'Popular', featured: true,
    color: '#dce6f5', shape: '<polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#1a3a7a" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 2,  name: 'Coach Bolts',       category: 'Bolts',          badge: null,      featured: true,
    color: '#e8eef8', shape: '<rect x="42" y="20" width="16" height="10" rx="2" fill="none" stroke="#1a3a7a" stroke-width="2"/><line x1="50" y1="30" x2="50" y2="80" stroke="#1a3a7a" stroke-width="3"/>' },
  { id: 3,  name: 'Dowel Pins',        category: 'Dowel Pins',     badge: 'New',     featured: true,
    color: '#f0f4fa', shape: '<rect x="38" y="15" width="24" height="70" rx="12" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 4,  name: 'Socket Grub Screw', category: 'Grub Screws',    badge: null,      featured: true,
    color: '#dce6f5', shape: '<circle cx="50" cy="50" r="28" fill="none" stroke="#1a3a7a" stroke-width="2"/><line x1="35" y1="50" x2="65" y2="50" stroke="#1a3a7a" stroke-width="2"/><line x1="50" y1="35" x2="50" y2="65" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 5,  name: 'Pan Head Screws',   category: 'Machine Screws', badge: 'Popular', featured: false,
    color: '#e8eef8', shape: '<ellipse cx="50" cy="30" rx="22" ry="10" fill="none" stroke="#1a3a7a" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="82" stroke="#1a3a7a" stroke-width="3"/><line x1="40" y1="82" x2="60" y2="82" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 6,  name: 'Countersunk Screws',category: 'Machine Screws', badge: null,      featured: false,
    color: '#f0f4fa', shape: '<path d="M35,25 L65,25 L55,45 L45,45 Z" fill="none" stroke="#1a3a7a" stroke-width="2"/><line x1="50" y1="45" x2="50" y2="80" stroke="#1a3a7a" stroke-width="3"/>' },
  { id: 7,  name: 'Hex Nuts',          category: 'Nuts',           badge: 'Popular', featured: false,
    color: '#dce6f5', shape: '<polygon points="50,18 76,33 76,67 50,82 24,67 24,33" fill="none" stroke="#1a3a7a" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 8,  name: 'Nyloc Nuts',        category: 'Nuts',           badge: null,      featured: false,
    color: '#e8eef8', shape: '<polygon points="50,18 76,33 76,67 50,82 24,67 24,33" fill="none" stroke="#1a3a7a" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="none" stroke="#c9a84c" stroke-width="2"/>' },
  { id: 9,  name: 'Wing Nuts',         category: 'Nuts',           badge: null,      featured: false,
    color: '#f0f4fa', shape: '<circle cx="50" cy="55" r="12" fill="none" stroke="#1a3a7a" stroke-width="2"/><path d="M38,50 Q20,30 25,20 Q35,35 38,50" fill="none" stroke="#1a3a7a" stroke-width="2"/><path d="M62,50 Q80,30 75,20 Q65,35 62,50" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 10, name: 'Flange Nuts',       category: 'Nuts',           badge: null,      featured: false,
    color: '#dce6f5', shape: '<ellipse cx="50" cy="68" rx="28" ry="8" fill="none" stroke="#1a3a7a" stroke-width="2"/><polygon points="50,22 70,34 70,58 50,70 30,58 30,34" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
  { id: 11, name: 'Cup Point Grub',    category: 'Grub Screws',    badge: null,      featured: false,
    color: '#e8eef8', shape: '<circle cx="50" cy="50" r="28" fill="none" stroke="#1a3a7a" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="#1a3a7a" opacity=".4"/>' },
  { id: 12, name: 'Taper Dowel Pins',  category: 'Dowel Pins',     badge: 'New',     featured: false,
    color: '#f0f4fa', shape: '<path d="M42,20 L58,20 L62,80 L38,80 Z" fill="none" stroke="#1a3a7a" stroke-width="2"/>' },
];

// ── NAV ACTIVE STATE ──
function setActiveNav() {
  // Use pathname segments to detect current page
  const path = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const hrefSegment = a.getAttribute('href').replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
    a.classList.toggle('active', hrefSegment === path && hrefSegment !== '');
  });
}

// ── STICKY NAV SHADOW ──
function initScrollNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── SCROLL FADE-IN ANIMATIONS ──
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ── SHARED NAV HTML ──
// Topbar + main nav wrapped in a sticky header — no pixel hacks, works on all screen sizes
function renderNav() {
  return `
  <header id="site-header">

    <div class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <span class="topbar-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            123 Your Street, City, Country
          </span>
          <span class="topbar-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
            <a href="mailto:hello@hbsfasteners.com">hello@hbsfasteners.com</a>
          </span>
          <span class="topbar-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            <a href="tel:+00000000000">+00 0000 000 000</a>
          </span>
        </div>
        <div class="topbar-right">
          <a href="#" class="topbar-social" title="LinkedIn" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="#" class="topbar-social" title="Facebook" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" class="topbar-social" title="Instagram" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
          <a href="https://wa.me/YOUR_PHONE_NUMBER" class="topbar-social" title="WhatsApp" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.466 0 9.882 4.415 9.882 9.882 0 5.466-4.416 9.882-9.882 9.882z"/></svg>
          </a>
        </div>
      </div>
    </div>

    <nav id="navbar">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <img src="/images/logo.png" alt="HBS" class="nav-logo-img" onerror="this.style.display='none'">
          <span class="nav-logo-text">
            HBS Fasteners
            <span class="nav-logo-sub">Precision Fastening Solutions</span>
          </span>
        </a>
        <ul class="nav-links">
          <li><a href="/products/">Products</a></li>
          <li><a href="/catalogue/">Catalogue</a></li>
          <li><a href="/about/">About</a></li>
          <li><a href="/contact/">Contact</a></li>
        </ul>
        <a href="https://wa.me/YOUR_PHONE_NUMBER" target="_blank" class="nav-cta nav-whatsapp">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:.35rem;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.378l-.361-.214-3.741.981.998-3.648-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.466 0 9.882 4.415 9.882 9.882 0 5.466-4.416 9.882-9.882 9.882z"/></svg>
          WhatsApp
        </a>
      </div>
    </nav>

  </header>`;
}

// ── SHARED FOOTER HTML ──
function renderFooter() {
  return `
  <footer class="site-footer-shared">
    <div class="footer-shared-inner">
      <div class="footer-shared-brand">
        <a href="/" class="footer-shared-logo">HBS Fasteners</a>
        <p>Precision fastening solutions built on legacy, quality and trust.</p>
      </div>
      <nav class="footer-shared-links">
        <a href="/products/">Products</a>
        <a href="/catalogue/">Catalogue</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
      </nav>
      <p class="footer-shared-copy">© 2025 HBS Fasteners. All rights reserved.</p>
    </div>
  </footer>`;
}

// ── PRODUCT CARD HTML ──
function productCardHTML(p) {
  return `
    <div class="product-card fade-in">
      <div class="product-img" style="background:${p.color}">
        <div class="product-img-inner">
          <svg width="100" height="100" viewBox="0 0 100 100" class="shape">${p.shape}</svg>
        </div>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <div>
          <div class="product-name">${p.name}</div>
          <div class="product-category">${p.category}</div>
        </div>
      </div>
    </div>`;
}

// ── CATALOGUE ITEM HTML ──
function catalogueItemHTML(p) {
  const el = document.createElement('div');
  el.className = 'catalogue-item fade-in';
  el.dataset.cat = p.category;
  el.innerHTML = `
    <div class="catalogue-img" style="background:${p.color}">
      <svg width="80" height="80" viewBox="0 0 100 100" class="shape">${p.shape}</svg>
    </div>
    <div class="catalogue-body">
      <div class="catalogue-name">${p.name}</div>
      <div class="catalogue-meta">${p.category}${p.badge ? ' · ' + p.badge : ''}</div>
    </div>`;
  return el;
}

// ── INIT ON LOAD ──
document.addEventListener('DOMContentLoaded', () => {
  // replaceWith puts <header>/<footer> directly in the DOM — not nested inside a div.
  // This is required for position:sticky to work correctly.
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) {
    const tmp = document.createElement('div');
    tmp.innerHTML = renderNav();
    navEl.replaceWith(tmp.firstElementChild);
  }

  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) {
    const tmp = document.createElement('div');
    tmp.innerHTML = renderFooter();
    footerEl.replaceWith(tmp.firstElementChild);
  }

  setActiveNav();
  initScrollNav();
  initFadeIn();
});