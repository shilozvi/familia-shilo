import React from 'react';

const AboutPage = () => {
  return (
    <div className="space-y-8">
      {/* כותרת ראשית */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-4xl font-bold text-familia-blue mb-4">
          👨‍👩‍👧‍👦 אודות משפחת שילוביצקי
        </h2>
        <p className="text-xl text-gray-700">
          "לה פמיליה דל שילו" - משפחה אחת, לב אחד, אהבה אחת
        </p>
      </div>

      {/* סיפור המשפחה */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-familia-blue mb-6 flex items-center">
          📖 הסיפור שלנו
        </h3>
        <div className="prose prose-lg max-w-none text-right">
          <p className="text-gray-700 leading-relaxed mb-4">
            משפחת שילוביצקי היא משפחה גדולה, חמה ואוהבת שמונה כיום כ-40 בני משפחה המפוזרים
            ברחבי הארץ ובעולם. המשפחה שלנו מאופיינת בערכים חזקים של אהבת חינם, כבוד הדדי,
            ושמירה על המסורת היהודית בדרך יפה ומכבדת.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            לאורך השנים, המשפחה שלנו גדלה והתפתחה, והיום אנחנו כוללים חמישה אחים ואחיות,
            כאשר לכל אחד יש משפחה יפה עם ילדים וכבר גם נכדים. למרות המרחקים הגיאוגרפיים,
            אנחנו שומרים על קשר חזק ותמידי.
          </p>
          <p className="text-gray-700 leading-relaxed">
            האתר הזה נוצר מתוך רצון לשמור על הקשר המיוחד בינינו, לתעד את הרגעים היפים,
            ולהעביר למשפחה הבאה את הערכים והזיכרונות החשובים לנו.
          </p>
        </div>
      </div>

      {/* ערכי המשפחה */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-familia-blue mb-6">
          💎 הערכים שלנו
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">❤️</div>
            <h4 className="font-bold text-lg mb-2">אהבת חינם</h4>
            <p className="text-gray-700">אהבה ללא תנאים בין כל בני המשפחה</p>
          </div>
          
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">🤝</div>
            <h4 className="font-bold text-lg mb-2">כבוד הדדי</h4>
            <p className="text-gray-700">כבוד לכל אחד ולדעותיו השונות</p>
          </div>
          
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">🕊️</div>
            <h4 className="font-bold text-lg mb-2">מסורת יהודית</h4>
            <p className="text-gray-700">שמירה על המסורת בדרך יפה ומכבדת</p>
          </div>
          
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">🎓</div>
            <h4 className="font-bold text-lg mb-2">חינוך ולמידה</h4>
            <p className="text-gray-700">עידוד לימוד והתפתחות אישית</p>
          </div>
          
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">🏠</div>
            <h4 className="font-bold text-lg mb-2">בית חם</h4>
            <p className="text-gray-700">יצירת אווירה חמה ומקבלת</p>
          </div>
          
          <div className="text-center p-6 bg-familia-warm rounded-lg">
            <div className="text-4xl mb-3">🌱</div>
            <h4 className="font-bold text-lg mb-2">צמיחה משותפת</h4>
            <p className="text-gray-700">תמיכה הדדית בהתפתחות ובהצלחה</p>
          </div>
        </div>
      </div>

      {/* מספרים */}
      <div className="bg-gradient-to-r from-familia-blue to-blue-600 text-white rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-center">
          📊 המשפחה במספרים
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">40+</div>
            <div className="text-familia-warm">בני משפחה</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">5</div>
            <div className="text-familia-warm">דורות</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">12</div>
            <div className="text-familia-warm">ילדים</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">∞</div>
            <div className="text-familia-warm">אהבה</div>
          </div>
        </div>
      </div>

      {/* איך להשתמש באתר */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-familia-blue mb-6">
          💡 איך להשתמש באתר?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏠</span>
              <div>
                <h4 className="font-bold">דף הבית</h4>
                <p className="text-gray-600">כאן תמצאו עדכונים על אירועים והתמונות האחרונות</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <h4 className="font-bold">לוח אירועים</h4>
                <p className="text-gray-600">ימי הולדת, יארצייטים, חגים ואירועים משפחתיים</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h4 className="font-bold">גלריית תמונות</h4>
                <p className="text-gray-600">העלאה ושיתוף תמונות משפחתיות מכל התקופות</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h4 className="font-bold">שלשורים</h4>
                <p className="text-gray-600">דיונים, תיאומים והודעות למשפחה</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h4 className="font-bold">פרטיות ובטיחות</h4>
                <p className="text-gray-600">האתר פרטי ומוגן, רק למשפחה שלנו</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <h4 className="font-bold">עדכונים במייל</h4>
                <p className="text-gray-600">קבלת התראות על אירועים ועדכונים חשובים</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;