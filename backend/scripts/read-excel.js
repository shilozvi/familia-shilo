const XLSX = require('xlsx');
const path = require('path');

// קריאת קובץ האקסל
const excelPath = path.join(__dirname, '../../assets/Family Events.xlsx');
console.log('📖 קורא קובץ אקסל:', excelPath);

try {
    // טעינת הקובץ
    const workbook = XLSX.readFile(excelPath);
    
    // הדפסת שמות הגיליונות
    console.log('📋 גיליונות בקובץ:', workbook.SheetNames);
    
    // קריאת הגיליון הראשון
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // המרה ל-JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('📊 מספר שורות:', data.length);
    console.log('🔍 דוגמה מהנתונים (5 שורות ראשונות):');
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    
    // הדפסת עמודות
    if (data.length > 0) {
        console.log('📋 עמודות בקובץ:', Object.keys(data[0]));
    }
    
} catch (error) {
    console.error('❌ שגיאה בקריאת הקובץ:', error.message);
}