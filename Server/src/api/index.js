// Định nghĩa các API endpoints cho từng resource (room, guest, booking, ...)
// Mount các router con (vd: /api/v1)
const express = require('express');
const roomRouter = require('./room.routes');
const roomTypeRouter = require('./roomType.routes');
const apiRouter = express.Router();

// Mount các router con
apiRouter.use('/rooms', roomRouter);
apiRouter.use('/room-types', roomTypeRouter);

module.exports = apiRouter;