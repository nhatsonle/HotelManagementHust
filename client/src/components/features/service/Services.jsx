import services from '../../../data/services_data';
import SubHeroSection from '@/components/ui/SubHeroSection';
import { useState } from 'react';

export default function Services() {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="pt-[72px] font-body">
      <SubHeroSection 
        title="Our Services" 
        description="All the services of our hotel are designed to offer a comfortable and carefree stay" 
        image={services[0].image}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-4xl uppercase tracking-wider mb-12 font-header font-bold">
          OUR SERVICES
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          All the services of our hotel are designed to offer a comfortable and carefree stay in the capital of Andalusia. Take advantage of the opportunities that our 4 star hotel offers you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-64 overflow-hidden relative">
                {!loadedImages[service.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={service.image}
                  alt={service.title}
                  className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${
                    loadedImages[service.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(service.id)}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{service.title}</h3>
                <ul className="space-y-2 text-gray-600">
                  {service.features.map((feature, index) => (
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