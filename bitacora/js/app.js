(() => {
    "use strict";

    const database = window.LocalDatabase;
    const $ = (selector) => document.querySelector(selector);
    const elements = {
        connection: $("#connection-status"),
        install: $("#install-button"),
        sidebar: $("#sidebar"),
        sidebarBackdrop: $("#sidebar-backdrop"),
        toggleSidebar: $("#toggle-sidebar-button"),
        closeSidebar: $("#close-sidebar-button"),
        newEntry: $("#new-entry-button"),
        newEntryMobile: $("#new-entry-mobile"),
        miniTitle: $("#mini-title"),
        miniGrid: $("#mini-grid"),
        miniPrev: $("#mini-prev"),
        miniNext: $("#mini-next"),
        startHour: $("#start-hour"),
        endHour: $("#end-hour"),
        days: $("#days-select"),
        export: $("#export-button"),
        import: $("#import-button"),
        importFile: $("#import-file"),
        storage: $("#storage-label"),
        prev: $("#prev-button"),
        next: $("#next-button"),
        today: $("#today-button"),
        rangeLabel: $("#range-label"),
        rangeCount: $("#range-count"),
        notice: $("#notice"),
        scroll: $("#schedule-scroll"),
        schedule: $("#schedule"),
        dragHint: $("#drag-hint"),
        dialog: $("#entry-dialog"),
        form: $("#entry-form"),
        dialogTitle: $("#dialog-title"),
        entryId: $("#entry-id"),
        patient: $("#entry-patient"),
        type: $("#entry-type"),
        date: $("#entry-date"),
        hour: $("#entry-hour"),
        colors: $("#color-options"),
        formError: $("#form-error"),
        deleteEntry: $("#delete-entry-button"),
        patientOptions: $("#patient-options"),
        typeOptions: $("#type-options"),
        updateBanner: $("#update-banner"),
        applyUpdate: $("#apply-update-button"),
        dismissUpdate: $("#dismiss-update-button"),
        iosDialog: $("#ios-install-dialog")
    };

    const COLORS = [
        { hex: "#7b2cbf", name: "Morado" },
        { hex: "#a37ad6", name: "Lavanda" },
        { hex: "#d6487e", name: "Rosa" },
        { hex: "#e07a5f", name: "Coral" },
        { hex: "#d9a032", name: "Ámbar" },
        { hex: "#3f9a6b", name: "Verde" },
        { hex: "#3b7dd8", name: "Azul" },
        { hex: "#6b6478", name: "Gris" }
    ];
    const DEFAULT_TYPES = ["Primera vez", "Seguimiento", "Terapia individual", "Terapia de pareja", "Terapia familiar", "Consulta en línea", "Valoración"];
    const DAY_SETS = { "mon-fri": [0, 1, 2, 3, 4], "mon-sat": [0, 1, 2, 3, 4, 5], all: [0, 1, 2, 3, 4, 5, 6] };
    const NARROW_QUERY = window.matchMedia("(max-width: 700px)");
    const NARROW_DAYS = 3;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let appointments = [];
    let slotMap = new Map();
    let schedule = { startHour: 8, endHour: 20, days: "mon-sat" };
    let focusDate = startOfDay(new Date());
    let miniMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    let visible = [];
    let colorTouched = false;
    let drag = null;
    let suppressClick = false;
    let registration;
    let waitingWorker;
    let deferredInstallPrompt;
    let noticeTimer;

    // ---------- Utilidades de fecha (siempre en hora local) ----------
    function pad(value) { return String(value).padStart(2, "0"); }
    function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    function addDays(date, amount) { return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount); }
    function dateKey(date) { return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`; }
    function fromKey(key) {
        const [year, month, day] = key.split("-").map(Number);
        return new Date(year, month - 1, day);
    }
    function weekdayIndex(date) { return (date.getDay() + 6) % 7; } // lunes = 0
    function startOfWeek(date) { return addDays(date, -weekdayIndex(date)); }
    function hourLabel(hour) { return `${pad(hour)}:00`; }
    function slotKey(date, hour) { return `${date}|${hour}`; }
    function isValidDateKey(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && dateKey(fromKey(value)) === value; }
    const longDate = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });
    const shortMonth = new Intl.DateTimeFormat("es", { month: "short" });
    const monthYear = new Intl.DateTimeFormat("es", { month: "long", year: "numeric" });
    const weekdayShort = new Intl.DateTimeFormat("es", { weekday: "short" });

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function createId() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }

    function tint(hex, alpha) {
        const value = /^#[0-9a-f]{6}$/i.test(hex) ? hex : COLORS[0].hex;
        const r = parseInt(value.slice(1, 3), 16);
        const g = parseInt(value.slice(3, 5), 16);
        const b = parseInt(value.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function safeColor(hex) { return COLORS.some((color) => color.hex === hex) ? hex : COLORS[0].hex; }

    // ---------- Avisos ----------
    function showNotice(message, isError, action) {
        window.clearTimeout(noticeTimer);
        elements.notice.textContent = message;
        if (action) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "notice-action";
            button.textContent = action.label;
            button.addEventListener("click", () => {
                elements.notice.hidden = true;
                action.handler();
            }, { once: true });
            elements.notice.append(" ", button);
        }
        elements.notice.classList.toggle("notice-error", Boolean(isError));
        elements.notice.hidden = false;
        if (!isError) noticeTimer = window.setTimeout(() => { elements.notice.hidden = true; }, action ? 8000 : 4500);
    }

    // ---------- Días visibles ----------
    function allowedDays() { return DAY_SETS[schedule.days] || DAY_SETS["mon-sat"]; }
    // Un día fuera del horario se muestra igual si tiene fichas, para que nunca queden ocultas.
    function isAllowed(date) {
        return allowedDays().includes(weekdayIndex(date)) || appointments.some((item) => item.date === dateKey(date));
    }

    function computeVisibleDays() {
        if (!NARROW_QUERY.matches) {
            const monday = startOfWeek(focusDate);
            return [0, 1, 2, 3, 4, 5, 6].map((index) => addDays(monday, index)).filter(isAllowed);
        }
        const days = [];
        let cursor = focusDate;
        for (let guard = 0; days.length < NARROW_DAYS && guard < 21; guard += 1) {
            if (isAllowed(cursor)) days.push(cursor);
            cursor = addDays(cursor, 1);
        }
        return days;
    }

    function navigate(direction) {
        if (!NARROW_QUERY.matches) {
            focusDate = addDays(focusDate, 7 * direction);
        } else if (direction > 0) {
            focusDate = addDays(visible[visible.length - 1], 1);
        } else {
            const days = [];
            let cursor = addDays(visible[0], -1);
            for (let guard = 0; days.length < NARROW_DAYS && guard < 21; guard += 1) {
                if (isAllowed(cursor)) days.push(cursor);
                cursor = addDays(cursor, -1);
            }
            focusDate = days[days.length - 1] || addDays(focusDate, -NARROW_DAYS);
        }
        miniMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
        render();
    }

    function hourRange(days) {
        const keys = new Set(days.map(dateKey));
        let start = schedule.startHour;
        let end = schedule.endHour;
        appointments.forEach((appointment) => {
            if (!keys.has(appointment.date)) return;
            start = Math.min(start, appointment.hour);
            end = Math.max(end, appointment.hour + 1);
        });
        const hours = [];
        for (let hour = start; hour < end; hour += 1) hours.push(hour);
        return hours;
    }

    // ---------- Render ----------
    function rebuildSlotMap() {
        slotMap = new Map(appointments.map((appointment) => [slotKey(appointment.date, appointment.hour), appointment]));
    }

    function rangeText(days) {
        if (days.length === 0) return "";
        const first = days[0];
        const last = days[days.length - 1];
        if (days.length === 1) return longDate.format(first);
        const sameMonth = first.getMonth() === last.getMonth();
        const sameYear = first.getFullYear() === last.getFullYear();
        const left = sameMonth ? first.getDate() : `${first.getDate()} ${shortMonth.format(first).replace(".", "")}`;
        const right = `${last.getDate()} ${shortMonth.format(last).replace(".", "")}`;
        return `${left} – ${right}${sameYear ? ` ${last.getFullYear()}` : ""}`;
    }

    function fichaMarkup(appointment) {
        const color = safeColor(appointment.color);
        const label = `${appointment.patient}, ${appointment.type}, ${longDate.format(fromKey(appointment.date))} a las ${hourLabel(appointment.hour)}. Toca para editar.`;
        return `<button class="ficha" type="button" data-id="${escapeHTML(appointment.id)}" style="--c:${color};--tint:${tint(color, 0.14)}" aria-label="${escapeHTML(label)}">
            <span class="ficha-name">${escapeHTML(appointment.patient)}</span>
            <span class="ficha-type">${escapeHTML(appointment.type)}</span>
            <span class="ficha-time">${hourLabel(appointment.hour)}</span>
        </button>`;
    }

    function renderSchedule() {
        visible = computeVisibleDays();
        const hours = hourRange(visible);
        const now = new Date();
        const todayKey = dateKey(now);
        const keys = visible.map(dateKey);
        let count = 0;

        const head = [`<div class="corner"></div>`];
        visible.forEach((day, index) => {
            const isToday = keys[index] === todayKey;
            head.push(`<div class="day-head${isToday ? " is-today" : ""}"><span class="dow">${escapeHTML(weekdayShort.format(day).replace(".", ""))}</span><span class="dom">${day.getDate()}</span></div>`);
        });

        const rows = hours.map((hour) => {
            const cells = [`<div class="hour-label">${hourLabel(hour)}</div>`];
            keys.forEach((key, index) => {
                const appointment = slotMap.get(slotKey(key, hour));
                if (appointment) count += 1;
                const isToday = key === todayKey;
                const isNow = isToday && now.getHours() === hour;
                const slotEnd = new Date(visible[index].getFullYear(), visible[index].getMonth(), visible[index].getDate(), hour + 1);
                const classes = ["slot", isToday ? "is-today" : "", slotEnd <= now ? "is-past" : ""].filter(Boolean).join(" ");
                const nowLine = isNow ? `<span class="now-line" style="top:${(now.getMinutes() / 60) * 100}%"></span>` : "";
                const content = appointment
                    ? fichaMarkup(appointment)
                    : `<button class="slot-add" type="button" data-date="${key}" data-hour="${hour}" aria-label="Agendar el ${escapeHTML(longDate.format(visible[index]))} a las ${hourLabel(hour)}"><span aria-hidden="true">＋</span></button>`;
                cells.push(`<div class="${classes}" data-date="${key}" data-hour="${hour}">${content}${nowLine}</div>`);
            });
            return cells.join("");
        });

        elements.schedule.style.setProperty("--days", String(visible.length));
        elements.schedule.innerHTML = head.join("") + rows.join("");
        elements.rangeLabel.textContent = rangeText(visible);
        elements.rangeCount.textContent = count === 1 ? "1 ficha" : `${count} fichas`;
    }

    function renderMiniCalendar() {
        const title = monthYear.format(miniMonth);
        elements.miniTitle.textContent = title.charAt(0).toLocaleUpperCase("es") + title.slice(1);
        const first = startOfWeek(miniMonth);
        const todayKey = dateKey(new Date());
        const visibleKeys = new Set(visible.map(dateKey));
        const busy = new Set(appointments.map((appointment) => appointment.date));
        const cells = [];
        for (let index = 0; index < 42; index += 1) {
            const day = addDays(first, index);
            const key = dateKey(day);
            const classes = ["mini-day",
                day.getMonth() !== miniMonth.getMonth() ? "is-other" : "",
                key === todayKey ? "is-today" : "",
                visibleKeys.has(key) ? "is-visible" : "",
                busy.has(key) ? "has-items" : ""].filter(Boolean).join(" ");
            cells.push(`<button class="${classes}" type="button" data-date="${key}" aria-label="${escapeHTML(longDate.format(day))}">${day.getDate()}</button>`);
        }
        elements.miniGrid.innerHTML = cells.join("");
    }

    function renderDatalists() {
        const patients = [...new Set(appointments.map((appointment) => appointment.patient))].sort((a, b) => a.localeCompare(b, "es"));
        const types = [...new Set([...DEFAULT_TYPES, ...appointments.map((appointment) => appointment.type)])];
        elements.patientOptions.innerHTML = patients.map((name) => `<option value="${escapeHTML(name)}"></option>`).join("");
        elements.typeOptions.innerHTML = types.map((name) => `<option value="${escapeHTML(name)}"></option>`).join("");
    }

    function render() {
        renderSchedule();
        renderMiniCalendar();
    }

    function scrollToHour(hour) {
        const row = elements.schedule.querySelector(`.slot[data-hour="${hour}"]`);
        if (!row) return;
        const header = elements.schedule.querySelector(".day-head");
        elements.scroll.scrollTop = Math.max(0, row.offsetTop - (header ? header.offsetHeight : 0) - 8);
    }

    function scrollToNow() {
        const hour = new Date().getHours();
        scrollToHour(Math.max(schedule.startHour, Math.min(hour - 1, schedule.endHour - 1)));
    }

    async function refreshData() {
        appointments = await database.readAll("appointments");
        rebuildSlotMap();
        renderDatalists();
        render();
    }

    // ---------- Diálogo de ficha ----------
    function fillHourOptions() {
        const options = [];
        for (let hour = 0; hour < 24; hour += 1) {
            options.push(`<option value="${hour}">${hourLabel(hour)} – ${hourLabel((hour + 1) % 24)}</option>`);
        }
        elements.hour.innerHTML = options.join("");
    }

    function renderColorOptions(selected) {
        elements.colors.innerHTML = COLORS.map((color) => `
            <label class="swatch" style="--c:${color.hex}" title="${color.name}">
                <input type="radio" name="color" value="${color.hex}" ${color.hex === selected ? "checked" : ""}>
                <span class="swatch-dot"></span><span class="sr-only">${color.name}</span>
            </label>`).join("");
    }

    function selectedColor() {
        const input = elements.colors.querySelector('input[name="color"]:checked');
        return input ? input.value : COLORS[0].hex;
    }

    function setFormError(message) {
        elements.formError.textContent = message || "";
        elements.formError.hidden = !message;
    }

    function openEntryDialog(appointment, slot) {
        closeSidebar();
        elements.form.reset();
        setFormError("");
        colorTouched = Boolean(appointment);
        elements.entryId.value = appointment ? appointment.id : "";
        elements.dialogTitle.textContent = appointment ? "Editar ficha" : "Nueva ficha";
        elements.deleteEntry.hidden = !appointment;
        elements.patient.value = appointment ? appointment.patient : "";
        elements.type.value = appointment ? appointment.type : "";
        const fallbackHour = Math.min(Math.max(new Date().getHours() + 1, schedule.startHour), schedule.endHour - 1);
        elements.date.value = appointment ? appointment.date : (slot ? slot.date : dateKey(isAllowed(focusDate) ? focusDate : visible[0] || focusDate));
        elements.hour.value = String(appointment ? appointment.hour : (slot ? slot.hour : fallbackHour));
        renderColorOptions(appointment ? safeColor(appointment.color) : COLORS[0].hex);
        elements.dialog.showModal();
        if (!isTouch) elements.patient.focus();
    }

    function suggestColorForType() {
        if (colorTouched) return;
        const type = elements.type.value.trim().toLocaleLowerCase("es");
        const match = [...appointments].reverse().find((item) => item.type.toLocaleLowerCase("es") === type);
        if (match) renderColorOptions(safeColor(match.color));
    }

    async function submitEntry(event) {
        event.preventDefault();
        const patient = elements.patient.value.trim();
        const type = elements.type.value.trim();
        const date = elements.date.value;
        const hour = Number(elements.hour.value);
        if (!patient) { setFormError("Escribe el nombre del paciente."); elements.patient.focus(); return; }
        if (!type) { setFormError("Indica el tipo de consulta."); elements.type.focus(); return; }
        if (!isValidDateKey(date)) { setFormError("Elige el día de la cita."); elements.date.focus(); return; }
        if (!Number.isInteger(hour) || hour < 0 || hour > 23) { setFormError("Elige la hora de la cita."); return; }

        const id = elements.entryId.value || createId();
        const previous = appointments.find((item) => item.id === id);
        const occupant = slotMap.get(slotKey(date, hour));
        if (occupant && occupant.id !== id) {
            setFormError(`Ese horario ya lo tiene ${occupant.patient}. Elige otra hora o mueve esa ficha.`);
            return;
        }
        const now = new Date().toISOString();
        const appointment = {
            id, date, hour, patient, type,
            color: safeColor(selectedColor()),
            createdAt: previous ? previous.createdAt : now,
            updatedAt: now
        };
        try {
            await database.saveAppointments([appointment]);
            elements.dialog.close();
            // Si la ficha quedó fuera de los días que se ven, salta a ese día.
            if (!visible.some((day) => dateKey(day) === date)) {
                focusDate = fromKey(date);
                miniMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
            }
            await refreshData();
            showNotice(previous ? "Ficha actualizada." : `Ficha agendada: ${patient}, ${hourLabel(hour)}.`);
        } catch (error) {
            setFormError(`No se pudo guardar la ficha: ${error.message}`);
        }
    }

    async function deleteCurrent() {
        const appointment = appointments.find((item) => item.id === elements.entryId.value);
        if (!appointment) return;
        if (!window.confirm(`¿Eliminar la ficha de ${appointment.patient} (${hourLabel(appointment.hour)})?`)) return;
        try {
            await database.deleteAppointment(appointment.id);
            elements.dialog.close();
            await refreshData();
            showNotice("Ficha eliminada.", false, {
                label: "Deshacer",
                handler: async () => {
                    if (slotMap.has(slotKey(appointment.date, appointment.hour))) {
                        showNotice("No se pudo deshacer: ese horario ya está ocupado.", true);
                        return;
                    }
                    await database.saveAppointments([appointment]);
                    await refreshData();
                }
            });
        } catch (error) {
            setFormError(`No se pudo eliminar la ficha: ${error.message}`);
        }
    }

    // ---------- Mover fichas (arrastrar y soltar) ----------
    async function moveAppointment(appointment, date, hour) {
        if (appointment.date === date && appointment.hour === hour) return;
        const now = new Date().toISOString();
        const other = slotMap.get(slotKey(date, hour));
        const before = [{ ...appointment }];
        const changes = [{ ...appointment, date, hour, updatedAt: now }];
        if (other) {
            before.push({ ...other });
            changes.push({ ...other, date: appointment.date, hour: appointment.hour, updatedAt: now });
        }
        try {
            await database.saveAppointments(changes);
            await refreshData();
            const message = other
                ? `Se intercambiaron ${appointment.patient} y ${other.patient}.`
                : `${appointment.patient} → ${longDate.format(fromKey(date))}, ${hourLabel(hour)}.`;
            showNotice(message, false, {
                label: "Deshacer",
                handler: async () => {
                    await database.saveAppointments(before);
                    await refreshData();
                }
            });
        } catch (error) {
            showNotice(`No se pudo mover la ficha: ${error.message}`, true);
            await refreshData();
        }
    }

    function clearDropTarget() {
        if (drag && drag.target) drag.target.classList.remove("is-drop", "is-swap");
        if (drag) drag.target = null;
    }

    function updateDropTarget(x, y) {
        const hit = document.elementFromPoint(x, y);
        const cell = hit && hit.closest ? hit.closest(".slot") : null;
        const target = cell && elements.schedule.contains(cell) ? cell : null;
        if (target === drag.target) return;
        clearDropTarget();
        if (!target) return;
        const occupied = target.querySelector(".ficha");
        const isOrigin = occupied && occupied.dataset.id === drag.appointment.id;
        if (isOrigin) return;
        drag.target = target;
        target.classList.add(occupied ? "is-swap" : "is-drop");
    }

    function startDrag() {
        const rect = drag.element.getBoundingClientRect();
        const ghost = drag.element.cloneNode(true);
        ghost.classList.add("ficha-ghost");
        ghost.removeAttribute("data-id");
        ghost.setAttribute("aria-hidden", "true");
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        drag.offsetX = drag.startX - rect.left;
        drag.offsetY = drag.startY - rect.top;
        document.body.append(ghost);
        drag.ghost = ghost;
        drag.active = true;
        drag.element.classList.remove("is-pressing");
        drag.element.classList.add("is-dragging");
        document.body.classList.add("is-dragging");
        if (navigator.vibrate) navigator.vibrate(12);
        positionGhost(drag.lastX, drag.lastY);
        autoScroll();
    }

    function positionGhost(x, y) {
        drag.ghost.style.transform = `translate(${x - drag.offsetX}px, ${y - drag.offsetY}px) rotate(-1.5deg) scale(1.03)`;
    }

    function autoScroll() {
        if (!drag || !drag.active) return;
        const rect = elements.scroll.getBoundingClientRect();
        const edge = 48;
        let dy = 0;
        let dx = 0;
        if (drag.lastY < rect.top + edge + 40) dy = -Math.ceil((rect.top + edge + 40 - drag.lastY) / 6);
        else if (drag.lastY > rect.bottom - edge) dy = Math.ceil((drag.lastY - (rect.bottom - edge)) / 6);
        if (drag.lastX < rect.left + edge + 30) dx = -Math.ceil((rect.left + edge + 30 - drag.lastX) / 8);
        else if (drag.lastX > rect.right - edge) dx = Math.ceil((drag.lastX - (rect.right - edge)) / 8);
        if (dy || dx) {
            elements.scroll.scrollTop += dy;
            elements.scroll.scrollLeft += dx;
            updateDropTarget(drag.lastX, drag.lastY);
        }
        drag.frame = window.requestAnimationFrame(autoScroll);
    }

    function endDrag(commit) {
        if (!drag) return;
        const current = drag;
        window.clearTimeout(current.timer);
        window.cancelAnimationFrame(current.frame);
        current.element.classList.remove("is-pressing", "is-dragging");
        document.body.classList.remove("is-dragging");
        if (current.ghost) current.ghost.remove();
        const target = current.target;
        clearDropTarget();
        drag = null;
        if (current.active) {
            suppressClick = true;
            window.setTimeout(() => { suppressClick = false; }, 350);
            if (commit && target) moveAppointment(current.appointment, target.dataset.date, Number(target.dataset.hour));
        }
    }

    function onPointerDown(event) {
        const element = event.target.closest(".ficha");
        if (!element || drag || (event.pointerType === "mouse" && event.button !== 0)) return;
        const appointment = appointments.find((item) => item.id === element.dataset.id);
        if (!appointment) return;
        drag = {
            appointment, element,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            startX: event.clientX, startY: event.clientY,
            lastX: event.clientX, lastY: event.clientY,
            active: false, target: null, ghost: null, timer: 0, frame: 0
        };
        if (event.pointerType !== "mouse") {
            // En pantallas táctiles se mantiene presionada para no confundir con desplazarse.
            element.classList.add("is-pressing");
            drag.timer = window.setTimeout(() => { if (drag && !drag.active) startDrag(); }, 320);
        }
    }

    function onPointerMove(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (!drag.active) {
            if (drag.pointerType === "mouse") {
                if (distance > 5) startDrag();
            } else if (distance > 10) {
                endDrag(false); // el dedo se movió antes del toque largo: es un desplazamiento
            }
            return;
        }
        event.preventDefault();
        positionGhost(event.clientX, event.clientY);
        updateDropTarget(event.clientX, event.clientY);
    }

    function onPointerUp(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        endDrag(event.type === "pointerup");
    }

    // ---------- Panel lateral (móvil) ----------
    function openSidebar() {
        elements.sidebar.classList.add("is-open");
        elements.sidebarBackdrop.hidden = false;
        elements.toggleSidebar.setAttribute("aria-expanded", "true");
    }
    function closeSidebar() {
        elements.sidebar.classList.remove("is-open");
        elements.sidebarBackdrop.hidden = true;
        elements.toggleSidebar.setAttribute("aria-expanded", "false");
    }

    // ---------- Ajustes ----------
    function fillScheduleSelects() {
        const start = [];
        const end = [];
        for (let hour = 0; hour < 24; hour += 1) start.push(`<option value="${hour}">${hourLabel(hour)}</option>`);
        for (let hour = 1; hour <= 24; hour += 1) end.push(`<option value="${hour}">${hour === 24 ? "24:00" : hourLabel(hour)}</option>`);
        elements.startHour.innerHTML = start.join("");
        elements.endHour.innerHTML = end.join("");
    }

    function syncScheduleControls() {
        elements.startHour.value = String(schedule.startHour);
        elements.endHour.value = String(schedule.endHour);
        elements.days.value = schedule.days;
    }

    async function saveSchedule(changed) {
        const next = { ...schedule, ...changed };
        if (next.endHour <= next.startHour) {
            if ("startHour" in changed) next.endHour = Math.min(24, next.startHour + 1);
            else next.startHour = Math.max(0, next.endHour - 1);
        }
        schedule = next;
        syncScheduleControls();
        render();
        try {
            await database.saveSetting({ key: "schedule", value: schedule });
        } catch (error) {
            showNotice(`No se pudo guardar el horario: ${error.message}`, true);
        }
    }

    function validSchedule(value) {
        return value && Number.isInteger(value.startHour) && Number.isInteger(value.endHour)
            && value.startHour >= 0 && value.endHour <= 24 && value.startHour < value.endHour
            && Object.prototype.hasOwnProperty.call(DAY_SETS, value.days);
    }

    // ---------- Respaldo ----------
    async function exportBackup() {
        try {
            const settings = await database.readAll("settings");
            const backup = {
                format: "bitacora-agenda",
                version: 2,
                exportedAt: new Date().toISOString(),
                appointments,
                settings
            };
            const blob = new Blob([JSON.stringify(backup, null, 1)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `bitacora-respaldo-${dateKey(new Date())}.json`;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 60000);
            showNotice(`Respaldo descargado: ${appointments.length} fichas.`);
        } catch (error) {
            showNotice(`No se pudo crear el respaldo: ${error.message}`, true);
        }
    }

    function validAppointment(item) {
        return item && typeof item.id === "string" && item.id
            && isValidDateKey(item.date) && Number.isInteger(item.hour) && item.hour >= 0 && item.hour <= 23
            && typeof item.patient === "string" && item.patient.trim()
            && typeof item.type === "string";
    }

    async function importBackup(file) {
        try {
            const backup = JSON.parse(await file.text());
            if (!backup || backup.format !== "bitacora-agenda" || backup.version !== 2 || !Array.isArray(backup.appointments)) {
                throw new Error("el archivo no es un respaldo de la agenda Bitácora.");
            }
            const existing = await database.readAll("appointments");
            const ids = new Set(existing.map((item) => item.id));
            const slots = new Set(existing.map((item) => slotKey(item.date, item.hour)));
            const accepted = [];
            let skipped = 0;
            backup.appointments.forEach((item) => {
                const key = validAppointment(item) ? slotKey(item.date, item.hour) : null;
                if (!key || ids.has(item.id) || slots.has(key)) { skipped += 1; return; }
                ids.add(item.id);
                slots.add(key);
                accepted.push({
                    id: item.id, date: item.date, hour: item.hour,
                    patient: item.patient.trim().slice(0, 80), type: item.type.trim().slice(0, 50),
                    color: safeColor(item.color),
                    createdAt: item.createdAt || new Date().toISOString(),
                    updatedAt: item.updatedAt || new Date().toISOString()
                });
            });
            const existingSettings = new Set((await database.readAll("settings")).map((setting) => setting.key));
            const settings = (Array.isArray(backup.settings) ? backup.settings : [])
                .filter((setting) => setting && setting.key === "schedule" && validSchedule(setting.value) && !existingSettings.has("schedule"));
            await database.importRecords(accepted, settings);
            if (settings.length) { schedule = settings[0].value; syncScheduleControls(); }
            await refreshData();
            showNotice(`Respaldo restaurado: ${accepted.length} fichas.${skipped ? ` Se omitieron ${skipped} que ya existían o chocaban con un horario ocupado; no se sobrescribió nada.` : ""}`);
        } catch (error) {
            showNotice(`No se pudo restaurar el respaldo: ${error.message}`, true);
        } finally {
            elements.importFile.value = "";
        }
    }

    // ---------- Almacenamiento, conexión, instalación y actualizaciones ----------
    // Pide al navegador que no borre IndexedDB por falta de espacio o inactividad
    // (Safari puede limpiar datos de sitios no instalados tras 7 días sin uso).
    async function requestPersistentStorage() {
        if (!navigator.storage || !navigator.storage.persist) return false;
        try {
            if (await navigator.storage.persisted()) return true;
            return await navigator.storage.persist();
        } catch {
            return false;
        }
    }

    async function updateStorageLabel(persistent) {
        if (!navigator.storage || !navigator.storage.estimate) return;
        const estimate = await navigator.storage.estimate();
        const megabytes = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        const mode = persistent || isStandalone ? "protegido" : "local";
        elements.storage.textContent = `Almacenamiento ${mode} · ${megabytes} MB usados`;
    }

    function updateConnectionStatus() {
        elements.connection.classList.toggle("is-offline", !navigator.onLine);
        elements.connection.querySelector("span:last-child").textContent = navigator.onLine
            ? "En línea · datos locales"
            : "Sin conexión · modo local";
    }

    function setUpdateReady(worker) {
        waitingWorker = worker;
        elements.updateBanner.hidden = false;
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            showNotice("Este navegador no permite activar el modo sin conexión.", true);
            return;
        }
        try {
            registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
            if (registration.waiting && navigator.serviceWorker.controller) setUpdateReady(registration.waiting);
            registration.addEventListener("updatefound", () => {
                const installing = registration.installing;
                if (!installing) return;
                installing.addEventListener("statechange", () => {
                    if (installing.state === "installed" && navigator.serviceWorker.controller) {
                        setUpdateReady(installing);
                    }
                });
            });
            if (!navigator.serviceWorker.controller) {
                navigator.serviceWorker.addEventListener("controllerchange", () => {
                    showNotice("La aplicación ya está lista para usarse sin conexión.");
                }, { once: true });
            }
        } catch (error) {
            showNotice(`No se pudo preparar el modo sin conexión: ${error.message}`, true);
        }
    }

    // ---------- Eventos ----------
    function bindEvents() {
        elements.newEntry.addEventListener("click", () => openEntryDialog(null));
        elements.newEntryMobile.addEventListener("click", () => openEntryDialog(null));
        elements.prev.addEventListener("click", () => navigate(-1));
        elements.next.addEventListener("click", () => navigate(1));
        elements.today.addEventListener("click", () => {
            focusDate = startOfDay(new Date());
            miniMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
            render();
            scrollToNow();
        });

        elements.miniPrev.addEventListener("click", () => {
            miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() - 1, 1);
            renderMiniCalendar();
        });
        elements.miniNext.addEventListener("click", () => {
            miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() + 1, 1);
            renderMiniCalendar();
        });
        elements.miniGrid.addEventListener("click", (event) => {
            const button = event.target.closest(".mini-day");
            if (!button) return;
            focusDate = fromKey(button.dataset.date);
            miniMonth = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
            render();
            closeSidebar();
        });

        elements.toggleSidebar.addEventListener("click", openSidebar);
        elements.closeSidebar.addEventListener("click", closeSidebar);
        elements.sidebarBackdrop.addEventListener("click", closeSidebar);

        elements.startHour.addEventListener("change", () => saveSchedule({ startHour: Number(elements.startHour.value) }));
        elements.endHour.addEventListener("change", () => saveSchedule({ endHour: Number(elements.endHour.value) }));
        elements.days.addEventListener("change", () => saveSchedule({ days: elements.days.value }));

        elements.schedule.addEventListener("click", (event) => {
            if (suppressClick) return;
            const add = event.target.closest(".slot-add");
            if (add) {
                openEntryDialog(null, { date: add.dataset.date, hour: Number(add.dataset.hour) });
                return;
            }
            const ficha = event.target.closest(".ficha");
            if (ficha) openEntryDialog(appointments.find((item) => item.id === ficha.dataset.id));
        });
        elements.schedule.addEventListener("pointerdown", onPointerDown);
        elements.schedule.addEventListener("contextmenu", (event) => {
            if (event.target.closest(".ficha")) event.preventDefault();
        });
        document.addEventListener("pointermove", onPointerMove, { passive: false });
        document.addEventListener("pointerup", onPointerUp);
        document.addEventListener("pointercancel", onPointerUp);
        // Mientras se arrastra con el dedo, evita que la página se desplace (iOS).
        document.addEventListener("touchmove", (event) => {
            if (drag && drag.active) event.preventDefault();
        }, { passive: false });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && drag) endDrag(false);
        });

        elements.type.addEventListener("change", suggestColorForType);
        elements.colors.addEventListener("change", () => { colorTouched = true; });
        elements.form.addEventListener("submit", submitEntry);
        elements.deleteEntry.addEventListener("click", deleteCurrent);
        $("#close-dialog-button").addEventListener("click", () => elements.dialog.close());
        $("#cancel-entry-button").addEventListener("click", () => elements.dialog.close());
        elements.dialog.addEventListener("click", (event) => {
            if (event.target === elements.dialog) elements.dialog.close();
        });

        elements.export.addEventListener("click", exportBackup);
        elements.import.addEventListener("click", () => elements.importFile.click());
        elements.importFile.addEventListener("change", () => {
            const file = elements.importFile.files && elements.importFile.files[0];
            if (file) importBackup(file);
        });

        const onLayoutChange = () => { if (!drag) render(); };
        if (NARROW_QUERY.addEventListener) NARROW_QUERY.addEventListener("change", onLayoutChange);
        else NARROW_QUERY.addListener(onLayoutChange);
        // Actualiza la línea de "ahora" cada minuto.
        window.setInterval(() => { if (!drag && !document.hidden) renderSchedule(); }, 60000);

        elements.applyUpdate.addEventListener("click", () => {
            if (!waitingWorker) return;
            waitingWorker.postMessage({ type: "APPLY_UPDATE" });
            waitingWorker = null;
            elements.updateBanner.hidden = true;
        });
        elements.dismissUpdate.addEventListener("click", () => { elements.updateBanner.hidden = true; });
        window.addEventListener("online", updateConnectionStatus);
        window.addEventListener("offline", updateConnectionStatus);
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            deferredInstallPrompt = event;
            elements.install.hidden = false;
        });
        if (isIOS && !isStandalone) elements.install.hidden = false;
        const closeIosDialog = () => elements.iosDialog.close();
        $("#close-ios-dialog").addEventListener("click", closeIosDialog);
        $("#ok-ios-dialog").addEventListener("click", closeIosDialog);
        elements.iosDialog.addEventListener("click", (event) => {
            if (event.target === elements.iosDialog) closeIosDialog();
        });
        elements.install.addEventListener("click", async () => {
            // Safari en iPhone/iPad no ofrece instalación programática: se muestran los pasos.
            if (isIOS) {
                elements.iosDialog.showModal();
                return;
            }
            if (!deferredInstallPrompt) return;
            await deferredInstallPrompt.prompt();
            deferredInstallPrompt = null;
            elements.install.hidden = true;
        });
        // Recarga solo cuando una versión nueva reemplaza a la anterior, no en la primera instalación.
        if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            let reloading = false;
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (reloading) return;
                reloading = true;
                window.location.reload();
            });
        }
    }

    async function initialize() {
        fillHourOptions();
        fillScheduleSelects();
        syncScheduleControls();
        if (isTouch) elements.dragHint.textContent = "Toca una hora libre para agendar. Mantén presionada una ficha y arrástrala para moverla.";
        bindEvents();
        updateConnectionStatus();
        try {
            await database.open();
            const saved = await database.readSetting("schedule");
            if (saved && validSchedule(saved.value)) schedule = saved.value;
            syncScheduleControls();
            await refreshData();
            scrollToNow();
            const persistent = await requestPersistentStorage();
            try {
                await updateStorageLabel(persistent);
            } catch (error) {
                showNotice(`No se pudo consultar el espacio usado: ${error.message}`, true);
            }
            registerServiceWorker();
        } catch (error) {
            showNotice(`No se pudo iniciar el almacenamiento local: ${error.message}`, true);
        }
    }

    initialize();
})();
