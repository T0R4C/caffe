
export function renderNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="navbar-brand">
      <a href="#/"><h1>☕ JakartaCaffe</h1></a>
    </div>
    <div class="navbar-nav">
      <a href="#/">Beranda</a>
      <a href="#/explore">Eksplorasi</a>
    </div>
  `;
  return nav;
}
