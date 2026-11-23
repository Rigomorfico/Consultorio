(() => {
    "use strict";

    const database = window.LocalDatabase;
    const elements = {
        connection: document.querySelector("#connection-status"),
        install: document.querySelector("#install-button"),
        newEntry: document.querySelector("#new-entry-button"),
        search: document.querySelector("#search-input"),
        sort: document.querySelector("#sort-select"),
        export: document.querySelector("#export-button"),
        import: document.querySelector("#import-button"),
        importFile: document.querySelector("#import-file"),
        notice: document.querySelector("#notice"),
        count: document.querySelector("#entry-count"),
        storage: document.querySelector("#storage-label"),
        list: document.querySelector("#entries-list"),
        dialog: document.querySelector("#entry-dialog"),
        form: document.querySelector("#entry-form"),
        dialogTitle: document.querySelector("#dialog-title"),
        entryId: document.querySelector("#entry-id"),
        title: document.querySelector("#entry-title"),
        date: document.querySelector("#entry-date"),
        category: document.querySelector("#entry-category"),
        body: document.querySelector("#entry-body"),
        tags: document.querySelector("#entry-tags"),
        related: document.querySelector("#related-options"),
        files: document.querySelector("#entry-files"),
        existingAttachments: document.querySelector("#existing-attachments"),
        updateBanner: document.querySelector("#update-banner"),
        applyUpdate: document.querySelector("#apply-update-button"),
        dismissUpdate: document.querySelector("#dismiss-update-button"),
        iosDialog: document.querySelector("#ios-install-dialog")
    };
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let entries = [];
    let attachments = [];
    let sortOrder = "desc";
    let registration;
    let waitingWorker;
    let deferredInstallPrompt;

    function showNotice(message, isError) {
        elements.notice.textContent = message;
        elements.notice.classList.toggle("notice-error", Boolean(isError));
        elements.notice.hidden = false;
        if (!isError) {
            window.setTimeout(() => {
                elements.notice.hidden = true;
            }, 5500);
        }
    }

    function createId() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    }

    function formatDate(value) {
        return new Intl.DateTimeFormat("es", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(value));
    }

    function localDateTimeValue(value) {
        const date = value ? new Date(value) : new Date();
        const pad = (part) => String(part).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function getEntryAttachments(entry) {
        const ids = new Set(entry.attachmentIds || []);
        return attachments.filter((attachment) => ids.has(attachment.id));
    }

    function renderEntries() {
        const query = elements.search.value.trim().toLocaleLowerCase("es");
        const filtered = entries
            .filter((entry) => [entry.title, entry.body, entry.category, ...(entry.tags || [])]
                .join(" ").toLocaleLowerCase("es").includes(query))
            .sort((left, right) => sortOrder === "desc"
                ? right.occurredAt.localeCompare(left.occurredAt)
                : left.occurredAt.localeCompare(right.occurredAt));

        elements.count.textContent = `(${entries.length})`;
        if (filtered.length === 0) {
            elements.list.innerHTML = query
                ? '<div class="empty-state"><span class="empty-icon">⌕</span><h3>No encontramos esa ficha</h3><p>Prueba con otras palabras o etiquetas.</p></div>'
                : '<div class="empty-state"><span class="empty-icon">✳</span><h3>Tu espacio empieza aquí</h3><p>Crea una ficha para guardar un avance, una idea, una reunión o cualquier evidencia de tu trabajo.</p><button class="button button-primary" data-action="new" type="button">Crear primera ficha</button></div>';
            return;
        }

        elements.list.innerHTML = filtered.map((entry) => {
            const files = getEntryAttachments(entry);
            const related = (entry.relatedEntryIds || [])
                .map((id) => entries.find((candidate) => candidate.id === id))
                .filter(Boolean);
            const tags = (entry.tags || []).map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
            const fileMarkup = files.map((file) => {
                const icon = file.type.startsWith("image/") ? "▧" : "↗";
                return `<a class="attachment-link" href="#" data-action="attachment" data-id="${escapeHTML(file.id)}" aria-label="Abrir ${escapeHTML(file.name)}"><span aria-hidden="true">${icon}</span>${escapeHTML(file.name)}</a>`;
            }).join("");
            const relatedMarkup = related.length
                ? `<div class="related-list"><span>Relacionada con</span>${related.map((item) => `<button class="related-link" type="button" data-action="related" data-id="${escapeHTML(item.id)}">${escapeHTML(item.title)}</button>`).join("")}</div>`
                : "";
            return `<article class="entry-card">
                <div class="entry-date"><span class="date-marker"></span><time datetime="${escapeHTML(entry.occurredAt)}">${escapeHTML(formatDate(entry.occurredAt))}</time></div>
                <div class="entry-card-main">
                    <div class="entry-card-heading">
                        <div><div class="entry-meta">${entry.category ? `<span class="category">${escapeHTML(entry.category)}</span>` : ""}${entry.updatedAt !== entry.createdAt ? "<span class=\"edited-label\">Editada</span>" : ""}</div><h3>${escapeHTML(entry.title)}</h3></div>
                        <div class="entry-actions"><button type="button" data-action="edit" data-id="${escapeHTML(entry.id)}">Editar</button><button type="button" data-action="delete" data-id="${escapeHTML(entry.id)}">Eliminar</button></div>
                    </div>
                    ${entry.body ? `<p class="entry-body">${escapeHTML(entry.body)}</p>` : ""}
                    ${tags ? `<div class="tags">${tags}</div>` : ""}
                    ${fileMarkup ? `<div class="attachment-list">${fileMarkup}</div>` : ""}
                    ${relatedMarkup}
                </div>
            </article>`;
        }).join("");
    }

    async function refreshData() {
        [entries, attachments] = await Promise.all([
            database.readAll("entries"),
            database.readAll("attachments")
        ]);
        renderEntries();
    }

    function renderRelatedOptions(selectedIds) {
        const options = entries.filter((entry) => entry.id !== elements.entryId.value);
        if (options.length === 0) {
            elements.related.innerHTML = '<p class="field-hint">Aún no hay otras fichas para relacionar.</p>';
            return;
        }
        elements.related.innerHTML = options.map((entry) => `
            <label class="related-option"><input type="checkbox" name="relatedEntryIds" value="${escapeHTML(entry.id)}" ${selectedIds.includes(entry.id) ? "checked" : ""}><span>${escapeHTML(entry.title)}</span><small>${escapeHTML(formatDate(entry.occurredAt))}</small></label>
        `).join("");
    }

    function renderExistingAttachments(entry) {
        const current = entry ? getEntryAttachments(entry) : [];
        elements.existingAttachments.innerHTML = current.map((attachment) => `
            <label class="existing-file"><input type="checkbox" name="keepAttachmentIds" value="${escapeHTML(attachment.id)}" checked><span>${escapeHTML(attachment.name)}</span><small>Conservar</small></label>
        `).join("");
    }

    function openEntryDialog(entry) {
        elements.form.reset();
        elements.entryId.value = entry ? entry.id : "";
        elements.dialogTitle.textContent = entry ? "Editar ficha" : "Nueva ficha";
        elements.title.value = entry ? entry.title : "";
        elements.date.value = localDateTimeValue(entry && entry.occurredAt);
        elements.category.value = entry ? entry.category || "" : "";
        elements.body.value = entry ? entry.body || "" : "";
        elements.tags.value = entry ? (entry.tags || []).join(", ") : "";
        elements.files.value = "";
        renderRelatedOptions(entry ? entry.relatedEntryIds || [] : []);
        renderExistingAttachments(entry);
        elements.dialog.showModal();
        elements.title.focus();
    }

    async function submitEntry(event) {
        event.preventDefault();
        if (!elements.form.reportValidity()) return;

        const id = elements.entryId.value || createId();
        const previous = entries.find((entry) => entry.id === id);
        const selectedAttachments = new Set(Array.from(
            elements.form.querySelectorAll('input[name="keepAttachmentIds"]:checked'),
            (input) => input.value
        ));
        const oldAttachments = previous ? getEntryAttachments(previous) : [];
        const removedAttachmentIds = oldAttachments
            .filter((attachment) => !selectedAttachments.has(attachment.id))
            .map((attachment) => attachment.id);
        const addedAttachments = Array.from(elements.files.files || [], (file) => ({
            id: createId(),
            entryId: id,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            createdAt: new Date().toISOString(),
            blob: file
        }));
        const now = new Date().toISOString();
        const relatedEntryIds = Array.from(
            elements.form.querySelectorAll('input[name="relatedEntryIds"]:checked'),
            (input) => input.value
        );
        const entry = {
            id,
            title: elements.title.value.trim(),
            occurredAt: new Date(elements.date.value).toISOString(),
            category: elements.category.value.trim(),
            body: elements.body.value.trim(),
            tags: elements.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
            relatedEntryIds,
            attachmentIds: [
                ...oldAttachments.filter((attachment) => selectedAttachments.has(attachment.id)).map((attachment) => attachment.id),
                ...addedAttachments.map((attachment) => attachment.id)
            ],
            createdAt: previous ? previous.createdAt : now,
            updatedAt: now
        };

        try {
            await database.saveEntry(entry, addedAttachments, removedAttachmentIds);
            elements.dialog.close();
            await refreshData();
            showNotice(previous ? "Ficha actualizada en este dispositivo." : "Ficha guardada en este dispositivo.");
        } catch (error) {
            showNotice(`No se pudo guardar la ficha: ${error.message}`, true);
        }
    }

    async function deleteEntry(id) {
        const entry = entries.find((item) => item.id === id);
        if (!entry || !window.confirm(`¿Eliminar “${entry.title}” y sus archivos? Esta acción no se puede deshacer.`)) return;
        try {
            await database.deleteEntry(id, entry.attachmentIds || []);
            await refreshData();
            showNotice("Ficha eliminada de este dispositivo.");
        } catch (error) {
            showNotice(`No se pudo eliminar la ficha: ${error.message}`, true);
        }
    }

    function openAttachment(id) {
        const attachment = attachments.find((item) => item.id === id);
        if (!attachment) {
            showNotice("No se encontró el archivo adjunto.", true);
            return;
        }
        const url = URL.createObjectURL(attachment.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.name;
        link.target = "_blank";
        link.rel = "noopener";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    }

    async function bytesToBase64(blob) {
        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let offset = 0; offset < bytes.length; offset += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
        }
        return btoa(binary);
    }

    function base64ToBlob(value, type) {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return new Blob([bytes], { type });
    }

    async function exportBackup() {
        try {
            const serializedAttachments = await Promise.all(attachments.map(async (attachment) => ({
                id: attachment.id,
                entryId: attachment.entryId,
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
                createdAt: attachment.createdAt,
                data: await bytesToBase64(attachment.blob)
            })));
            const settings = await database.readAll("settings");
            const backup = {
                format: "bitacora-backup",
                version: 1,
                exportedAt: new Date().toISOString(),
                entries,
                attachments: serializedAttachments,
                settings
            };
            const blob = new Blob([JSON.stringify(backup)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `bitacora-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 60000);
            showNotice(`Respaldo completo descargado: ${entries.length} fichas y ${attachments.length} archivos.`);
        } catch (error) {
            showNotice(`No se pudo crear el respaldo: ${error.message}`, true);
        }
    }

    function validateBackup(backup) {
        if (!backup || backup.format !== "bitacora-backup" || backup.version !== 1
            || !Array.isArray(backup.entries) || !Array.isArray(backup.attachments)
            || !Array.isArray(backup.settings || [])) {
            throw new Error("El archivo no tiene un formato de respaldo Bitácora válido.");
        }
        const entryIds = new Set();
        const attachmentIds = new Set();
        backup.entries.forEach((entry) => {
            if (!entry || typeof entry.id !== "string" || typeof entry.title !== "string"
                || typeof entry.occurredAt !== "string" || !Number.isFinite(Date.parse(entry.occurredAt))
                || !Array.isArray(entry.attachmentIds || [])) {
                throw new Error("El respaldo contiene una ficha incompleta o inválida.");
            }
            if (entryIds.has(entry.id)) throw new Error("El respaldo contiene identificadores de ficha repetidos.");
            entryIds.add(entry.id);
        });
        backup.attachments.forEach((attachment) => {
            if (!attachment || typeof attachment.id !== "string" || typeof attachment.entryId !== "string"
                || typeof attachment.name !== "string" || typeof attachment.data !== "string") {
                throw new Error("El respaldo contiene un archivo adjunto inválido.");
            }
            if (attachmentIds.has(attachment.id)) throw new Error("El respaldo contiene identificadores de archivo repetidos.");
            attachmentIds.add(attachment.id);
        });
    }

    async function importBackup(file) {
        try {
            const backup = JSON.parse(await file.text());
            validateBackup(backup);
            const [existingEntries, existingAttachments, existingSettings] = await Promise.all([
                database.readAll("entries"),
                database.readAll("attachments"),
                database.readAll("settings")
            ]);
            const entryIds = new Set(existingEntries.map((entry) => entry.id));
            const attachmentIds = new Set(existingAttachments.map((attachment) => attachment.id));
            const attachmentById = new Map(backup.attachments.map((attachment) => [attachment.id, attachment]));
            const acceptedEntries = [];
            const acceptedAttachments = [];
            const acceptedIds = new Set();
            let skipped = 0;

            for (const original of backup.entries) {
                if (entryIds.has(original.id)) {
                    skipped += 1;
                    continue;
                }
                const entry = { ...original, relatedEntryIds: [...(original.relatedEntryIds || [])] };
                const mappedAttachmentIds = [];
                for (const oldId of original.attachmentIds || []) {
                    const item = attachmentById.get(oldId);
                    if (!item || item.entryId !== original.id) continue;
                    let newAttachmentId = item.id;
                    while (attachmentIds.has(newAttachmentId)) newAttachmentId = createId();
                    attachmentIds.add(newAttachmentId);
                    mappedAttachmentIds.push(newAttachmentId);
                    acceptedAttachments.push({
                        id: newAttachmentId,
                        entryId: entry.id,
                        name: item.name,
                        type: item.type || "application/octet-stream",
                        size: item.size,
                        createdAt: item.createdAt || new Date().toISOString(),
                        blob: base64ToBlob(item.data, item.type || "application/octet-stream")
                    });
                }
                entry.attachmentIds = mappedAttachmentIds;
                acceptedEntries.push(entry);
                acceptedIds.add(entry.id);
                entryIds.add(entry.id);
            }
            const allAvailableIds = new Set([...existingEntries.map((entry) => entry.id), ...acceptedIds]);
            acceptedEntries.forEach((entry) => {
                entry.relatedEntryIds = entry.relatedEntryIds.filter((id) => allAvailableIds.has(id));
            });
            const settingKeys = new Set(existingSettings.map((setting) => setting.key));
            const acceptedSettings = (backup.settings || []).filter((setting) => {
                if (!setting || typeof setting.key !== "string" || settingKeys.has(setting.key)) return false;
                settingKeys.add(setting.key);
                return true;
            });
            await database.importRecords(acceptedEntries, acceptedAttachments, acceptedSettings);
            await refreshData();
            const detail = skipped
                ? ` Se omitieron ${skipped} fichas con identificadores que ya existían; no se sobrescribió ningún dato.`
                : " No se sobrescribieron datos existentes.";
            showNotice(`Respaldo restaurado: ${acceptedEntries.length} fichas y ${acceptedAttachments.length} archivos.${detail}`);
        } catch (error) {
            showNotice(`No se pudo restaurar el respaldo: ${error.message}`, true);
        } finally {
            elements.importFile.value = "";
        }
    }

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

    function bindEvents() {
        elements.newEntry.addEventListener("click", () => openEntryDialog(null));
        elements.list.addEventListener("click", (event) => {
            const action = event.target.closest("[data-action]");
            if (!action) return;
            const id = action.dataset.id;
            if (action.dataset.action === "new") openEntryDialog(null);
            if (action.dataset.action === "edit") openEntryDialog(entries.find((entry) => entry.id === id));
            if (action.dataset.action === "delete") deleteEntry(id);
            if (action.dataset.action === "attachment") {
                event.preventDefault();
                openAttachment(id);
            }
            if (action.dataset.action === "related") {
                elements.search.value = "";
                renderEntries();
                const target = Array.from(elements.list.querySelectorAll(".entry-card"))
                    .find((card) => card.querySelector(`[data-action="edit"][data-id="${CSS.escape(id)}"]`));
                if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
        elements.search.addEventListener("input", renderEntries);
        elements.sort.addEventListener("change", async () => {
            sortOrder = elements.sort.value;
            renderEntries();
            try {
                await database.saveSetting({ key: "preferences", value: { sortOrder } });
            } catch (error) {
                showNotice(`No se pudo guardar la preferencia: ${error.message}`, true);
            }
        });
        elements.export.addEventListener("click", exportBackup);
        elements.import.addEventListener("click", () => elements.importFile.click());
        elements.importFile.addEventListener("change", () => {
            const file = elements.importFile.files && elements.importFile.files[0];
            if (file) importBackup(file);
        });
        elements.form.addEventListener("submit", submitEntry);
        document.querySelector("#close-dialog-button").addEventListener("click", () => elements.dialog.close());
        document.querySelector("#cancel-entry-button").addEventListener("click", () => elements.dialog.close());
        elements.dialog.addEventListener("click", (event) => {
            if (event.target === elements.dialog) elements.dialog.close();
        });
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
        document.querySelector("#close-ios-dialog").addEventListener("click", closeIosDialog);
        document.querySelector("#ok-ios-dialog").addEventListener("click", closeIosDialog);
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
        bindEvents();
        updateConnectionStatus();
        try {
            await database.open();
            const preference = await database.readSetting("preferences");
            if (preference && preference.value && ["asc", "desc"].includes(preference.value.sortOrder)) {
                sortOrder = preference.value.sortOrder;
                elements.sort.value = sortOrder;
            }
            await refreshData();
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