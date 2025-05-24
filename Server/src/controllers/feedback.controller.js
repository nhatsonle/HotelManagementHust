const feedbackService = require('../services/feedback.service');

// Function to get all feedback
async function getAllFeedback(req, res) {
  try {
    const feedbacks = await feedbackService.getAllFeedback();
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching feedback.' });
  }
}

// Function to get feedback by room ID
async function getFeedbackByRoomId(req, res) {
  const { roomId } = req.params;
  try {
    const feedbacks = await feedbackService.getFeedbackByRoomId(roomId);
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching feedback for the specified room.' });
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackByRoomId
}; 