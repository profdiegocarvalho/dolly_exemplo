document.addEventListener('DOMContentLoaded', function () {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const searchInput = document.getElementById('searchInput');
  const openDerModalBtn = document.getElementById('openDerModalBtn');
  const derModalElement = document.getElementById('derModal');
  const derImage = document.getElementById('derImage');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  
  let panzoomInstance = null;
  let derModal = null;

  if (derModalElement) {
    derModal = new bootstrap.Modal(derModalElement);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const isDark = document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode', !isDark);
      themeToggleBtn.textContent = isDark ? 'Alternar Modo Claro' : 'Alternar Modo Escuro';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const query = e.target.value.toLowerCase().trim();
      const sections = document.querySelectorAll('.table-section');

      sections.forEach(function (section) {
        const tableId = section.getAttribute('id') || '';
        const title = section.querySelector('h3') ? section.querySelector('h3').textContent.toLowerCase() : '';
        const desc = section.querySelector('p') ? section.querySelector('p').textContent.toLowerCase() : '';
        const rows = section.querySelectorAll('tbody tr');
        let sectionHasMatch = false;

        if (query === '') {
          section.style.display = '';
          rows.forEach(row => row.style.display = '');
          return;
        }

        if (tableId.toLowerCase().includes(query) || title.includes(query) || desc.includes(query)) {
          sectionHasMatch = true;
          rows.forEach(row => row.style.display = '');
        } else {
          rows.forEach(function (row) {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes(query)) {
              row.style.display = '';
              sectionHasMatch = true;
            } else {
              row.style.display = 'none';
            }
          });
        }

        section.style.display = sectionHasMatch ? '' : 'none';
      });
    });
  }

  if (openDerModalBtn && derModal) {
    openDerModalBtn.addEventListener('click', function () {
      derModal.show();
    });
  }

  if (derModalElement) {
    derModalElement.addEventListener('shown.bs.modal', function () {
      if (!panzoomInstance && typeof Panzoom !== 'undefined' && derImage) {
        panzoomInstance = Panzoom(derImage, {
          maxScale: 6,
          minScale: 0.5,
          contain: 'outside',
          cursor: 'move'
        });

        derImage.parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel);

        if (btnZoomIn) {
          btnZoomIn.addEventListener('click', function () {
            panzoomInstance.zoomIn();
          });
        }

        if (btnZoomOut) {
          btnZoomOut.addEventListener('click', function () {
            panzoomInstance.zoomOut();
          });
        }

        if (btnZoomReset) {
          btnZoomReset.addEventListener('click', function () {
            panzoomInstance.reset();
          });
        }
      }
    });

    derModalElement.addEventListener('hidden.bs.modal', function () {
      if (panzoomInstance) {
        panzoomInstance.reset();
      }
    });
  }
});