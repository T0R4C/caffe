import { getCafes } from '../lib/api.js';
import L from 'leaflet';

export async function renderDetail(slug) {
  const section = document.createElement('div');
  section.className = 'page-detail animate-fade-in-up';
  
  section.innerHTML = \`<div class="container" style="padding-top: 120px; color: var(--color-text-muted);">Memuat data kafe...</div>\`;

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

    // Dummy Reviews
    const mockReviews = [
      { name: "Andi S.", rating: 5, text: "Tempatnya cozy banget buat WFC. Kopinya juara!" },
      { name: "Budi R.", rating: 4, text: "Pelayanan ramah, tapi parkiran agak sempit kalau weekend." }
    ];
    
    const mockMenus = [
      { name: "Ice Caramel Macchiato", price: "Rp 45.000" },
      { name: "Truffle Fries", price: "Rp 35.000" },
      { name: "Almond Croissant", price: "Rp 30.000" }
    ];

    section.innerHTML = \`
      <!-- HERO HEADER -->
      <div class="detail-hero">
        <div class="detail-hero-bg" style="background-image: url('\${cafe.thumbnail}')"></div>
        <div class="detail-hero-overlay"></div>
        <div class="container detail-header">
          <a href="#/explore" class="detail-back">← Kembali ke Eksplorasi</a>
          <h1 class="detail-title">\${cafe.name}</h1>
          <div class="detail-meta-badges">
            <div class="meta-badge rating">★ \${cafe.rating || 0} <span style="color: var(--color-text-muted); font-weight: 400; margin-left: 4px;">(\${cafe.total_reviews || 0} ulasan)</span></div>
            <div class="meta-badge price">💰 \${cafe.price_level || '$$'}</div>
            <div class="meta-badge">📍 \${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="container detail-grid">
        <!-- Left Column: Info & Reviews -->
        <div class="detail-main">
          
          <div class="detail-section">
            <h3>Tentang Kafe</h3>
            <p style="color: var(--color-text-muted); font-size: 1.1rem; line-height: 1.8;">
              \${cafe.description || 'Sebuah tempat nyaman untuk menikmati kopi pilihan dan suasana santai di tengah hiruk pikuk kota Jakarta.'}
            </p>
          </div>
          
          <div class="detail-section">
            <h3>Menu Populer</h3>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
              \${mockMenus.map(menu => \`
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">
                  <span style="color: var(--color-text-main);">\${menu.name}</span>
                  <span style="color: var(--color-primary-dark); font-weight: 600;">\${menu.price}</span>
                </div>
              \`).join('')}
            </div>
          </div>

          <div class="detail-section">
            <h3>Ulasan Pengguna</h3>
            <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px;">
              \${mockReviews.map(review => \`
                <div style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <strong style="color: var(--color-text-main);">\${review.name}</strong>
                    <span style="color: #FFD700;">\${'★'.repeat(review.rating)}\${'☆'.repeat(5-review.rating)}</span>
                  </div>
                  <p style="color: var(--color-text-muted); font-size: 0.9rem;">"\${review.text}"</p>
                </div>
              \`).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top: 24px; width: 100%;">Tulis Ulasan</button>
          </div>
        </div>

        <!-- Right Column: Map & Actions -->
        <div class="detail-sidebar">
          <div class="detail-section" style="padding: var(--space-md);">
            <div id="detail-mini-map" style="background: #222; height: 250px; border-radius: var(--radius-md); margin-bottom: var(--space-md); z-index: 1;"></div>
            <a href="\${mapsUrl}" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center;">
              Buka di Google Maps ↗
            </a>
          </div>
          
          <div class="detail-section">
            <h3>Informasi Kontak</h3>
            <div class="info-list" style="margin-top: 16px;">
              <div class="info-item">
                <div class="info-icon">📍</div>
                <div>
                  <div class="info-label">Alamat Lengkap</div>
                  <div class="info-text">\${cafe.address || 'Alamat tidak tersedia'}</div>
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

    // Initialize mini map after DOM updates
    setTimeout(() => {
      const mapEl = document.getElementById('detail-mini-map');
      if (mapEl && cafe.latitude && cafe.longitude) {
        const miniMap = L.map('detail-mini-map', {
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false
        }).setView([cafe.latitude, cafe.longitude], 15);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(miniMap);
        
        const coffeeIcon = L.divIcon({
          className: 'custom-map-marker',
          html: '<div style="background: var(--color-primary); width: 24px; height: 24px; border-radius: 50%; border: 3px solid #111;"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([cafe.latitude, cafe.longitude], { icon: coffeeIcon }).addTo(miniMap);
      }
    }, 100);

  }, 50);

  return section;
}
