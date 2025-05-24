import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditBooking = ({ booking, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({ ...booking });

  useEffect(() => {
    setFormData({ ...booking });
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      await onDelete(booking.booking_id);
      Swal.fire('Deleted!', 'The booking has been deleted.', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative z-10 bg-white w-[600px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold text-[#1470ef] mb-4">
          Edit Booking #{booking.booking_id}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Guest ID</label>
              <input
                type="number"
                name="guest_id"
                value={formData.guest_id || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Room ID</label>
              <input
                type="number"
                name="room_id"
                value={formData.room_id || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Check-In</label>
              <input
                type="date"
                name="check_in"
                value={formData.check_in?.slice(0, 10) || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Check-Out</label>
              <input
                type="date"
                name="check_out"
                value={formData.check_out?.slice(0, 10) || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Total Amount</label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Amount Paid</label>
              <input
                type="number"
                name="amount_paid"
                value={formData.amount_paid || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Status</label>
              <select
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                required
              >
                <option value="">Select status</option>
                <option value="Booked">Booked</option>
                <option value="Awaiting Payment">Awaiting Payment</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Checked-out">Checked-out</option>
              </select>
            </div>
            <div>
              <label className="block text-[#676f86] font-semibold mb-1">Adults</label>
              <input
                type="number"
                name="num_adults"
                value={formData.num_adults || 0}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded"
                min={0}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#676f86] font-semibold mb-1">Children</label>
            <input
              type="number"
              name="num_children"
              value={formData.num_children || 0}
              onChange={handleChange}
              className="w-full p-2 border border-[#ddd] rounded"
              min={0}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="px-4 py-2 bg-[#f0f0f0] text-[#333] rounded hover:bg-[#e0e0e0]"
              onClick={onClose}
            >
              Close
            </button>
            <div className="ml-auto flex gap-3">
              {booking.booking_id && (
                <button
                  type="button"
                  className="px-4 py-2 bg-[#e74c3c] text-white rounded hover:bg-[#c0392b]"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-[#3498db] text-white rounded hover:bg-[#2980b9]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;