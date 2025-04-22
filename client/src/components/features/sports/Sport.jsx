import sports from "../../../data/sports_data";
import { useState, useEffect } from "react";
import SubHeroSection from "@/components/ui/SubHeroSection";
import { GoZoomIn } from "react-icons/go";
import { GoZoomOut } from "react-icons/go";
import { IoMdReturnLeft } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Sport(){
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedImage]);

  const openModal = (image) => {
    setSelectedImage(image);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleWheel = (e) => {
    if (!selectedImage) return;
    e.preventDefault();
    
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 3);
    setScale(newScale);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return(
    <div className="pt-[72px] font-body">
      <SubHeroSection 
        title='Sport Facilities' 
        description='Enjoy sports' 
        image={sports[0].image}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-4xl uppercase tracking-wider mb-12 font-header font-bold">
          Sports Facilities
        </h2>
        <h3 className="text-center text-xl  mb-8">
          Explore our range of sports facilities designed for your enjoyment and fitness.
        </h3>
        <p className="text-center text-gray-600 mb-8">
          Opening hours: 6:00 AM - 10:00 PM
          </p>

        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4">
            {sports.slice(1).map((item) => (
              <div key={item.id} className="relative rounded-lg overflow-hidden group">
                {!loadedImages[item.id] && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105 ${
                    loadedImages[item.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(item.id)}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(item)}
                    className="absolute left-2 top-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors cursor-pointer"
                    aria-label="Zoom image"
                  >
                    <GoZoomIn className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onWheel={handleWheel}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div 
            className="relative max-w-4xl w-full" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-12 right-0 flex items-center gap-4">
              <button
                onClick={() => setScale(prev => Math.min(prev + 0.2, 3))}
                className="text-white cursor-pointer hover:text-gray-300 bg-black/50 rounded-full p-2"
                aria-label="Zoom in"
              >
                <GoZoomIn className="w-6 h-6" />
              </button>
              <button
                onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}
                className="text-white cursor-pointer hover:text-gray-300 bg-black/50 rounded-full p-2"
                aria-label="Zoom out"
              >
                <GoZoomOut className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className="text-white cursor-pointer hover:text-gray-300 bg-black/50 rounded-full p-2"
                aria-label="Reset zoom"
              >
                <IoMdReturnLeft className="w-6 h-6" />
              </button>
              <button
                onClick={closeModal}
                className="text-white cursor-pointer hover:text-gray-300 bg-black/50 rounded-full p-2"
                aria-label="Close modal"
              >
                <IoIosCloseCircleOutline className="w-6 h-6" />
              </button>
            </div>
            <div 
              className="overflow-hidden rounded-lg cursor-move"
              onMouseDown={handleDragStart}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg transition-transform duration-200"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                draggable="false"
              />
            </div>
            <div className="mt-4 text-white">
              <h3 className="text-2xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

