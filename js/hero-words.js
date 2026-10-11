const heroWord = document.querySelector('.hero-amazing img');
const words = [
  { src: new URL('../assets/icons/hero_good.svg', import.meta.url).href, alt: 'GOOD' },
  { src: new URL('../assets/icons/hero_stunning.svg', import.meta.url).href, alt: 'STUNNING' },
  { src: new URL('../assets/icons/hero_amazing.svg', import.meta.url).href, alt: 'AMAZING' }
];

// Load each SVG before cycling to avoid a blank frame when the word changes.
await Promise.all(words.map(word => {
  const image = new Image();
  image.src = word.src;
  return image.decode();
}));

let currentWord = 0;
setInterval(() => {
  currentWord = (currentWord + 1) % words.length;
  heroWord.src = words[currentWord].src;
  heroWord.alt = words[currentWord].alt;
}, 2250);
