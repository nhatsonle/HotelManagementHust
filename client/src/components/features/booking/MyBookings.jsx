import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/auth.service';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/sign-in');
          setIsLoading(false);
          return;
        }

        // First fetch user profile to get guest_id
        const userResponse = await fetch(
          `https://hotelmanagementhust.onrender.com/api/users/${currentUser.user_id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const userData = await userResponse.json();
        const guestId = userData.data.user.Guest?.guest_id;

        if (!guestId) {
          throw new Error('Guest ID not found');
        }

        // Then fetch bookings using guest_id
        const response = await fetch(
          `https://hotelmanagementhust-m6i2.onrender.com/api/bookings/guest/id/${encodeURIComponent(guestId)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.status === 404) {
          setBookings([]);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        console.log('Bookings response:', data);
        
        // Fetch room details for each booking
        let bookingsWithRooms = [];
        try {
          bookingsWithRooms = await Promise.all(
            data.map(async (booking) => {
              try {
                const roomResponse = await fetch(
                  `https://hotelmanagementhust.onrender.com/api/rooms/${booking.room_id}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  }
                );
                
                if (roomResponse.ok) {
                  const roomApiResponse = await roomResponse.json();
                  const roomData = roomApiResponse.data || {};
                  const roomType = roomData.roomType || {};
                  return {
                    ...booking,
                    room_number: roomData.room_number,
                    bed_type: roomData.bed_type,
                    room_floor: roomData.room_floor,
                    room_facility: roomData.room_facility,
                    room_type_name: roomType.type_name,
                    room_base_price: roomType.base_price
                  };
                }
                return booking;
              } catch (error) {
                console.error('Error fetching room details:', error);
                return booking;
              }
            })
          );
        } catch (roomErr) {
          console.error('Error in Promise.all for room fetch:', roomErr);
          bookingsWithRooms = data;
        }
        setBookings(bookingsWithRooms);
      } catch (err) {
        setError(err.message || 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            <p className="mt-1 text-sm text-gray-500">A list of all your bookings.</p>
          </div>
          
          {bookings.length === 0 ? (
            <div className="px-4 py-12 sm:px-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">You haven't made any bookings yet.</p>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <li key={booking.booking_id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          Booking #{booking.booking_id}
                        </p>
                        <div className="mt-2 flex flex-col sm:flex-row sm:justify-between items-center">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <span className="truncate">
                                Check-in: {new Date(booking.check_in).toLocaleDateString('en-GB')}
                              </span>
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <span className="truncate">
                                Check-out: {new Date(booking.check_out).toLocaleDateString('en-GB')}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'Awaiting-Payment' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                            <div className="ml-4 flex-shrink-0 text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ₫{parseFloat(booking.total_amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                Paid: ₫{parseFloat(booking.amount_paid).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Guests: {booking.num_adults} Adults, {booking.num_children} Children</p>
                          <p>Room: {booking.room_number || `#${booking.room_id}`}</p>
                          {booking.room_type_name && <p>Type: {booking.room_type_name}</p>}
                          {booking.bed_type && <p>Beds: {booking.bed_type}</p>}
                          {booking.room_floor && <p>Floor: {booking.room_floor}</p>}
                          {booking.room_facility && <p>Facilities: {booking.room_facility}</p>}
                          {booking.room_base_price && <p>Base Price: ₫{parseInt(booking.room_base_price).toLocaleString()}</p>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 