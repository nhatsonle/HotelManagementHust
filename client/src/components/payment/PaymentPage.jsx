// pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import vnpLogo from '../../assets/images/vnpay.png';
import novotelLogo from '../../assets/images/novotel.png';
import ncb from '../../assets/images/ncb.png';

function PaymentPage() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingDetails, setBookingDetails] = useState(null);
  const [amountToPay, setAmountToPay] = useState(0);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (location.state) {
      setAmountToPay(location.state.amount);
      setBookingDetails(location.state.bookingDetails);
      setRoomDetails(location.state.roomDetails);
    }
  }, [location.state, bookingId]);

  useEffect(() => {
    // No auto-redirect, modal will handle navigation
  }, [paymentSuccess]);

  const validateForm = () => {
    const errors = {};
    if (!cardNumber) errors.cardNumber = 'Please fill in the card number';
    if (!cardName) errors.cardName = 'Please fill in the card name';
    if (!releaseDate) errors.releaseDate = 'Please fill in the release date';
    return errors;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentSuccess(false);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://hotelmanagementhust-m6i2.onrender.com/api/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok) throw new Error(data.message || 'Error when confirming payment.');
        setPaymentSuccess(true);
        setBookingDetails(data.booking);
      } catch (e) {
        console.error('Raw response:', text);
        setPaymentError('Server error: ' + text);
      }
    } catch (err) {
      console.log(err);
      setPaymentError(err.message || 'Payment failed, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!bookingDetails && !location.state?.amount) {
    return <p className="text-center mt-10 text-lg text-red-500">No valid booking information to pay. Please try again from the beginning.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 relative">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl z-10">
        {/* Left: Order Info */}
        <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 p-8 flex flex-col justify-between">
          {/* Header logos */}
          <div className="flex items-center gap-4 mb-8">
            {/* Replace src with your actual logo paths */}
            <img src={vnpLogo} alt="VNPay" className="h-8" />
            <span className="font-bold text-xl text-[#e30613]">VNPay</span>
            
          </div>
          <div className="flex items-center gap-4 mb-8">
            <img src={novotelLogo} alt="Novotel" className="h-60 rounded-xl" />
            
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-6">Booking Information</h2>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Amount to pay</span>
              <span className="text-2xl font-bold text-blue-700">{Number(amountToPay).toLocaleString('en-US')}<span className="text-base font-normal"> USD</span></span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Value of the order</span>
              <span>{Number(amountToPay).toLocaleString('en-US')}<span className="text-xs"> USD</span></span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Transaction fee</span>
              <span>0<span className="text-xs"> USD</span></span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Booking ID</span>
              <span>{bookingDetails?.booking_id || '---'}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Provider</span>
              <span>MC CTT VNPay</span>
            </div>
          </div>
        </div>
        {/* Right: Payment Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-center">Payment through NCB Bank</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Card Number</label>
                <div className="flex items-center border rounded px-3 py-2 bg-gray-50">
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Enter card number"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                  {/* Replace with actual NCB logo path */}
                  <img src={ncb} alt="NCB" className="h-6 ml-2" />
                </div>
                {formErrors.cardNumber && <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Card Name</label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 bg-gray-50 ${formErrors.cardName ? 'border-red-500' : ''}`}
                  placeholder="Enter card name (without special characters)"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                />
                {formErrors.cardName && <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Release Date</label>
                <input
                  type="text"
                  className={`w-full border rounded px-3 py-2 bg-gray-50 ${formErrors.releaseDate ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                  value={releaseDate}
                  onChange={e => setReleaseDate(e.target.value)}
                />
                {formErrors.releaseDate && <p className="text-red-500 text-sm mt-1">{formErrors.releaseDate}</p>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Promotion Code</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                  placeholder="Choose or enter the promotion code"
                  disabled
                />
              </div>
              {paymentError && <p className="text-red-500 text-sm">Error: {paymentError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Modal for payment success */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-gradient-to-b flex items-center justify-center z-50 from-transparent to-black">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="text-green-600 text-3xl mb-2">✔</div>
            <div className="text-lg font-semibold mb-2">Payment and booking confirmation successful!</div>
            <div className="mb-6">Thank you for using our service. Click the button below to return to the home page.</div>
            <button
              className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition"
              onClick={() => navigate('/')}
            >
              Back to home page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;