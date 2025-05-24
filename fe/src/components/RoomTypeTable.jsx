import React, { useState, useEffect } from "react";
import { getRoomTypes, addRoomType, updateRoomType, deleteRoomType } from "../services/api";
import EditRoomType from "./EditRoomType.jsx";
import ellipsisVertical from "../assets/ellipsis-vertical.svg";

const RoomTypeTable = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const typesPerPage = 8;

  const fetchRoomTypes = async () => {
    try {
      const response = await getRoomTypes({ limit: 100 });
      setRoomTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  // Sort room types by type_id before slicing for pagination
  const sortedRoomTypes = [...roomTypes].sort((a, b) => a.type_id - b.type_id);
  const totalPages = Math.ceil(sortedRoomTypes.length / typesPerPage);
  const displayedTypes = sortedRoomTypes.slice((currentPage - 1) * typesPerPage, currentPage * typesPerPage);

  const handleAddClick = () => {
    setSelectedType({
      type_id: '',
      type_name: '',
      base_price: '',
      cancellation_policy: ''
    });
    setIsAdding(true);
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        type_name: data.type_name,
        base_price: parseFloat(data.base_price),
        cancellation_policy: data.cancellation_policy
      };

      if (isAdding) {
        await addRoomType(payload);
      } else {
        await updateRoomType(data.type_id, payload);
      }

      await fetchRoomTypes();
      setSelectedType(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (type_id) => {
    try {
      await deleteRoomType(type_id);
      await fetchRoomTypes();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const handleCloseForm = () => {
    setSelectedType(null);
    setIsAdding(false);
  };

  return (
    <div className="w-[80%] h-[70%] p-5 font-montserrat flex flex-col ml-auto mt-15">
      <div className="flex mb-5">
        <button
          className="ml-auto px-5 py-2 bg-[#1470ef] text-white rounded font-bold hover:bg-[#218838] transition-colors"
          onClick={handleAddClick}
        >
          Add Room Type
        </button>
      </div>

      <table className="w-full border-collapse border border-[#e9f1fe]">
        <thead>
          <tr>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Type ID</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Type Name</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Base Price</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Cancellation Policy</th>
            <th className="bg-[#f8f9fd] border-b border-[#e9f1fe] px-3 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {displayedTypes.map((type) => (
            <tr key={type.type_id}>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{type.type_id}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{type.type_name}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{type.base_price}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{type.cancellation_policy}</td>
              <td className="border-b border-[#e9f1fe] px-3 py-2">
                <button onClick={() => setSelectedType(type)}>
                  <img src={ellipsisVertical} alt="Options" className="w-5 h-5 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(isAdding || selectedType) && (
        <EditRoomType
          type={selectedType}
          onSave={handleSave}
          onClose={handleCloseForm}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default RoomTypeTable;
  