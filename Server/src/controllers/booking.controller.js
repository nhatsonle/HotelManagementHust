// controllers/bookingController.js
const { Op } = require('sequelize');
const { sequelize, Guest, Booking, Room, RoomType, Feedback } // Nạp tất cả model cần thiết từ models/index.js
    = require('../db'); // Giả sử models/index.js export tất cả models và sequelize

const bookingController = {
  initiateBooking: async (req, res, next) => {
    console.log('Booking request:', req.body); // Debug thông tin đầu vào
    const t = await sequelize.transaction(); // Bắt đầu một transaction
    try {
      const {
        check_in_date, // Mong đợi 'YYYY-MM-DD'
        check_out_date, // Mong đợi 'YYYY-MM-DD'
        num_adults,
        num_children,
        guest_info, // { name, email, phone, ... }
        room_type_id // Tùy chọn: ID của loại phòng khách muốn
      } = req.body;
      
      // ----- 1. Xác thực đầu vào cơ bản -----
      if (!check_in_date || !check_out_date || num_adults === undefined || num_children === undefined || !guest_info || !guest_info.email || !guest_info.name) {
        await t.rollback();
        return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin: check_in_date, check_out_date, num_adults, num_children, và guest_info (tối thiểu name, email).' });
      }

      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const today = new Date();
      today.setHours(0,0,0,0); // So sánh chỉ ngày

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn < today) {
        await t.rollback();
        return res.status(400).json({ message: 'Ngày check-in hoặc check-out không hợp lệ hoặc ngày check-in đã qua.' });
      }
      if (checkIn >= checkOut) {
        await t.rollback();
        return res.status(400).json({ message: 'Ngày check-out phải sau ngày check-in.' });
      }
      if (parseInt(num_adults) < 1) { // Ít nhất 1 người lớn
        await t.rollback();
        return res.status(400).json({ message: 'Số lượng người lớn phải ít nhất là 1.' });
      }
      const numberOfGuests = parseInt(num_adults) + parseInt(num_children || 0);


      // ----- 2. Xử lý thông tin Khách (Guest) - Tìm hoặc Tạo -----
      let guest;
      guest = await Guest.findOne({ where: { email: guest_info.email }, transaction: t });

      if (!guest) {
        guest = await Guest.create({
          name: guest_info.name,
          email: guest_info.email,
          phone: guest_info.phone,
          // Các trường khác từ guest_info nếu có và model Guest hỗ trợ
          passport_number: guest_info.passport_number,
          city: guest_info.city,
          region: guest_info.region,
          address: guest_info.address,
          zip_code: guest_info.zip_code,
        }, { transaction: t });
      } else {
        // Tùy chọn: Cập nhật thông tin khách nếu đã tồn tại và có thông tin mới
        // Ví dụ: guest.phone = guest_info.phone || guest.phone; await guest.save({ transaction: t });
      }


      // ----- 3. Tìm Phòng (Room) trống phù hợp -----
      const roomWhereConditions = {
        // BẠN CẦN CUNG CẤP CÁC GIÁ TRỊ ENUM CHÍNH XÁC TỪ `room_status_enum`
        room_status: { [Op.in]: ['Available', 'Cleaning'] }, // Trạng thái phòng cho phép đặt
        adult_number: { [Op.gte]: parseInt(num_adults) },   // Sức chứa người lớn
        child_number: { [Op.gte]: parseInt(num_children || 0) } // Sức chứa trẻ em
      };
      if (room_type_id) {
        roomWhereConditions.type_id = room_type_id;
      }

      const potentiallySuitableRooms = await Room.findAll({
        where: roomWhereConditions,
        transaction: t
      });

      if (!potentiallySuitableRooms.length) {
        await t.rollback();
        return res.status(404).json({ message: 'Không tìm thấy phòng nào phù hợp với yêu cầu sức chứa hoặc loại phòng.' });
      }

      let selectedRoom = null;
      for (const room of potentiallySuitableRooms) {
        const conflictingBooking = await Booking.findOne({
          where: {
            room_id: room.room_id,
            // BẠN CẦN CUNG CẤP CÁC GIÁ TRỊ ENUM CHÍNH XÁC TỪ `booking_status_enum`
            // cho các trạng thái không còn giữ phòng (ví dụ: đã hủy, đã hoàn thành, không đến)
            status: { [Op.notIn]: ['Checked-out', 'Cancelled'] },
            // Logic kiểm tra chồng chéo lịch
            [Op.and]: [
              { check_in: { [Op.lt]: checkOut } }, // check_in của booking cũ < check_out của booking mới
              { check_out: { [Op.gt]: checkIn } }  // check_out của booking cũ > check_in của booking mới
            ]
          },
          transaction: t
        });

        if (!conflictingBooking) {
          selectedRoom = room; // Tìm thấy phòng trống đầu tiên
          break;
        }
      }

      if (!selectedRoom) {
        await t.rollback();
        return res.status(409).json({ message: 'Rất tiếc, tất cả các phòng phù hợp đã được đặt trong khoảng thời gian bạn chọn.' });
      }


      // ----- 4. Tính toán total_amount (Đơn giản hóa) -----
      const roomType = await RoomType.findByPk(selectedRoom.type_id, { transaction: t });
      if (!roomType) {
        await t.rollback();
        // Lỗi này không nên xảy ra nếu dữ liệu DB nhất quán (type_id trong room phải có trong roomtypes)
        return res.status(500).json({ message: `Lỗi cấu hình: Không tìm thấy loại phòng cho phòng ID ${selectedRoom.room_id}.` });
      }
      const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      // Đây là logic tính giá rất cơ bản, bạn sẽ cần mở rộng nó nhiều
      const total_amount = (roomType.base_price || 0) * numberOfNights;


      // ----- 5. Tạo bản ghi Booking -----
      // BẠN CẦN CUNG CẤP GIÁ TRỊ ENUM CHÍNH XÁC CHO 'Awaiting-Payment'
      const initialBookingStatus = 'Awaiting-Payment'; // Từ `booking_status_enum`

      const newBooking = await Booking.create({
        guest_id: guest.guest_id,
        room_id: selectedRoom.room_id,
        check_in: checkIn, // Nên lưu dưới dạng Date object hoặc chuỗi YYYY-MM-DD chuẩn
        check_out: checkOut,
        num_adults: parseInt(num_adults),
        num_children: parseInt(num_children || 0),
        total_amount: total_amount,
        amount_paid: 0, // Ban đầu
        status: initialBookingStatus
      }, { transaction: t });

      await t.commit(); // Hoàn tất transaction
      console.log('Total amount:', total_amount);

      // Trả về thông tin booking và phòng (tùy chọn)
      res.status(201).json({
        message: 'Đã giữ phòng thành công! Vui lòng tiến hành thanh toán.',
        booking: newBooking,
        room_info: { // Thông tin phòng cơ bản để client hiển thị
          room_number: selectedRoom.room_number,
          bed_type: selectedRoom.bed_type,
          base_price_per_night: roomType.base_price,
          room_facility: selectedRoom.room_facility,
          type_name: roomType.type_name, // Lấy từ roomType
          total_amount: total_amount
        }
      });

    } catch (error) {
      await t.rollback(); // Rollback transaction nếu có lỗi
      console.error('Lỗi khi khởi tạo booking:', error);
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ message: "Lỗi dữ liệu: " + error.message, errors: error.errors });
      }
      next(error); // Chuyển các lỗi khác cho error handler chung
    }
  },

  // ... (cancelBooking, confirmBooking và các hàm khác sẽ ở đây) ...

  // Nhớ cập nhật cancelBooking đã tạo ở bước trước nếu cần
  cancelBooking: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId, { transaction: t });

        if (!booking) {
            await t.rollback();
            return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
        }
        
        // BẠN CẦN CUNG CẤP GIÁ TRỊ ENUM CHÍNH XÁC TỪ booking_status_enum
        const cancellableStatus = 'Awaiting-Payment'; 
        const cancelledStatus = 'Cancelled';

        if (booking.status !== cancellableStatus) {
            await t.rollback();
            return res.status(403).json({ message: `Không thể hủy booking này. Trạng thái hiện tại: ${booking.status}` });
        }

        booking.status = cancelledStatus;
        await booking.save({ transaction: t });
        
        await t.commit();
        res.status(200).json({ message: 'Booking đã được hủy thành công.', booking });
    } catch (error) {
        await t.rollback();
        console.error('Lỗi khi hủy booking:', error);
        next(error);
    }
  },

  confirmBooking: async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { bookingId } = req.params;
        // const { payment_details } = req.body; // Nếu bạn cần lưu thông tin thanh toán

        const booking = await Booking.findByPk(bookingId, { transaction: t });

        if (!booking) {
            await t.rollback();
            return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
        }

        // BẠN CẦN CUNG CẤP GIÁ TRỊ ENUM CHÍNH XÁC TỪ booking_status_enum
        const paymentPendingStatus = 'Awaiting-Payment';
        const confirmedStatus = 'Booked';

        if (booking.status !== paymentPendingStatus) {
            await t.rollback();
            return res.status(403).json({ message: `Không thể xác nhận booking này. Trạng thái hiện tại: ${booking.status}` });
        }

        booking.status = confirmedStatus;
        // Giả sử thanh toán đã đủ
        booking.amount_paid = booking.total_amount; // Cập nhật số tiền đã trả
        // if (payment_details) { /* Xử lý payment_details */ }

        await booking.save({ transaction: t });
        await t.commit();
        res.status(200).json({ message: 'Booking đã được xác nhận thành công.', booking });

    } catch (error) {
        await t.rollback();
        console.error('Lỗi khi xác nhận booking:', error);
        next(error);
    }
  }

};

module.exports = bookingController;