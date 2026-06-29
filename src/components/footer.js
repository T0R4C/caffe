
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <p>&copy; 2026 JakartaCaffe. Built with ☕ for Jakarta.</p>
    </div>
  `;
  return footer;
}
