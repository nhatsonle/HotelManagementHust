const guestService = require('../services/guest.service');

exports.getAllGuests = async (req, res) => {
  const guests = await guestService.getAllGuests();
  res.json(guests);
};

exports.getGuestById = async (req, res) => {
  const guest = await guestService.getGuestById(req.params.id);
  if (!guest) return res.status(404).json({ message: 'Không tìm thấy khách' });
  res.json(guest);
};

exports.createGuest = async (req, res) => {
  try {
    const newGuest = await guestService.createGuest(req.body);
    res.status(201).json(newGuest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateGuest = async (req, res) => {
  const updated = await guestService.updateGuest(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Không tìm thấy khách' });
  res.json(updated);
};

exports.deleteGuest = async (req, res) => {
  await guestService.deleteGuest(req.params.id);
  res.status(204).send();
};