import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditRoom = ({ room, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({ ...room });

  useEffect(() => {
    setFormData({ ...room });
  }, [room]);

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
      text: 'Do you really want to delete this room?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it',
    });

    if (result.isConfirmed) {
      await onDelete(room.id);
      Swal.fire('Deleted!', 'The room has been deleted.', 'success');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative z-10 bg-white w-[600px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold text-[#1470ef] mb-4">
          {room.id ? `Edit Room ${room.roomNumber || ''}` : "Add New Room"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Room Number:</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]" 
                name="roomNumber"
                value={formData.roomNumber || ''} 
                onChange={handleChange}
                placeholder="Enter room number"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Bed Type:</label>
              <input 
                type="text" 
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]" 
                value={formData.bedType || ''} 
                name="bedType" 
                onChange={handleChange} 
                placeholder="E.g., Single bed, Double bed"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Floor:</label>
              <select 
                name="floor"
                value={formData.floor || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
                required
              >
                <option value="">Select Floor</option>
                <option value="Floor 1">Floor 1</option>
                <option value="Floor 2">Floor 2</option>
                <option value="Floor 3">Floor 3</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Price ($):</label>
              <input 
                type="number" 
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]" 
                name="price" 
                value={formData.price || ''} 
                onChange={handleChange} 
                placeholder="Enter price"
                min={0}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[#676f86] font-semibold mb-1">Facility:</label>
            <input 
              type="text" 
              className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]" 
              value={formData.facility || ''} 
              name="facility" 
              onChange={handleChange} 
              placeholder="E.g., AC, shower, TV"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Status:</label>
              <select 
                name="status"
                value={formData.status || ''}
                onChange={handleChange}
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]"
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-[#676f86] font-semibold mb-1">Discount (%):</label>
              <input 
                type="number" 
                className="w-full p-2 border border-[#ddd] rounded mt-1 focus:outline-none focus:ring-2 focus:ring-[#1470ef]" 
                name="discount" 
                value={formData.discount || 0} 
                onChange={handleChange} 
                min={0}
                max={100}
              />
            </div>
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
              {room.id && (
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

export default EditRoom;
