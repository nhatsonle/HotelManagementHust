import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../../services/auth.service';
import BookingSummary from './BookingSummary';

function GuestInfoForm() {
  // Get state passed from BookingSection
  const location = useLocation();
  const navigate = useNavigate();
  const { checkInDate, checkOutDate, numAdults, numChildren = 0, room_type_id} = location.state || {};
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
  const [error, setError] = useState(null);

  // Fetch user data if signed in
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const response = await authService.getProfile();
          if (response.success) {
            const userData = response.data.user;
            setGuestInfo({
              fullName: userData.full_name || '',
              email: userData.email || '',
              phone: userData.Guest?.phone || '',
              passportNumber: userData.Guest?.passport_number || '',
              city: userData.Guest?.city || '',
              region: userData.Guest?.region || '',
              address: userData.Guest?.address || '',
              zipcode: userData.Guest?.zip_code || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    let guestId;

    try {
      // Validate required fields
      if (!checkInDate || !checkOutDate || !numAdults || !room_type_id) {
        setError('Please ensure all booking details are provided');
        setIsLoading(false);
        return;
      }

      // Get current user's guest_id
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        setError('Please sign in to make a booking');
        setIsLoading(false);
        return;
      }

      const userResponse = await authService.getProfile();
      if (!userResponse.success || !userResponse.data.user.Guest?.guest_id) {
        setError('Unable to get guest information. Please try again.');
        setIsLoading(false);
        return;
      }

      guestId = userResponse.data.user.Guest.guest_id;

      // Validate guest information
      if (!guestInfo.fullName || !guestInfo.email) {
        setError('Please provide your full name and email');
        setIsLoading(false);
        return;
      }

      // Prepare guest info payload
      const guestInfoPayload = {
        name: guestInfo.fullName,
        email: guestInfo.email,
        phone: guestInfo.phone || '',
        passport_number: guestInfo.passportNumber || '',
        city: guestInfo.city || '',
        region: guestInfo.region || '',
        address: guestInfo.address || '',
        zip_code: guestInfo.zipcode || ''
      };

      // Prepare the complete request payload with proper data types
      const requestPayload = {
        guest_id: Number(guestId),
        room_id: Number(room_type_id),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: parseInt(numAdults, 10),
        num_children: parseInt(numChildren, 10),
        guest_info: guestInfoPayload
      };

      // Log the request payload for debugging
      console.log('Booking request payload:', requestPayload);

      const response = await axios.post('https://hotelmanagementhust-m6i2.onrender.com/api/bookings/initiate', requestPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
      console.error('Booking error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        payload: {
          guest_id: guestId,
          room_id: room_type_id,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          num_adults: numAdults,
          num_children: numChildren
        }
      });
      
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while processing your booking';
      setError(errorMessage);
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
            <div><strong>Children:</strong> {Number(numChildren) || 0}</div>
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
