import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [eventsRes, photosRes] = await Promise.all([
        axios.get('/api/events'),
        axios.get('/api/photos?limit=6')
      ]);
      
      // סינון אירועים של היום
      const today = new Date().toISOString().split('T')[0];
      const todayEvents = eventsRes.data.filter(event => 
        event.gregorian_date === today
      );
      
      setTodayEvents(todayEvents);
      setRecentPhotos(photosRes.data);
    } catch (error) {
      console.error('שגיאה בטעינת נתוני דף הבית:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-2xl">⏳ טוען נתונים...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ברכת פתיחה */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-familia-blue mb-4">
          🌟 שלום ומברכת למשפחת שילוביצקי היקרה! 🌟
        </h2>
        <p className="text-lg text-gray-700">
          כאן תוכלו לשתף, לחגוג, לזכור ולהישאר מחוברים כמשפחה אחת גדולה ואוהבת 💙
        </p>
      </div>

      {/* אירועי היום */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-familia-blue mb-4 flex items-center">
          📅 מה קורה היום?
        </h3>
        {todayEvents.length > 0 ? (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div key={event.id} className="bg-familia-warm p-4 rounded-lg">
                <h4 className="font-bold text-lg">{event.title}</h4>
                <p className="text-gray-700">{event.description}</p>
                <span className="text-sm text-familia-blue">
                  {event.event_type === 'birthday' && '🎂 יום הולדת'}
                  {event.event_type === 'anniversary' && '💍 יום נישואין'}
                  {event.event_type === 'yahrzeit' && '🕯️ יום זיכרון'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            😊 אין אירועים מיוחדים היום - יום רגוע למשפחה!
          </p>
        )}
      </div>

      {/* תמונות אחרונות */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-familia-blue mb-4 flex items-center">
          📸 תמונות אחרונות מהמשפחה
        </h3>
        {recentPhotos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recentPhotos.map((photo) => (
              <div key={photo.id} className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={`/uploads/photos/${photo.filename}`}
                  alt={photo.caption || 'תמונה משפחתית'}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm text-gray-700 truncate">
                    {photo.caption || 'תמונה משפחתית'}
                  </p>
                  <p className="text-xs text-gray-500">
                    ❤️ {photo.likes} לייקים
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            📷 עדיין אין תמונות - בואו נתחיל להעלות זיכרונות יפים!
          </p>
        )}
      </div>

      {/* סטטיסטיקות מהירות */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-familia-blue text-white rounded-xl p-6 text-center">
          <h4 className="text-3xl font-bold">40+</h4>
          <p>בני משפחה</p>
        </div>
        <div className="bg-familia-gold text-white rounded-xl p-6 text-center">
          <h4 className="text-3xl font-bold">{recentPhotos.length}</h4>
          <p>תמונות באתר</p>
        </div>
        <div className="bg-green-500 text-white rounded-xl p-6 text-center">
          <h4 className="text-3xl font-bold">∞</h4>
          <p>אהבה משפחתית</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;