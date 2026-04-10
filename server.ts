import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "MD. Rahat Mahamud Portfolio API is running" });
  });

  // Projects API
  app.get("/api/projects", (req, res) => {
    res.json({ success: true, data: [] }); // In a real app, fetch from DB
  });

  app.post("/api/projects", (req, res) => {
    res.json({ success: true, message: "Project added successfully" });
  });

  // Research API
  app.get("/api/research", (req, res) => {
    res.json({ success: true, data: [] });
  });

  // Certificates API
  app.get("/api/certificates", (req, res) => {
    res.json({ success: true, data: [] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
