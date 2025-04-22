import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HeroSection from './components/features/home/HeroSection';
import BookingSection from './components/features/home/BookingSection';
import FeaturesSection from './components/features/home/FeaturesSection';
import StorySection from './components/features/home/StorySection';
import AboutUsSection from './components/features/about/AboutUs';
import Dining from './components/features/dining/Dining';
import Sport from './components/features/sports/Sport';
import Services from './components/features/service/Services';
import Attractions from './components/features/attractions/Attractions';
import heroImage from './assets/images/herosection.png';

function App() {
  return (
    <Router>
      <Header />
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
        <Route path="/rooms" element={<div>Rooms Page</div>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/dining" element={<Dining />} />
        <Route path='/sports' element={<Sport />} />
        <Route path='/services' element={<Services />} />
        <Route path='/attractions' element={<Attractions />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;