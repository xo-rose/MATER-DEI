const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#site-menu');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    menu.classList.toggle('hidden', isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      menu.classList.add('hidden');
    });
  });
}


const yearElement = document.querySelector('#current-year');
if (yearElement) yearElement.textContent = new Date().getFullYear();


const lightbox = document.querySelector('#photo-lightbox');
const lightboxImage = document.querySelector('#photo-lightbox-image');
const lightboxClose = document.querySelector('.photo-lightbox-close');

if (lightbox && lightboxImage) {
  document.querySelectorAll('[data-lightbox-src]').forEach((photo) => {
    photo.addEventListener('click', () => {
      lightboxImage.src = photo.dataset.lightboxSrc;
      lightboxImage.alt = photo.dataset.lightboxAlt || '';
      lightbox.showModal();
    });
  });
  lightboxClose?.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
  });
}
