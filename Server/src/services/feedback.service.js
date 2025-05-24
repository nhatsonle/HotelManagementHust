const Feedback = require('../db/Feedback.model');
const { sequelize } = require('../config/db.config');

// Service to get all feedback
async function getAllFeedback() {
  try {
    return await Feedback.findAll();
  } catch (error) {
    throw new Error('An error occurred while fetching feedback.');
  }
}

// Service to get feedback by room ID using a database function
async function getFeedbackByRoomId(roomId) {
  try {
    const results = await sequelize.query('SELECT * FROM get_feedback_by_room_id(:input_room_id)', {
      replacements: { input_room_id: roomId },
      type: sequelize.QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    throw new Error('An error occurred while fetching feedback for the specified room.');
  }
}

module.exports = {
  getAllFeedback,
  getFeedbackByRoomId
}; 