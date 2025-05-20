import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingSummary from './BookingSummary';

function GuestInfoForm() {
  // Get state passed from BookingSection
  const location = useLocation();
  const navigate = useNavigate();
  const { checkInDate, checkOutDate, numAdults, numChildren, room_type_id} = location.state || {};
  const [guestInfo, setGuestInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
    city: '',
    region: '',
    address: '',
    zipcode: ''
  });
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error , setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const guestPayload = { ...guestInfo, name: guestInfo.fullName };
      delete guestPayload.fullName;
      const response = await axios.post('http://localhost:3000/api/bookings/initiate', {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: Number(numAdults),
        num_children: Number(numChildren),
        room_type_id : Number(room_type_id),
        guest_info: guestPayload,
      });
      if (response.status === 201) {
        const { booking, room_info } = response.data;
        setBookingData({ booking, room_info });
        setIsLoading(true); // keep loading for next page
        navigate('/booking-summary', { state: { booking, room_info } });
        return;
      } else {
        setError('Unexpected response from server.');
        setIsLoading(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-header text-center pt-5 mb-2 font-bold">Guest Information</h2>
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 justify-center text-lg">
            <div><strong>Check-in:</strong> {checkInDate || '-'}</div>
            <div><strong>Check-out:</strong> {checkOutDate || '-'}</div>
            <div><strong>Adults:</strong> {numAdults || '-'}</div>
            <div><strong>Children:</strong> {numChildren || '-'}</div>
            <div><strong>Room ID:</strong> {room_type_id || '-'}</div>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input name="fullName" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.fullName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input name="email" type="email" className="border rounded-lg p-2 w-full" required value={guestInfo.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input name="phone" type="tel" className="border rounded-lg p-2 w-full" required value={guestInfo.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Passport Number</label>
            <input name="passportNumber" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.passportNumber} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">City</label>
            <input name="city" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.city} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Region</label>
            <input name="region" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.region} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input name="address" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.address} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Zipcode</label>
            <input name="zipcode" type="text" className="border rounded-lg p-2 w-full" required value={guestInfo.zipcode} onChange={handleChange} />
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 w-full font-header font-bold hover:bg-blue-700 transition-colors" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {bookingData && (
          <div className="mt-6 text-green-700 text-center">Booking initiated successfully!</div>
        )}
      </div>
    </div>
  );
}

export default GuestInfoForm;
