
export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar glass-panel';
  
  // Add scroll listener for styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  const hash = window.location.hash || '#/';

  nav.innerHTML = `
    <div class="navbar-brand">
      <a href="#/">
        <span style="font-size: 1.75rem;">☕</span>
        <h1 style="margin: 0; font-size: 1.25rem; letter-spacing: -0.5px;">Jakarta<span style="color: var(--color-text-main);">Caffe</span></h1>
      </a>
    </div>
    <div class="navbar-nav">
      <a href="#/" class="${hash === '#/' ? 'active' : ''}">Beranda</a>
      <a href="#/explore" class="${hash.startsWith('#/explore') ? 'active' : ''}">Eksplorasi</a>
    </div>
  `;
  return nav;
}
