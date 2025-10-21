import express from 'express'; // CHANGED
const router = express.Router();

/**
 * @route   POST /api/bugtest
 * @desc    Analyzes code for bugs
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required in the request body.' });
    }

    console.log('Received code for bug testing:', code);
    const aiResponse = `// AI Bug Analysis:\n// 1. Found a potential null pointer exception on line X.\n// 2. The loop on line Y might have an off-by-one error.`;

    // IMPORTANT: His frontend expects 'analysis'
    res.json({ analysis: aiResponse }); 

  } catch (error) {
    console.error('Error in /api/bugtest:', error);
    res.status(500).send('Server Error');
  }
});

export default router; // CHANGED