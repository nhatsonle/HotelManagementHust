import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaUser, FaBed, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';

function formatDateDMY(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function CheckRates() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });

  const [filters, setFilters] = useState({
    type_id: '',
    min_discount: '',
    max_discount: '',
    cancellation_policy: '',
    showFilters: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableRates, setAvailableRates] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [cancellationPolicies, setCancellationPolicies] = useState([]);

  // Refs for date pickers
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  // Fetch room types and cancellation policies on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch room types
        const roomTypesResponse = await axios.get('/api/roomType');
        if (roomTypesResponse.data.success) {
          setRoomTypes(roomTypesResponse.data.data);
        }

        // Get unique cancellation policies from rates
        const ratesResponse = await axios.get('/api/rates');
        if (ratesResponse.data.success) {
          const policies = [...new Set(ratesResponse.data.data.map(rate => rate.cancellation_policy))];
          setCancellationPolicies(policies);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAvailableRates(null);

    try {
      // Convert dates to ISO format for API
      const checkInDate = new Date(formData.checkIn).toISOString().split('T')[0];
      const checkOutDate = new Date(formData.checkOut).toISOString().split('T')[0];

      // Build query parameters
      const params = {
        active: true,
        start_date_before: checkInDate,
        end_date_after: checkOutDate,
        min_availability: formData.rooms
      };

      // Add filters if they are set
      if (filters.type_id) params.type_id = filters.type_id;
      if (filters.min_discount) params.min_discount = filters.min_discount;
      if (filters.max_discount) params.max_discount = filters.max_discount;
      if (filters.cancellation_policy) params.cancellation_policy = filters.cancellation_policy;

      // Get rates with filters
      const response = await axios.get('/api/rates', { params });

      if (response.data.success) {
        setAvailableRates(response.data.data);
      } else {
        setError('Failed to fetch rates. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred while checking rates.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to convert string to Date for react-datepicker
  const getDateObj = (dateStr) => (dateStr ? parseISO(dateStr) : null);

  // Helper to convert Date to yyyy-MM-dd string for API
  const toAPIDate = (dateObj) => dateObj ? format(dateObj, 'yyyy-MM-dd') : '';

  // Update handleChange for react-datepicker
  const handleDateChange = (date, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date ? toAPIDate(date) : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilters = () => {
    setFilters(prev => ({
      ...prev,
      showFilters: !prev.showFilters
    }));
  };

  const resetFilters = () => {
    setFilters({
      type_id: '',
      min_discount: '',
      max_discount: '',
      cancellation_policy: '',
      showFilters: filters.showFilters
    });
  };

  return (
    <div className="min-h-screen pt-[72px] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Room Rates</h1>
          <p className="text-lg text-gray-600">Find the best rates for your stay with us</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in Date */}
              <div className="w-full">
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <div className="relative w-full">
                  <DatePicker
                    id="checkIn"
                    name="checkIn"
                    selected={getDateObj(formData.checkIn)}
                    onChange={(date) => handleDateChange(date, 'checkIn')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 datepicker-fullwidth"
                    wrapperClassName="w-full"
                    minDate={new Date()}
                    ref={checkInRef}
                    autoComplete="off"
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => checkInRef.current && checkInRef.current.setFocus && checkInRef.current.setFocus()}
                  >
                    <FaCalendarAlt className="text-gray-400 text-xl" />
                  </span>
                </div>
              </div>

              {/* Check-out Date */}
              <div className="w-full">
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <div className="relative w-full">
                  <DatePicker
                    id="checkOut"
                    name="checkOut"
                    selected={getDateObj(formData.checkOut)}
                    onChange={(date) => handleDateChange(date, 'checkOut')}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 datepicker-fullwidth"
                    wrapperClassName="w-full"
                    minDate={formData.checkIn ? getDateObj(formData.checkIn) : new Date()}
                    ref={checkOutRef}
                    autoComplete="off"
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => checkOutRef.current && checkOutRef.current.setFocus && checkOutRef.current.setFocus()}
                  >
                    <FaCalendarAlt className="text-gray-400 text-xl" />
                  </span>
                </div>
              </div>

              {/* Number of Guests */}
              <div className="w-full">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 text-xl" />
                  </span>
                </div>
              </div>

              {/* Number of Rooms */}
              <div className="w-full">
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms
                </label>
                <div className="relative w-full">
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    min="1"
                    max="5"
                    value={formData.rooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <FaBed className="text-gray-400 text-xl" />
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleFilters}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <FaFilter />
                {filters.showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Advanced Filters */}
            {filters.showFilters && (
              <div className="border-t pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Type Filter */}
                  <div>
                    <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type
                    </label>
                    <select
                      id="type_id"
                      name="type_id"
                      value={filters.type_id}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Room Types</option>
                      {roomTypes.map(type => (
                        <option key={type.type_id} value={type.type_id}>
                          {type.type_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cancellation Policy Filter */}
                  <div>
                    <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-2">
                      Cancellation Policy
                    </label>
                    <select
                      id="cancellation_policy"
                      name="cancellation_policy"
                      value={filters.cancellation_policy}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Policies</option>
                      {cancellationPolicies.map(policy => (
                        <option key={policy} value={policy}>
                          {policy}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Discount Range */}
                  <div>
                    <label htmlFor="min_discount" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Discount (%)
                    </label>
                    <input
                      type="number"
                      id="min_discount"
                      name="min_discount"
                      min="0"
                      max="100"
                      value={filters.min_discount}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Min discount"
                    />
                  </div>

                  <div>
                    <label htmlFor="max_discount" className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Discount (%)
                    </label>
                    <input
                      type="number"
                      id="max_discount"
                      name="max_discount"
                      min="0"
                      max="100"
                      value={filters.max_discount}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Max discount"
                    />
                  </div>
                </div>

                {/* Reset Filters Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking Availability...
                  </>
                ) : (
                  'Check Availability'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Available Rates */}
          {availableRates && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Rates</h2>
              <div className="space-y-4">
                {availableRates.map((rate) => (
                  <div key={rate.rate_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{rate.deal_name}</h3>
                        <p className="text-gray-600 mt-1">
                          {formatDateDMY(rate.start_date)} - {formatDateDMY(rate.end_date)}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {rate.cancellation_policy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ${rate.deal_price}
                          <span className="text-sm font-normal text-gray-500">/night</span>
                        </p>
                        {rate.discount > 0 && (
                          <p className="text-sm text-green-600 mt-1">
                            {rate.discount}% off
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => window.location.href = `/rooms?rate=${rate.rate_id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Rate Guarantee</h3>
            <p className="text-gray-600">We guarantee the best rates when you book directly with us.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Cancellation</h3>
            <p className="text-gray-600">Free cancellation up to 24 hours before check-in.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Special Offers</h3>
            <p className="text-gray-600">Check our special packages and seasonal promotions.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 