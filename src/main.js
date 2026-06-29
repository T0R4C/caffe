
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderExplore } from './pages/explore.js';
import { renderDetail } from './pages/detail.js';

const app = document.getElementById('app');

async function router() {
  const hash = window.location.hash || '#/';
  
  app.innerHTML = '';
  const navbar = renderNavbar();
  app.appendChild(navbar);
  
  let pageContent;
  
  if (hash === '#/') {
    pageContent = await renderHome();
  } else if (hash.startsWith('#/explore')) {
    pageContent = await renderExplore();
  } else if (hash.startsWith('#/cafe/')) {
    const slug = hash.split('/')[2];
    pageContent = await renderDetail(slug);
  } else {
    pageContent = await renderHome();
  }
  
  app.appendChild(pageContent);
  
  // Footer only on home and detail, not explore (due to split screen)
  if (!hash.startsWith('#/explore')) {
    const footer = renderFooter();
    app.appendChild(footer);
  }
  
  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
