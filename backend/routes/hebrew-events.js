const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { HDate } = require('@hebcal/core');
const router = express.Router();

const dbPath = path.join(__dirname, '../database/familia_shilo.db');

// קבלת כל האירועים העבריים
router.get('/', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  db.all('SELECT * FROM hebrew_events ORDER BY hebrew_month, hebrew_day', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'שגיאה בשליפת אירועים עבריים' });
      return;
    }
    
    res.json(rows);
  });
  
  db.close();
});

// קבלת אירועים של היום בלוח העברי
router.get('/today', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  try {
    // חישוב התאריך העברי של היום
    const today = new Date();
    const hebrewDate = new HDate(today);
    const hebrewMonth = hebrewDate.getMonthName('h');
    const hebrewDay = hebrewDate.getDate();
    
    // המרת מספר היום לעברית (כמו באקסל)
    const hebrewNumerals = {
      1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳', 6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
      11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו', 16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
      21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה', 26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳'
    };
    
    const hebrewDayString = hebrewNumerals[hebrewDay] || hebrewDay.toString();
    const todayHebrewDate = `${hebrewDayString} ב${hebrewMonth}`;
    
    // חיפוש אירועים שמתאימים לתאריך של היום
    const query = `
      SELECT * FROM hebrew_events 
      WHERE hebrew_month = ? OR hebrew_date LIKE ?
      ORDER BY name
    `;
    
    db.all(query, [hebrewMonth, `%${hebrewDayString}%`], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'שגיאה בשליפת אירועי היום' });
        return;
      }
      
      res.json({
        today_hebrew_date: todayHebrewDate,
        hebrew_month: hebrewMonth,
        hebrew_day: hebrewDayString,
        events: rows
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בחישוב התאריך העברי' });
  }
  
  db.close();
});

// קבלת אירועים של השבוע הנוכחי
router.get('/this-week', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  try {
    // חישוב הטווח של השבוע בלוח העברי
    const today = new Date();
    const events = [];
    
    // עבור כל יום בשבוע הקרוב
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      const hebrewDate = new HDate(checkDate);
      const hebrewMonth = hebrewDate.getMonthName('h');
      
      events.push({
        gregorian_date: checkDate.toISOString().split('T')[0],
        hebrew_month: hebrewMonth,
        hebrew_day: hebrewDate.getDate()
      });
    }
    
    // שליפת אירועים לכל התאריכים בשבוע
    const monthsInWeek = [...new Set(events.map(e => e.hebrew_month))];
    const query = `
      SELECT * FROM hebrew_events 
      WHERE hebrew_month IN (${monthsInWeek.map(() => '?').join(',')})
      ORDER BY hebrew_month, hebrew_day, name
    `;
    
    db.all(query, monthsInWeek, (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'שגיאה בשליפת אירועי השבוע' });
        return;
      }
      
      res.json({
        week_info: events,
        events: rows
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'שגיאה בחישוב אירועי השבוע' });
  }
  
  db.close();
});

// קבלת אירועים לפי חודש עברי
router.get('/month/:monthName', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const monthName = req.params.monthName;
  
  db.all('SELECT * FROM hebrew_events WHERE hebrew_month = ? ORDER BY hebrew_day, name', [monthName], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'שגיאה בשליפת אירועי החודש' });
      return;
    }
    
    res.json({
      month: monthName,
      events: rows
    });
  });
  
  db.close();
});

// קבלת אירועים קרובים (30 יום הקרובים)
router.get('/upcoming', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  
  // זו פונקציה מורכבת יותר שתצטרך התאמה עדינה
  // לעת עתה נחזיר את כל האירועים
  db.all('SELECT * FROM hebrew_events ORDER BY hebrew_month, hebrew_day LIMIT 10', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'שגיאה בשליפת אירועים קרובים' });
      return;
    }
    
    res.json(rows);
  });
  
  db.close();
});

module.exports = router;