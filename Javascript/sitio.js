document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("[data-whatsapp-form]");
  if (!form) return;

  // ----- Compañero elegido desde el carrusel -----
  const carousel = document.querySelector("[data-carousel]");
  const valueInput = form.querySelector("[data-companion-value]");
  const emptyState = form.querySelector("[data-companion-empty]");
  const chosenState = form.querySelector("[data-companion-chosen]");

  if (carousel && valueInput && emptyState && chosenState) {
    const chosenImg = chosenState.querySelector("[data-companion-img]");
    const chosenName = chosenState.querySelector("[data-companion-name]");
    const fallback = chosenState.querySelector("[data-companion-fallback]");

    // Si la foto no cargara, en su lugar queda el peluche de respaldo
    chosenImg.addEventListener("error", function () {
      chosenImg.hidden = true;
      fallback.hidden = false;
    });

    // Delegación: el carrusel clona una tarjeta al vuelo, así que no podemos
    // enganchar cada botón por separado; el clon quedaría muerto.
    carousel.addEventListener("click", function (event) {
      const button = event.target.closest("[data-companion-choose]");
      if (!button) return;

      const card = button.closest(".companion-card");
      if (!card) return;

      const name = card.querySelector("h3").textContent.trim();
      const src = card.querySelector("img").getAttribute("src");

      valueInput.value = name;
      fallback.hidden = true;
      chosenImg.hidden = false;
      chosenImg.src = src;
      chosenImg.alt = name;
      chosenName.textContent = name;
      emptyState.hidden = true;
      chosenState.hidden = false;

      // Marca la tarjeta elegida; comparamos por nombre para marcar también el clon
      const cards = carousel.querySelectorAll(".companion-card");
      Array.prototype.forEach.call(cards, function (item) {
        const title = item.querySelector("h3");
        item.classList.toggle("is-chosen", !!title && title.textContent.trim() === name);
      });

      // Sin argumentos hereda el scroll-behavior del CSS, que ya respeta
      // la preferencia de movimiento reducido
      document.getElementById("cita").scrollIntoView();
      chosenState.focus();
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const companero = (data.get("companero") || "").trim();
    const lines = [
      "Hola, Psic. Mileidy García. Quisiera solicitar información.",
      "Nombre: " + data.get("nombre"),
      "Teléfono: " + data.get("telefono")
    ];
    if (companero) lines.push("Compañero: " + companero);
    lines.push("Mensaje: " + data.get("mensaje"));
    window.open("https://wa.me/523114451806?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
  });
});
