import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingMessage } from '../../components/common/Notification';
import { useNotification } from '../../hooks/useNotification';
import Notification from '../../components/common/Notification';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    tags: '',
    album_name: 'כללי'
  });
  
  const { notifications, removeNotification, showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, [selectedAlbum]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const url = selectedAlbum 
        ? `/api/photos?album=${selectedAlbum}`
        : '/api/photos';
      const response = await axios.get(url);
      setPhotos(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת תמונות:', error);
      showError('שגיאה בטעינת התמונות');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/api/photos/albums');
      setAlbums(response.data);
    } catch (error) {
      console.error('שגיאה בטעינת אלבומים:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('photoFile');
    const file = fileInput.files[0];
    
    if (!file) {
      showError('אנא בחרו תמונה להעלאה');
      return;
    }

    if (!newPhoto.album_name.trim()) {
      showError('אנא הזינו שם אלבום');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', newPhoto.caption);
    formData.append('tags', newPhoto.tags);
    formData.append('album_name', newPhoto.album_name);

    try {
      setUploading(true);
      await axios.post('/api/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowUploadForm(false);
      setNewPhoto({
        caption: '',
        tags: '',
        album_name: 'כללי'
      });
      fileInput.value = '';
      fetchPhotos();
      fetchAlbums();
      showSuccess('תמונה הועלתה בהצלחה! 📸');
    } catch (error) {
      console.error('שגיאה בהעלאת תמונה:', error);
      showError('שגיאה בהעלאת התמונה');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (photoId) => {
    try {
      await axios.post(`/api/photos/${photoId}/like`);
      fetchPhotos();
    } catch (error) {
      console.error('שגיאה בלייק:', error);
    }
  };

  if (loading) {
    return <LoadingMessage message="טוען תמונות..." />;
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
      {/* כותרת וכפתורים */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-bold text-familia-blue">
            🖼️ גלריית התמונות המשפחתית
          </h2>
          <div className="flex gap-3">
            <select
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">כל האלבומים</option>
              {albums.map((album) => (
                <option key={album.album_name} value={album.album_name}>
                  {album.album_name} ({album.photo_count})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-familia-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📷 העלאת תמונה
            </button>
          </div>
        </div>
      </div>

      {/* טופס העלאת תמונה */}
      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">העלאת תמונה חדשה</h3>
          <form onSubmit={handlePhotoUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">בחירת תמונה</label>
              <input
                type="file"
                id="photoFile"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">תיאור התמונה</label>
              <input
                type="text"
                value={newPhoto.caption}
                onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="מה מתרחש בתמונה?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">תגיות (מופרדות בפסיקים)</label>
                <input
                  type="text"
                  value={newPhoto.tags}
                  onChange={(e) => setNewPhoto({...newPhoto, tags: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="חגים, משפחה, ילדים..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">אלבום</label>
                <input
                  type="text"
                  value={newPhoto.album_name}
                  onChange={(e) => setNewPhoto({...newPhoto, album_name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="שם האלבום"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    מעלה...
                  </>
                ) : (
                  '✅ העלאת תמונה'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* גלריית תמונות */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={`/uploads/photos/${photo.filename}`}
                    alt={photo.caption || 'תמונה משפחתית'}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {photo.caption || 'תמונה משפחתית'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {photo.album_name}
                    </span>
                    <button
                      onClick={() => handleLike(photo.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                    >
                      ❤️ {photo.likes}
                    </button>
                  </div>
                  {photo.tags && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.split(',').map((tag, index) => (
                          <span key={index} className="text-xs bg-familia-warm px-2 py-1 rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              📷 עדיין אין תמונות באלבום זה
            </p>
            <p className="text-gray-400">
              בואו נתחיל לשתף זיכרונות יפים!
            </p>
          </div>
        )}
      </div>

      {/* מודל צפייה בתמונה */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedPhoto(null)}>
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={`/uploads/photos/${selectedPhoto.filename}`}
              alt={selectedPhoto.caption}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="bg-white p-4 rounded-b-lg">
              <p className="text-lg font-medium">{selectedPhoto.caption}</p>
              <p className="text-sm text-gray-600">
                הועלה על ידי: {selectedPhoto.uploader_name} | ❤️ {selectedPhoto.likes} לייקים
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;