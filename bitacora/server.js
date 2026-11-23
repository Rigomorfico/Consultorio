const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 8765;
const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/manifest+json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json; charset=utf-8"
};

http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method not allowed");
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
        response.writeHead(400);
        response.end("Bad request");
        return;
    }

    // Igual que Cloudflare Pages: /index.html redirige a / (URLs limpias).
    if (pathname === "/index.html") {
        response.writeHead(308, { Location: "/" });
        response.end();
        return;
    }
    if (pathname === "/") pathname = "/index.html";
    const filePath = path.resolve(root, `.${pathname}`);
    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (error, contents) => {
        if (error) {
            response.writeHead(error.code === "ENOENT" ? 404 : 500);
            response.end(error.code === "ENOENT" ? "Not found" : "Could not read file");
            return;
        }

        const noCache = ["sw.js", "index.html", "manifest.json"].includes(path.basename(filePath));
        response.writeHead(200, {
            "Cache-Control": noCache ? "no-cache" : "public, max-age=3600",
            "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
            "X-Content-Type-Options": "nosniff"
        });
        response.end(request.method === "HEAD" ? undefined : contents);
    });
}).listen(port, "127.0.0.1", () => {
    console.log(`Bitácora: http://127.0.0.1:${port}/`);
    console.log("Deja esta terminal abierta mientras uses la app.");
});
