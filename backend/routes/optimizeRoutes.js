import express from 'express'; // CHANGED
const router = express.Router();

/**
 * @route   POST /api/optimize
 * @desc    Provides optimization suggestions for code
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required in the request body.' });
    }

    console.log('Received code for optimization:', code);
    const aiResponse = `// AI Optimization Suggestions:\n// 1. The algorithm has a time complexity of O(n^2). Consider using a hash map to reduce it to O(n).\n// 2. Variable declarations can be combined.`;

    // IMPORTANT: His frontend expects 'analysis'
    res.json({ analysis: aiResponse });

  } catch (error) {
    console.error('Error in /api/optimize:', error);
    res.status(500).send('Server Error');
  }
});

export default router; // CHANGED