import express from 'express';
const router = express.Router();

// This route corresponds to POST /api/review
router.post('/', (req, res) => {
  try {
    const { language, code } = req.body;
    console.log(`[API /api/review] Received ${language} code for review.`);

    const mockReview = `--- MOCK REVIEW ---\nLanguage: ${language}\nYour code:\n${code}\n\nAI Analysis:\n1. This is a great start!\n2. Consider using 'const' instead of 'let' for variables that do not change.\n3. Your function is well-named.\n--- END MOCK REVIEW ---`;
    
    res.status(200).json({ review: mockReview });
  
  } catch (error) {
    res.status(500).json({ error: 'Failed to process review request.' });
  }
});

// You can add more review-related routes here, like GET /:id
export default router;