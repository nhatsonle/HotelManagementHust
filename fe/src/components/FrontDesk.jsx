import React, { useEffect, useState } from "react";
import { getBookings } from "../services/api3";
import { getGuests } from "../services/api2";
import { getRooms } from "../services/api";
import ellipsisVertical from "../assets/ellipsis-vertical.svg";
import EditBooking from "./EditBooking";
import { deleteBooking } from "../services/api3"; 

const FrontDesk = () => {
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;

  const [filterCheckIn, setFilterCheckIn] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, guestRes, roomRes] = await Promise.all([
          getBookings(),
          getGuests(),
          getRooms({ limit: 100 }),
        ]);
        setBookings(bookingRes);
        setGuests(guestRes?.data || []);
        setRooms(roomRes?.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  };

  const getGuestName = (guestId) => {
    const guest = guests.find((g) => g.guest_id === guestId);
    return guest ? guest.name : `Guest ${guestId}`;
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.room_id === roomId);
    return room ? room.room_number : `Room ${roomId}`;
  };

  const filteredBookings = bookings.filter((booking) => {
    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);

    if (filterCheckIn && checkInDate < new Date(filterCheckIn)) return false;
    if (filterCheckOut && checkOutDate > new Date(filterCheckOut)) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const displayedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const statusStyles = {
    Cancelled: "text-[#e74c3c] bg-[#fde8e8]",
    Booked: "text-[#51cc95] bg-[#e7f8f0]",
    "Awaiting-Payment": "text-[#f2ab4f] bg-[#fdf4e5]",
    "Checked-out": "text-[#5a9cf3] bg-[#e9f1fe]",
  };

  return (
    <div className="w-[80%] h-[70%] p-5 font-montserrat flex flex-col ml-auto mt-15">
      <h1 className="text-xl font-bold mb-4">Booking List</h1>

      {/* Filter Section */}
      <div className="bg-[#f8f9fd] rounded-xl p-6 mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block mb-1 text-[#676f86] font-semibold">Check In</label>
            <input
              type="date"
              value={filterCheckIn}
              onChange={(e) => setFilterCheckIn(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-[#676f86] font-semibold">Check Out</label>
            <input
              type="date"
              value={filterCheckOut}
              onChange={(e) => setFilterCheckOut(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Booking Table */}
      {loading ? (
        <div className="text-center text-[#676f86]">Loading bookings...</div>
      ) : (
        <>
          <table className="w-full border-collapse border border-[#e9f1fe]">
            <thead>
              <tr>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Guest Name</th>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Room Number</th>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Check-In</th>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Check-Out</th>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Total Amount</th>
                <th className="bg-[#f8f9fd] text-[#676f86] px-3 py-2">Status</th>
                <th className="bg-[#f8f9fd] px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-4 text-[#676f86]">No bookings found.</td></tr>
              ) : (
                displayedBookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td className="text-[#676f86] border-b px-3 py-2">{getGuestName(booking.guest_id)}</td>
                    <td className="text-[#676f86] border-b px-3 py-2">{getRoomNumber(booking.room_id)}</td>
                    <td className="text-[#676f86] border-b px-3 py-2">{formatDate(booking.check_in)}</td>
                    <td className="text-[#676f86] border-b px-3 py-2">{formatDate(booking.check_out)}</td>
                    <td className="text-[#676f86] border-b px-3 py-2">{parseInt(booking.total_amount).toLocaleString()} VND</td>
                    <td className="border-b px-3 py-2">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${statusStyles[booking.status] || 'bg-gray-200 text-gray-600'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="border-b px-3 py-2">
                      <button onClick={() => {
                        setSelectedBooking(booking);
                        setIsEditing(true);
                      }}>
                        <img src={ellipsisVertical} alt="Options" className="w-5 h-5 cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:text-[#ccc]"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <span
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded font-bold text-sm cursor-pointer ${
                    currentPage === i + 1 ? 'bg-[#f8f9fd] text-[#2470de]' : 'hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:text-[#ccc]"
            >
              Next
            </button>
          </div>

          {/* EditBooking Popup */}
          {isEditing && selectedBooking && (
              <EditBooking
              booking={selectedBooking}
              onClose={() => {
                setIsEditing(false);
                setSelectedBooking(null);
              }}
              onSave={(updatedData) => {
                setBookings((prev) =>
                  prev.map((b) =>
                    b.booking_id === selectedBooking.booking_id ? { ...b, ...updatedData } : b
                  )
                );
                setIsEditing(false);
                setSelectedBooking(null);
              }}
              onDelete={async (bookingId) => {
                try {
                  await deleteBooking(bookingId);
                  setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
                } catch (err) {
                  console.error("Failed to delete booking:", err);
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FrontDesk;
