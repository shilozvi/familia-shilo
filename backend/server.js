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

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ ברוך הבא לאתר המשפחתי של שילוביצקי! 👨‍👩‍👧‍👦',
    status: 'השרת רץ בהצלחה',
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      photos: '/api/photos',
      discussions: '/api/discussions',
      users: '/api/users'
    },
    version: '1.0.0'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'שרת משפחת שילוביצקי פועל בהצלחה! 💙' });
});

app.listen(PORT, () => {
  console.log(`🚀 השרת פועל על פורט ${PORT}`);
  console.log(`📱 בקר בכתובת: http://localhost:${PORT}`);
});