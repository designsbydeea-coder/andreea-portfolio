// Run in the head before content is painted; without this script, content stays visible.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  let observer;
  const reveal = section => {
    section.classList.add('is-revealed');
    observer.unobserve(section);
  };
  const revealAll = () => {
    observer?.disconnect();
    root.classList.remove('home-reveal-enabled');
  };

  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { rootMargin: '0px 0px -64px 0px', threshold: 0 });

    document.addEventListener('DOMContentLoaded', () => {
      try {
        document.querySelectorAll('.home-reveal').forEach(section => observer.observe(section));
      } catch {
        revealAll();
      }
    }, { once: true });

    // Keyboard navigation must never leave a focused control visually hidden.
    document.addEventListener('focusin', event => {
      const section = event.target.closest('.home-reveal');
      if (section) reveal(section);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) revealAll();
    });
    root.classList.add('home-reveal-enabled');
  } catch {
    revealAll();
  }
})();
