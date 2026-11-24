(() => {
    "use strict";

    const DB_NAME = "bitacora-personal";
    // v2: agenda por horas ("appointments"). Los almacenes de la versión 1 no se borran.
    const DB_VERSION = 2;
    let databasePromise;

    function open() {
        if (databasePromise) return databasePromise;
        databasePromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("appointments")) {
                    const appointments = db.createObjectStore("appointments", { keyPath: "id" });
                    appointments.createIndex("date", "date");
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
                reject(new Error("La app está abierta en otra pestaña con una versión anterior. Ciérrala e inténtalo de nuevo."));
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

    function transactionDone(transaction, message) {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error(message));
            transaction.onabort = () => reject(transaction.error || new Error(message));
        });
    }

    async function readAll(storeName) {
        const db = await open();
        return requestResult(db.transaction(storeName, "readonly").objectStore(storeName).getAll());
    }

    // Guarda una o varias fichas en una sola transacción (p. ej. al intercambiar dos horarios).
    async function saveAppointments(appointments) {
        const db = await open();
        const transaction = db.transaction("appointments", "readwrite");
        const store = transaction.objectStore("appointments");
        appointments.forEach((appointment) => store.put(appointment));
        return transactionDone(transaction, "No se pudo guardar la ficha.");
    }

    async function deleteAppointment(id) {
        const db = await open();
        const transaction = db.transaction("appointments", "readwrite");
        transaction.objectStore("appointments").delete(id);
        return transactionDone(transaction, "No se pudo eliminar la ficha.");
    }

    async function saveSetting(setting) {
        const db = await open();
        const transaction = db.transaction("settings", "readwrite");
        transaction.objectStore("settings").put(setting);
        return transactionDone(transaction, "No se pudo guardar la configuración.");
    }

    async function readSetting(key) {
        const db = await open();
        return requestResult(db.transaction("settings", "readonly").objectStore("settings").get(key));
    }

    async function importRecords(appointments, settings) {
        const db = await open();
        const transaction = db.transaction(["appointments", "settings"], "readwrite");
        const store = transaction.objectStore("appointments");
        appointments.forEach((appointment) => store.add(appointment));
        settings.forEach((setting) => transaction.objectStore("settings").put(setting));
        return transactionDone(transaction, "No se pudo importar el respaldo.");
    }

    window.LocalDatabase = { open, readAll, readSetting, saveSetting, saveAppointments, deleteAppointment, importRecords };
})();
