const Feedback = require('../db/Feedback.model');

// Service to get all feedback
async function getAllFeedback() {
  try {
    return await Feedback.findAll();
  } catch (error) {
    throw new Error('An error occurred while fetching feedback.');
  }
}

module.exports = {
  getAllFeedback
}; 