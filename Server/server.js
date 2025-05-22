// app.js (đã cập nhật)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./src/config/swagger.config');
const app = express();
const port = 3000;

// Nạp các module router
const mainRoutes = require('./src/api/main.routes'); // Đường dẫn đến file mainRoutes.js
const guestRoutes = require('./src/api/guest.routes'); // Đường dẫn đến file userRoutes.js
const { connectDB } = require('./src/config/db.config'); // Đường dẫn đến file database.js
const bookingRoutes = require('./src/api/booking.routes'); // Đường dẫn đến file bookingRoutes.js

connectDB();

app.use(helmet());
app.use(cors());

// Middleware vẫn giữ ở đây (hoặc có thể tách ra thư mục middleware/ sau này)
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] Nhận ${req.method} đến ${req.originalUrl}`);
  next();
};
app.use(requestLogger);





// Phục vụ Swagger UI tại endpoint /api-docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ----- ROUTES ----- (đảm bảo đã require và use các route của bạn)
app.use('/', mainRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

// ----- ERROR HANDLING MIDDLEWARE (NẾU CÓ) -----
// ...

app.listen(port, () => {
  console.log(`Ứng dụng Express đang lắng nghe tại http://localhost:${port}`);
  // console.log(`Tài liệu API có tại: http://localhost:${port}/api-docs`); // Thêm dòng này
});