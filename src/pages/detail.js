
import { getCafes } from '../lib/api.js';

export async function renderDetail(slug) {
  const section = document.createElement('div');
  section.className = 'page-detail';
  
  const cafes = await getCafes();
  const cafe = cafes.find(c => c.slug === slug) || cafes[0];

  section.innerHTML = `
    <div class="detail-hero" style="background-image: url('${cafe.thumbnail}')"></div>
    <div class="detail-content container">
      <a href="javascript:history.back()" style="color: var(--color-secondary); margin-bottom: var(--space-md); display: inline-block;">← Kembali</a>
      <h1>${cafe.name}</h1>
      <div style="display: flex; gap: var(--space-md); margin-top: var(--space-sm); color: var(--color-text-muted);">
        <span>📍 ${cafe.address}</span>
        <span style="color: #FFD700;">★ ${cafe.rating} (${cafe.total_reviews} ulasan)</span>
        <span>${cafe.price_level}</span>
      </div>
      
      <div style="margin-top: var(--space-xl);">
        <h3>Deskripsi</h3>
        <p style="margin-top: var(--space-sm); color: var(--color-text-muted);">${cafe.description}</p>
      </div>
    </div>
  `;

  return section;
}
