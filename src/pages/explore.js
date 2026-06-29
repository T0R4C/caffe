
import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';

export async function renderExplore() {
  const section = document.createElement('div');
  section.className = 'page-explore';
  
  section.innerHTML = `
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
  `;

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
      card.style.animationDelay = `${(index % 10) * 50}ms`;
      listContainer.appendChild(card);
    });
  }, 100);

  return section;
}
