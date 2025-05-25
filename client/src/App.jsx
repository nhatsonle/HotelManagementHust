import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/features/home/HeroSection';
import BookingSection from './components/features/booking/BookingSection';
import FeaturesSection from './components/features/home/FeaturesSection';
import StorySection from './components/features/home/StorySection';
import AboutUsSection from './components/features/about/AboutUs';
import Rooms from './components/features/rooms/Rooms';
import Dining from './components/features/dining/Dining';
import Sport from './components/features/sports/Sport';
import Services from './components/features/service/Services';
import Attractions from './components/features/attractions/Attractions';
import GuestInfoForm from './components/features/booking/GuestInfoForm';
import BookingSummary from './components/features/booking/BookingSummary';
import heroImage from './assets/images/herosection.png';
import PaymentPage from './components/payment/PaymentPage';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Profile from './components/pages/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import MyBookings from './components/features/booking/MyBookings';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection heroImage={heroImage} />
                <BookingSection />
                <StorySection />
                <FeaturesSection />
              </>
            } />
            <Route path="/about" element={<AboutUsSection />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/pricing" element={<div>Pricing</div>} />
            <Route path="/dining" element={<Dining />} />
            <Route path='/sports' element={<Sport />} />
            <Route path='/services' element={<Services />} />
            <Route path='/attractions' element={<Attractions />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/guest-info' element={<GuestInfoForm />} />
            <Route path='/booking-summary' element={<BookingSummary />} />
            <Route path='/payment/:bookingId' element={<PaymentPage />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;