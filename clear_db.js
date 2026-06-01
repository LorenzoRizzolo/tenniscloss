import db from './src/lib/server/db.js';

const tables = db
  .prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
      AND name NOT LIKE 'sqlite_%'
  `)
  .all();

db.pragma('foreign_keys = OFF');

const transaction = db.transaction(() => {
  for (const { name } of tables) {
    db.prepare(`DELETE FROM "${name}"`).run();
    console.log(`Svuotata tabella: ${name}`);
  }
});

transaction();

db.pragma('foreign_keys = ON');
