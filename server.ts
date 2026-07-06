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
const upload = multer({ storage });

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
  const product = JSON.parse(req.body.productData);
  const files = req.files as Express.Multer.File[];
  const newImageUrls = files.map(file => `/uploads/${file.filename}`);
  const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
  const imageUrls = [...existingImages, ...newImageUrls];
  
  const stmt = db.prepare(`
    INSERT INTO products (id, storeId, name, categoryId, description, price, promoPrice, length, color, stock, featured, hidden, showPrice, images, video, views, clicks, "order")
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
    product.views ?? null,
    product.clicks ?? null,
    product.order ?? null
  );
  res.json({ success: true });
});

app.put("/api/products/:id", upload.array("images"), (req, res) => {
  const product = JSON.parse(req.body.productData);
  const files = req.files as Express.Multer.File[];
  const newImageUrls = files.map(file => `/uploads/${file.filename}`);
  const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
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
    product.order ?? null,
    req.params.id
  );
  res.json({ success: true });
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
  const category = JSON.parse(req.body.categoryData);
  const image = req.file ? `/uploads/${req.file.filename}` : category.image;

  const stmt = db.prepare(`
    INSERT INTO categories (id, storeId, name, image, "order")
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(category.id, category.storeId, category.name, image, category.order);
  res.json({ success: true });
});

app.put("/api/categories/:id", upload.single("image"), (req, res) => {
  const category = JSON.parse(req.body.categoryData);
  const image = req.file ? `/uploads/${req.file.filename}` : category.image;

  const stmt = db.prepare(`
    UPDATE categories SET storeId=?, name=?, image=?, "order"=? WHERE id=?
  `);
  stmt.run(category.storeId, category.name, image, category.order, req.params.id);
  res.json({ success: true });
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
