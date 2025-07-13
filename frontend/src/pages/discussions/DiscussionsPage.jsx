import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingMessage } from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    category: 'כללי'
  });
  const [newComment, setNewComment] = useState('');
  
  const { notifications, removeNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/discussions');
      setDiscussions(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת דיונים:', error);
      showError('שגיאה בטעינת הדיונים');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (discussionId) => {
    try {
      const response = await axios.get(`/api/discussions/${discussionId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת תגובות:', error);
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    
    if (!newDiscussion.title.trim()) {
      showError('אנא הזינו נושא לדיון');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.post('/api/discussions', newDiscussion);
      setShowNewDiscussion(false);
      setNewDiscussion({ title: '', category: 'כללי' });
      fetchDiscussions();
      showSuccess('דיון נוצר בהצלחה! 💬');
    } catch (error) {
      console.error('שגיאה ביצירת דיון:', error);
      showError('שגיאה ביצירת הדיון');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/discussions/${selectedDiscussion.id}/comments`, {
        content: newComment
      });
      setNewComment('');
      fetchComments(selectedDiscussion.id);
      fetchDiscussions(); // לעדכון מספר התגובות
    } catch (error) {
      console.error('שגיאה בהוספת תגובה:', error);
      alert('שגיאה בהוספת תגובה');
    }
  };

  const openDiscussion = (discussion) => {
    setSelectedDiscussion(discussion);
    fetchComments(discussion.id);
  };

  const categories = ['כללי', 'חגים', 'אירועים', 'תיאום', 'הודעות'];

  if (loading) {
    return <LoadingMessage message="טוען דיונים..." />;
  }

  if (selectedDiscussion) {
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
        {/* חזרה לרשימת דיונים */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => {
              setSelectedDiscussion(null);
              setComments([]);
            }}
            className="text-familia-blue hover:text-blue-700 mb-4"
          >
            ← חזרה לרשימת הדיונים
          </button>
          <h2 className="text-2xl font-bold text-familia-blue">
            💬 {selectedDiscussion.title}
          </h2>
          <p className="text-gray-600">
            נוצר על ידי: {selectedDiscussion.creator_name || 'משתמש אנונימי'} | 
            קטגוריה: {selectedDiscussion.category}
          </p>
        </div>

        {/* תגובות */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">תגובות</h3>
          
          {comments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                    <div className="text-left mr-4">
                      <p className="text-sm font-medium text-familia-blue">
                        {comment.author_name || 'משתמש אנונימי'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('he-IL', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              עדיין אין תגובות לדיון זה - היו הראשונים להגיב!
            </p>
          )}

          {/* טופס תגובה חדשה */}
          <form onSubmit={handleAddComment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">הוספת תגובה</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-24"
                placeholder="כתבו את התגובה שלכם..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-familia-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💬 שליחת תגובה
            </button>
          </form>
        </div>
      </div>
    );
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
            💬 שלשורים משפחתיים
          </h2>
          <button
            onClick={() => setShowNewDiscussion(!showNewDiscussion)}
            className="bg-familia-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ דיון חדש
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          כאן אפשר לדון, לתאם, לשתף ולהישאר מחוברים כמשפחה
        </p>
      </div>

      {/* טופס דיון חדש */}
      {showNewDiscussion && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">יצירת דיון חדש</h3>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">נושא הדיון</label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="למשל: תיאום לארוחת פסח"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">קטגוריה</label>
              <select
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                    יוצר...
                  </>
                ) : (
                  '✅ יצירת דיון'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowNewDiscussion(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* רשימת דיונים */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">דיונים פעילים</h3>
        
        {discussions.length > 0 ? (
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openDiscussion(discussion)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-familia-blue hover:text-blue-700">
                      {discussion.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>📁 {discussion.category}</span>
                      <span>👤 {discussion.creator_name || 'משתמש אנונימי'}</span>
                      <span>💬 {discussion.comments_count} תגובות</span>
                    </div>
                  </div>
                  <div className="text-left mr-4">
                    <p className="text-sm text-gray-500">
                      {new Date(discussion.created_at).toLocaleDateString('he-IL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              💬 עדיין אין דיונים
            </p>
            <p className="text-gray-400">
              התחילו דיון חדש ובואו נתחיל לדבר!
            </p>
          </div>
        )}
      </div>

      {/* קטגוריות מהירות */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => {
          const categoryCount = discussions.filter(d => d.category === category).length;
          return (
            <div key={category} className="bg-familia-warm rounded-lg p-4 text-center">
              <h4 className="font-bold text-familia-blue">{category}</h4>
              <p className="text-sm text-gray-600">{categoryCount} דיונים</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscussionsPage;