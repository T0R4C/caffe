
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderHome() {
  const section = document.createElement('div');
  section.className = 'page-home';
  
  // HERO
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
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
  `;
  section.appendChild(hero);

  // FEATURED
  const featured = document.createElement('div');
  featured.className = 'container';
  featured.style.marginTop = 'var(--space-2xl)';
  
  featured.innerHTML = `
    <div class="section-title">
      <h2>Top Rated <span style="color: var(--color-primary); font-weight: 300;">Cafes</span></h2>
      <a href="#/explore" style="color: var(--color-text-muted); font-weight: 500;">Lihat Semua Peta →</a>
    </div>
    <div class="featured-grid" id="home-featured-grid">
      <!-- Cards will be injected here -->
      <div style="color: var(--color-text-muted);">Memuat data kafe premium...</div>
    </div>
  `;
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
      card.style.animationDelay = `${index * 100}ms`;
      grid.appendChild(card);
    });
  }, 100);

  return section;
}
