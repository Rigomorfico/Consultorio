# Bitácora — Consultorio Psicológico

App web instalable (PWA) que funciona sin conexión. Las fichas y sus archivos se guardan
**solo en el dispositivo** (IndexedDB); no hay servidor ni base de datos en la nube.

Vive dentro del repositorio del sitio (`Consultorio-1/bitacora/`) y se publica en su
**propio subdominio** con un segundo proyecto de Cloudflare Pages conectado al mismo repo de GitHub.

```
GitHub: Rigomorfico/Consultorio
 ├─ /            → Pages "consultorio"  → dominio principal (sitio actual, sin cambios)
 └─ /bitacora/   → Pages "bitacora"     → app.psicologamileidygarcia.com (esta app)
```

## Publicar en Cloudflare Pages (una sola vez)

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Elige el mismo repositorio `Rigomorfico/Consultorio`.
3. Configuración de compilación:
   - **Production branch:** `main`
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
   - **Root directory (advanced):** `bitacora`
4. Guardar y desplegar. Quedará en `https://<proyecto>.pages.dev`.
5. En el proyecto nuevo → **Custom domains → Set up a custom domain** → `app.psicologamileidygarcia.com`.
   Si el dominio ya está en Cloudflare, el registro CNAME se crea solo; si no, crea un
   `CNAME app → <proyecto>.pages.dev` en tu proveedor DNS.
6. (Opcional) En **Settings → Builds → Build watch paths**, incluye solo `bitacora/*` para que
   cambios del sitio principal no redespliegen la app (y en el proyecto principal, excluye `bitacora/*`).

El proyecto Pages del sitio principal **no se toca**. Ten en cuenta que también publicará
`/bitacora/` en el dominio principal; funciona, pero cada dominio tiene su propia IndexedDB,
así que usa siempre el subdominio. Para forzarlo, agrega en `Consultorio-1/_redirects`:

```
/bitacora/*  https://app.psicologamileidygarcia.com/:splat  301
```

## Instalar en iPhone (Safari)

1. Abre `https://app.psicologamileidygarcia.com` en **Safari** (iOS 16.4+ también permite Chrome/Edge).
2. **Compartir → Agregar a pantalla de inicio → Agregar.** La app también muestra estos pasos
   con el botón *Instalar app*.
3. Ábrela una vez con conexión; desde ahí funciona sin internet.

> Instalada en la pantalla de inicio, iOS no borra sus datos por inactividad (en Safari normal
> sí puede hacerlo tras 7 días sin uso). Aun así, usa **Descargar respaldo** con regularidad:
> si se elimina la app del iPhone, sus datos se eliminan con ella.

## Actualizar la app

1. Cambia los archivos que necesites.
2. **Sube la versión** en `sw.js` → `CACHE_NAME` (p. ej. `v8-consultorio`). Si agregas un archivo
   nuevo, añádelo también a `APP_SHELL`.
3. `git push` a `main`. Cloudflare despliega solo; los usuarios verán *"Hay una actualización
   lista"* y sus fichas se conservan.

## Probar localmente

```
cd bitacora
node server.js            # http://127.0.0.1:8765/
```

El servidor imita a Cloudflare Pages (redirige `/index.html` → `/`). Usa otro puerto con
`PORT=8790 node server.js`.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Interfaz y metadatos para iOS/Android |
| `css/app.css` | Estilos con la paleta del consultorio |
| `js/database.js` | Acceso a IndexedDB (`bitacora-personal`) |
| `js/app.js` | Lógica, respaldo, instalación, almacenamiento persistente |
| `sw.js` | Service Worker: precarga todos los recursos y los sirve sin conexión |
| `manifest.json` | Manifiesto PWA (íconos PNG 192/512 y maskable) |
| `_headers` | Cabeceras de Cloudflare Pages (sin caché para `sw.js`, seguridad) |
| `icons/` | Íconos opacos generados desde el logotipo del consultorio |
