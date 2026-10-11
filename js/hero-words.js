const heroButton = document.querySelector('.hero-word-button');
const wordNames = ['AMAZING', 'GOOD', 'STUNNING'];
const words = wordNames.map(word => heroButton.querySelector(`.hero-word-${word.toLowerCase()}`));
let currentWord = 0;
let changing = false;

// All layers are in the HTML; AMAZING stays visible if JavaScript is unavailable.
const ready = Promise.all(words.map(image => image.decode()))
  .then(() => { heroButton.classList.add('is-ready'); return true; })
  .catch(() => false);

heroButton.addEventListener('click', async () => {
  if (changing) return;
  changing = true;
  try {
    if (!await ready) return;
    const nextWord = (currentWord + 1) % words.length;
    words[currentWord].classList.remove('is-current');
    words[nextWord].classList.add('is-current');
    currentWord = nextWord;
    heroButton.setAttribute('aria-label', `Change hero word. Current word: ${wordNames[currentWord]}`);

    // Ignore repeat taps until this crossfade ends; reduced motion has no fades.
    const fades = words.flatMap(image => image.getAnimations());
    await Promise.all(fades.map(fade => fade.finished.catch(() => {})));
  } finally {
    changing = false;
  }
});
