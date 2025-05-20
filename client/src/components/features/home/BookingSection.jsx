import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

function BookingSection() {
  // State variables for form fields
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState('0');
  const [numChildren, setNumChildren] = useState('0');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/guest-info', {
      state: {
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        numAdults,
        numChildren
      }
    });
  };

  return (
    <section className="container mx-auto px-4 -mt-24 relative z-10 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
        <h2 className="text-2xl font-header text-center mb-2 font-bold">Book a Room</h2>
        <p className="text-gray-600 text-center mb-6">Discover the perfect space for you!</p>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-600 mb-1">Check-in date</label>
            <DatePicker
              selected={checkInDate}
              onChange={date => setCheckInDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholderText="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-600 mb-1">Check-out date</label>
            <DatePicker
              selected={checkOutDate}
              onChange={date => setCheckOutDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholderText="yyyy-MM-dd"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-600 mb-1">Adults</label>
            <select 
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={numAdults}
              onChange={e => setNumAdults(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm text-gray-600 mb-1">Children</label>
            <select 
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={numChildren}
              onChange={e => setNumChildren(e.target.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-lg p-2 h-full mt-auto hover:bg-blue-700 transition-colors font-header font-bold w-full"
          >
            BOOK NOW
          </button>
        </form>
      </div>
    </section>
  );
}

export default BookingSection;