const express = require('express');
const router = express.Router();
const { HDate } = require('@hebcal/core');
const database = require('../database/init');

// קבלת כל האירועים
router.get('/', (req, res) => {
  const db = database.getDB();
  const query = `
    SELECT e.*, u.name as creator_name 
    FROM events e 
    LEFT JOIN users u ON e.created_by = u.id 
    ORDER BY e.gregorian_date ASC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// הוספת אירוע חדש
router.post('/', (req, res) => {
  const { title, description, event_type, hebrew_date, gregorian_date, recurring } = req.body;
  const db = database.getDB();
  
  const query = `
    INSERT INTO events (title, description, event_type, hebrew_date, gregorian_date, recurring, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [title, description, event_type, hebrew_date, gregorian_date, recurring, 1], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'אירוע נוסף בהצלחה!' });
  });
});

module.exports = router;