import React, { useState, useEffect } from 'react';
import { HDate, months } from '@hebcal/core';

const HebrewDateDisplay = () => {
  const [hebrewDate, setHebrewDate] = useState(null);
  const [gregDate, setGregDate] = useState(new Date());

  useEffect(() => {
    const updateDates = () => {
      const today = new Date();
      const hDate = new HDate(today);
      setHebrewDate(hDate);
      setGregDate(today);
    };

    updateDates();
    
    // עדכון כל דקה למקרה שהתאריך משתנה
    const interval = setInterval(updateDates, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!hebrewDate) return null;

  const hebrewMonthName = hebrewDate.getMonthName('h');
  const hebrewDay = hebrewDate.getDate();
  const hebrewYear = hebrewDate.getFullYear();
  
  // המרת מספר היום לעברית
  const hebrewNumerals = {
    1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳', 6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
    11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו', 16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
    21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה', 26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳'
  };

  const hebrewDayString = hebrewNumerals[hebrewDay] || hebrewDay.toString();

  // שמות ימים בעברית
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const todayName = dayNames[gregDate.getDay()];

  return (
    <div className="bg-gradient-to-r from-familia-blue to-blue-800 text-white rounded-xl shadow-lg p-6 mb-6">
      <div className="text-center">
        {/* יום השבוע */}
        <div className="text-familia-warm text-lg font-medium mb-2">
          יום {todayName}
        </div>
        
        {/* התאריך העברי הראשי */}
        <div className="text-4xl font-bold mb-2 leading-tight">
          {hebrewDayString} ב{hebrewMonthName}
        </div>
        
        {/* שנה עברית */}
        <div className="text-xl text-familia-warm mb-3">
          תשפ״{hebrewYear.toString().slice(-2)}
        </div>
        
        {/* קו מפריד */}
        <div className="w-20 h-0.5 bg-familia-warm mx-auto mb-3 opacity-70"></div>
        
        {/* תאריך לועזי */}
        <div className="text-lg opacity-90">
          {gregDate.toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
      
      {/* איקון קלנדר */}
      <div className="absolute top-4 left-4 text-familia-warm text-2xl opacity-70">
        📅
      </div>
    </div>
  );
};

export default HebrewDateDisplay;