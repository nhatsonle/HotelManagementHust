import { useState, useEffect } from 'react';
import carousel1 from '../assets/images/carousel/carousel-1.png';
import carousel2 from '../assets/images/carousel/carousel-2.jpg';
import carousel3 from '../assets/images/carousel/carousel-3.jpg';
import carousel4 from '../assets/images/carousel/carousel-4.jpg';

const images = [
  { src: carousel1, alt: "Four Seasons History 1", description: "1980 - 1990 - NOVOTEL IS BORN" },
  { src: carousel2, alt: "Four Seasons History 2", description: "1990 - 2000 - THE FIRST NOVOTEL RESORT IN VIETNAM" },
  { src: carousel3, alt: "Four Seasons History 3",
    description: "2000 - 2010 - EXPANSION INTO THE US"
   },
  { src: carousel4, alt: "Four Seasons History 4",
    description: "2010 TO PRESENT - A NEW ERA OF LUXURY"
   },
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden h-[600px] group">
      {/* Carousel container */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl font-semibold pt-110">{image.description}</h3>
            </div>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevSlide}
      >
        &#10094;
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextSlide}
      >
        &#10095;
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;