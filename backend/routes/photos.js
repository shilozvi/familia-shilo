const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const database = require('../database/init');

// הגדרת Multer להעלאת תמונות
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/photos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('רק קבצי תמונה מותרים!'));
    }
  }
});

// קבלת כל התמונות
router.get('/', (req, res) => {
  const { album, limit = 50 } = req.query;
  const db = database.getDB();
  
  let query = `
    SELECT p.*, u.name as uploader_name 
    FROM photos p 
    LEFT JOIN users u ON p.uploaded_by = u.id
  `;
  let params = [];
  
  if (album) {
    query += ' WHERE p.album_name = ?';
    params.push(album);
  }
  
  query += ' ORDER BY p.upload_date DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// העלאת תמונה חדשה
router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'לא נבחרה תמונה' });
  }
  
  const { caption = '', tags = '', album_name = 'כללי' } = req.body;
  const db = database.getDB();
  
  const query = `
    INSERT INTO photos (filename, original_name, caption, tags, album_name, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    req.file.filename,
    req.file.originalname,
    caption,
    tags,
    album_name,
    1
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ 
      id: this.lastID, 
      filename: req.file.filename,
      message: 'תמונה הועלתה בהצלחה!' 
    });
  });
});

// הוספת לייק לתמונה
router.post('/:id/like', (req, res) => {
  const { id } = req.params;
  const db = database.getDB();
  
  const query = 'UPDATE photos SET likes = likes + 1 WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'לייק נוסף בהצלחה!' });
  });
});

// קבלת אלבומים קיימים
router.get('/albums', (req, res) => {
  const db = database.getDB();
  
  const query = `
    SELECT album_name, COUNT(*) as photo_count 
    FROM photos 
    GROUP BY album_name 
    ORDER BY album_name
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;