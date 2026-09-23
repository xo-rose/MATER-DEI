const updateForm = document.querySelector('#updates-form');

if (updateForm) {
  const status = document.querySelector('#admin-status');
  const fields = {
    weekOf: document.querySelector('#update-week'),
    theme: document.querySelector('#update-theme'),
    readings: document.querySelector('#update-readings'),
    announcements: document.querySelector('#update-announcements'),
  };
  const draftKey = 'mater-dei-parish-updates-draft';

  const setForm = (updates = {}) => {
    fields.weekOf.value = updates.weekOf || '';
    fields.theme.value = updates.theme || '';
    fields.readings.value = updates.readings || '';
    fields.announcements.value = Array.isArray(updates.announcements) ? updates.announcements.join('\n') : '';
  };

  const getFormData = () => ({
    weekOf: fields.weekOf.value,
    theme: fields.theme.value.trim(),
    readings: fields.readings.value.trim(),
    announcements: fields.announcements.value.split('\n').map((item) => item.trim()).filter(Boolean),
  });

  fetch('data/parish-updates.json')
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Could not load published updates.')))
    .then((updates) => {
      setForm(updates);
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) setForm(JSON.parse(savedDraft));
    })
    .catch(() => { status.textContent = 'Could not load the current updates. You can still fill in the form.'; });

  document.querySelector('#save-draft').addEventListener('click', () => {
    localStorage.setItem(draftKey, JSON.stringify(getFormData()));
    status.textContent = 'Draft saved in this browser on this device.';
  });

  updateForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const blob = new Blob([`${JSON.stringify(getFormData(), null, 2)}\n`], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'parish-updates.json';
    link.click();
    URL.revokeObjectURL(downloadUrl);
    status.textContent = 'Update file downloaded. Add it to the project as data/parish-updates.json, then commit and push to publish.';
  });
}
