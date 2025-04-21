import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BookingSection from './components/BookingSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import AboutUsSection from './components/AboutUs';
import StorySection from './components/StorySection';

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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;