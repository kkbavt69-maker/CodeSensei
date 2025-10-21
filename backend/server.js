const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import the individual route files
const bugtestRoutes = require('./routes/bugtest');
const optimizeRoutes = require('./routes/optimize');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// --- Define API Routes ---
// Connect the individual routes to their specific paths
app.use('/api/bugtest', bugtestRoutes);
app.use('/api/optimize', optimizeRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from CodeSensei Backend!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
