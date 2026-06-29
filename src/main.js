
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderExplore } from './pages/explore.js';
import { renderDetail } from './pages/detail.js';

const app = document.getElementById('app');
const navbar = renderNavbar();
const footer = renderFooter();

async function router() {
  const hash = window.location.hash || '#/';
  
  app.innerHTML = '';
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
  if (!hash.startsWith('#/explore')) {
    app.appendChild(footer);
  }
  
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
