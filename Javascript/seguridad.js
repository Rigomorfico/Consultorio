/* Mecanismos de disuasión del sitio.
   Bloquean el panel de desarrollo, el clic derecho y el zoom por teclado,
   y mandan a 404.html cuando alguien insiste.

   Aviso: esto es disuasión, no seguridad. El sitio es estático y su código
   sigue siendo accesible por otras vías; aquí solo se frena al curioso.

   Los resguardos que llevan las reglas existen porque este sitio tiene
   formulario y se usa mucho desde el celular: sin ellos, la página se
   cerraría sola mientras un visitante escribe. */
(function () {
  "use strict";

  var PAGINA_ERROR = "404.html";
  var UMBRAL_PANEL = 350;        // px de crecimiento que delatan un panel acoplado
  var LECTURAS_PARA_ACTUAR = 2;  // lecturas seguidas antes de darlo por abierto

  // Si el script llegara a cargarse en la propia página de error, no hace nada:
  // evita que un clic derecho ahí provoque recargas en cadena.
  if (/404\.html$/i.test(window.location.pathname)) return;

  // En pantallas táctiles el teclado virtual y los gestos falsean las medidas
  // de la ventana, así que ahí no se vigila el tamaño ni se toca el zoom.
  var esTactil = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);

  var CAMPOS = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
  var yaRedirigido = false;

  function esCampo(el) {
    return !!(el && el.nodeType === 1 && el.closest && el.closest(CAMPOS));
  }

  function irAlError() {
    if (yaRedirigido) return;   // una sola vez: si no, se encadenan redirecciones
    yaRedirigido = true;
    // replace y no href, para que la página bloqueada no quede en el historial
    window.location.replace(PAGINA_ERROR);
  }

  /* ---- 1. Panel de desarrollo por teclado ---- */
  // En captura, para adelantarse a cualquier otro manejador de la página.
  document.addEventListener("keydown", function (e) {
    var tecla = (e.key || "").toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    var abrePanel =
      e.key === "F12" || e.key === "F10" ||
      (mod && e.shiftKey && (tecla === "i" || tecla === "j" || tecla === "c")) ||
      (mod && tecla === "u");

    if (abrePanel) {
      e.preventDefault();
      irAlError();
    }
  }, true);

  /* ---- 2. Clic derecho ---- */
  document.addEventListener("contextmenu", function (e) {
    // Dentro de un campo se respeta: es la vía para pegar, y en el celular
    // este mismo evento lo dispara la pulsación larga al escribir.
    if (esCampo(e.target)) return;
    e.preventDefault();
    irAlError();
  });

  /* ---- 3. Zoom, solo en escritorio ---- */
  // Aquí únicamente se impide el gesto; no manda a la página de error, porque
  // hacer zoom no es un intento de husmear sino una forma de leer mejor.
  if (!esTactil) {
    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    }, { passive: false });

    document.addEventListener("keydown", function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      var teclas = ["+", "-", "=", "_", "0"];
      var codigos = ["NumpadAdd", "NumpadSubtract", "Numpad0"];
      if (teclas.indexOf(e.key) !== -1 || codigos.indexOf(e.code) !== -1) {
        e.preventDefault();
      }
    });

    // Pellizco del trackpad en Safari de escritorio
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (evento) {
      document.addEventListener(evento, function (e) { e.preventDefault(); });
    });
  }

  /* ---- 3b. Zoom hecho desde el menú del navegador ---- */
  // Ese zoom no llega como evento: es interfaz de Chrome, no de la página, y
  // ninguna web puede impedirlo (es una función de accesibilidad y los
  // navegadores la protegen). Lo único posible es notarlo, porque
  // devicePixelRatio cambia con él, y pedir de buena manera volver al 100%.
  if (!esTactil) {
    var ratioZoomBase = window.devicePixelRatio;
    var esperaZoom = null;
    var tiempoOculta = null;
    var cajaAviso = null;

    // El aviso se arma desde aquí, con estilo propio, para no depender de
    // clases del sitio: este script vive en cuatro páginas distintas.
    var crearAviso = function () {
      var estilo = document.createElement("style");
      estilo.textContent =
        ".aviso-zoom{position:fixed;left:50%;bottom:5.5rem;transform:translateX(-50%);" +
        "max-width:min(90vw,30rem);background:rgba(0,0,0,.85);color:#fff;padding:.6rem 1rem;" +
        "border-radius:6px;font-size:.95rem;line-height:1.45;text-align:center;z-index:1400;" +
        "opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease}" +
        ".aviso-zoom.visible{opacity:1;visibility:visible}" +
        "@media (prefers-reduced-motion: reduce){.aviso-zoom{transition:none}}";
      document.head.appendChild(estilo);

      var caja = document.createElement("div");
      caja.className = "aviso-zoom";
      caja.setAttribute("role", "status");
      caja.setAttribute("aria-live", "polite");
      caja.textContent = "Para ver el sitio como fue diseñado, mantén el zoom del navegador al 100%.";
      document.body.appendChild(caja);
      return caja;
    };

    var mostrarAviso = function () {
      if (!document.body) return;
      if (!cajaAviso) cajaAviso = crearAviso();
      cajaAviso.classList.add("visible");
      clearTimeout(tiempoOculta);
      tiempoOculta = setTimeout(function () { cajaAviso.classList.remove("visible"); }, 5000);
    };

    // Cambiar el zoom dispara resize; la espera evita avisar en cada paso
    // intermedio cuando alguien ajusta varias veces seguidas.
    window.addEventListener("resize", function () {
      clearTimeout(esperaZoom);
      esperaZoom = setTimeout(function () {
        if (window.devicePixelRatio !== ratioZoomBase) {
          mostrarAviso();
        } else if (cajaAviso) {
          // Volvió al nivel con el que entró: el aviso ya no hace falta
          clearTimeout(tiempoOculta);
          cajaAviso.classList.remove("visible");
        }
      }, 300);
    });
  }

  /* ---- 4. Panel acoplado, detectado por el tamaño de la ventana ---- */
  // Se mide el crecimiento respecto a la carga, no el valor absoluto: así las
  // barras de extensiones o de favoritos no cuentan como panel abierto.
  if (!esTactil) {
    var baseAncho = window.outerWidth - window.innerWidth;
    var baseAlto = window.outerHeight - window.innerHeight;
    var baseRatio = window.devicePixelRatio;
    var seguidas = 0;

    setInterval(function () {
      // Cambiar el zoom mueve devicePixelRatio y con él las medidas: se
      // recalibra en lugar de tomarlo por un panel recién abierto. De avisar
      // por ese zoom ya se encarga la sección 3b.
      if (window.devicePixelRatio !== baseRatio) {
        baseRatio = window.devicePixelRatio;
        baseAncho = window.outerWidth - window.innerWidth;
        baseAlto = window.outerHeight - window.innerHeight;
        seguidas = 0;
        return;
      }

      // Con un campo enfocado no se mide: el teclado y los paneles del sistema
      // alteran la ventana justo mientras alguien está escribiendo.
      if (esCampo(document.activeElement)) {
        seguidas = 0;
        return;
      }

      var creceAncho = (window.outerWidth - window.innerWidth) - baseAncho;
      var creceAlto = (window.outerHeight - window.innerHeight) - baseAlto;

      if (creceAncho > UMBRAL_PANEL || creceAlto > UMBRAL_PANEL) {
        seguidas++;
        if (seguidas >= LECTURAS_PARA_ACTUAR) irAlError();
      } else {
        seguidas = 0;
      }
    }, 1000);
  }
})();
