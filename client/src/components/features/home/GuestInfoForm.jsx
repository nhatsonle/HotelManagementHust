import React from 'react';
import { useLocation } from 'react-router-dom';

function GuestInfoForm() {
  // Get state passed from BookingSection
  const location = useLocation();
  const { checkInDate, checkOutDate, numAdults, numChildren } = location.state || {};

  return (
    <div className="container mx-auto px-4 py-12 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-header text-center mb-2 font-bold">Guest Information</h2>
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 justify-center text-lg">
            <div><strong>Check-in:</strong> {checkInDate || '-'}</div>
            <div><strong>Check-out:</strong> {checkOutDate || '-'}</div>
            <div><strong>Adults:</strong> {numAdults || '-'}</div>
            <div><strong>Children:</strong> {numChildren || '-'}</div>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input type="tel" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Passport Number</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">City</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Region</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Zipcode</label>
            <input type="text" className="border rounded-lg p-2 w-full" required />
          </div>
          <button type="submit" className="bg-blue-600 text-white rounded-lg p-2 w-full font-header font-bold hover:bg-blue-700 transition-colors">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default GuestInfoForm;
