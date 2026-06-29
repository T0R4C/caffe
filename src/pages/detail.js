
import { getCafes } from '../lib/api.js';

export async function renderDetail(slug) {
  const section = document.createElement('div');
  section.className = 'page-detail animate-fade-in-up';
  
  // Temporary loading state
  section.innerHTML = `<div class="container" style="padding-top: 120px; color: var(--color-text-muted);">Memuat data kafe...</div>`;

  // Fetch data
  setTimeout(async () => {
    const cafes = await getCafes();
    const cafe = cafes.find(c => c.slug === slug);

    if (!cafe) {
      section.innerHTML = `
        <div class="container" style="padding-top: 120px; text-align: center;">
          <h2>Kafe tidak ditemukan</h2>
          <a href="#/explore" class="btn btn-primary" style="margin-top: 24px;">Kembali Eksplorasi</a>
        </div>
      `;
      return;
    }

    const mapsUrl = cafe.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`;

    section.innerHTML = `
      <!-- HERO HEADER -->
      <div class="detail-hero">
        <div class="detail-hero-bg" style="background-image: url('${cafe.thumbnail}')"></div>
        <div class="detail-hero-overlay"></div>
        <div class="container detail-header">
          <a href="#/explore" class="detail-back">← Kembali ke Eksplorasi</a>
          <h1 class="detail-title">${cafe.name}</h1>
          <div class="detail-meta-badges">
            <div class="meta-badge rating">★ ${cafe.rating} <span style="color: var(--color-text-muted); font-weight: 400; margin-left: 4px;">(${cafe.total_reviews} ulasan)</span></div>
            <div class="meta-badge price">💰 ${cafe.price_level || '$$'}</div>
            <div class="meta-badge">📍 ${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</div>
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
              ${cafe.description || 'Sebuah tempat nyaman untuk menikmati kopi pilihan dan suasana santai di tengah hiruk pikuk kota Jakarta.'}
            </p>
          </div>

          <div class="detail-section">
            <h3>Informasi Kontak & Lokasi</h3>
            <div class="info-list">
              <div class="info-item">
                <div class="info-icon">📍</div>
                <div>
                  <div class="info-label">Alamat Lengkap</div>
                  <div class="info-text">${cafe.address || 'Alamat tidak tersedia'}</div>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">🗺️</div>
                <div>
                  <div class="info-label">Koordinat Geografis (Dari Scraper)</div>
                  <div class="info-text">Latitude: ${cafe.latitude} <br> Longitude: ${cafe.longitude}</div>
                </div>
              </div>

              ${cafe.phone ? `
              <div class="info-item">
                <div class="info-icon">📞</div>
                <div>
                  <div class="info-label">Telepon</div>
                  <div class="info-text">${cafe.phone}</div>
                </div>
              </div>` : ''}
              
              ${cafe.instagram ? `
              <div class="info-item">
                <div class="info-icon">📸</div>
                <div>
                  <div class="info-label">Instagram</div>
                  <div class="info-text"><a href="${cafe.instagram}" target="_blank" style="color: var(--color-primary); text-decoration: underline;">${cafe.instagram}</a></div>
                </div>
              </div>` : ''}
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
            <a href="${mapsUrl}" target="_blank" class="btn btn-primary" style="width: 100%; justify-content: center;">
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
    `;
  }, 50);

  return section;
}
