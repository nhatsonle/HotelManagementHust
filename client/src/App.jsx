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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <BookingSection />
            <StorySection />
            <FeaturesSection />  
          </>
        } />
        <Route path="/about" element={<AboutUsSection />} />
        <Route path="/rooms" element={<div>Rooms Page</div>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/dining" element={<Dining />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;