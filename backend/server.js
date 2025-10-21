import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Import your new, specific route files
import reviewRoutes from './routes/reviewRoutes.js';
import learnRoutes from './routes/learnRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from CodeSensei Backend!');
});

// 2. Tell Express to use your new routers at specific paths
app.use('/api/review', reviewRoutes);
app.use('/api/learn', learnRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});