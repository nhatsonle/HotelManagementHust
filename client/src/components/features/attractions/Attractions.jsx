import attractions from '../../../data/attractions_data';
import SubHeroSection from '@/components/ui/SubHeroSection';
import { useState } from 'react';

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

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-4xl uppercase tracking-wider mb-12 font-header font-bold">
          LOCAL ATTRACTIONS
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Explore the vibrant attractions and cultural experiences surrounding our hotel. From historical landmarks to modern entertainment, there's something for everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction) => (
            <div 
              key={attraction.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-64 overflow-hidden relative">
                {!loadedImages[attraction.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={attraction.image}
                  alt={attraction.title}
                  className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${
                    loadedImages[attraction.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(attraction.id)}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{attraction.title}</h3>
                <ul className="space-y-2 text-gray-600">
                  {attraction.features.map((feature, index) => (
                    <li key={index} className="flex items-start group">
                      <span className="mr-2 mt-1 text-blue-600 transition-transform duration-300 group-hover:scale-125">•</span>
                      <span className="group-hover:text-gray-800 transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}