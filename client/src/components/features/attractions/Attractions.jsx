import attractions from '../../../data/attractions_data';
import { useState } from 'react';
import { GrCaretNext } from "react-icons/gr";
import { GrCaretPrevious } from "react-icons/gr";

export default function Attractions() {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="pt-[72px] font-body">
      <SubHeroSection 
        title="Local Attractions" 
        description="Discover the best attractions and activities around our hotel" 
        image={attractions[0].image}
      />

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
            <div className="absolute top-93 left-1 flex justify-between w-110 mt-4 px-4">
              <button
                onClick={rotateLeft}
                aria-label="Rotate left"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full shadow-lg p-3 hover:bg-blue-50 transition select-none"
              >
                <GrCaretPrevious size={20} />
              </button>
              <button
                onClick={rotateRight}
                aria-label="Rotate right"
                className=" absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue rounded-full shadow-lg p-3 hover:bg-blue-50 transition select-none"
              >
                <GrCaretNext size={20} />
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
    </div>
  );
}