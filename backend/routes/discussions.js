const express = require('express');
const router = express.Router();
const database = require('../database/init');

// קבלת כל הדיונים
router.get('/', (req, res) => {
  const db = database.getDB();
  const query = `
    SELECT d.*, u.name as creator_name,
           COUNT(c.id) as comments_count
    FROM discussions d 
    LEFT JOIN users u ON d.created_by = u.id
    LEFT JOIN comments c ON d.id = c.discussion_id
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// יצירת דיון חדש
router.post('/', (req, res) => {
  const { title, category = 'כללי' } = req.body;
  const db = database.getDB();
  
  const query = `
    INSERT INTO discussions (title, category, created_by)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [title, category, 1], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'דיון נוצר בהצלחה!' });
  });
});

// קבלת תגובות לדיון
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  const db = database.getDB();
  
  const query = `
    SELECT c.*, u.name as author_name
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.discussion_id = ?
    ORDER BY c.created_at ASC
  `;
  
  db.all(query, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// הוספת תגובה לדיון
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const db = database.getDB();
  
  const query = `
    INSERT INTO comments (content, discussion_id, author_id)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [content, id, 1], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'תגובה נוספה בהצלחה!' });
  });
});

module.exports = router;