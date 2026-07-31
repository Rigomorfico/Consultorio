(() => {
  "use strict";

  // Pega aquí solamente el ID de cliente OAuth de tipo "Aplicación web".
  // El client_secret nunca debe publicarse en GitHub Pages.
  const GOOGLE_CLIENT_ID = "PENDIENTE.apps.googleusercontent.com";
  const SCOPE = "https://www.googleapis.com/auth/calendar.events";
  const API_BASE = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

  const loginPanel = document.querySelector("[data-login-panel]");
  const workspace = document.querySelector("[data-workspace]");
  const connectButton = document.querySelector("[data-connect]");
  const loginStatus = document.querySelector("[data-login-status]");
  const syncStatus = document.querySelector("[data-sync-status]");
  const periodTitle = document.querySelector("[data-period-title]");
  const monthGrid = document.querySelector("[data-month-grid]");
  const eventList = document.querySelector("[data-event-list]");
  const dialog = document.querySelector("[data-event-dialog]");
  const form = document.querySelector("[data-event-form]");
  const formTitle = document.querySelector("[data-form-title]");
  const formError = document.querySelector("[data-form-error]");
  const deleteButton = document.querySelector("[data-delete-event]");

  let tokenClient;
  let accessToken = "";
  let visibleDate = new Date();
  let events = [];

  const pad = value => String(value).padStart(2, "0");
  const localInputValue = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const dayKey = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const eventStart = event => new Date(event.start.dateTime || `${event.start.date}T00:00:00`);

  function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("is-error", isError);
  }

  function waitForGoogle(attempts = 40) {
    if (window.google?.accounts?.oauth2) {
      initializeGoogle();
      return;
    }
    if (attempts > 0) {
      window.setTimeout(() => waitForGoogle(attempts - 1), 150);
      return;
    }
    connectButton.disabled = true;
    setStatus(loginStatus, "No fue posible cargar el acceso de Google. Revisa la conexión e inténtalo nuevamente.", true);
  }

  function initializeGoogle() {
    if (GOOGLE_CLIENT_ID.startsWith("PENDIENTE")) {
      connectButton.disabled = true;
      setStatus(loginStatus, "Falta configurar el ID de cliente OAuth de Google.", true);
      return;
    }
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: handleTokenResponse,
      error_callback: () => setStatus(loginStatus, "Google cerró o rechazó la autorización.", true)
    });
    connectButton.disabled = false;
    setStatus(loginStatus, "Google solicitará permiso para administrar los eventos.");
  }

  function handleTokenResponse(response) {
    if (response.error) {
      setStatus(loginStatus, `No se pudo autorizar: ${response.error}`, true);
      return;
    }
    accessToken = response.access_token;
    loginPanel.hidden = true;
    workspace.hidden = false;
    loadEvents();
  }

  async function apiRequest(url = API_BASE, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json", ...(options.headers || {}) }
    });
    if (response.status === 401) {
      disconnect(false);
      setStatus(loginStatus, "La sesión expiró. Conecta nuevamente tu cuenta.", true);
      throw new Error("Sesión expirada");
    }
    if (!response.ok) {
      let message = `Error de Google (${response.status})`;
      try { message = (await response.json()).error?.message || message; } catch (_) { /* respuesta sin JSON */ }
      throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
  }

  function monthBounds() {
    const start = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1);
    const end = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1);
    return { start, end };
  }

  async function loadEvents() {
    setStatus(syncStatus, "Sincronizando…");
    const { start, end } = monthBounds();
    const params = new URLSearchParams({ timeMin: start.toISOString(), timeMax: end.toISOString(), singleEvents: "true", orderBy: "startTime", maxResults: "250" });
    try {
      const data = await apiRequest(`${API_BASE}?${params}`);
      events = data.items || [];
      renderCalendar();
      setStatus(syncStatus, `Sincronizada · ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`);
    } catch (error) {
      if (accessToken) setStatus(syncStatus, error.message, true);
    }
  }

  function renderCalendar() {
    const year = visibleDate.getFullYear();
    const month = visibleDate.getMonth();
    periodTitle.textContent = visibleDate.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
    monthGrid.replaceChildren();
    const first = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
    const today = dayKey(new Date());

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      const key = dayKey(date);
      const cellEvents = events.filter(event => dayKey(eventStart(event)) === key);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-cell";
      if (date.getMonth() !== month) button.classList.add("is-outside");
      if (key === today) button.classList.add("is-today");
      button.dataset.date = key;
      button.setAttribute("aria-label", `${date.toLocaleDateString("es-MX", { dateStyle: "full" })}, ${cellEvents.length} eventos`);
      const number = document.createElement("span");
      number.className = "day-number";
      number.textContent = date.getDate();
      const group = document.createElement("span");
      group.className = "day-events";
      cellEvents.slice(0, 3).forEach(event => {
        const item = document.createElement("span");
        item.className = "day-event";
        item.textContent = event.summary || "Sin título";
        group.append(item);
      });
      button.append(number, group);
      monthGrid.append(button);
    }
    renderEventList();
  }

  function renderEventList() {
    eventList.replaceChildren();
    if (!events.length) {
      const empty = document.createElement("p");
      empty.className = "empty-events";
      empty.textContent = "No hay eventos en este mes.";
      eventList.append(empty);
      return;
    }
    events.forEach(event => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "event-card";
      button.dataset.eventId = event.id;
      const title = document.createElement("strong");
      title.textContent = event.summary || "Sin título";
      const time = document.createElement("span");
      time.textContent = formatEventDate(event);
      button.append(title, time);
      eventList.append(button);
    });
  }

  function formatEventDate(event) {
    if (event.start.date) return eventStart(event).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" });
    return eventStart(event).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function openNewEvent(date = new Date()) {
    const start = new Date(date);
    start.setHours(Math.max(new Date().getHours() + 1, 9), 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    form.reset();
    form.elements.eventId.value = "";
    form.elements.start.value = localInputValue(start);
    form.elements.end.value = localInputValue(end);
    formTitle.textContent = "Nuevo evento";
    deleteButton.hidden = true;
    formError.textContent = "";
    dialog.showModal();
    form.elements.summary.focus();
  }

  function openExistingEvent(event) {
    form.reset();
    form.elements.eventId.value = event.id;
    form.elements.summary.value = event.summary || "";
    form.elements.description.value = event.description || "";
    form.elements.start.value = localInputValue(eventStart(event));
    form.elements.end.value = localInputValue(new Date(event.end.dateTime || `${event.end.date}T00:00:00`));
    formTitle.textContent = "Editar evento";
    deleteButton.hidden = false;
    formError.textContent = "";
    dialog.showModal();
  }

  async function saveEvent(event) {
    event.preventDefault();
    formError.textContent = "";
    const data = new FormData(form);
    const start = new Date(data.get("start"));
    const end = new Date(data.get("end"));
    if (end <= start) {
      formError.textContent = "La hora de fin debe ser posterior a la de inicio.";
      return;
    }
    const payload = { summary: data.get("summary").trim(), description: data.get("description").trim(), start: { dateTime: start.toISOString() }, end: { dateTime: end.toISOString() } };
    const eventId = data.get("eventId");
    const saveButton = document.querySelector("[data-save-event]");
    saveButton.disabled = true;
    try {
      await apiRequest(eventId ? `${API_BASE}/${encodeURIComponent(eventId)}` : API_BASE, { method: eventId ? "PATCH" : "POST", body: JSON.stringify(payload) });
      dialog.close();
      await loadEvents();
    } catch (error) { formError.textContent = error.message; }
    finally { saveButton.disabled = false; }
  }

  async function deleteEvent() {
    const eventId = form.elements.eventId.value;
    if (!eventId || !window.confirm("¿Eliminar este evento de Google Calendar?")) return;
    deleteButton.disabled = true;
    try {
      await apiRequest(`${API_BASE}/${encodeURIComponent(eventId)}`, { method: "DELETE" });
      dialog.close();
      await loadEvents();
    } catch (error) { formError.textContent = error.message; }
    finally { deleteButton.disabled = false; }
  }

  function disconnect(revoke = true) {
    if (revoke && accessToken) google.accounts.oauth2.revoke(accessToken, () => {});
    accessToken = "";
    events = [];
    workspace.hidden = true;
    loginPanel.hidden = false;
    setStatus(loginStatus, "Cuenta desconectada. Puedes volver a autorizarla cuando quieras.");
  }

  connectButton.addEventListener("click", () => tokenClient?.requestAccessToken({ prompt: "consent" }));
  document.querySelector("[data-refresh]").addEventListener("click", loadEvents);
  document.querySelector("[data-disconnect]").addEventListener("click", () => disconnect(true));
  document.querySelector("[data-new-event]").addEventListener("click", () => openNewEvent());
  document.querySelector("[data-previous]").addEventListener("click", () => { visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() - 1, 1); loadEvents(); });
  document.querySelector("[data-next]").addEventListener("click", () => { visibleDate = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 1); loadEvents(); });
  document.querySelector("[data-today]").addEventListener("click", () => { visibleDate = new Date(); loadEvents(); });
  monthGrid.addEventListener("click", event => { const cell = event.target.closest("[data-date]"); if (cell) openNewEvent(new Date(`${cell.dataset.date}T12:00:00`)); });
  eventList.addEventListener("click", event => { const card = event.target.closest("[data-event-id]"); const item = events.find(entry => entry.id === card?.dataset.eventId); if (item) openExistingEvent(item); });
  document.querySelectorAll("[data-close-dialog]").forEach(button => button.addEventListener("click", () => dialog.close()));
  form.addEventListener("submit", saveEvent);
  deleteButton.addEventListener("click", deleteEvent);
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  connectButton.disabled = true;
  waitForGoogle();
})();
