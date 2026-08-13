const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const frontendDistPath = path.resolve(__dirname, "../crm-frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");

app.use(cors());
app.use(express.json());

// Updated Content Security Policy (Allows local dev tools & connect sockets)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' http://localhost:* ws://localhost:* http://127.0.0.1:* ws://127.0.0.1:* https: wss:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Direct imports for essential routes to avoid silent mount skips
try {
  app.use("/api/auth", require("./routes/authRoutes"));
} catch (e) {
  console.error("⚠️ Failed to load authRoutes:", e.message);
}

try {
  app.use("/api/leads", require("./routes/leadRoutes"));
} catch (e) {
  console.error("⚠️ Failed to load leadRoutes:", e.message);
}

// Optional helper function for non-critical routes
const safeMountRoute = (mountPath, relativeRoutePath) => {
  const fullPath = path.resolve(__dirname, relativeRoutePath);
  if (fs.existsSync(fullPath) || fs.existsSync(`${fullPath}.js`)) {
    try {
      app.use(mountPath, require(relativeRoutePath));
      console.log(`✅ Route mounted: ${mountPath}`);
    } catch (err) {
      console.error(`❌ Syntax/Export error in ${relativeRoutePath}:`, err.message);
    }
  } else {
    console.warn(`⚠️ Route file missing: ${fullPath}`);
  }
};

safeMountRoute("/api/tasks", "./routes/taskRoutes");
safeMountRoute("/api/users", "./routes/userRoutes");

// Mount both plural (/api/workspaces) and singular (/api/workspace) to match all frontend requests
safeMountRoute("/api/workspaces", "./routes/workspaceRoutes");
safeMountRoute("/api/workspace", "./routes/workspaceRoutes");

safeMountRoute("/api/lead-discovery", "./routes/leadDiscoveryRoutes");

app.get("/favicon.ico", (req, res) => res.status(204).end());

// Static frontend serving for production builds
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get("/", (req, res) => {
    res.sendFile(frontendIndexPath);
  });

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ message: `API route ${req.path} not found.` });
    }
    res.sendFile(frontendIndexPath);
  });
}

module.exports = app;