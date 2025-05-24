const guestQueries = require('../db/guest.queries');

exports.getAllGuests = () => guestQueries.getAllGuests();

exports.getGuestById = (guest_id) => guestQueries.getGuestById(guest_id);

exports.createGuest = (guest) => {
  const { name, phone, email, passport_number, city, region, address, zip_code } = guest;
  if (!name || !phone || !email) {
    throw new Error('Tên, số điện thoại và email là bắt buộc');
  }
  return guestQueries.createGuest(name, phone, email, passport_number, city, region, address, zip_code);
};

exports.updateGuest = (guest_id, guest) => {
  const { name, phone, email, passport_number, city, region, address, zip_code } = guest;
  return guestQueries.updateGuest(guest_id, name, phone, email, passport_number, city, region, address, zip_code);
};

exports.deleteGuest = (guest_id) => guestQueries.deleteGuest(guest_id);