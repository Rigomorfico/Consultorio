(() => {
    "use strict";

    const DB_NAME = "bitacora-personal";
    const DB_VERSION = 1;
    let databasePromise;

    function open() {
        if (databasePromise) return databasePromise;
        databasePromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("entries")) {
                    const entries = db.createObjectStore("entries", { keyPath: "id" });
                    entries.createIndex("occurredAt", "occurredAt");
                }
                if (!db.objectStoreNames.contains("attachments")) {
                    const attachments = db.createObjectStore("attachments", { keyPath: "id" });
                    attachments.createIndex("entryId", "entryId");
                }
                if (!db.objectStoreNames.contains("settings")) {
                    db.createObjectStore("settings", { keyPath: "key" });
                }
            };
            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => {
                    db.close();
                    databasePromise = undefined;
                };
                resolve(db);
            };
            request.onerror = () => {
                databasePromise = undefined;
                reject(request.error || new Error("No se pudo abrir la base de datos local."));
            };
            request.onblocked = () => {
                databasePromise = undefined;
                reject(new Error("La base de datos está ocupada por otra pestaña. Ciérrala e inténtalo de nuevo."));
            };
        });
        return databasePromise;
    }

    function requestResult(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error("Falló una operación de almacenamiento local."));
        });
    }

    async function readAll(storeName) {
        const db = await open();
        return requestResult(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
    }

    async function saveEntry(entry, addedAttachments, removedAttachmentIds) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["entries", "attachments"], "readwrite");
            transaction.objectStore("entries").put(entry);
            const store = transaction.objectStore("attachments");
            removedAttachmentIds.forEach((id) => store.delete(id));
            addedAttachments.forEach((attachment) => store.put(attachment));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error("No se pudo guardar la ficha."));
            transaction.onabort = () => reject(transaction.error || new Error("Se canceló el guardado de la ficha."));
        });
    }

    async function deleteEntry(entryId, attachmentIds) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["entries", "attachments"], "readwrite");
            const entryStore = transaction.objectStore("entries");
            entryStore.delete(entryId);
            const readEntries = entryStore.getAll();
            readEntries.onsuccess = () => {
                readEntries.result.forEach((entry) => {
                    if (!(entry.relatedEntryIds || []).includes(entryId)) return;
                    entry.relatedEntryIds = entry.relatedEntryIds.filter((id) => id !== entryId);
                    entry.updatedAt = new Date().toISOString();
                    entryStore.put(entry);
                });
            };
            const store = transaction.objectStore("attachments");
            attachmentIds.forEach((id) => store.delete(id));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error("No se pudo eliminar la ficha."));
            transaction.onabort = () => reject(transaction.error || new Error("Se canceló la eliminación."));
        });
    }

    async function saveSetting(setting) {
        const db = await open();
        const transaction = db.transaction("settings", "readwrite");
        transaction.objectStore("settings").put(setting);
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error("No se pudo guardar la configuración."));
            transaction.onabort = () => reject(transaction.error || new Error("Se canceló el guardado de la configuración."));
        });
    }

    async function readSetting(key) {
        const db = await open();
        return requestResult(db.transaction("settings", "readonly").objectStore("settings").get(key));
    }

    async function importRecords(entries, attachments, settings) {
        const db = await open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["entries", "attachments", "settings"], "readwrite");
            const entryStore = transaction.objectStore("entries");
            const attachmentStore = transaction.objectStore("attachments");
            entries.forEach((entry) => entryStore.add(entry));
            attachments.forEach((attachment) => attachmentStore.add(attachment));
            settings.forEach((setting) => transaction.objectStore("settings").put(setting));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error("No se pudo importar el respaldo."));
            transaction.onabort = () => reject(transaction.error || new Error("Se canceló la importación."));
        });
    }

    window.LocalDatabase = { open, readAll, readSetting, saveEntry, deleteEntry, saveSetting, importRecords };
})();