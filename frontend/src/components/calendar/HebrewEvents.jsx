import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HebrewEvents = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayHebrewDate, setTodayHebrewDate] = useState('');

  useEffect(() => {
    fetchHebrewEvents();
  }, []);

  const fetchHebrewEvents = async () => {
    try {
      setLoading(true);
      const [todayRes, upcomingRes] = await Promise.all([
        axios.get('/api/hebrew-events/today'),
        axios.get('/api/hebrew-events/upcoming')
      ]);
      
      setTodayEvents(todayRes.data.events || []);
      setTodayHebrewDate(todayRes.data.today_hebrew_date || '');
      setUpcomingEvents(upcomingRes.data || []);
    } catch (error) {
      console.error('שגיאה בטעינת אירועים עבריים:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'יום הולדת': return '🎂';
      case 'יום נישואין': return '💍';
      case 'יום זיכרון': return '🕯️';
      default: return '📅';
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'יום הולדת': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'יום נישואין': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'יום זיכרון': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* אירועי היום */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-familia-blue mb-4 flex items-center">
          🌟 אירועים ליום {todayHebrewDate}
        </h3>
        
        {todayEvents.length > 0 ? (
          <div className="space-y-3">
            {todayEvents.map((event) => (
              <div 
                key={event.id} 
                className={`p-4 rounded-lg border-r-4 ${getEventColor(event.event_type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventIcon(event.event_type)}</span>
                    <div>
                      <h4 className="font-bold text-lg">{event.name}</h4>
                      <p className="text-sm opacity-75">
                        {event.family} • {event.relationship}
                      </p>
                      {event.age && (
                        <p className="text-sm font-medium">
                          גיל {Math.floor(event.age)} שנים
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{event.event_type}</p>
                    <p className="text-sm">{event.hebrew_date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-4 block">🌅</span>
            <p className="text-lg">אין אירועים מיוחדים היום</p>
            <p className="text-sm">יום רגוע ושלו למשפחה 💙</p>
          </div>
        )}
      </div>

      {/* אירועים קרובים */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-familia-blue mb-4 flex items-center">
          📋 אירועים קרובים
        </h3>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.slice(0, 6).map((event) => (
              <div 
                key={event.id} 
                className="bg-gray-50 p-3 rounded-lg border-l-3 border-familia-blue"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getEventIcon(event.event_type)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{event.name}</p>
                    <p className="text-xs text-gray-600">
                      {event.hebrew_date} • {event.event_type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            לא נמצאו אירועים קרובים
          </p>
        )}
      </div>
    </div>
  );
};

export default HebrewEvents;