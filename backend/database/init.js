const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'familia_shilo.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ שגיאה בחיבור למסד הנתונים:', err.message);
      } else {
        console.log('✅ מסד הנתונים מחובר בהצלחה');
        this.initTables();
      }
    });
  }

  initTables() {
    // טבלת משתמשים
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        role TEXT DEFAULT 'member',
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // טבלת אירועים
    this.db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        event_type TEXT NOT NULL,
        hebrew_date TEXT,
        gregorian_date TEXT,
        recurring BOOLEAN DEFAULT 0,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )
    `);

    // טבלת תמונות
    this.db.run(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT,
        caption TEXT,
        tags TEXT,
        album_name TEXT,
        uploaded_by INTEGER,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0,
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);

    // טבלת דיונים
    this.db.run(`
      CREATE TABLE IF NOT EXISTS discussions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users (id)
      )
    `);

    // טבלת תגובות
    this.db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        discussion_id INTEGER,
        photo_id INTEGER,
        event_id INTEGER,
        author_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (discussion_id) REFERENCES discussions (id),
        FOREIGN KEY (photo_id) REFERENCES photos (id),
        FOREIGN KEY (event_id) REFERENCES events (id),
        FOREIGN KEY (author_id) REFERENCES users (id)
      )
    `);

    console.log('✅ טבלאות מסד הנתונים נוצרו בהצלחה');
  }

  getDB() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database(); 