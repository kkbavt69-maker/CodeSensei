// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
import reviewRoutes from './routes/reviewRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import optimizeRoutes from './routes/optimizeRoutes.js';
import bugTesterRoutes from './routes/bugTesterRoutes.js';

app.use('/api/review', reviewRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/optimize', optimizeRoutes);
app.use('/api/bugtest', bugTesterRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});