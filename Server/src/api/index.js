// Định nghĩa các API endpoints cho từng resource (room, guest, booking, ...)
// Mount các router con (vd: /api/v1)

const express = require('express');
//const roomRouter = require('./room.routes');
const guestRouter = require('./guest.routes');
//const bookingRouter = require('./booking.routes');

const apiRouter = express.Router();

//apiRouter.use('/rooms', roomRouter);
apiRouter.use('/guests', guestRouter);
//apiRouter.use('/bookings', bookingRouter);

module.exports = apiRouter;
