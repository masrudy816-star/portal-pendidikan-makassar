const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".rtf": "application/rtf",
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload terlalu besar"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function safeJoin(...parts) {
  const target = path.resolve(ROOT, ...parts);
  if (!target.startsWith(ROOT)) throw new Error("Path tidak aman");
  return target;
}

function slugify(value) {
  return String(value || "file")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function handleApi(req, res) {
  if (req.method === "GET" && req.url === "/admin/status") {
    return send(res, 200, JSON.stringify({ ok: true, mode: "local-admin-server" }));
  }

  if (req.method === "POST" && req.url === "/admin/save-json") {
    const payload = await readJson(req);
    if (!payload.data || typeof payload.data !== "object") {
      return send(res, 400, JSON.stringify({ ok: false, message: "Data JSON tidak valid" }));
    }

    const dataDir = safeJoin("data");
    const jsonPath = path.join(dataDir, "school.json");
    const backupPath = path.join(dataDir, "school.backup.json");
    if (fs.existsSync(jsonPath)) fs.copyFileSync(jsonPath, backupPath);
    fs.writeFileSync(jsonPath, `${JSON.stringify(payload.data, null, 2)}\n`);
    return send(res, 200, JSON.stringify({ ok: true, path: "data/school.json", backup: "data/school.backup.json" }));
  }

  if (req.method === "POST" && req.url === "/admin/upload") {
    const payload = await readJson(req);
    const rawName = payload.name || "upload.bin";
    const extension = path.extname(rawName).replace(".", "") || "bin";
    const baseName = slugify(path.basename(rawName, path.extname(rawName)));
    const targetType = payload.targetType === "docs" ? "docs" : "images";
    const dirParts = targetType === "docs" ? ["assets", "docs"] : ["assets", "img", "uploads"];
    const relativeDir = dirParts.join("/");
    const outputDir = safeJoin(...dirParts);
    fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `${Date.now()}-${baseName}.${extension}`;
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, Buffer.from(payload.data || "", "base64"));
    return send(res, 200, JSON.stringify({ ok: true, path: `${relativeDir}/${fileName}` }));
  }

  return false;
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  let filePath;
  try {
    filePath = safeJoin(pathname.replace(/^\/+/, ""));
  } catch {
    return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return send(res, 404, "Not found", "text/plain; charset=utf-8");
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/admin/")) {
      const handled = await handleApi(req, res);
      if (handled !== false) return;
    }
    serveStatic(req, res);
  } catch (error) {
    send(res, 500, JSON.stringify({ ok: false, message: error.message }));
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} sedang dipakai. Matikan Live Server/Python server dulu, lalu jalankan lagi: node server.js`);
    process.exit(1);
  }
  if (error.code === "EPERM") {
    console.error(`Tidak diizinkan membuka port ${PORT}. Coba jalankan ulang terminal/VS Code, lalu jalankan: node server.js`);
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Website sekolah berjalan di http://127.0.0.1:${PORT}/`);
  console.log(`Admin panel: http://127.0.0.1:${PORT}/admin.html`);
});
