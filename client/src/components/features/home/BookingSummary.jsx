import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CancelBookingButton({ bookingId, onSuccess, onError, disabled }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`http://localhost:3000/api/bookings/${bookingId}/cancel`);
      if (response.status === 200 && response.data.booking.status === 'Cancelled') {
        onSuccess('Cancel room reservation successfully!');
      } else {
        onError('Unexpected response from server.');
      }
    } catch (err) {
      onError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="bg-red-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-red-700 transition-colors"
      onClick={handleCancel}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'Cancelling...' : 'Cancel Booking'}
    </button>
  );
}

function ConfirmBookingButton({bookingId, onClick, disabled }) {
  
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
    const response = await axios.patch(`http://localhost:3000/api/bookings/${bookingId}/confirm`);
      if (response.status === 200 && response.data.booking.status === 'Booked') {
        onSuccess('Create a new room reservation successfully!');
      } else {
        onError('Unexpected response from server.');
      }
    } catch (err) {
      onError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className="bg-green-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-green-700 transition-colors"
      onClick={handleConfirm}
      disabled={isLoading || disabled}
    >
      {isLoading ? 'Confirming...' : 'Confirm Booking'}
    </button>
  );
}

function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, room_info } = location.state || {};
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [bookingData, setBookingData] = React.useState({ booking, room_info });

  const handleCancelSuccess = (msg) => {
    setSuccessMsg(msg);
    setBookingData(null);
  };

  const handleConfirmSuccess = (msg) => {
    setSuccessMsg(msg); 
    setBookingData(null);
  }

  const handleCancelError = (msg) => {
    setError(msg);
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg('');
    try {
      const booking_id = bookingData.booking.booking_id;
      const response = await axios.patch(`http://localhost:3000/api/bookings/${booking_id}/confirm`);
      if (response.status === 200 && response.data.booking.status === 'Booked') {
        setSuccessMsg('Create a new room reservation successfully!');
        setBookingData(prev => ({
          ...prev,
          booking: response.data.booking
        }));
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="container mx-auto px-4 py-41 font-body text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-xl mx-auto max-h-screen">
          {successMsg && <div className="text-green-600 mb-4 text-center">{successMsg}</div>}
          <h2 className="text-2xl font-header font-bold mb-4">No Booking Data</h2>
          <p>There is no booking information to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-41 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-header text-center mb-4 font-bold">Booking Summary</h2>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {successMsg && <div className="text-green-600 mb-4 text-center">{successMsg}</div>}
        <div className="mb-6 text-lg">
          <div className="mb-2"><strong>Room:</strong> {bookingData.room_info.room_name || bookingData.room_info.room_number || '-'}</div>
          <div className="mb-2"><strong>Type:</strong> {bookingData.room_info.type_name || '-'}</div>
          <div className="mb-2"><strong>Beds:</strong> {bookingData.room_info.bed_type || '-'}</div>
          <div className="mb-2"><strong>Price per night:</strong> {bookingData.room_info.base_price_per_night ? `$${bookingData.room_info.base_price_per_night}` : '-'}</div>
          <div className="mb-2">
            <strong>Total Amount:</strong> {bookingData.room_info.total_amount !== null && bookingData.room_info.total_amount !== undefined 
              ? `$${bookingData.room_info.total_amount}`
              : '-'}
          </div>
          <div className="mb-2"><strong>Status:</strong> {bookingData.booking.status}</div>
          <div className="mb-2"><strong>Booking ID:</strong> {bookingData.booking.booking_id}</div>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          {bookingData.booking.status !== 'Booked' && (
            <>
              <button className="bg-green-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-green-700 transition-colors" onClick={handleConfirmBooking} disabled={isLoading}>
                Confirm booking and Payment
              </button>
              <CancelBookingButton
                bookingId={bookingData.booking.booking_id}
                onSuccess={handleCancelSuccess}
                onError={handleCancelError}
                disabled={isLoading}
              />
            </>
          )}
          {bookingData.booking.status === 'Booked' && (
            <button className="bg-blue-600 text-white rounded-lg px-6 py-2 font-header font-bold hover:bg-blue-700 transition-colors" onClick={() => navigate('/')}>
              Make a new reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingSummary;
