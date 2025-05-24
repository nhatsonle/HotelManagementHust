const express = require('express');
const Feedback = require('../db/Feedback.model');
const router = express.Router();

// GET all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching feedback.' });
  }
});

module.exports = router; 