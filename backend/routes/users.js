const express = require('express');
const router = express.Router();
const database = require('../database/init');

// קבלת כל המשתמשים
router.get('/', (req, res) => {
  const db = database.getDB();
  const query = 'SELECT id, name, email, phone, role, avatar_url, created_at FROM users';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// הוספת משתמש חדש
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  const db = database.getDB();
  
  const query = `
    INSERT INTO users (name, email, phone)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [name, email, phone], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'משתמש נוסף בהצלחה!' });
  });
});

module.exports = router;