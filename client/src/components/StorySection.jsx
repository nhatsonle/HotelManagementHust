import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from './ui/button'; // Adjust the import path as necessary
function StorySection() {
  return (
    <div className="bg-[#fdf8f3] py-25 font-body mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        {/* Left side - Image with border */}
        <div className="md:w-1/2">
          <div className="relative rounded-lg overflow-hidden border-4 border-black">
            <img
              src="/src/assets/images/holidays.jpg"
              alt="Hotel Dining"
              className="w-full h-[400px] object-cover"
            />
            
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="md:w-1/2 space-y-6">
          <Link to='/about' className="text-4xl font-semibold text-[#8B4513] font-header">
          <h1 className='mb-5'>THE NOVOTEL STORY</h1>
            
          </Link>
          
          <p className="text-gray-700 leading-relaxed">
            Novotel was born from a love and passion for extraordinary hospitality and Vietnamese culture. 
            We aspire to share these stories, connecting guests with authentic values while creating 
            comprehensive holiday experiences.
          </p>

          <div className="mt-4">
            <div className="text-2xl text-[#8B4513] font-signature italic">
              Signature Hospitality
            </div>
          </div>

          <Button asChild variant="outline" className="font-header font-bold text-black hover:bg-[#8B4513] hover:text-white transition-colors duration-300">
            <Link to="/about">DISCOVER MORE</Link>
          </Button>


        </div>
      </div>
    </div>
  );
}

export default StorySection;