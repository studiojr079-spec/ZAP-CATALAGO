const Database = require('better-sqlite3');
const db = new Database(':memory:');
db.exec('CREATE TABLE test (val TEXT);');
try {
  db.prepare('INSERT INTO test VALUES (?)').run(undefined);
  console.log('Success');
} catch(e) {
  console.log('Error:', e.message);
}
