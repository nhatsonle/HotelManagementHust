const guestQueries = require('../db/guest.queries');

exports.getAllGuests = () => guestQueries.getAllGuests();

exports.getGuestById = (guest_id) => guestQueries.getGuestById(guest_id);

exports.createGuest = (guest) => {
  const { name, phone, email } = guest;
  return guestQueries.createGuest(name, phone, email);
};

exports.updateGuest = (guest_id, guest) => {
  const { name, phone, email } = guest;
  return guestQueries.updateGuest(guest_id, name, phone, email);
};

exports.deleteGuest = (guest_id) => guestQueries.deleteGuest(guest_id);
