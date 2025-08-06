const express = require('express');
const router = express.Router();
const { gradePrompt, generateSuggestions } = require('../services/promptGrader');

// Grade a prompt
router.post('/grade', (req, res) => {
  try {
    const { prompt } = req.body;
    const score = gradePrompt(prompt);
    res.json({ score });
  } catch (error) {
    res.status(500).json({ error: 'Failed to grade prompt' });
  }
});

// Get suggestions for improving a prompt
router.post('/suggestions', (req, res) => {
  try {
    const { prompt } = req.body;
    const suggestions = generateSuggestions(prompt);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

module.exports = router;