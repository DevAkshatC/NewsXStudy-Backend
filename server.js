const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for CORS (add more if needed)
const allowedOrigins = [
  process.env.FRONTEND_URL, // Netlify or your live frontend URL
  'http://localhost:5500',  // Live Server
  'http://127.0.0.1:5500'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow if origin matches any allowedOrigins (even with subpaths)
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin} not allowed`));
  },
  credentials: true
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const bookmarkRoutes = require('./routes/bookmarks');
const newsRoutes = require('./routes/news');

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/news', newsRoutes);

// Health check routes
app.get('/', (req, res) => res.send('Backend OK'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch(err => console.log('DB Error:', err));
