import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingMessage } from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'other',
    gregorian_date: ''
  });
  
  const { notifications, removeNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת אירועים:', error);
      showError('שגיאה בטעינת האירועים');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) {
      showError('אנא הזינו שם לאירוע');
      return;
    }
    
    if (!newEvent.gregorian_date) {
      showError('אנא בחרו תאריך לאירוע');
      return;
    }
    
    try {
      setSubmitting(true);
      const eventData = {
        ...newEvent,
        hebrew_date: 'תאריך עברי' // נוסיף חישוב אמיתי בהמשך
      };

      await axios.post('/api/events', eventData);
      setShowAddForm(false);
      setNewEvent({
        title: '',
        description: '',
        event_type: 'other',
        gregorian_date: ''
      });
      fetchEvents();
      showSuccess('אירוע נוסף בהצלחה! 🎉');
    } catch (error) {
      console.error('שגיאה בהוספת אירוע:', error);
      showError('שגיאה בהוספת האירוע');
    } finally {
      setSubmitting(false);
    }
  };

  const getEventTypeEmoji = (type) => {
    switch (type) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💍';
      case 'yahrzeit': return '🕯️';
      case 'holiday': return '🎪';
      default: return '📅';
    }
  };

  const getEventTypeName = (type) => {
    switch (type) {
      case 'birthday': return 'יום הולדת';
      case 'anniversary': return 'יום נישואין';
      case 'yahrzeit': return 'יום זיכרון';
      case 'holiday': return 'חג';
      default: return 'אירוע כללי';
    }
  };

  const upcomingEvents = events
    .filter(event => new Date(event.gregorian_date) >= new Date())
    .sort((a, b) => new Date(a.gregorian_date) - new Date(b.gregorian_date))
    .slice(0, 10);

  if (loading) {
    return <LoadingMessage message="טוען אירועים..." />;
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration}
        />
      ))}
      {/* כותרת */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-familia-blue">
            📅 לוח אירועים משפחתי
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-familia-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ הוספת אירוע
          </button>
        </div>
      </div>

      {/* טופס הוספת אירוע */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">הוספת אירוע חדש</h3>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם האירוע</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="למשל: יום הולדת של דני"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">תיאור (אופציונלי)</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
                placeholder="פרטים נוספים על האירוע..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">סוג האירוע</label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="birthday">🎂 יום הולדת</option>
                  <option value="anniversary">💍 יום נישואין</option>
                  <option value="yahrzeit">🕯️ יום זיכרון</option>
                  <option value="holiday">🎪 חג</option>
                  <option value="other">📅 אירוע כללי</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">תאריך</label>
                <input
                  type="date"
                  value={newEvent.gregorian_date}
                  onChange={(e) => setNewEvent({...newEvent, gregorian_date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    שומר...
                  </>
                ) : (
                  '✅ שמירת אירוע'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* אירועים קרובים */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-familia-blue mb-6">
          🔜 אירועים קרובים
        </h3>
        
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventTypeEmoji(event.event_type)}</span>
                    <div>
                      <h4 className="font-bold text-lg">{event.title}</h4>
                      <p className="text-sm text-gray-600">{getEventTypeName(event.event_type)}</p>
                      {event.description && (
                        <p className="text-gray-700 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-familia-blue">
                      {new Date(event.gregorian_date).toLocaleDateString('he-IL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {event.hebrew_date && (
                      <p className="text-sm text-gray-600">{event.hebrew_date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            📅 אין אירועים קרובים כרגע
          </p>
        )}
      </div>

      {/* תאריך עברי של היום */}
      <div className="bg-familia-blue text-white rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold mb-2">📅 התאריך של היום</h3>
        <p className="text-familia-warm">
          {new Date().toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

export default EventsPage;