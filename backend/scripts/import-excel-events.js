const XLSX = require('xlsx');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { HDate } = require('@hebcal/core');

// נתיבים לקבצים
const excelPath = path.join(__dirname, '../../assets/Family Events.xlsx');
const dbPath = path.join(__dirname, '../database/familia_shilo.db');

console.log('🚀 מתחיל ייבוא אירועים מקובץ האקסל...');

// קריאת קובץ האקסל
const workbook = XLSX.readFile(excelPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📊 נמצאו ${data.length} אירועים באקסל`);

// התחברות לבסיס הנתונים
const db = new sqlite3.Database(dbPath);

// יצירת טבלה לאירועים עבריים
const createHebrewEventsTable = `
  CREATE TABLE IF NOT EXISTS hebrew_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    family TEXT,
    event_type TEXT,
    hebrew_date TEXT,
    hebrew_month TEXT,
    hebrew_day TEXT,
    gregorian_date TEXT,
    birth_year INTEGER,
    relationship TEXT,
    email TEXT,
    address TEXT,
    age REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.run(createHebrewEventsTable, (err) => {
  if (err) {
    console.error('❌ שגיאה ביצירת טבלה:', err);
    return;
  }
  
  console.log('✅ טבלת אירועים עבריים נוצרה בהצלחה');
  
  // ניקוי נתונים קיימים
  db.run('DELETE FROM hebrew_events', (err) => {
    if (err) {
      console.error('❌ שגיאה בניקוי נתונים:', err);
      return;
    }
    
    console.log('🧹 נתונים קיימים נוקו');
    
    // הכנת SQL לייבוא
    const insertSQL = `
      INSERT INTO hebrew_events (
        name, family, event_type, hebrew_date, hebrew_month, hebrew_day,
        gregorian_date, birth_year, relationship, email, address, age
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    let successCount = 0;
    let errorCount = 0;
    
    // עיבוד כל שורה
    data.forEach((row, index) => {
      try {
        // ניקוי ועיבוד הנתונים
        const name = row['שם'] || row['שם_1'] || '';
        const family = row['משפחה'] || '';
        const eventType = row['Event'] || '';
        const hebrewDate = row['יום בעברי'] || row['יום בעברי_1'] || '';
        const hebrewMonth = row['חודש'] || '';
        const relationship = row['קרבה'] || '';
        const email = row['Email'] || '';
        const address = row['מען'] || '';
        const birthYear = row['Birth Year'] && row['Birth Year'] !== '?????' ? parseInt(row['Birth Year']) : null;
        const age = row['Age'] && row['Age'] !== '????' ? parseFloat(row['Age']) : null;
        
        // חישוב תאריך גרגוריאני מהתאריך העברי
        let gregorianDate = null;
        if (hebrewDate && hebrewMonth) {
          try {
            // ניסיון להמיר תאריך עברי לגרגוריאני
            // זה מורכב יותר, אז נשאיר זאת לשלב הבא
            gregorianDate = row['__EMPTY_2'] || null;
          } catch (dateError) {
            console.warn(`⚠️ בעיה בהמרת תאריך עבור ${name}:`, dateError.message);
          }
        }
        
        // חילוץ מספר היום מהתאריך העברי
        const hebrewDay = hebrewDate.match(/^([^\\s]+)/)?.[1] || '';
        
        // ודא שיש לפחות שם ואירוע
        if (name && eventType) {
          db.run(insertSQL, [
            name, family, eventType, hebrewDate, hebrewMonth, hebrewDay,
            gregorianDate, birthYear, relationship, email, address, age
          ], (err) => {
            if (err) {
              console.error(`❌ שגיאה בייבוא שורה ${index + 1} (${name}):`, err.message);
              errorCount++;
            } else {
              successCount++;
              if (successCount % 10 === 0) {
                console.log(`✅ יובאו ${successCount} אירועים...`);
              }
            }
            
            // בדיקה אם זה הרשומה האחרונה
            if (successCount + errorCount === data.length) {
              console.log(`🎉 ייבוא הושלם! הצלחות: ${successCount}, שגיאות: ${errorCount}`);
              
              // הצגת דוגמה מהנתונים שיובאו
              db.all('SELECT * FROM hebrew_events LIMIT 5', (err, rows) => {
                if (!err) {
                  console.log('📋 דוגמה מהנתונים שיובאו:');
                  console.table(rows);
                }
                db.close();
              });
            }
          });
        } else {
          console.warn(`⚠️ דילוג על שורה ${index + 1} - חסרים נתונים חיוניים`);
          errorCount++;
        }
        
      } catch (rowError) {
        console.error(`❌ שגיאה בעיבוד שורה ${index + 1}:`, rowError.message);
        errorCount++;
      }
    });
  });
});