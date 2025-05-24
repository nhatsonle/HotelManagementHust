import React, { useState, useEffect } from 'react';
import EditGuest from "./EditGuest.jsx";
import ellipsisVertical from "../assets/ellipsis-vertical.svg";
import { getGuests, createGuest, updateGuest, deleteGuest } from "../services/api2";

const GuestTable = () => {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const guestsPerPage = 8;

  const fetchGuests = async () => {
    try {
      const res = await getGuests();
      setGuests(res.data);
    } catch (err) {
      console.error("Failed to fetch guests", err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const displayedGuests = filteredGuests.slice(
    (currentPage - 1) * guestsPerPage,
    currentPage * guestsPerPage
  );

  const handleSave = async (guest) => {
    const defaultedGuest = {
      guest_id: guest.guest_id || undefined,
      name: guest.name || "",
      phone: guest.phone || "",
      email: guest.email || "",
      address: guest.address || "",
      region: guest.region || "",
      passport_number: guest.passport_number || null,
      city: guest.city || "",
      zip_code: guest.zip_code || null
    };

    try {
      if (guest.guest_id) {
        await updateGuest(guest.guest_id, defaultedGuest);
      } else {
        await createGuest(defaultedGuest);
      }
      fetchGuests();
    } catch (error) {
      console.error("Error saving guest:", error);
    }
    setSelectedGuest(null);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGuest(id);
      fetchGuests();
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
    setSelectedGuest(null);
  };

  return (
    <div className="w-[80%] h-[70%] p-5 font-montserrat flex flex-col ml-auto mt-15">
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="ml-auto border border-gray-300 rounded px-3 py-1 text-sm w-64"
        />
        <button
          className="px-5 py-2 bg-[#1470ef] text-white rounded font-bold hover:bg-[#218838] transition-colors"
          onClick={() => {
            setSelectedGuest({
              name: "",
              phone: "",
              email: "",
              address: "",
              region: "",
              passport_number: "",
              city: "",
              zip_code: ""
            });
            setIsAdding(true);
          }}
        >
          Add Guest
        </button>
      </div>

      <table className="w-full border-collapse border border-[#e9f1fe]">
        <thead>
          <tr>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Name</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Phone</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Email</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Address</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left">Region</th>
            <th className="bg-[#f8f9fd] text-[#676f86] border-b border-[#e9f1fe] px-3 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {displayedGuests.map((g) => (
            <tr key={g.guest_id}>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{g.name}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{g.phone}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{g.email}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{g.address}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">{g.region}</td>
              <td className="text-[#676f86] border-b border-[#e9f1fe] px-3 py-2">
                <button onClick={() => { setSelectedGuest(g); setIsAdding(false); }}>
                  <img src={ellipsisVertical} alt="Options" className="w-5 h-5 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded font-bold text-sm cursor-pointer ${currentPage === i + 1 ? "bg-[#f8f9fd] text-[#2470de]" : "hover:bg-gray-100"}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-white border border-[#676f86] rounded font-bold text-sm text-[#676f86] hover:bg-[#f0f0f0] disabled:text-[#e0e0e0] disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {selectedGuest && (
        <EditGuest
          guest={selectedGuest}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => {
            setSelectedGuest(null);
            setIsAdding(false);
          }}
        />
      )}
    </div>
  );
};

export default GuestTable;
