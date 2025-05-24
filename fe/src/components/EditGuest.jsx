import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditGuest = ({ guest, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({ ...guest });

  useEffect(() => {
    setFormData({ ...guest });
  }, [guest]);

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
      text: 'Do you really want to delete this guest?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      await onDelete(guest.guest_id);
      Swal.fire('Deleted!', 'The guest has been deleted.', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative z-10 bg-white w-[600px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold text-[#1470ef] mb-4">
          {guest.guest_id ? `Edit Guest: ${guest.name}` : "Add New Guest"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Region:</label>
              <input
                type="text"
                name="region"
                value={formData.region || ''}
                onChange={handleChange}
                placeholder="Enter region"
                required
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#676f86] font-semibold mb-1">Passport Number:</label>
            <input
              type="text"
              name="passport_number"
              value={formData.passport_number || ''}
              onChange={handleChange}
              placeholder="Enter passport number"
              className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">City:</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Zip Code:</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code || ''}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#676f86] font-semibold mb-1">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Enter full address"
              required
              className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              className="px-4 py-2 bg-[#f0f0f0] text-[#333] rounded hover:bg-[#e0e0e0] transition-colors"
              onClick={onClose}
            >
              Close
            </button>
            <div className="ml-auto flex gap-3">
              {guest.guest_id && (
                <button
                  type="button"
                  className="px-4 py-2 bg-[#e74c3c] text-white rounded font-bold hover:bg-[#c0392b] transition-colors"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-[#3498db] text-white rounded font-bold hover:bg-[#2980b9] transition-colors"
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

export default EditGuest;