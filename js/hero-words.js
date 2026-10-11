const heroWords = document.querySelector('.hero-amazing');

// Start one shared CSS timeline only when every SVG is ready to paint.
await Promise.all([...heroWords.querySelectorAll('img')].map(image => image.decode()));

function syncVisibility() {
  heroWords.classList.toggle('is-paused', document.hidden);
}

document.addEventListener('visibilitychange', syncVisibility);
syncVisibility();
heroWords.classList.add('is-cycling');
