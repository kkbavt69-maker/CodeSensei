import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});