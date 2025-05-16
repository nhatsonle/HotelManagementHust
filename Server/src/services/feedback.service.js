const queries = require('../db/feedback.queries');

exports.getAllFeedbacks = () => queries.getAllFeedbacks();

exports.getRecentFeedbacks = () => queries.getRecentFeedbacks();

exports.createFeedback = (data) => {
  const { guest_id, room_id, comment } = data;
  return queries.createFeedback(guest_id, room_id, comment);
};

exports.deleteFeedback = (feedback_id) => queries.deleteFeedback(feedback_id);
