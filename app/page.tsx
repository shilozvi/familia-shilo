export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-right rtl px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">ברוכים הבאים לאתר Familia del Shilo</h1>
      <p className="text-lg max-w-xl text-center mb-6 text-gray-700">
        זהו האתר המשפחתי שלנו. כאן תמצאו לוח ימי הולדת, גלריית תמונות, צ׳אט משפחתי, עץ משפחה, פרשת שבוע, סיפורים ועוד.
      </p>
      <a
        href="/login"
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
      >
        התחברות עם חשבון Google
      </a>
      <p className="text-sm text-gray-600 mt-4">המערכת תאפשר לבחור שם משתמש אישי לאחר ההתחברות</p>
    </main>
  );
}
