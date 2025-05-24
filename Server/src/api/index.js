// Định nghĩa các API endpoints cho từng resource (room, guest, booking, ...)
// Mount các router con (vd: /api/v1)
const express = require('express');
const cors = require('cors');
const roomRouter = require('./room.routes');
const roomTypeRouter = require('./roomType.routes');
const rateRouter = require('./rate.routes');
const feedbackRouter = require('./feedback.routes');
const apiRouter = express.Router();

const app = express();

app.use(cors({
  origin: '*' // or '*' to allow all origins
}));

// Mount các router con
apiRouter.use('/rooms', roomRouter);
apiRouter.use('/room-types', roomTypeRouter);
apiRouter.use('/rates', rateRouter);
apiRouter.use('/feedback', feedbackRouter);

module.exports = apiRouter;