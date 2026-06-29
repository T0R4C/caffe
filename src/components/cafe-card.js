
export function createCafeCard(cafe) {
  const card = document.createElement('div');
  card.className = 'cafe-card';
  card.onclick = () => window.location.hash = `/cafe/${cafe.slug}`;
  
  card.innerHTML = `
    <div class="cafe-card-image">
      <img src="${cafe.thumbnail}" alt="${cafe.name}" loading="lazy">
      <div class="cafe-card-badge">★ ${cafe.rating}</div>
    </div>
    <div class="cafe-card-content">
      <h3 class="cafe-card-title">${cafe.name}</h3>
      <div class="cafe-card-meta">
        <span>📍 ${cafe.area?.name || 'Jakarta'}</span>
        <span>${cafe.price_level}</span>
      </div>
      <p style="font-size: 0.875rem; color: var(--color-text-muted); line-height: 1.4;">
        ${cafe.description || ''}
      </p>
    </div>
  `;
  return card;
}
