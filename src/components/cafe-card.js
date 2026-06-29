
export function createCafeCard(cafe) {
  const card = document.createElement('div');
  card.className = 'cafe-card animate-fade-in-up';
  
  // Format coordinate for external map link if needed
  const mapsUrl = cafe.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`;
  
  card.innerHTML = `
    <div class="cafe-card-image">
      <img src="${cafe.thumbnail}" alt="${cafe.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'">
      <div class="cafe-card-badge">★ ${cafe.rating}</div>
    </div>
    <div class="cafe-card-content">
      <h3 class="cafe-card-title">${cafe.name}</h3>
      <div class="cafe-card-address">
        <span style="flex-shrink: 0; color: var(--color-primary-dark);">📍</span>
        <span>${cafe.address || 'Jakarta'}</span>
      </div>
      
      <div class="cafe-card-footer">
        <span style="color: var(--color-primary); font-weight: 500;">${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</span>
        <span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; color: #8FBC8F; font-weight: 600;">${cafe.price_level || '$$'}</span>
      </div>
    </div>
  `;
  
  // Make the whole card clickable
  card.onclick = () => window.location.hash = `/cafe/${cafe.slug}`;
  
  return card;
}
