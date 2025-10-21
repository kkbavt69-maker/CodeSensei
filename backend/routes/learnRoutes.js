import express from 'express';
const router = express.Router();

// This route corresponds to POST /api/learn
router.post('/', (req, res) => {
  try {
    const { language, topic } = req.body;
    console.log(`[API /api/learn] Received request for ${topic} in ${language}.`);

    const mockExplanation = `--- MOCK EXPLANATION ---\nTopic: ${topic} in ${language}\n\n${topic} is a fundamental concept. Here is a quick explanation:\n\n[...Detailed explanation of the topic...]\n\nExample:\n// Example code for ${topic} in ${language}\nconsole.log("This is an example!");\n--- END MOCK EXPLANATION ---`;

    res.status(200).json({ explanation: mockExplanation });

  } catch (error) {
    res.status(500).json({ error: 'Failed to process learn request.' });
  }
});

export default router;