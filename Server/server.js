// app.js (đã cập nhật)
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;

// Nạp các module router
const mainRoutes = require('./src/api/main.routes'); // Đường dẫn đến file mainRoutes.js
const guestRoutes = require('./src/api/guest.routes'); // Đường dẫn đến file userRoutes.js
const { connectDB } = require('./src/config/db.config'); // Đường dẫn đến file database.js


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

// ----- CẤU HÌNH SWAGGER -----
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Phiên bản OpenAPI
    info: {
      title: 'API Quản Lý Khách (Guests API)',
      version: '1.0.0',
      description: 'Tài liệu API cho việc quản lý thông tin khách trong ứng dụng.',
      contact: { // Thông tin liên hệ (tùy chọn)
        name: 'Son Le/Team',
        email: 'son.ln225918@sis.hust.edu.com',
      },
    },
    servers: [ // Danh sách các server API của bạn
      {
        url: `http://localhost:${port}`, // URL server phát triển
        description: 'Development server',
      },
      // Bạn có thể thêm các server khác (staging, production) ở đây
    ],
    // Định nghĩa các components dùng chung, ví dụ: Schemas (cấu trúc dữ liệu)
    // Điều này giúp tái sử dụng và làm cho tài liệu gọn gàng hơn
    components: {
      schemas: {
        GuestInput: { // Schema cho dữ liệu đầu vào khi tạo/cập nhật Guest
          type: 'object',
          required: ['name', 'email'], // Các trường bắt buộc
          properties: {
            name: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'a.nguyen@example.com', unique: true },
            passport_number: { type: 'string', example: 'C1234567' },
            phone: { type: 'string', example: '0901234567' },
            city: { type: 'string', example: 'Hà Nội' },
            region: { type: 'string', example: 'Miền Bắc' },
            address: { type: 'string', example: '123 Đường ABC, Quận XYZ' },
            zip_code: { type: 'string', example: '100000' },
            // Không nên có password ở đây nếu đây là input cho client
            // Nếu có password, nó nên là cho việc tạo mới
          },
        },
        GuestResponse: { // Schema cho dữ liệu Guest trả về (có guest_id)
          type: 'object',
          properties: {
            guest_id: { type: 'integer', readOnly: true, description: 'ID tự động tạo của khách' },
            name: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'a.nguyen@example.com' },
            passport_number: { type: 'string', example: 'C1234567' },
            phone: { type: 'string', example: '0901234567' },
            city: { type: 'string', example: 'Hà Nội' },
            region: { type: 'string', example: 'Miền Bắc' },
            address: { type: 'string', example: '123 Đường ABC, Quận XYZ' },
            zip_code: { type: 'string', example: '100000' },
            // Không nên trả về password hash trong response API
          }
        },
        ErrorResponse: { // Schema cho phản hồi lỗi chung
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Thông báo lỗi cụ thể' },
                errors: { type: 'array', items: {type: 'object'}, example: [{field: 'email', message: 'Email không hợp lệ'}] }
            }
        }
      }
    }
  },
  // Đường dẫn đến các file chứa định nghĩa API (JSDoc comments)
  // ['./routes/*.js'] sẽ quét tất cả các file .js trong thư mục routes/
  apis: ['./src/api/*.js'],
};

// Tạo đặc tả Swagger từ options trên
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Phục vụ Swagger UI tại endpoint /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ----- ROUTES ----- (đảm bảo đã require và use các route của bạn)
app.use('/', mainRoutes);
app.use('/api/guests', guestRoutes);


// ----- ERROR HANDLING MIDDLEWARE (NẾU CÓ) -----
// ...

app.listen(port, () => {
  console.log(`Ứng dụng Express đang lắng nghe tại http://localhost:${port}`);
  console.log(`Tài liệu API có tại: http://localhost:${port}/api-docs`); // Thêm dòng này
});