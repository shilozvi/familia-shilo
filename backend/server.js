const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/discussions', require('./routes/discussions'));
app.use('/api/users', require('./routes/users'));

// Root route - temporary HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>משפחת שילוביצקי - אתר משפחתי</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }
        .container {
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        .status {
          background: rgba(72, 187, 120, 0.8);
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
        }
        .api-links {
          margin-top: 2rem;
        }
        .api-links a {
          display: inline-block;
          margin: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        .api-links a:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>👨‍👩‍👧‍👦 משפחת שילוביצקי</h1>
        <p>ברוכים הבאים לאתר המשפחתי שלנו!</p>
        
        <div class="status">
          ✅ השרת רץ בהצלחה על Render!
        </div>
        
        <p>🚀 בקרוב נשיק את הממשק החדש עם React</p>
        
        <div class="api-links">
          <h3>🔗 בדיקת API:</h3>
          <a href="/api/health" target="_blank">בריאות השרת</a>
          <a href="/api/events" target="_blank">אירועים</a>
          <a href="/api/photos" target="_blank">תמונות</a>
          <a href="/api/discussions" target="_blank">דיונים</a>
        </div>
        
        <p style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.7;">
          💙 נוצר עם אהבה עבור המשפחה
        </p>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'שרת משפחת שילוביצקי פועל בהצלחה! 💙' });
});

app.listen(PORT, () => {
  console.log(`🚀 השרת פועל על פורט ${PORT}`);
  console.log(`📱 בקר בכתובת: http://localhost:${PORT}`);
});