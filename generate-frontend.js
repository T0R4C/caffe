import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const STYLES_DIR = './src/styles';
const COMPONENTS_DIR = './src/components';
const PAGES_DIR = './src/pages';
const LIB_DIR = './src/lib';

[SRC_DIR, STYLES_DIR, COMPONENTS_DIR, PAGES_DIR, LIB_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. variables.css
fs.writeFileSync(path.join(STYLES_DIR, 'variables.css'), `
:root {
  /* Colors */
  --color-bg-dark: #0D0D0D;
  --color-bg-card: #1A1A1A;
  --color-primary: #6F4E37;
  --color-secondary: #D4A574;
  --color-accent: #2D5016;
  --color-text-main: #FFF8F0;
  --color-text-muted: #A0A0A0;
  --color-border: rgba(255, 255, 255, 0.1);

  /* Typography */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 10px 30px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(111, 78, 55, 0.4);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
`);

// 2. global.css
fs.writeFileSync(path.join(STYLES_DIR, 'global.css'), `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg-dark);
  color: var(--color-text-main);
  font-family: var(--font-body);
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 700;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  background: rgba(13, 13, 13, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid var(--color-border);
}

.navbar-brand h1 {
  font-size: 1.5rem;
  color: var(--color-secondary);
}

.navbar-nav a {
  margin-left: var(--space-lg);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.navbar-nav a:hover, .navbar-nav a.active {
  color: var(--color-secondary);
}

/* Cafe Card */
.cafe-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.cafe-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-glow);
}

.cafe-card-image {
  height: 200px;
  background: #333;
  position: relative;
}

.cafe-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cafe-card-badge {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #FFD700;
}

.cafe-card-content {
  padding: var(--space-md);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.cafe-card-title {
  font-size: 1.25rem;
  margin-bottom: var(--space-xs);
}

.cafe-card-meta {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-bottom: var(--space-md);
  display: flex;
  justify-content: space-between;
}

/* Footer */
.footer {
  margin-top: auto;
  padding: var(--space-2xl) 0;
  text-align: center;
  background: #0a0a0a;
  border-top: 1px solid var(--color-border);
}
`);

// 4. pages.css
fs.writeFileSync(path.join(STYLES_DIR, 'pages.css'), `
/* Home Page */
.page-home .hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-2xl) var(--space-md);
  background: radial-gradient(circle at center, rgba(111,78,55,0.2) 0%, rgba(13,13,13,1) 70%);
}

.hero h2 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: var(--space-md);
}

.hero p {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin-bottom: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  padding: var(--space-2xl) 0;
}

.stat-card {
  background: var(--color-bg-card);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--color-border);
}

.stat-card h3 {
  font-size: 2.5rem;
  color: var(--color-secondary);
  margin-bottom: var(--space-xs);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  padding: var(--space-lg) 0 var(--space-2xl);
}

/* Explore Page */
.page-explore {
  padding-top: 80px; /* offset navbar */
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.explore-layout {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.explore-sidebar {
  width: 400px;
  background: var(--color-bg-dark);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--space-md);
}

.explore-map {
  flex-grow: 1;
  background: #111;
  position: relative;
}

.filter-panel {
  margin-bottom: var(--space-md);
}

.cafe-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Detail Page */
.page-detail {
  padding-top: 80px;
}

.detail-hero {
  height: 40vh;
  background-size: cover;
  background-position: center;
  position: relative;
}

.detail-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent, var(--color-bg-dark));
}

.detail-content {
  margin-top: -100px;
  position: relative;
  z-index: 10;
  background: var(--color-bg-dark);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
`);

// 5. lib/demo-data.js
fs.writeFileSync(path.join(LIB_DIR, 'demo-data.js'), `
export const DEMO_CAFES = [
  {
    slug: 'toko-kopi-tuku-cipete',
    name: 'Toko Kopi Tuku Cipete',
    address: 'Jl. Cipete Raya No.7, Cipete Sel., Jakarta Selatan',
    area: { name: 'Jakarta Selatan', slug: 'jakarta-selatan' },
    latitude: -6.2626,
    longitude: 106.7980,
    rating: 4.8,
    total_reviews: 3200,
    price_level: '$',
    thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
    description: 'Pelopor Kopi Susu Tetangga yang legendaris.'
  },
  {
    slug: 'giyanti-coffee-roastery',
    name: 'Giyanti Coffee Roastery',
    address: 'Jl. Surabaya No.20, Menteng, Jakarta Pusat',
    area: { name: 'Jakarta Pusat', slug: 'jakarta-pusat' },
    latitude: -6.2023,
    longitude: 106.8402,
    rating: 4.7,
    total_reviews: 1850,
    price_level: '$$$',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop',
    description: 'Salah satu roastery terbaik di Jakarta.'
  },
  {
    slug: 'anomali-coffee-menteng',
    name: 'Anomali Coffee Menteng',
    address: 'Jl. Teuku Cik Ditiro No.52, Menteng, Jakarta Pusat',
    area: { name: 'Jakarta Pusat', slug: 'jakarta-pusat' },
    latitude: -6.1958,
    longitude: 106.8346,
    rating: 4.6,
    total_reviews: 1250,
    price_level: '$$',
    thumbnail: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600&h=400&fit=crop',
    description: 'Kopi asli Indonesia dengan suasana homey.'
  },
  {
    slug: 'arabica-jakarta',
    name: '% Arabica Jakarta',
    address: 'Senopati, Jakarta Selatan',
    area: { name: 'Jakarta Selatan', slug: 'jakarta-selatan' },
    latitude: -6.2301,
    longitude: 106.8066,
    rating: 4.5,
    total_reviews: 950,
    price_level: '$$$',
    thumbnail: 'https://images.unsplash.com/photo-1521017432531-fde3a5004131?w=600&h=400&fit=crop',
    description: 'Brand kopi terkenal dari Kyoto, Jepang.'
  }
];

export const getDemoCafes = () => DEMO_CAFES;
`);

// 6. lib/supabase.js
fs.writeFileSync(path.join(LIB_DIR, 'supabase.js'), `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
`);

// 7. lib/api.js
fs.writeFileSync(path.join(LIB_DIR, 'api.js'), `
import { supabase, isSupabaseConfigured } from './supabase.js';
import { getDemoCafes } from './demo-data.js';

export async function getCafes(options = {}) {
  if (isSupabaseConfigured()) {
    let query = supabase.from('cafes').select('*, areas(name, slug)');
    if (options.area) query = query.eq('areas.slug', options.area);
    if (options.limit) query = query.limit(options.limit);
    
    const { data, error } = await query;
    if (error) {
      console.error(error);
      return getDemoCafes(); // fallback
    }
    return data;
  }
  return getDemoCafes();
}
`);

// 8. components/navbar.js
fs.writeFileSync(path.join(COMPONENTS_DIR, 'navbar.js'), `
export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = \`
    <div class="navbar-brand">
      <a href="#/"><h1>☕ JakartaCaffe</h1></a>
    </div>
    <div class="navbar-nav">
      <a href="#/">Beranda</a>
      <a href="#/explore">Eksplorasi</a>
    </div>
  \`;
  return nav;
}
`);

// 9. components/footer.js
fs.writeFileSync(path.join(COMPONENTS_DIR, 'footer.js'), `
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = \`
    <div class="container">
      <p>&copy; 2026 JakartaCaffe. Built with ☕ for Jakarta.</p>
    </div>
  \`;
  return footer;
}
`);

// 10. components/cafe-card.js
fs.writeFileSync(path.join(COMPONENTS_DIR, 'cafe-card.js'), `
export function createCafeCard(cafe) {
  const card = document.createElement('div');
  card.className = 'cafe-card';
  card.onclick = () => window.location.hash = \`/cafe/\${cafe.slug}\`;
  
  card.innerHTML = \`
    <div class="cafe-card-image">
      <img src="\${cafe.thumbnail}" alt="\${cafe.name}" loading="lazy">
      <div class="cafe-card-badge">★ \${cafe.rating}</div>
    </div>
    <div class="cafe-card-content">
      <h3 class="cafe-card-title">\${cafe.name}</h3>
      <div class="cafe-card-meta">
        <span>📍 \${cafe.area?.name || 'Jakarta'}</span>
        <span>\${cafe.price_level}</span>
      </div>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.4;">
        \${cafe.description || ''}
      </p>
    </div>
  \`;
  return card;
}
`);

// 11. pages/home.js
fs.writeFileSync(path.join(PAGES_DIR, 'home.js'), `
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderHome() {
  const section = document.createElement('div');
  section.className = 'page-home';
  
  // Hero
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = \`
    <h2 class="text-gradient">Temukan Kafe Terbaik<br>di Jakarta</h2>
    <p>Jelajahi 500+ kafe dan coffee shop terbaik se-DKI Jakarta. Dari roastery premium hingga kopi susu legendaris.</p>
    <a href="#/explore" class="btn" style="background: var(--color-primary); padding: 12px 24px; border-radius: var(--radius-full); font-weight: 600;">Mulai Eksplorasi →</a>
  \`;
  section.appendChild(hero);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'container stats-grid';
  stats.innerHTML = \`
    <div class="stat-card"><h3>500+</h3><p>Kafe Terdata</p></div>
    <div class="stat-card"><h3>4.5</h3><p>Rata-rata Rating</p></div>
    <div class="stat-card"><h3>6</h3><p>Wilayah Jakarta</p></div>
  \`;
  section.appendChild(stats);

  // Featured
  const featured = document.createElement('div');
  featured.className = 'container';
  featured.innerHTML = '<h2>Kafe Populer</h2>';
  
  const grid = document.createElement('div');
  grid.className = 'featured-grid';
  
  const cafes = await getCafes({ limit: 4 });
  cafes.forEach(cafe => {
    grid.appendChild(createCafeCard(cafe));
  });
  
  featured.appendChild(grid);
  section.appendChild(featured);

  return section;
}
`);

// 12. pages/explore.js
fs.writeFileSync(path.join(PAGES_DIR, 'explore.js'), `
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderExplore() {
  const section = document.createElement('div');
  section.className = 'page-explore';
  
  section.innerHTML = \`
    <div class="explore-layout">
      <div class="explore-sidebar" id="explore-sidebar">
        <h2 style="margin-bottom: var(--space-md);">Eksplorasi Kafe</h2>
        <div class="cafe-list" id="cafe-list"></div>
      </div>
      <div class="explore-map" id="explore-map">
        <!-- Map goes here -->
        <div style="display: flex; height: 100%; align-items: center; justify-content: center; color: var(--color-text-muted);">
          Peta Interaktif (Leaflet.js) akan dimuat di sini
        </div>
      </div>
    </div>
  \`;

  // Fetch and render list
  setTimeout(async () => {
    const listEl = section.querySelector('#cafe-list');
    const cafes = await getCafes();
    cafes.forEach(cafe => {
      listEl.appendChild(createCafeCard(cafe));
    });
  }, 0);

  return section;
}
`);

// 13. pages/detail.js
fs.writeFileSync(path.join(PAGES_DIR, 'detail.js'), `
import { getCafes } from '../lib/api.js';

export async function renderDetail(slug) {
  const section = document.createElement('div');
  section.className = 'page-detail';
  
  const cafes = await getCafes();
  const cafe = cafes.find(c => c.slug === slug) || cafes[0];

  section.innerHTML = \`
    <div class="detail-hero" style="background-image: url('\${cafe.thumbnail}')"></div>
    <div class="detail-content container">
      <a href="javascript:history.back()" style="color: var(--color-secondary); margin-bottom: var(--space-md); display: inline-block;">← Kembali</a>
      <h1>\${cafe.name}</h1>
      <div style="display: flex; gap: var(--space-md); margin-top: var(--space-sm); color: var(--color-text-muted);">
        <span>📍 \${cafe.address}</span>
        <span style="color: #FFD700;">★ \${cafe.rating} (\${cafe.total_reviews} ulasan)</span>
        <span>\${cafe.price_level}</span>
      </div>
      
      <div style="margin-top: var(--space-xl);">
        <h3>Deskripsi</h3>
        <p style="margin-top: var(--space-sm); color: var(--color-text-muted);">\${cafe.description}</p>
      </div>
    </div>
  \`;

  return section;
}
`);

// 14. main.js
fs.writeFileSync(path.join(SRC_DIR, 'main.js'), `
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderExplore } from './pages/explore.js';
import { renderDetail } from './pages/detail.js';

const app = document.getElementById('app');
const navbar = renderNavbar();
const footer = renderFooter();

async function router() {
  const hash = window.location.hash || '#/';
  
  app.innerHTML = '';
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
  if (!hash.startsWith('#/explore')) {
    app.appendChild(footer);
  }
  
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
`);

console.log('Frontend generated successfully!');
