import { getCafes } from '../lib/api.js';
import { createCafeCard } from '../components/cafe-card.js';
import L from 'leaflet';

export async function renderExplore() {
  const section = document.createElement('div');
  section.className = 'page-explore';
  
  section.innerHTML = \`
    <div class="explore-layout">
      <!-- SIDEBAR LIST -->
      <div class="explore-sidebar">
        <div class="explore-filters">
          <h3>Eksplorasi Area</h3>
          <div class="filter-row" id="explore-filter-row">
            <div class="chip active" data-area="all">Semua Area</div>
            <div class="chip" data-area="jakarta-selatan">Jakarta Selatan</div>
            <div class="chip" data-area="jakarta-pusat">Jakarta Pusat</div>
            <div class="chip" data-area="jakarta-barat">Jakarta Barat</div>
            <div class="chip" data-area="jakarta-utara">Jakarta Utara</div>
            <div class="chip" data-area="jakarta-timur">Jakarta Timur</div>
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
      <div class="explore-map" id="explore-map"></div>
    </div>
  \`;

  setTimeout(async () => {
    // 1. Initialize Map
    const mapContainer = document.getElementById('explore-map');
    if (!mapContainer) return;

    const map = L.map('explore-map', {
      zoomControl: false // custom position later if needed
    }).setView([-6.2088, 106.8456], 11);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark mode map tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    // 2. Fetch Data
    const listContainer = section.querySelector('#explore-cafe-list');
    let allCafes = await getCafes();
    allCafes.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    
    // Custom Icon
    const coffeeIcon = L.divIcon({
      className: 'custom-map-marker',
      html: '<div style="background: var(--color-primary); width: 24px; height: 24px; border-radius: 50%; border: 3px solid #111; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    function renderListAndMap(cafes) {
      listContainer.innerHTML = '';
      markersLayer.clearLayers();

      if (cafes.length === 0) {
        listContainer.innerHTML = \`<div style="text-align: center; padding: 2rem; color: var(--color-text-muted);">Tidak ada kafe ditemukan di area ini.</div>\`;
        return;
      }

      const bounds = L.latLngBounds();

      // Render max 50 for performance
      cafes.slice(0, 50).forEach((cafe, index) => {
        // Render Card
        const card = createCafeCard(cafe);
        card.style.animationDelay = \`\${(index % 10) * 50}ms\`;
        
        // Add hover effect to highlight on map
        card.addEventListener('mouseenter', () => {
          if (cafe.latitude && cafe.longitude) {
            map.flyTo([cafe.latitude, cafe.longitude], 16, { animate: true, duration: 0.5 });
          }
        });
        
        listContainer.appendChild(card);

        // Render Marker
        if (cafe.latitude && cafe.longitude) {
          const latLng = [cafe.latitude, cafe.longitude];
          const marker = L.marker(latLng, { icon: coffeeIcon }).addTo(markersLayer);
          
          marker.bindPopup(\`
            <div style="font-family: var(--font-body); text-align: center;">
              <strong>\${cafe.name}</strong><br>
              <span style="color: #FFD700;">★ \${cafe.rating}</span><br>
              <a href="#/cafe/\${cafe.slug}" style="color: var(--color-primary); text-decoration: underline; font-size: 0.8rem; margin-top: 4px; display: inline-block;">Lihat Detail</a>
            </div>
          \`);
          
          bounds.extend(latLng);
        }
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    renderListAndMap(allCafes);

    // 3. Filter Logic
    const filterChips = section.querySelectorAll('.chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const areaSlug = chip.getAttribute('data-area');
        if (areaSlug === 'all') {
          renderListAndMap(allCafes);
        } else {
          // If area is matching precisely with area.slug from relation, we use cafe.area?.slug
          // Fallback to coordinates based matching using string inclusion for simplicity in demo
          const filtered = allCafes.filter(c => 
            (c.area && c.area.slug === areaSlug) || 
            (c.area_id && c.area_slug === areaSlug) ||
            (c.address && c.address.toLowerCase().includes(areaSlug.replace('jakarta-', '')))
          );
          
          // Since the API returns flattened demo data without area_id sometimes, 
          // a safer filter for this iteration:
          const safeFiltered = allCafes.filter(c => {
            const areaName = chip.textContent.toLowerCase();
            return c.address?.toLowerCase().includes(areaName) || c.area?.name?.toLowerCase().includes(areaName);
          });
          
          renderListAndMap(safeFiltered.length > 0 ? safeFiltered : allCafes.filter(c => c.area_id === areaSlug));
        }
      });
    });

  }, 100);

  return section;
}
