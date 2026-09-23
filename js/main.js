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

document.querySelectorAll('[data-parish-updates]').forEach((section) => {
  fetch(section.dataset.updatesUrl)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Updates unavailable')))
    .then((updates) => {
      const dateElement = section.querySelector('[data-update-date]');
      const themeElement = section.querySelector('[data-update-theme]');
      const readingsElement = section.querySelector('[data-update-readings]');
      const list = section.querySelector('[data-update-announcements]');
      const empty = section.querySelector('[data-update-empty]');
      if (updates.weekOf && dateElement) {
        const date = new Date(`${updates.weekOf}T12:00:00`);
        dateElement.textContent = `Sunday, ${date.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      }
      if (updates.theme && themeElement) themeElement.textContent = updates.theme;
      if (updates.readings && readingsElement) readingsElement.textContent = updates.readings;
      if (list && Array.isArray(updates.announcements)) {
        list.replaceChildren(...updates.announcements.map((announcement) => {
          const item = document.createElement('li');
          item.textContent = announcement;
          return item;
        }));
        if (empty) empty.hidden = updates.announcements.length > 0;
      }
    })
    .catch(() => {});
});
