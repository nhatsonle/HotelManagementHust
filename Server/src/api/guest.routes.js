// routes/guestRoutes.js
const express = require('express');
const router = express.Router();
const Guest = require('../db/Guest.model'); // Quan trọng: Nạp Model Guest


/**
 * @swagger
 * tags:
 * name: Guests
 * description: Các API để quản lý thông tin Khách
 */

/**
 * @swagger
 * /api/guests:
 * get:
 * summary: Lấy danh sách tất cả khách
 * tags: [Guests]
 * description: Trả về một danh sách tất cả các khách hàng có trong hệ thống.
 * responses:
 * '200':
 * description: Một mảng JSON chứa danh sách khách.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/GuestResponse' # Tham chiếu đến Schema GuestResponse đã định nghĩa ở app.js
 * '500':
 * description: Lỗi server nội bộ.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res, next) => {
  try {
    const guests = await Guest.findAll(); // Lấy tất cả các hàng từ bảng 'guests'
    res.status(200).json(guests);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách:', error);
    next(error); // Chuyển lỗi đến middleware xử lý lỗi (nếu có) hoặc default handler
  }
});




/**
 * @swagger
 * /api/guests:
 * post:
 * summary: Tạo một khách mới
 * tags: [Guests]
 * description: Tạo một bản ghi khách mới trong hệ thống.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/GuestInput' # Dữ liệu đầu vào để tạo Guest
 * responses:
 * '201':
 * description: Khách được tạo thành công.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/GuestResponse' # Khách vừa được tạo
 * '400':
 * description: Dữ liệu đầu vào không hợp lệ (ví dụ: thiếu trường, email sai định dạng).
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/ErrorResponse'
 * '500':
 * description: Lỗi server nội bộ.
 */
router.post('/', async (req, res, next) => {
  try {
    // req.body sẽ chứa dữ liệu client gửi lên (ví dụ: { name: "...", email: "...", ... })
    // Cần có middleware express.json() trong app.js
    const newGuestData = req.body;
    const newGuest = await Guest.create(newGuestData); // Tạo một bản ghi mới trong bảng 'guests'
    res.status(201).json(newGuest); // Trả về khách vừa tạo với status 201 Created
  } catch (error) {
    console.error('Lỗi khi tạo khách mới:', error);
    // Sequelize có thể trả về lỗi validation (vd: thiếu trường, email không hợp lệ, unique constraint)
    // Chúng ta có thể kiểm tra error.name để biết thêm chi tiết
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      // Gửi lỗi 400 Bad Request nếu là lỗi từ client
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error); // Cho các lỗi khác
  }
});

// 3. GET /api/guests/:guestId - Lấy thông tin một khách cụ thể
router.get('/:guestId', async (req, res, next) => {
  try {
    const guestId = req.params.guestId;
    const guest = await Guest.findByPk(guestId); // Tìm khách bằng Khóa Chính (Primary Key)

    if (guest) {
      res.status(200).json(guest);
    } else {
      // Nếu không tìm thấy, trả về lỗi 404
      res.status(404).json({ message: `Không tìm thấy khách với ID: ${guestId}` });
    }
  } catch (error) {
    console.error('Lỗi khi tìm khách:', error);
    next(error);
  }
});

// 4. PUT /api/guests/:guestId - Cập nhật (thay thế toàn bộ hoặc một phần) một khách
router.put('/:guestId', async (req, res, next) => {
  try {
    const guestId = req.params.guestId;
    const guest = await Guest.findByPk(guestId);

    if (guest) {
      // Phương thức guest.update() sẽ cập nhật các trường được cung cấp trong req.body
      // và bỏ qua các trường không có trong req.body.
      const updatedGuest = await guest.update(req.body);
      res.status(200).json(updatedGuest);
    } else {
      res.status(404).json({ message: `Không tìm thấy khách với ID: ${guestId} để cập nhật.` });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật khách:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
});

// 5. PATCH /api/guests/:guestId - Cập nhật một phần (Tương tự PUT với Sequelize instance.update())
// Sequelize không phân biệt rõ ràng PUT và PATCH ở cấp độ instance.update()
// Cả hai đều cập nhật các trường được cung cấp.
// Nếu bạn muốn logic PATCH chặt chẽ hơn (chỉ cập nhật nếu trường có trong body),
// bạn cần tự xử lý logic đó trước khi gọi update.
router.patch('/:guestId', async (req, res, next) => {
  try {
    const guestId = req.params.guestId;
    const guest = await Guest.findByPk(guestId);

    if (guest) {
      const updatedGuest = await guest.update(req.body); // Cập nhật các trường có trong req.body
      res.status(200).json(updatedGuest);
    } else {
      res.status(404).json({ message: `Không tìm thấy khách với ID: ${guestId} để cập nhật.` });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật một phần khách:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
});

// 6. DELETE /api/guests/:guestId - Xóa một khách
router.delete('/:guestId', async (req, res, next) => {
  try {
    const guestId = req.params.guestId;
    const guest = await Guest.findByPk(guestId);

    if (guest) {
      await guest.destroy(); // Xóa khách khỏi database
      res.status(204).send(); // 204 No Content - Phản hồi thành công, không có body
    } else {
      res.status(404).json({ message: `Không tìm thấy khách với ID: ${guestId} để xóa.` });
    }
  } catch (error){
    console.error('Lỗi khi xóa khách:', error);
    next(error);
  }
});

module.exports = router;