import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const db = new Database("database.sqlite");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    storeId TEXT,
    name TEXT,
    categoryId TEXT,
    description TEXT,
    price REAL,
    promoPrice REAL,
    length TEXT,
    color TEXT,
    stock INTEGER,
    featured INTEGER,
    hidden INTEGER,
    showPrice INTEGER,
    images TEXT,
    video TEXT,
    views INTEGER,
    clicks INTEGER,
    "order" INTEGER
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    storeId TEXT,
    name TEXT,
    image TEXT,
    "order" INTEGER
  );
  CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    storeId TEXT,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    storeId TEXT,
    data TEXT
  );
  CREATE TABLE IF NOT EXISTS analytics (
    storeId TEXT PRIMARY KEY,
    data TEXT
  );
`);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ 
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10MB limit for text fields
    fileSize: 50 * 1024 * 1024 // 50MB limit for files
  }
});

// Middleware to parse JSON
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// API routes
app.get("/api/products", (req, res) => {
  const { storeId } = req.query;
  const products = (storeId 
    ? db.prepare("SELECT * FROM products WHERE storeId = ?").all(storeId)
    : db.prepare("SELECT * FROM products").all()) as any[];
  const parsedProducts = products.map(p => ({
    ...p,
    images: JSON.parse(p.images as string),
    featured: !!p.featured,
    hidden: !!p.hidden,
    showPrice: !!p.showPrice
  }));
  res.json(parsedProducts);
});

app.post("/api/products", upload.array("images"), (req, res) => {
  try {
    const product = JSON.parse(req.body.productData || '{}');
    const files = req.files as Express.Multer.File[] || [];
    const newImageUrls = files.map(file => `/uploads/${file.filename}`);
    
    let existingImages = [];
    if (req.body.existingImages && req.body.existingImages !== 'undefined') {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        if (Array.isArray(parsed)) existingImages = parsed;
      } catch (e) {
        console.error("Failed to parse existingImages", e);
      }
    }
    const imageUrls = [...existingImages, ...newImageUrls];
      
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, storeId, name, categoryId, description, price, promoPrice, length, color, stock, featured, hidden, showPrice, images, video, views, clicks, "order")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      product.id ?? null,
      product.storeId ?? null,
      product.name ?? null,
      product.categoryId ?? null,
      product.description ?? null,
      product.price ?? null, 
      product.promoPrice ?? null,
      product.length ?? null,
      product.color ?? null,
      product.stock ?? null,
      product.featured ? 1 : 0, 
      product.hidden ? 1 : 0,
      product.showPrice ? 1 : 0,
      JSON.stringify(imageUrls),
      product.video ?? null, 
      product.views ?? 0,
      product.clicks ?? 0,
      product.order ?? 0
    );
    res.json({ success: true });
  } catch (e: any) {
    console.error("Error in POST /api/products:", e);
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/products/:id", upload.array("images"), (req, res) => {
  try {
    const product = JSON.parse(req.body.productData || '{}');
    const files = req.files as Express.Multer.File[] || [];
    const newImageUrls = files.map(file => `/uploads/${file.filename}`);
    
    let existingImages = [];
    if (req.body.existingImages && req.body.existingImages !== 'undefined') {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        if (Array.isArray(parsed)) existingImages = parsed;
      } catch (e) {
        console.error("Failed to parse existingImages", e);
      }
    }
    const imageUrls = [...existingImages, ...newImageUrls];

    const stmt = db.prepare(`
      UPDATE products SET 
        storeId=?, name=?, categoryId=?, description=?, price=?, promoPrice=?, length=?, color=?, stock=?, featured=?, hidden=?, showPrice=?, images=?, video=?, "order"=?
      WHERE id=?
    `);
    stmt.run(
      product.storeId ?? null,
      product.name ?? null,
      product.categoryId ?? null,
      product.description ?? null,
      product.price ?? null, 
      product.promoPrice ?? null,
      product.length ?? null,
      product.color ?? null,
      product.stock ?? null,
      product.featured ? 1 : 0, 
      product.hidden ? 1 : 0,
      product.showPrice ? 1 : 0,
      JSON.stringify(imageUrls),
      product.video ?? null, 
      product.order ?? 0,
      req.params.id
    );
    res.json({ success: true });
  } catch (e: any) {
    console.error("Error in PUT /api/products:", e);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/categories", (req, res) => {
  const { storeId } = req.query;
  const categories = storeId
    ? db.prepare("SELECT * FROM categories WHERE storeId = ?").all(storeId)
    : db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

app.post("/api/categories", upload.single("image"), (req, res) => {
  try {
    const category = JSON.parse(req.body.categoryData || '{}');
    const image = req.file ? `/uploads/${req.file.filename}` : category.image;
  
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO categories (id, storeId, name, image, "order")
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(category.id, category.storeId, category.name, image, category.order);
    res.json({ success: true });
  } catch (e: any) {
    console.error("Error in POST /api/categories:", e);
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/categories/:id", upload.single("image"), (req, res) => {
  try {
    const category = JSON.parse(req.body.categoryData || '{}');
    const image = req.file ? `/uploads/${req.file.filename}` : category.image;
  
    const stmt = db.prepare(`
      UPDATE categories SET storeId=?, name=?, image=?, "order"=? WHERE id=?
    `);
    stmt.run(category.storeId, category.name, image, category.order, req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    console.error("Error in PUT /api/categories:", e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/stores", (req: any, res: any) => {
  const stores = db.prepare("SELECT * FROM stores").all() as any[];
  const parsedStores = stores.map(s => {
    try { return JSON.parse(s.data); } catch { return s; }
  });
  res.json(parsedStores);
});

app.get("/api/stores/slug/:slug", (req, res) => {
  const stores = db.prepare("SELECT * FROM stores").all() as any[];
  const parsedStores = stores.map(s => {
    try { return JSON.parse(s.data); } catch { return s; }
  });
  const store = parsedStores.find(s => s.slug === req.params.slug);
  res.json(store || null);
});

app.get("/api/stores/:id", (req, res) => {
  const store = db.prepare("SELECT * FROM stores WHERE id = ?").get(req.params.id) as any;
  res.json(store ? JSON.parse(store.data) : null);
});

app.post("/api/stores", (req, res) => {
  const store = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO stores (id, data)
    VALUES (?, ?)
  `);
  stmt.run(store.id, JSON.stringify(store));
  res.json({ success: true });
});

app.put("/api/stores/:id", (req, res) => {
  const store = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO stores (id, data)
    VALUES (?, ?)
  `);
  stmt.run(req.params.id, JSON.stringify(store));
  res.json({ success: true });
});

// ===== USERS API =====
app.get("/api/users", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all() as any[];
  res.json(users.map(u => {
    try { return JSON.parse(u.data); } catch { return u; }
  }));
});

app.get("/api/users/:id", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.params.id) as any;
  res.json(user ? JSON.parse(user.data) : null);
});

app.get("/api/users/email/:email", (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(req.params.email) as any;
  res.json(user ? JSON.parse(user.data) : null);
});

app.post("/api/users", (req, res) => {
  const user = req.body;
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, data)
    VALUES (?, ?, ?)
  `);
  stmt.run(user.id, user.email, JSON.stringify(user));
  res.json({ success: true });
});

// ===== ORDERS API =====
app.get("/api/orders", (req, res) => {
  const { storeId } = req.query;
  const orders = storeId 
    ? db.prepare("SELECT * FROM orders WHERE storeId = ?").all(storeId) as any[]
    : db.prepare("SELECT * FROM orders").all() as any[];
  res.json(orders.map(o => JSON.parse(o.data)));
});
app.post("/api/orders", (req, res) => {
  const order = req.body;
  const stmt = db.prepare(`INSERT OR REPLACE INTO orders (id, storeId, data) VALUES (?, ?, ?)`);
  stmt.run(order.id, order.storeId, JSON.stringify(order));
  res.json({ success: true });
});

// ===== NOTIFICATIONS API =====
app.get("/api/notifications", (req, res) => {
  const { storeId } = req.query;
  const notifs = storeId 
    ? db.prepare("SELECT * FROM notifications WHERE storeId = ?").all(storeId) as any[]
    : db.prepare("SELECT * FROM notifications").all() as any[];
  res.json(notifs.map(n => JSON.parse(n.data)));
});
app.post("/api/notifications", (req, res) => {
  const notif = req.body;
  const stmt = db.prepare(`INSERT OR REPLACE INTO notifications (id, storeId, data) VALUES (?, ?, ?)`);
  stmt.run(notif.id, notif.storeId, JSON.stringify(notif));
  res.json({ success: true });
});

// ===== ANALYTICS API =====
app.get("/api/analytics/:storeId", (req, res) => {
  const row = db.prepare("SELECT * FROM analytics WHERE storeId = ?").get(req.params.storeId) as any;
  res.json(row ? JSON.parse(row.data) : null);
});
app.post("/api/analytics", (req, res) => {
  const analytics = req.body;
  const stmt = db.prepare(`INSERT OR REPLACE INTO analytics (storeId, data) VALUES (?, ?)`);
  stmt.run(analytics.storeId, JSON.stringify(analytics));
  res.json({ success: true });
});

// Vite middleware for development and static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
