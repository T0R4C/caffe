
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderHome() {
  const section = document.createElement('div');
  section.className = 'page-home';
  
  // Hero
  const hero = document.createElement('section');
  hero.className = 'hero';
  hero.innerHTML = `
    <h2 class="text-gradient">Temukan Kafe Terbaik<br>di Jakarta</h2>
    <p>Jelajahi 500+ kafe dan coffee shop terbaik se-DKI Jakarta. Dari roastery premium hingga kopi susu legendaris.</p>
    <a href="#/explore" class="btn" style="background: var(--color-primary); padding: 12px 24px; border-radius: var(--radius-full); font-weight: 600;">Mulai Eksplorasi →</a>
  `;
  section.appendChild(hero);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'container stats-grid';
  stats.innerHTML = `
    <div class="stat-card"><h3>500+</h3><p>Kafe Terdata</p></div>
    <div class="stat-card"><h3>4.5</h3><p>Rata-rata Rating</p></div>
    <div class="stat-card"><h3>6</h3><p>Wilayah Jakarta</p></div>
  `;
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
