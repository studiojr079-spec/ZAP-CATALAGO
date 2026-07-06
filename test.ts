import Database from 'better-sqlite3';
const db = new Database('database.sqlite');
const cols = db.prepare("PRAGMA table_info(products)").all();
console.log(cols);
