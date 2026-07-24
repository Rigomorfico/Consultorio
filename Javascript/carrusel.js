// Carrusel "Elige a tu compañero".
// Auto-avance con bucle continuo, flechas prev/siguiente y pausa al pasar el cursor.
document.addEventListener("DOMContentLoaded", function () {
  var carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  var track = carousel.querySelector(".carousel-track");
  var slides = Array.prototype.slice.call(track.children);
  if (slides.length <= 1) return;

  var prevBtn = carousel.querySelector(".carousel-prev");
  var nextBtn = carousel.querySelector(".carousel-next");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var count = slides.length;
  var DURATION = reduce ? 0 : 600;   // debe coincidir con la transición del CSS
  var DELAY = 4000;                  // tiempo entre cambios automáticos
  var index = 0;
  var animating = false;
  var timer = null;

  // Clon de la primera tarjeta al final, para un bucle continuo sin rebobinado
  var clone = slides[0].cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);

  function setTransition(on) { track.style.transition = on ? "" : "none"; }
  function move() { track.style.transform = "translateX(" + (-index * 100) + "%)"; }

  function next() {
    if (animating) return;
    animating = true;
    index++;
    setTransition(true);
    move();
    window.setTimeout(function () {
      if (index === count) {          // aterrizamos en el clon: reposicionar sin animación
        setTransition(false);
        index = 0;
        move();
        void track.offsetWidth;       // fuerza reflujo para aplicar el salto
        setTransition(true);
      }
      animating = false;
    }, DURATION);
  }

  function prev() {
    if (animating) return;
    animating = true;
    if (index === 0) {                // salto instantáneo al clon y luego animar hacia atrás
      setTransition(false);
      index = count;
      move();
      void track.offsetWidth;
      setTransition(true);
      index = count - 1;
      move();
    } else {
      index--;
      setTransition(true);
      move();
    }
    window.setTimeout(function () { animating = false; }, DURATION);
  }

  function start() {
    if (reduce) return;
    stop();
    timer = window.setInterval(next, DELAY);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  if (nextBtn) nextBtn.addEventListener("click", function () { next(); start(); });
  if (prevBtn) prevBtn.addEventListener("click", function () { prev(); start(); });

  // Pausa al pasar el cursor o al enfocar con teclado; reanuda al salir
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  start();
});
