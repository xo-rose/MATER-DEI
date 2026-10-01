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
      const themeImageElement = section.querySelector('[data-update-theme-image]');
      const readingsElement = section.querySelector('[data-update-readings]');
      const list = section.querySelector('[data-update-announcements]');
      const empty = section.querySelector('[data-update-empty]');
      if (updates.weekOf && dateElement) {
        const date = new Date(`${updates.weekOf}T12:00:00`);
        dateElement.textContent = `Sunday, ${date.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}`;
      }
      if (themeElement) {
        if (updates.theme) themeElement.textContent = updates.theme;
        themeElement.hidden = !updates.theme && Boolean(updates.themeImage);
      }
      if (updates.themeImage && themeImageElement) {
        const updatesUrl = new URL(section.dataset.updatesUrl, window.location.href);
        const siteRoot = new URL('../', updatesUrl);
        themeImageElement.src = new URL(String(updates.themeImage).replace(/^\/+/, ''), siteRoot).href;
        themeImageElement.alt = updates.theme ? `Sunday theme: ${updates.theme}` : 'Sunday theme artwork';
        themeImageElement.hidden = false;
      }
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

document.querySelectorAll('[data-facebook-link]').forEach((link) => {
  fetch(link.dataset.settingsUrl)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Parish links unavailable')))
    .then((settings) => {
      if (!settings.facebookUrl) return;
      const facebookUrl = new URL(settings.facebookUrl, window.location.href);
      if (!['http:', 'https:'].includes(facebookUrl.protocol)) return;
      link.href = facebookUrl.href;
    })
    .catch(() => {});
});

document.querySelectorAll('[data-events-list]').forEach((list) => {
  fetch(list.dataset.eventsUrl)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Events unavailable')))
    .then((events) => {
      if (!Array.isArray(events)) return;
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const upcoming = events
        .filter((event) => event && event.published !== false && event.title && event.date && event.date >= today)
        .sort((first, second) => first.date.localeCompare(second.date));
      const limit = Number(list.dataset.eventLimit) || upcoming.length;
      const visibleEvents = upcoming.slice(0, limit);
      if (!visibleEvents.length) return;

      list.querySelector('[data-event-empty]')?.setAttribute('hidden', '');
      const fragment = document.createDocumentFragment();
      visibleEvents.forEach((event) => {
        const card = document.createElement('article');
        card.className = 'event-card';

        if (event.image) {
          const image = document.createElement('img');
          image.className = 'event-card-image';
          image.src = event.image;
          image.alt = event.title;
          image.loading = 'lazy';
          card.append(image);
        }

        const content = document.createElement('div');
        content.className = 'event-card-content';
        const dateLabel = document.createElement('p');
        dateLabel.className = 'event-card-date';
        dateLabel.textContent = new Date(`${event.date}T12:00:00`).toLocaleDateString('en-NG', {
          weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
        });
        const title = document.createElement('h3');
        title.textContent = event.title;
        content.append(dateLabel, title);

        const details = [event.time, event.location].filter(Boolean).join(' · ');
        if (details) {
          const detailLine = document.createElement('p');
          detailLine.className = 'event-card-details';
          detailLine.textContent = details;
          content.append(detailLine);
        }
        if (event.description) {
          const description = document.createElement('p');
          description.className = 'event-card-description';
          description.textContent = event.description;
          content.append(description);
        }
        card.append(content);
        fragment.append(card);
      });
      list.append(fragment);
    })
    .catch(() => {});
});
