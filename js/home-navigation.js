(() => {
  const header = document.querySelector('#home .site-header, .project-page .site-header');
  const toggle = header.querySelector('.mobile-menu-toggle');
  const compact = window.matchMedia('(max-width: 767.98px)');
  const setOpen = open => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  header.querySelectorAll('nav a, .header-socials a, .mobile-brand').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setOpen(false);
  });
  compact.addEventListener('change', () => setOpen(false));
  header.classList.add('mobile-nav-ready');
})();
