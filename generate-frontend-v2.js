import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const STYLES_DIR = './src/styles';
const COMPONENTS_DIR = './src/components';
const PAGES_DIR = './src/pages';
const LIB_DIR = './src/lib';

// 1. variables.css
fs.writeFileSync(path.join(STYLES_DIR, 'variables.css'), `
:root {
  /* Colors - Premium Dark Coffee Theme */
  --color-bg-dark: #0A0908;
  --color-bg-card: #151312;
  --color-bg-card-hover: #1E1C1A;
  
  --color-primary: #D4A373; /* Warm latte */
  --color-primary-dark: #A98460;
  --color-secondary: #FAEDCD; /* Cream */
  --color-accent: #E9EDC9;
  
  --color-text-main: #FEFAE0;
  --color-text-muted: #A8A196;
  
  --color-border: rgba(254, 250, 224, 0.08);
  --color-glass: rgba(21, 19, 18, 0.6);

  /* Typography */
  --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 80px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0,0,0,0.3);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 16px 40px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 24px rgba(212, 163, 115, 0.15);
  --shadow-glow-strong: 0 0 32px rgba(212, 163, 115, 0.3);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
`);

// 2. global.css
fs.writeFileSync(path.join(STYLES_DIR, 'global.css'), `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-dark);
  color: var(--color-text-main);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

a {
  color: inherit;
  text-decoration: none;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-panel {
  background: var(--color-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg-dark);
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp var(--transition-slow) forwards;
}
`);

// 3. components.css
fs.writeFileSync(path.join(STYLES_DIR, 'components.css'), `
/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: all var(--transition-normal);
}

.navbar.scrolled {
  background: rgba(10, 9, 8, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  padding: var(--space-sm) var(--space-lg);
}

.navbar-brand h1 {
  font-size: 1.5rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.navbar-nav {
  display: flex;
  gap: var(--space-xl);
  align-items: center;
}

.navbar-nav a {
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
  position: relative;
}

.navbar-nav a:hover, .navbar-nav a.active {
  color: var(--color-text-main);
}

.navbar-nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--transition-normal);
}

.navbar-nav a.active::after {
  width: 100%;
}

/* Cafe Card */
.cafe-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}

.cafe-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-glow);
  border-color: rgba(212, 163, 115, 0.3);
  background: var(--color-bg-card-hover);
}

.cafe-card-image {
  height: 220px;
  position: relative;
  overflow: hidden;
}

.cafe-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.cafe-card:hover .cafe-card-image img {
  transform: scale(1.05);
}

.cafe-card-badge {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: rgba(10, 9, 8, 0.85);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(212, 163, 115, 0.2);
  box-shadow: var(--shadow-sm);
}

.cafe-card-content {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.cafe-card-title {
  font-size: 1.25rem;
  margin-bottom: var(--space-xs);
  color: var(--color-text-main);
}

.cafe-card-address {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.4;
}

.cafe-card-footer {
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1rem;
  transition: all var(--transition-normal);
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg-dark);
  box-shadow: 0 4px 12px rgba(212, 163, 115, 0.2);
}

.btn-primary:hover {
  background: #E5B484;
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-strong);
}

/* Chip/Tag */
.chip {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.chip:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-main);
}

.chip.active {
  background: rgba(212, 163, 115, 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Footer */
.footer {
  margin-top: auto;
  padding: var(--space-3xl) 0;
  text-align: center;
  background: #050404;
  border-top: 1px solid var(--color-border);
}
.footer p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
`);

// 4. pages.css
fs.writeFileSync(path.join(STYLES_DIR, 'pages.css'), `
/* Home Page */
.hero {
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 0 var(--space-md);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  z-index: -2;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, var(--color-bg-dark) 100%);
  z-index: -1;
}

.hero-content {
  max-width: 800px;
  animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero h2 {
  font-size: clamp(3rem, 6vw, 5rem);
  margin-bottom: var(--space-lg);
  line-height: 1.1;
}

.hero p {
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Sections */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-xl);
}

.section-title h2 {
  font-size: 2rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-xl);
  padding: var(--space-2xl) 0 var(--space-3xl);
}

/* Explore Page - Split Screen */
.page-explore {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.explore-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  margin-top: 72px; /* Navbar height */
}

.explore-sidebar {
  width: 480px;
  min-width: 480px;
  background: var(--color-bg-dark);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: var(--shadow-lg);
}

.explore-filters {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-card);
}

.explore-filters h3 {
  margin-bottom: var(--space-md);
  font-size: 1.25rem;
}

.filter-row {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding-bottom: var(--space-sm);
}
.filter-row::-webkit-scrollbar { height: 4px; }

.cafe-list-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}

.cafe-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.explore-map {
  flex-grow: 1;
  background: #111;
  position: relative;
  z-index: 1;
}

/* Responsive Split Screen */
@media (max-width: 900px) {
  .explore-layout {
    flex-direction: column;
  }
  .explore-sidebar {
    width: 100%;
    min-width: 100%;
    height: 50vh;
  }
  .explore-map {
    height: 50vh;
  }
}

/* Detail Page */
.detail-hero {
  height: 50vh;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.detail-hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: -2;
}

.detail-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10,9,8,0.2) 0%, var(--color-bg-dark) 100%);
  z-index: -1;
}

.detail-header {
  padding: var(--space-2xl) 0;
  width: 100%;
  position: relative;
  z-index: 10;
}

.detail-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: var(--space-md);
  transition: gap var(--transition-fast);
}
.detail-back:hover { gap: 12px; }

.detail-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: var(--space-sm);
}

.detail-meta-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-glass);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  font-weight: 500;
}
.meta-badge.rating { color: #FFD700; border-color: rgba(255, 215, 0, 0.3); }
.meta-badge.price { color: #8FBC8F; }

.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-2xl);
  padding: var(--space-2xl) 0 var(--space-3xl);
}

.detail-section {
  background: var(--color-bg-card);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-lg);
}

.detail-section h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-sm);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-item {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.info-icon {
  font-size: 1.25rem;
  color: var(--color-primary-dark);
}

.info-text {
  color: var(--color-text-main);
  line-height: 1.5;
}

.info-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

@media (max-width: 900px) {
  .detail-grid { grid-template-columns: 1fr; }
}
`);

// 5. components/navbar.js
fs.writeFileSync(path.join(COMPONENTS_DIR, 'navbar.js'), `
export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar glass-panel';
  
  // Add scroll listener for styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const hash = window.location.hash || '#/';

  nav.innerHTML = \`
    <div class="navbar-brand">
      <a href="#/">
        <span style="font-size: 1.75rem;">☕</span>
        <h1 style="margin: 0; font-size: 1.25rem; letter-spacing: -0.5px;">Jakarta<span style="color: var(--color-text-main);">Caffe</span></h1>
      </a>
    </div>
    <div class="navbar-nav">
      <a href="#/" class="\${hash === '#/' ? 'active' : ''}">Beranda</a>
      <a href="#/explore" class="\${hash.startsWith('#/explore') ? 'active' : ''}">Eksplorasi</a>
    </div>
  \`;
  return nav;
}
`);

// 6. components/cafe-card.js
fs.writeFileSync(path.join(COMPONENTS_DIR, 'cafe-card.js'), `
export function createCafeCard(cafe) {
  const card = document.createElement('div');
  card.className = 'cafe-card animate-fade-in-up';
  
  // Format coordinate for external map link if needed
  const mapsUrl = cafe.google_maps_url || \`https://www.google.com/maps/search/?api=1&query=\${cafe.latitude},\${cafe.longitude}\`;
  
  card.innerHTML = \`
    <div class="cafe-card-image">
      <img src="\${cafe.thumbnail}" alt="\${cafe.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'">
      <div class="cafe-card-badge">★ \${cafe.rating}</div>
    </div>
    <div class="cafe-card-content">
      <h3 class="cafe-card-title">\${cafe.name}</h3>
      <div class="cafe-card-address">
        <span style="flex-shrink: 0; color: var(--color-primary-dark);">📍</span>
        <span>\${cafe.address || 'Jakarta'}</span>
      </div>
      
      <div class="cafe-card-footer">
        <span style="color: var(--color-primary); font-weight: 500;">\${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</span>
        <span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; color: #8FBC8F; font-weight: 600;">\${cafe.price_level || '$$'}</span>
      </div>
    </div>
  \`;
  
  // Make the whole card clickable
  card.onclick = () => window.location.hash = \`/cafe/\${cafe.slug}\`;
  
  return card;
}
`);

// 7. pages/home.js
fs.writeFileSync(path.join(PAGES_DIR, 'home.js'), `
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderHome() {
  const section = document.createElement('div');
  section.className = 'page-home';
  
  // HERO
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = \`
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h2 class="text-gradient">Estetika Kopi Jakarta<br>di Ujung Jari Anda</h2>
      <p>Kurasi premium 700+ kedai kopi dan roastery terbaik se-DKI Jakarta. Temukan suasana ideal untuk bekerja, nongkrong, atau sekadar menyendiri.</p>
      <a href="#/explore" class="btn btn-primary">
        Mulai Eksplorasi 
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  \`;
  section.appendChild(hero);

  // FEATURED
  const featured = document.createElement('div');
  featured.className = 'container';
  featured.style.marginTop = 'var(--space-2xl)';
  
  featured.innerHTML = \`
    <div class="section-title">
      <h2>Top Rated <span style="color: var(--color-primary); font-weight: 300;">Cafes</span></h2>
      <a href="#/explore" style="color: var(--color-text-muted); font-weight: 500;">Lihat Semua Peta →</a>
    </div>
    <div class="featured-grid" id="home-featured-grid">
      <!-- Cards will be injected here -->
      <div style="color: var(--color-text-muted);">Memuat data kafe premium...</div>
    </div>
  \`;
  section.appendChild(featured);

  // Fetch data
  setTimeout(async () => {
    const grid = section.querySelector('#home-featured-grid');
    grid.innerHTML = '';
    const cafes = await getCafes({ limit: 6 });
    // Sort by rating roughly
    cafes.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    
    cafes.slice(0, 6).forEach((cafe, index) => {
      const card = createCafeCard(cafe);
      card.style.animationDelay = \`\${index * 100}ms\`;
      grid.appendChild(card);
    });
  }, 100);

  return section;
}
`);

// 8. pages/explore.js
fs.writeFileSync(path.join(PAGES_DIR, 'explore.js'), `
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderExplore() {
  const section = document.createElement('div');
  section.className = 'page-explore';
  
  section.innerHTML = \`
    <div class="explore-layout">
      <!-- SIDEBAR LIST -->
      <div class="explore-sidebar">
        <div class="explore-filters">
          <h3>Eksplorasi Area</h3>
          <div class="filter-row">
            <div class="chip active">Semua Area</div>
            <div class="chip">Jakarta Selatan</div>
            <div class="chip">Jakarta Pusat</div>
            <div class="chip">Jakarta Barat</div>
            <div class="chip">Jakarta Utara</div>
            <div class="chip">Jakarta Timur</div>
          </div>
        </div>
        
        <div class="cafe-list-container">
          <div class="cafe-list" id="explore-cafe-list">
            <div style="color: var(--color-text-muted); text-align: center; padding: var(--space-xl);">
              Mencari kafe terbaik...
            </div>
          </div>
        </div>
      </div>
      
      <!-- MAP -->
      <div class="explore-map" id="explore-map">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--color-text-muted); background: #111;">
          <span style="font-size: 3rem; margin-bottom: 1rem;">🗺️</span>
          <p>Sistem Peta akan dimuat (Butuh library Leaflet)</p>
          <p style="font-size: 0.875rem; opacity: 0.6; margin-top: 8px;">Peta terintegrasi dengan koordinat akurat.</p>
        </div>
      </div>
    </div>
  \`;

  // Fetch all cafes and render them
  setTimeout(async () => {
    const listContainer = section.querySelector('#explore-cafe-list');
    const cafes = await getCafes();
    listContainer.innerHTML = ''; // clear loading
    
    // Sort by name or rating to make it look nice
    cafes.sort((a,b) => (b.rating || 0) - (a.rating || 0));

    // Render first 20 to avoid DOM lag
    cafes.slice(0, 30).forEach((cafe, index) => {
      const card = createCafeCard(cafe);
      card.style.animationDelay = \`\${(index % 10) * 50}ms\`;
      listContainer.appendChild(card);
    });
  }, 100);

  return section;
}
`);

// 9. pages/detail.js
fs.writeFileSync(path.join(PAGES_DIR, 'detail.js'), `
import { getCafes } from '../lib/api.js';

export async function renderDetail(slug) {
  const section = document.createElement('div');
  section.className = 'page-detail animate-fade-in-up';
  
  // Temporary loading state
  section.innerHTML = \`<div class="container" style="padding-top: 120px; color: var(--color-text-muted);">Memuat data kafe...</div>\`;

  // Fetch data
  setTimeout(async () => {
    const cafes = await getCafes();
    const cafe = cafes.find(c => c.slug === slug);

    if (!cafe) {
      section.innerHTML = \`
        <div class="container" style="padding-top: 120px; text-align: center;">
          <h2>Kafe tidak ditemukan</h2>
          <a href="#/explore" class="btn btn-primary" style="margin-top: 24px;">Kembali Eksplorasi</a>
        </div>
      \`;
      return;
    }

    const mapsUrl = cafe.google_maps_url || \`https://www.google.com/maps/search/?api=1&query=\${cafe.latitude},\${cafe.longitude}\`;

    section.innerHTML = \`
      <!-- HERO HEADER -->
      <div class="detail-hero">
        <div class="detail-hero-bg" style="background-image: url('\${cafe.thumbnail}')"></div>
        <div class="detail-hero-overlay"></div>
        <div class="container detail-header">
          <a href="#/explore" class="detail-back">← Kembali ke Eksplorasi</a>
          <h1 class="detail-title">\${cafe.name}</h1>
          <div class="detail-meta-badges">
            <div class="meta-badge rating">★ \${cafe.rating} <span style="color: var(--color-text-muted); font-weight: 400; margin-left: 4px;">(\${cafe.total_reviews} ulasan)</span></div>
            <div class="meta-badge price">💰 \${cafe.price_level || '$$'}</div>
            <div class="meta-badge">📍 \${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="container detail-grid">
        <!-- Left Column: Info -->
        <div class="detail-main">
          
          <div class="detail-section">
            <h3>Tentang Kafe</h3>
            <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.8;">
              \${cafe.description || 'Sebuah tempat nyaman untuk menikmati kopi pilihan dan suasana santai di tengah hiruk pikuk kota Jakarta.'}
            </p>
          </div>

          <div class="detail-section">
            <h3>Informasi Kontak & Lokasi</h3>
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">📍</div>
                <div>
                  <div class="info-label">Alamat Lengkap</div>
                  <div class="info-text">\${cafe.address || 'Alamat tidak tersedia'}</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">🗺️</div>
                <div>
                  <div class="info-label">Koordinat Geografis (Dari Scraper)</div>
                  <div class="info-text">Latitude: \${cafe.latitude} <br> Longitude: \${cafe.longitude}</div>
                </div>
              </div>

              \${cafe.phone ? \`
              <div class="info-item">
                <div class="info-icon">📞</div>
                <div>
                  <div class="info-label">Telepon</div>
                  <div class="info-text">\${cafe.phone}</div>
                </div>
              </div>\` : ''}
              
              \${cafe.instagram ? \`
              <div class="info-item">
                <div class="info-icon">📸</div>
                <div>
                  <div class="info-label">Instagram</div>
                  <div class="info-text"><a href="\${cafe.instagram}" target="_blank" style="color: var(--color-primary); text-decoration: underline;">\${cafe.instagram}</a></div>
                </div>
              </div>\` : ''}
            </div>
          </div>
        </div>

        <!-- Right Column: Map & Actions -->
        <div class="detail-sidebar">
          <div class="detail-section" style="padding: var(--space-md);">
            <div style="background: #222; height: 250px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); margin-bottom: var(--space-md);">
              <div style="text-align: center;">
                <span style="font-size: 2rem;">📍</span>
                <p style="margin-top: 8px; font-size: 0.875rem;">Peta Lokasi (Placeholder)</p>
              </div>
            </div>
            <a href="\${mapsUrl}" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Buka di Google Maps ↗
            </a>
          </div>
          
          <div class="detail-section">
            <h3>Fasilitas</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: var(--space-md);">
              <div class="chip">📶 WiFi Cepat</div>
              <div class="chip">🔌 Stopkontak</div>
              <div class="chip">🅿️ Parkir Luas</div>
              <div class="chip">❄️ Full AC</div>
            </div>
          </div>
        </div>
      </div>
    \`;
  }, 50);

  return section;
}
`);

// Re-generate main.js to ensure everything is hooked up correctly
fs.writeFileSync(path.join(SRC_DIR, 'main.js'), `
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderExplore } from './pages/explore.js';
import { renderDetail } from './pages/detail.js';

const app = document.getElementById('app');

async function router() {
  const hash = window.location.hash || '#/';
  
  app.innerHTML = '';
  const navbar = renderNavbar();
  app.appendChild(navbar);
  
  let pageContent;
  
  if (hash === '#/') {
    pageContent = await renderHome();
  } else if (hash.startsWith('#/explore')) {
    pageContent = await renderExplore();
  } else if (hash.startsWith('#/cafe/')) {
    const slug = hash.split('/')[2];
    pageContent = await renderDetail(slug);
  } else {
    pageContent = await renderHome();
  }
  
  app.appendChild(pageContent);
  
  // Footer only on home and detail, not explore (due to split screen)
  if (!hash.startsWith('#/explore')) {
    const footer = renderFooter();
    app.appendChild(footer);
  }
  
  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
`);

console.log('Frontend v2 (Premium Redesign) generated successfully!');
