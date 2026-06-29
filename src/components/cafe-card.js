export function createCafeCard(cafe) {
  const card = document.createElement('div');
  card.className = 'cafe-card animate-fade-in-up';
  
  // Format coordinate for external map link if needed
  const mapsUrl = cafe.google_maps_url || \`https://www.google.com/maps/search/?api=1&query=\${cafe.latitude},\${cafe.longitude}\`;
  
  card.innerHTML = \`
    <div class="cafe-card-image">
      <img src="\${cafe.thumbnail}" alt="\${cafe.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop'">
      <div class="cafe-card-badge">★ \${cafe.rating || 0}</div>
      <button class="favorite-btn" aria-label="Simpan Kafe" title="Simpan ke Favorit" style="position: absolute; top: 16px; left: 16px; background: rgba(10,9,8,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: white;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
    </div>
    <div class="cafe-card-content">
      <h3 class="cafe-card-title">\${cafe.name}</h3>
      <div class="cafe-card-address">
        <span style="flex-shrink: 0; color: var(--color-primary-dark);">📍</span>
        <span>\${cafe.address || 'Jakarta'}</span>
      </div>
      
      <div class="cafe-card-footer">
        <span style="color: var(--color-primary); font-weight: 500;">\${cafe.area?.name || (cafe.area_id ? 'Jakarta' : 'Area Tidak Diketahui')}</span>
        <span style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 12px; color: #8FBC8F; font-weight: 600;">\${cafe.price_level || '$$'}</span>
      </div>
    </div>
  \`;
  
  // Make the whole card clickable EXCEPT the favorite button
  card.onclick = (e) => {
    if (e.target.closest('.favorite-btn')) return;
    window.location.hash = \`/cafe/\${cafe.slug}\`;
  };

  // Favorite button interaction
  const favBtn = card.querySelector('.favorite-btn');
  const favSvg = favBtn.querySelector('svg');
  let isFav = false;
  favBtn.onclick = (e) => {
    e.stopPropagation();
    isFav = !isFav;
    if (isFav) {
      favSvg.setAttribute('fill', 'currentColor');
      favSvg.style.color = '#ff4d4d'; // Red heart
      favBtn.style.transform = 'scale(1.1)';
      setTimeout(() => favBtn.style.transform = 'scale(1)', 200);
    } else {
      favSvg.setAttribute('fill', 'none');
      favSvg.style.color = 'white';
    }
  };
  
  return card;
}
