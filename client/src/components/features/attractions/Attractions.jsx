import attractions from '../../../data/attractions_data';
import SubHeroSection from '@/components/ui/SubHeroSection';
import { useState } from 'react';

export default function AttractionsCircle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = 6;
  const radius = 320; // radius of the circle for images
  const sizeActive = 300; // size of active image
  const sizeInactive = 200; // size of inactive images
  const offsetX = -650; // shift entire circle container left

  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  // Helper to normalize angle to [0, 360)
  const normalizeAngle = (angle) => {
    let a = angle % 360;
    if (a < 0) a += 360;
    return a;
  };

  // Active background style, with overlay for darkening
  const activeBackgroundStyle = {
    backgroundImage: `url(${attractions[activeIndex].image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -10,
    transition: 'background-image 0.8s ease-in-out',
  };

  return (
    <>
      {/* Background image */}
      <div aria-hidden="true" style={activeBackgroundStyle} />

      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-transparent font-sans max-w-full overflow-x-hidden relative z-10">
        <div className="flex flex-col md:flex-row items-center max-w-4xl w-full">
          {/* Circle and arrows section */}
          <div className="flex flex-col items-center">
            <div
              className="relative rounded-full border-4 border-white shadow-lg flex items-center justify-center"
              style={{
                width: 500,
                height: 500,
                transform: `translateX(${offsetX}px)`
      
              }}
            >
              {attractions.slice(0, total).map((attraction, index) => {
                const angle =
                  (360 / total) * index - activeIndex * (360 / total);
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;
                const isActive = index === activeIndex;

                // Normalize angle to [0,360)
                const normAngle = normalizeAngle(angle);

                // Show only images on right half circle (angle between 0 and 180)
                const isVisible = normAngle >= 0 && normAngle <= 360;

                return (
                  <img
                    key={attraction.id}
                    src={attraction.image}
                    alt={attraction.title}
                    className={`absolute rounded-full object-cover shadow-md transition-all duration-500 cursor-pointer select-none ${
                      isActive ? 'z-30 border-4 border-blue-500' : 'opacity-70'
                    }`}
                    style={{
                      width: isActive ? sizeActive : sizeInactive,
                      height: isActive ? sizeActive : sizeInactive,
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: isActive
                        ? '0 10px 20px rgba(59,130,246,0.5)'
                        : 'none',
                      opacity: isVisible ? 1 : 0,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transition: 'all 0.5s ease',
                    }}
                    onClick={() => setActiveIndex(index)}
                    draggable={false}
                  />
                );
              })}

              
            </div>

            {/* Buttons below circle */}
            <div className="absolute top-93 left-11 flex justify-between w-110 mt-4 px-4">
              <button
                onClick={rotateLeft}
                aria-label="Rotate left"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full shadow-lg p-3 hover:bg-blue-50 transition select-none"
              >
                &#9664;
              </button>
              <button
                onClick={rotateRight}
                aria-label="Rotate right"
                className=" absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full shadow-lg p-3 hover:bg-blue-50 transition select-none"
              >
                &#9654;
              </button>
            </div>
          </div>

          {/* Text description on the right */}
          <div className="w-[700px] bg-white rounded-lg shadow-lg p-8 ml-12 flex-shrink-0">
            <h3 className="text-2xl font-bold mb-4 text-blue-700">
              {attractions[activeIndex].title}
            </h3>
            <ul className="list-disc list-inside space-y-3 text-blue-700 text-lg">
              {attractions[activeIndex].features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}