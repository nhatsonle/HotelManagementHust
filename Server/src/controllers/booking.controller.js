// controllers/bookingController.js
const { Op } = require('sequelize');
const { sequelize, Guest, Booking, Room, RoomType, Feedback } = require('../db/index.js'); 

const bookingController = {
  initiateBooking: async (req, res, next) => {
    console.log('Booking request:', req.body); // Debug thông tin đầu vào
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
        return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin: check_in_date, check_out_date, num_adults, num_children, và guest_info (tối thiểu name, email).' });
      }

      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);
      const today = new Date();
      today.setHours(0,0,0,0); // So sánh chỉ ngày

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkIn < today) {
        return res.status(400).json({ message: 'Ngày check-in hoặc check-out không hợp lệ hoặc ngày check-in đã qua.' });
      }
      if (checkIn >= checkOut) {
        return res.status(400).json({ message: 'Ngày check-out phải sau ngày check-in.' });
      }
      if (parseInt(num_adults) < 1) { // Ít nhất 1 người lớn
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
        });
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
        where: roomWhereConditions
      });

      if (!potentiallySuitableRooms.length) {
        return res.status(404).json({ message: 'Không tìm thấy phòng nào phù hợp với yêu cầu sức chứa hoặc loại phòng.' });
      }

      let selectedRoom = null;
      for (const room of potentiallySuitableRooms) {
        const conflictingBooking = await Booking.findOne({
          where: {
            room_id: room.room_id,
            
            status: { [Op.notIn]: ['Checked-out', 'Cancelled'] },
            // Logic kiểm tra chồng chéo lịch
            [Op.and]: [
              { check_in: { [Op.lt]: checkOut } }, // check_in của booking cũ < check_out của booking mới
              { check_out: { [Op.gt]: checkIn } }  // check_out của booking cũ > check_in của booking mới
            ]
          }
        });

        if (!conflictingBooking) {
          selectedRoom = room; // Tìm thấy phòng trống đầu tiên
          break;
        }
      }

      if (!selectedRoom) {
        return res.status(409).json({ message: 'Rất tiếc, tất cả các phòng phù hợp đã được đặt trong khoảng thời gian bạn chọn.' });
      }


      // ----- 4. Tính toán total_amount  -----
      const roomType = await RoomType.findByPk(selectedRoom.type_id);
      if (!roomType) {
        
        return res.status(500).json({ message: `Lỗi cấu hình: Không tìm thấy loại phòng cho phòng ID ${selectedRoom.room_id}.` });
      }
      const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      const total_amount = (roomType.base_price || 0) * numberOfNights;


      // ----- 5. Tạo bản ghi Booking -----
 
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
      });

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
      console.error('Lỗi khi khởi tạo booking:', error);
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ message: "Lỗi dữ liệu: " + error.message, errors: error.errors });
      }
      next(error); // Chuyển các lỗi khác cho error handler chung
    }
  },

  

  // Nhớ cập nhật cancelBooking đã tạo ở bước trước nếu cần
  cancelBooking: async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
        }
        
        // BẠN CẦN CUNG CẤP GIÁ TRỊ ENUM CHÍNH XÁC TỪ booking_status_enum
        const cancellableStatus = 'Awaiting-Payment'; 
        const cancelledStatus = 'Cancelled';

        if (booking.status !== cancellableStatus) {
            return res.status(403).json({ message: `Không thể hủy booking này. Trạng thái hiện tại: ${booking.status}` });
        }

        booking.status = cancelledStatus;
        await booking.save();
        
        await t.commit();
        res.status(200).json({ message: 'Booking đã được hủy thành công.', booking });
    } catch (error) {
        console.error('Lỗi khi hủy booking:', error);
        next(error);
    }
  },
  getAllBooking: async (req, res, next) => {
    try {
      const bookings = await Booking.findAll(); // Không cần transaction ở đây
      res.status(200).json({ bookings });
    } catch (error) {
      console.error('Lỗi khi lấy tất cả booking:', error);
      next(error);
    }
  },

getBookingById : async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    next(error);
  }
},

findAllBookingsByGuestName: async (guestName) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Guest,
          as: 'guest',
          where: {
            
            name: { [Op.iLike]: `%${guestName}%` }
          },
          required: true 
        }
      ]
    });

    if (bookings.length > 0) {
      console.log(`Tìm thấy ${bookings.length} booking(s) cho khách có tên: ${guestName}`);
      // bookings.forEach(b => console.log(b.toJSON()));
      return bookings;
    } else {
      console.log(`Không tìm thấy booking nào cho khách có tên: ${guestName}`);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi tìm tất cả bookings theo tên khách:", error);
    throw error;
  }
},



editBooking: async (req, res, next) => {
  const { bookingId } = req.params;
  // Giả sử req.body chứa trực tiếp các trường cần cập nhật
  // Ví dụ: { check_in_date: "...", num_adults: ... }
  const updates = req.body; 

  
  try {
    const booking = await Booking.findByPk(bookingId, {
      include: [ // Nạp các model liên quan để kiểm tra và tính toán lại
        { model: Room, as: 'room', include: [{ model: RoomType, as: 'roomType' }] },
        { model: Guest, as: 'guest' }
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
    }

    // --- Kiểm tra xem có thay đổi các trường quan trọng không ---
    const hasDateChanges = updates.check_in_date || updates.check_out_date;
    const hasGuestNumberChanges = updates.num_adults !== undefined || updates.num_children !== undefined;

    // Lấy giá trị hiện tại hoặc giá trị mới nếu có
    const newCheckIn = updates.check_in_date ? new Date(updates.check_in_date) : new Date(booking.check_in);
    const newCheckOut = updates.check_out_date ? new Date(updates.check_out_date) : new Date(booking.check_out);
    const newNumAdults = updates.num_adults !== undefined ? parseInt(updates.num_adults) : booking.num_adults;
    const newNumChildren = updates.num_children !== undefined ? parseInt(updates.num_children || 0) : booking.num_children;
    
    // Xác thực ngày cơ bản (nếu có thay đổi)
    if (hasDateChanges) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime()) || newCheckIn < today) {
            
            return res.status(400).json({ message: 'Ngày check-in hoặc check-out không hợp lệ hoặc ngày check-in đã qua.' });
        }
        if (newCheckIn >= newCheckOut) {
            
            return res.status(400).json({ message: 'Ngày check-out phải sau ngày check-in.' });
        }
    }
    if (newNumAdults < 1) {
        
        return res.status(400).json({ message: 'Số người lớn phải ít nhất là 1.' });
    }

    // --- Logic kiểm tra lại nếu có thay đổi quan trọng ---
    if (hasDateChanges || hasGuestNumberChanges) {
      const room = booking.room; // Room đã được include

      // 1. Kiểm tra lại sức chứa phòng
      const totalNewGuests = newNumAdults + newNumChildren;
      const roomCapacity = (room.adult_number || 0) + (room.child_number || 0);
      if (totalNewGuests > roomCapacity) {
        return res.status(400).json({ message: `Số lượng khách (${totalNewGuests}) vượt quá sức chứa (${roomCapacity}) của phòng ${room.room_number}.` });
      }
      if (newNumAdults > (room.adult_number || 0) || newNumChildren > (room.child_number || 0) ) {
        return res.status(400).json({ message: `Số người lớn hoặc trẻ em vượt quá sức chứa của phòng.` });
      }

      // 2. Kiểm tra lại phòng trống (nếu ngày tháng thay đổi)
      if (hasDateChanges) {
        const conflictingBooking = await Booking.findOne({
          where: {
            room_id: room.room_id,
            booking_id: { [Op.ne]: bookingId }, // Loại trừ chính booking đang sửa
            status: { [Op.notIn]: ['Cancelled', 'Checked-out'] }, // Thay thế bằng ENUM của bạn
            [Op.and]: [
              { check_in: { [Op.lt]: newCheckOut } },
              { check_out: { [Op.gt]: newCheckIn } }
            ]
          }
        });

        if (conflictingBooking) {
          return res.status(409).json({ message: `Phòng ${room.room_number} đã được đặt trong khoảng thời gian mới bạn chọn.` });
        }
      }

      // 3. Tính toán lại total_amount
      const roomType = room.roomType; // RoomType đã được include
      if (!roomType) {
          return res.status(500).json({ message: `Lỗi cấu hình: Không tìm thấy loại phòng.`})
      }
      const numberOfNights = Math.ceil((newCheckOut.getTime() - newCheckIn.getTime()) / (1000 * 60 * 60 * 24));
      updates.total_amount = (roomType.base_price || 0) * numberOfNights; // Gán giá trị mới vào object updates
    }
    
    // Chỉ cập nhật các trường được phép và có trong req.body
    // Tạo một object chứa các trường được phép cập nhật từ req.body
    const allowedUpdates = {};
    if (updates.hasOwnProperty('check_in_date')) allowedUpdates.check_in = newCheckIn;
    if (updates.hasOwnProperty('check_out_date')) allowedUpdates.check_out = newCheckOut;
    if (updates.hasOwnProperty('num_adults')) allowedUpdates.num_adults = newNumAdults;
    if (updates.hasOwnProperty('num_children')) allowedUpdates.num_children = newNumChildren;
    // Nếu total_amount được tính lại, nó sẽ có trong `updates` và được gán vào `allowedUpdates`
    if (updates.hasOwnProperty('total_amount')) allowedUpdates.total_amount = updates.total_amount;

    

    if (Object.keys(allowedUpdates).length > 0) {
        await booking.update(allowedUpdates);
    } else {
        // Không có gì để cập nhật, nhưng vẫn có thể coi là thành công (hoặc trả về 304 Not Modified)
        return res.status(200).json({ message: "Không có thông tin nào được thay đổi.", booking });
    }

    res.status(200).json(booking); // Trả về booking đã được cập nhật

  } catch (error) {
    console.error('Lỗi khi sửa booking:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
    }
    next(error);
  }
},

deleteBooking: async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
    }
    await booking.destroy();
    res.status(200).json({ message: 'Booking đã được xóa thành công.', booking });

  } catch (error) {
    console.error('Lỗi khi xóa booking:', error);
    next(error);
  }
},

  // controllers/bookingController.js
// ...
confirmBooking: async (req, res, next) => {
  try {
      const { bookingId } = req.params;
      // const { payment_details } = req.body; // Nhận thông tin thanh toán nếu có

      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
          return res.status(404).json({ message: `Không tìm thấy booking với ID: ${bookingId}` });
      }

      const paymentPendingStatus = 'Awaiting-Payment'; // Giá trị ENUM của bạn
      const confirmedStatus = 'Booked';           // Giá trị ENUM của bạn

      if (booking.status !== paymentPendingStatus) {
          return res.status(403).json({ message: `Không thể xác nhận booking này. Trạng thái hiện tại: ${booking.status}` });
      }

      booking.status = confirmedStatus;
      booking.amount_paid = booking.total_amount; // Giả sử thanh toán đủ
      // if (payment_details) { /* Xử lý, lưu payment_details nếu cần */ }
      

      await booking.save({ transaction: t });


      if(booking.room_id)
      {
        const room = await Room.findByPk(booking.room_id);
        if(room)
        {
          const newRoomStatus = 'Booked';
          room.room_status = newRoomStatus;
          await room.save();
          console.log(`Phòng ${room.room_number} đã được đặt cho booking ${bookingId}.`);
        }
        else
        {
          console.log(`Không tìm thấy phòng với ID: ${booking.room_id}`);
          return res.status(500).json({ message: `Không tìm thấy phòng với ID: ${booking.room_id}` });
        }
      }
      else {
        // Trường hợp này cũng là bất thường nếu booking luôn phải có room_id
        console.warn(`Booking ID ${bookingId} không có room_id. Không thể cập nhật trạng thái phòng.`);
      }
      
      res.status(200).json({ message: 'Booking đã được xác nhận thành công.', booking });

  } catch (error) {
      console.error('Lỗi khi xác nhận booking:', error);
      next(error);
  }
},
// ...

getBookingsByGuestID: async (guestID) => {
  try {
    const bookings = await Booking.findAll({
          where: {
           guest_id : guestID
          }
    });

    if (bookings.length > 0) {
      console.log(`Tìm thấy ${bookings.length} booking(s) cho khách có ID: ${guestID}`);
      // bookings.forEach(b => console.log(b.toJSON()));
      return bookings;
    } else {
      console.log(`Không tìm thấy booking nào cho khách có ID: ${guestID}`);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi tìm tất cả bookings theo ID khách:", error);
    throw error;
  }
},
}

module.exports = bookingController;