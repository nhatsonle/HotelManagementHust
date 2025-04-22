import React from 'react';
import SignatureDishesCarousel from './SignatureDishesCarousel';
import diningImage from '../../../assets/images/dining.avif';

function Dining() {
  return (
    <div className="pt-[72px] font-body">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <img
          src={diningImage}
          alt="Dining Experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Culinary Excellence</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Experience extraordinary flavors and impeccable service at our award-winning restaurants
            </p>
          </div>
        </div>
      </section>

      {/* Signature Dishes Section */}
      <section className="bg-gray-50">
        <SignatureDishesCarousel />
      </section>
    </div>
  );
}

export default Dining;