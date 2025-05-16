// controllers/guestController.js
const { Guest, Booking, Feedback } = require('../db'); // Nạp các model cần thiết từ models/index.js

// Tạo một đối tượng chứa các phương thức xử lý
const guestController = {
  // Phương thức lấy tất cả guests (tương ứng với GET /api/guests)
  getAllGuests: async (req, res, next) => {
    try {
      const guests = await Guest.findAll(); // Lấy tất cả các hàng từ bảng 'guests'
      res.status(200).json(guests);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách:', error);
      next(error); // Chuyển lỗi đến middleware xử lý lỗi (nếu có) hoặc default handler
    }
  },

  // Phương thức tạo guest mới (tương ứng với POST /api/guests)
  createGuest: async (req, res, next) => {
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
  },

  // Phương thức lấy guest theo ID (tương ứng với GET /api/guests/:guestId)
  getGuestById: async (req, res, next) => {
    try {
      const guestId = req.params.guestId; // Lấy guestId từ req.params
      const guest = await Guest.findByPk(guestId, {
        include: [
          { model: Booking, as: 'bookings' },
          { model: Feedback, as: 'feedbacks' }
        ]
      });

      if (guest) {
        res.status(200).json(guest);
      } else {
        res.status(404).json({ message: `Không tìm thấy khách với ID: ${guestId}` });
      }
    } catch (error) {
      console.error(`Lỗi khi tìm khách ID ${req.params.guestId}:`, error);
      next(error);
    }
  },

  // Phương thức cập nhật guest (tương ứng với PUT /api/guests/:guestId)
  updateGuest: async (req, res, next) => {
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
  },

  // Phương thức xóa guest (tương ứng với DELETE /api/guests/:guestId)
  deleteGuest: async (req, res, next) => {
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
  },
  // Bạn có thể thêm các phương thức khác cho PATCH nếu cần logic riêng
  patchGuest: async(req, res, next) => {
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
  }
};

module.exports = guestController; // Xuất khẩu đối tượng controller