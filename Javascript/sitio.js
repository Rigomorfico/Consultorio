document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("[data-whatsapp-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      "Hola, Psic. Mileidy García. Quisiera solicitar información.",
      "Nombre: " + data.get("nombre"),
      "Teléfono: " + data.get("telefono"),
      "Mensaje: " + data.get("mensaje")
    ].join("\n");
    window.open("https://wa.me/523114451806?text=" + encodeURIComponent(message), "_blank", "noopener");
  });
});
