import React, { useState } from "react";
import "./RoomTable.css"; // Import file CSS

const roomsData = [
  { id: "#001", bedType: "Double bed", floor: "Floor -1", facility: "AC, shower, double bed, towel, bathtub, TV", status: "Available" },
  { id: "#002", bedType: "Single bed", floor: "Floor -2", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Booked" },
  { id: "#003", bedType: "VIP", floor: "Floor -1", facility: "AC, shower, double bed, towel, bathtub, TV", status: "Booked" },
  { id: "#004", bedType: "VIP", floor: "Floor -1", facility: "AC, shower, double bed, towel, bathtub, TV", status: "Reserved" },
  { id: "#005", bedType: "Single bed", floor: "Floor -1", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Reserved" },
  { id: "#006", bedType: "Double bed", floor: "Floor -2", facility: "AC, shower, double bed, towel, bathtub, TV", status: "Waitlist" },
  { id: "#007", bedType: "Double bed", floor: "Floor -3", facility: "AC, shower, double bed, towel, bathtub, TV", status: "Reserved" },
  { id: "#008", bedType: "Single bed", floor: "Floor -5", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Blocked" },
  { id: "#008", bedType: "Single bed", floor: "Floor -5", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Blocked" },
  { id: "#008", bedType: "Single bed", floor: "Floor -5", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Blocked" },
  { id: "#008", bedType: "Single bed", floor: "Floor -5", facility: "AC, shower, single bed, towel, bathtub, TV", status: "Blocked" },
];

const RoomTable = () => {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  const statusCounts = roomsData.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1;
    return acc;
  }, { All: roomsData.length });

  const filteredRooms = filter === "All" ? roomsData : roomsData.filter(room => room.status === filter);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const displayedRooms = filteredRooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="container">
      {/* Filter Buttons */}
      <div className="content">
        <div className="filter-buttons">
          <div className="left-buttons">
            {["All", "Available", "Booked", "Reserved", "Waitlist", "Blocked"].map(status => (
              <button key={status} className={filter === status ? "active" : ""} onClick={() => { setFilter(status); setCurrentPage(1); }}>
                {status} ({statusCounts[status] || 0})
              </button>
            ))}
          </div>
          <button className="add-room">Add Room</button>
        </div>

        {/* Room Table */}
        <table>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Bed Type</th>
              <th>Room Floor</th>
              <th>Room Facility</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedRooms.map(room => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.bedType}</td>
                <td>{room.floor}</td>
                <td>{room.facility}</td>
                <td>
                  <span className={`status ${room.status.toLowerCase()}`}>{room.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <div className="page-numbers">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index + 1}
              className={`page-number ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>

    </div>
  );
};

export default RoomTable;
