import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import signatureDishes from '../../../data';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SignatureDishesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-center text-4xl uppercase tracking-wider mb-12 font-header font-bold">
        Signature Dishes & Drinks
      </h2>

      <div className="py-10">
        <Swiper
          modules={[EffectCoverflow, Navigation, Pagination]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          loop={true}
          onSwiper={setSwiperInstance}
          onSlideChange={handleSlideChange}
          pagination={{ clickable: true }}
          className="pb-16"
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
        >
          {signatureDishes.map((dish, index) => (
            <SwiperSlide key={dish.id}>
              <div 
                className={`
                  transform transition-all duration-300 ease-in-out
                  ${index === activeIndex 
                    ? 'scale-110 opacity-100 z-10' 
                    : 'scale-90 opacity-70 -translate-z-6'
                  }
                `}
              >
                <div className={`
                  bg-white rounded-lg overflow-hidden
                  transition-all duration-300
                  ${index === activeIndex 
                    ? 'shadow-xl' 
                    : 'shadow-md'
                  }
                `}>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="w-full h-[250px] object-cover"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold mb-2">{dish.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{dish.description}</p>
                    {dish.location && (
                      <div className="mt-auto">
                        <button className="w-full bg-black text-white text-sm py-2 px-4 uppercase hover:bg-gray-800 transition-colors">
                          {dish.location}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <span className="text-sm font-medium">
          {activeIndex + 1} / {signatureDishes.length}
        </span>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default SignatureDishesCarousel;