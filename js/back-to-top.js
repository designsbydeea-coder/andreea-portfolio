document.querySelector(".footer-back-to-top")?.addEventListener("click", (event) => {
  const target = document.getElementById("top");
  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
  });
});
