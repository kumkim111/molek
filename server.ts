import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("data_structures.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    data TEXT NOT NULL
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/collections", (req, res) => {
    const rows = db.prepare("SELECT * FROM collections").all();
    res.json(rows);
  });

  app.post("/api/collections", (req, res) => {
    const { type, data } = req.body;
    const info = db.prepare("INSERT INTO collections (type, data) VALUES (?, ?)").run(type, JSON.stringify(data));
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/collections/:id", (req, res) => {
    const { data } = req.body;
    db.prepare("UPDATE collections SET data = ? WHERE id = ?").run(JSON.stringify(data), req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/collections/:id", (req, res) => {
    db.prepare("DELETE FROM collections WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/reset", (req, res) => {
    db.prepare("DELETE FROM collections").run();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
