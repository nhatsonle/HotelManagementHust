const Feedback = require('../db/Feedback.model');

// Function to get all feedback
async function getAllFeedback(req, res) {
  try {
    const feedbacks = await Feedback.findAll();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching feedback.' });
  }
}

module.exports = {
  getAllFeedback
}; 