const express = require('express');
const router = express.Router();
const database = require('../database/init');

// התחברות פשוטה
router.post('/login', (req, res) => {
  const { password } = req.body;
  
  if (password === 'familia2024') {
    res.json({ 
      success: true, 
      user: { 
        id: 1, 
        name: 'משתמש משפחתי', 
        role: 'member' 
      },
      message: 'התחברת בהצלחה למשפחת שילוביצקי! 💙'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'סיסמה שגויה' 
    });
  }
});

module.exports = router;