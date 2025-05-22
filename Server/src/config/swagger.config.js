// config/swagger.config.js
const PORT = process.env.PORT || 3000; // Lấy port từ biến môi trường hoặc dùng 3000

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booking System API',
      version: '1.0.0',
      description: 'API documentation for the Hotel Booking System, covering guest management, room availability, booking processes, and more.',
      contact: {
        name: 'Tên Nhóm Phát Triển Của Bạn',
        // url: 'http://yourwebsite.com',
        email: 'emailcuaban@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`, // URL cơ sở cho các API của bạn (ví dụ: /api)
        description: 'Development Server',
      },
      // Bạn có thể thêm các server khác (staging, production)
    ],
    components: {
      schemas: {
        // Schemas cho Guest (tham khảo từ Guest.model.js)
        GuestInfoInput: {
          type: 'object',
          required: ['name', 'email', 'phone'],
          properties: {
            name: { type: 'string', example: 'Nguyễn Văn An' },
            email: { type: 'string', format: 'email', example: 'an.nguyen@example.com' },
            phone: { type: 'string', example: '0901234567' },
            passport_number: { type: 'string', nullable: true, example: 'C1234567' },
            city: { type: 'string', nullable: true, example: 'Hồ Chí Minh' },
            region: { type: 'string', nullable: true, example: 'Miền Nam' },
            address: { type: 'string', nullable: true, example: '123 Đường ABC' },
            zip_code: { type: 'string', nullable: true, example: '700000' },
          },
        },
        GuestResponse: {
          type: 'object',
          properties: {
            guest_id: { type: 'integer', readOnly: true },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', nullable: true },
            // ... các trường khác của Guest mà bạn muốn trả về
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true },
          },
        },
        // Schemas cho Booking
        BookingInitiateInput: {
          type: 'object',
          required: ['check_in_date', 'check_out_date', 'num_adults', 'guest_info'],
          properties: {
            check_in_date: { type: 'string', format: 'date', example: '2025-12-20' },
            check_out_date: { type: 'string', format: 'date', example: '2025-12-25' },
            num_adults: { type: 'integer', minimum: 1, example: 2 },
            num_children: { type: 'integer', minimum: 0, default: 0, example: 1 },
            guest_info: { $ref: '#/components/schemas/GuestInfoInput' },
            room_type_id: { type: 'integer', nullable: true, description: 'ID của loại phòng (tùy chọn)' },
          },
        },
        RoomInfoForBookingResponse: { // Thông tin phòng trả về khi giữ chỗ
            type: 'object',
            properties: {
                room_number: { type: 'string' },
                bed_type: { type: 'string' },
                room_facility: { type: 'string' },
                type_name: { type: 'string' },
                base_price_per_night: { type: 'number', format: 'float' }
            }
        },
        BookingResponse: { // Schema chung cho một Booking object trả về
          type: 'object',
          properties: {
            booking_id: { type: 'integer', readOnly: true },
            guest_id: { type: 'integer' },
            room_id: { type: 'integer' },
            check_in: { type: 'string', format: 'date-time' }, // Hoặc date nếu bạn lưu DATEONLY
            check_out: { type: 'string', format: 'date-time' },// Hoặc date
            num_adults: { type: 'integer' },
            num_children: { type: 'integer' },
            total_amount: { type: 'number', format: 'float' },
            amount_paid: { type: 'number', format: 'float' },
            status: { type: 'string', example: 'Awaiting-Payment' }, // Nên liệt kê các giá trị ENUM nếu có thể
            created_at: { type: 'string', format: 'date-time', readOnly: true },
            updated_at: { type: 'string', format: 'date-time', readOnly: true },
            guest: { $ref: '#/components/schemas/GuestResponse', nullable: true, description: "Thông tin khách đặt (nếu include)" },
            room: { type: 'object', nullable: true, description: "Thông tin phòng (nếu include, cần định nghĩa RoomResponse schema)" }
          },
        },
        BookingInitiateResponse: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                booking: { $ref: '#/components/schemas/BookingResponse' },
                room_info: { $ref: '#/components/schemas/RoomInfoForBookingResponse'}
            }
        },
        BookingConfirmPayload: { // Dữ liệu gửi lên khi xác nhận booking (nếu có)
            type: 'object',
            properties: {
                payment_transaction_id: { type: 'string', example: 'TRANS123XYZ', nullable: true },
                // ... các chi tiết thanh toán khác nếu cần
            }
        },
        BookingCancelPayload: { // Dữ liệu gửi lên khi hủy booking (nếu có)
            type: 'object',
            properties: {
                cancellation_reason: {type: 'string', example: 'Thay đổi kế hoạch', nullable: true}
            }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Thông báo lỗi' },
            errors: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  field: { type: 'string', nullable: true },
                  message: { type: 'string' }
                }
              },
              nullable: true 
            },
          },
        },
      },
      securitySchemes: { // Nếu bạn có xác thực, ví dụ JWT
        // bearerAuth: {
        //   type: 'http',
        //   scheme: 'bearer',
        //   bearerFormat: 'JWT',
        // }
      }
    },
    // security: [{ // Áp dụng security scheme cho tất cả API (nếu có)
    //   bearerAuth: []
    // }],
  },
  apis: ['./routes/*.js', './src/routes/*.js'], // Đường dẫn đến các file chứa JSDoc cho API
                                                // Điều chỉnh cho khớp với cấu trúc thư mục của bạn
};

module.exports = swaggerOptions;