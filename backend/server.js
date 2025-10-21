import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Import ALL four route files
import reviewRoutes from './routes/reviewRoutes.js';
import learnRoutes from './routes/learnRoutes.js';
import bugTesterRoutes from './routes/bugTesterRoutes.js'; // FRIEND'S ROUTE
import optimizeRoutes from './routes/optimizeRoutes.js'; // FRIEND'S ROUTE

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

// 2. Use ALL four routers
app.use('/api/review', reviewRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/bugtest', bugTesterRoutes);   // FRIEND'S ROUTE
app.use('/api/optimize', optimizeRoutes); // FRIEND'S ROUTE

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});