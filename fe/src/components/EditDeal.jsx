import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getRoomTypes } from '../services/api';

const EditDeal = ({ deal, onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState({ ...deal });
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    setFormData({ ...deal });
  }, [deal]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getRoomTypes();
        setRoomTypes(res.data.data);
      } catch (err) {
        console.error("Failed to load room types", err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['type_id', 'availability', 'discount', 'deal_price'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (deal?.id) {
      payload.id = deal.id;
    }
    onSave(payload);
    onClose();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this deal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      await onDelete(deal.id);
      Swal.fire('Deleted!', 'The deal has been deleted.', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="relative bg-white p-6 rounded shadow-md z-10 w-[600px]">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          {deal?.id ? "Edit Deal" : "Add New Deal"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="deal_name"
            value={formData.deal_name || ''}
            onChange={handleChange}
            placeholder="Deal Name"
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="type_id"
            value={formData.type_id || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Room Type</option>
            {roomTypes.map(rt => (
              <option key={rt.type_id} value={rt.type_id}>
                {rt.type_name}
              </option>
            ))}
          </select>

          <input
            name="discount"
            type="number"
            value={formData.discount || ''}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full border p-2 rounded"
          />
          <input
            name="deal_price"
            type="number"
            value={formData.deal_price || ''}
            onChange={handleChange}
            placeholder="Deal Price"
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="availability"
            type="number"
            value={formData.availability || ''}
            onChange={handleChange}
            placeholder="Availability"
            className="w-full border p-2 rounded"
          />
          <input
            name="start_date"
            type="date"
            value={formData.start_date || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="end_date"
            type="date"
            value={formData.end_date || ''}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="cancellation_policy"
            value={formData.cancellation_policy || ''}
            onChange={handleChange}
            placeholder="Cancellation Policy"
            className="w-full border p-2 rounded"
          />

          {/* Footer: Close (left), Delete + Save (right) */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Close
            </button>

            <div className="flex gap-2">
              {deal?.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-[#e74c3c] text-white rounded font-bold hover:bg-[#c0392b] transition-colors cursor-pointer"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-[#3498db] text-white rounded font-bold hover:bg-[#2980b9] transition-colors cursor-pointer"
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

export default EditDeal;
