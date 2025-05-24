import React, { useState, useEffect } from "react";
import { getRooms, addRoom, updateRoom, deleteRoom } from "../services/api";
import EditRoom from "./EditRoom.jsx";
import ellipsisVertical from '../assets/ellipsis-vertical.svg';

const Table = () => {
  const [roomsData, setRoomsData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await getRooms({ limit: 100 });
      const mappedRooms = response.data.data.map((room) => ({
        id: room.room_id,
        roomNumber: `#${room.room_number}`,
        bedType: room.bed_type,
        floor: `Floor ${room.room_floor}`,
        facility: room.room_facility,
        status: room.room_status,
        price: room.roomType?.base_price || 0,
        discount: 0,
      }));
      setRoomsData(mappedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Sort rooms by RoomNumber (numeric)
  const sortedRooms = [...roomsData].sort((a, b) => {
    const numA = parseInt(a.roomNumber.replace("#", ""), 10);
    const numB = parseInt(b.roomNumber.replace("#", ""), 10);
    return numA - numB;
  });

  const statusCounts = roomsData.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, { All: roomsData.length });

  const filteredRooms = filter === "All" ? sortedRooms : sortedRooms.filter(room => room.status === filter);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const displayedRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

  const statusStyles = {
    Available: "text-[#5a9cf3] bg-[#e9f1fe]",
    Booked: "text-[#e74c3c] bg-[#fde8e8]",
    Reserved: "text-[#51cc95] bg-[#e7f8f0]",
    Cleaning: "text-[#f2ab4f] bg-[#fdf4e5]",
    Maintenance: "text-[#fda539] bg-[#fdf4e5]",
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleAddRoomClick = () => {
    setSelectedRoom({
      id: '',
      roomNumber: '',
      bedType: '',
      floor: '',
      facility: '',
      status: 'Available',
      price: 0,
      discount: 0,
    });
    setIsAdding(true);
  };

  const handleSave = async (roomData) => {
    try {
      const convertedStatus = roomData.status === "Waitlist" ? "Reserved" : roomData.status === "Blocked" ? "Maintenance" : roomData.status;
      const payload = {
        room_number: roomData.roomNumber.replace('#', ''),
        bed_type: roomData.bedType,
        room_floor: parseInt(roomData.floor.replace("Floor ", ""), 10),
        room_facility: roomData.facility,
        room_status: convertedStatus,
        type_id: 1,
        adult_number: 1,
        child_number: 0
      };

      if (isAdding) {
        await addRoom(payload);
      } else {
        await updateRoom(roomData.id, payload);
      }

      await fetchRooms();
      setFilter("All");
      setSelectedRoom(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving room:", error.response?.data || error.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await deleteRoom(roomId);
      await fetchRooms();
      setSelectedRoom(null);
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const handleCloseForm = () => {
    setSelectedRoom(null);
    setIsAdding(false);
  };

  return (
    <div className="w-[80%] h-[70%] p-5 font-montserrat flex flex-col ml-auto mt-15">
      <div className="flex gap-2 mb-5">
        {["All", "Available", "Booked", "Reserved", "Cleaning", "Maintenance"].map(status => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full font-bold transition-all ${filter === status ? "bg-[#5a9cf3] text-white" : "bg-[#f0f0f0] text-[#676f86] hover:bg-[#d6e4ff]"}`}
            onClick={() => setFilter(status)}
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
        <button
          className="ml-auto px-5 py-2 bg-[#1470ef] text-white rounded font-bold hover:bg-[#218838] transition-colors"
          onClick={handleAddRoomClick}
        >
          Add Room
        </button>
      </div>

      <table className="w-full border-collapse border border-[#e9f1fe]">
        <thead>
          <tr>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Room Number</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Bed Type</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Room Floor</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Room Facility</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Status</th>
            <th className="bg-[#f8f9fd] border-b border-[#e9f1fe] px-3 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {displayedRooms.map(room => (
            <tr key={room.id}>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{room.roomNumber}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{room.bedType}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{room.floor}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{room.facility}</td>
              <td className="border-b border-[#e9f1fe] px-3 py-2">
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-center ${statusStyles[room.status] || ''}`}>
                  {room.status}
                </span>
              </td>
              <td className="border-b border-[#e9f1fe] px-3 py-2">
                <button onClick={() => { setSelectedRoom(room); setIsAdding(false); }}>
                  <img src={ellipsisVertical} alt="Options" className="w-5 h-5 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:bg-transparent disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index + 1}
              className={`px-4 py-2 rounded font-bold text-sm text-center cursor-pointer ${currentPage === index + 1 ? "bg-[#f8f9fd] text-[#2470de]" : "hover:bg-gray-100"}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:bg-transparent disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {(isAdding || selectedRoom) && (
        <EditRoom
          room={selectedRoom}
          onSave={handleSave}
          onClose={handleCloseForm}
          onDelete={handleDeleteRoom}
        />
      )}
    </div>
  );
};

export default Table;
