
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderExplore() {
  const section = document.createElement('div');
  section.className = 'page-explore';
  
  section.innerHTML = `
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
  `;

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
