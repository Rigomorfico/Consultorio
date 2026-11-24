const CACHE_PREFIX = "bitacora-shell-";
// Incrementa la versión cada vez que cambie cualquier archivo de APP_SHELL.
const CACHE_NAME = `${CACHE_PREFIX}v8-consultorio`;
const RUNTIME_CACHE = "bitacora-runtime";

// "./" y no "./index.html": Cloudflare Pages redirige /index.html -> / (URLs limpias),
// y Safari rechaza respuestas redirigidas servidas por un Service Worker.
const SHELL_DOCUMENT = "./";
const APP_SHELL = [
    SHELL_DOCUMENT,
    "./manifest.json",
    "./css/app.css",
    "./js/database.js",
    "./js/app.js",
    "./icons/apple-touch-icon.png",
    "./icons/favicon-32.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png",
    "./icons/logo.png"
];

// Copia la respuesta sin la marca "redirected" para que Safari la acepte.
async function cleanResponse(response) {
    if (!response || !response.redirected) return response;
    const body = await response.blob();
    return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    });
}

async function precache() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async (path) => {
        // cache: "reload" evita copiar una versión vieja desde la caché HTTP.
        const response = await fetch(new Request(path, { cache: "reload" }));
        if (!response.ok) throw new Error(`No se pudo precachear ${path}: ${response.status}`);
        await cache.put(path, await cleanResponse(response));
    }));
}

self.addEventListener("install", (event) => {
    event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys
                .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
                .map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "APPLY_UPDATE") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // Cualquier navegación (/, /index.html, /?algo) abre la app desde la caché.
    if (request.mode === "navigate") {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(SHELL_DOCUMENT);
            if (cached) return cached;
            return cleanResponse(await fetch(request));
        })());
        return;
    }

    event.respondWith((async () => {
        const shell = await caches.open(CACHE_NAME);
        const cached = await shell.match(request, { ignoreSearch: true });
        if (cached) return cached;

        // Recursos fuera de la lista: red primero y copia en caché para usarlos sin conexión.
        const runtime = await caches.open(RUNTIME_CACHE);
        try {
            const response = await fetch(request);
            if (response.ok && response.type === "basic") {
                await runtime.put(request, await cleanResponse(response.clone()));
            }
            return response;
        } catch (error) {
            const fallback = await runtime.match(request);
            if (fallback) return fallback;
            throw error;
        }
    })());
});
