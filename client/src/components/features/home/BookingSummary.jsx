import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, room_info } = location.state || {};

  if (!booking || !room_info) {
    return (
      <div className="container mx-auto px-4 py-12 font-body text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-header font-bold mb-4">No Booking Data</h2>
          <p>There is no booking information to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-header text-center mb-4 font-bold">Booking Summary</h2>
        <div className="mb-6 text-lg">
          <div className="mb-2"><strong>Room:</strong> {room_info.room_name || room_info.room_number || '-'}</div>
          <div className="mb-2"><strong>Type:</strong> {room_info.room_type || '-'}</div>
          <div className="mb-2"><strong>Beds:</strong> {room_info.beds || '-'}</div>
          <div className="mb-2"><strong>Price per night:</strong> {room_info.price_per_night ? `$${room_info.price_per_night}` : '-'}</div>
          <div className="mb-2"><strong>Total Amount:</strong> {room_info.total_amount ? `$${room_info.total_amount}` : '-'}</div>
          <div className="mb-2"><strong>Status:</strong> {booking.status}</div>
          <div className="mb-2"><strong>Booking ID:</strong> {booking.booking_id}</div>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <button className="bg-green-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-green-700 transition-colors" onClick={() => { /* handle confirm/payment here */ }}>
            Confirm booking and Payment
          </button>
          <button className="bg-red-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-red-700 transition-colors" onClick={() => { /* handle cancel here */ }}>
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
