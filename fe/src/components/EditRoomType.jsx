import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditRoomType = ({ type, onSave, onClose, onDelete }) => {
  const [formData, setFormData] = useState({ ...type });

  useEffect(() => {
    setFormData({ ...type });
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this room type?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      await onDelete(type.id || type.type_id);
      Swal.fire("Deleted!", "Room type has been deleted.", "success");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-30"
        onClick={onClose}
      />
      <div className="relative z-10 bg-white w-[500px] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold text-[#1470ef] mb-4">
          {type?.type_id ? "Edit Room Type" : "Add Room Type"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-[#676f86]">Type Name</label>
            <input
              name="type_name"
              value={formData.type_name || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#676f86]">Base Price</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-[#676f86]">Cancellation Policy</label>
            <input
              name="cancellation_policy"
              value={formData.cancellation_policy || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {type?.type_id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default EditRoomType;
