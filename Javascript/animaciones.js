// Aparición de tarjetas al hacer scroll.
// Seguro: si no hay soporte o el usuario prefiere menos movimiento,
// las tarjetas simplemente quedan visibles (no se ocultan).
document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".include-card");
  if (!cards.length) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  cards.forEach(function (card) { card.classList.add("reveal-init"); });

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

  cards.forEach(function (card) { observer.observe(card); });
});
