import AboutUs from "../assets/images/AboutUs.png";
import Biography from "../assets/images/Biography.jpg";
import Carousel from "./Carousel";

export default function AboutUsSection() {
  return(
    <div className="bg-black text-white font-body flex flex-col items-center">
      <div className="flex mt-15 pt-10 pb-10 text-bold text-4xl">
        <h1 className="font-body">ABOUT US</h1>
      </div>
      
      <div className="relative">
        <img src={AboutUs} alt="About us" className="w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      {/* Removed padding-top and adjusted margins */}
      <div className="text-center pl-25 pr-25  mt-10 relative z-10 ">
        <p className="text-lg pb-5">When you think about Novotel, we hope unparalleled luxury comes to mind. But what is luxury, really? Our answer may surprise you.</p>
        <p className="text-lg">
        To us, true luxury is a meaningful sense of belonging. It is a dedicated focus on how people want to be treated, grounded in the genuine care you experience during your stay and defined by an abundance of humanity and generosity. This starts with our passionate team, welcoming you to be the centre of our world, anywhere in the world – and always with a distinctly human touch.
        </p>
      </div>
      
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 mt-20 mb-20">
        <div className="md:w-1/2">
          <img src={Biography} alt="Founder" className="w-full object-cover grayscale" />
        </div>
        
        <div className="md:w-1/2 md:pl-12 mt-8 md:mt-0 flex flex-col items-center md:items-start">
          <blockquote className="text-xl italic mb-6">
            "There was no vision, there was no grand dream — but there has always been a consistent thread and it propels us forward today, as we continue to grow globally, and that's service."
          </blockquote>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Le Nhat Son</h3>
            <p className="text-gray-400">FOUNDER AND CHAIRMAN</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="w-full py-16 px-4 bg-white text-black font-body">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-4">HISTORY OF NOVOTEL</h2>
          <p className="text-center text-lg mb-8">
            The story of Novotel Hotels and Resorts, which opened its first hotel in 1990, is a tale of continual innovation, remarkable expansion and a single-minded dedication to the highest of standards.
          </p>
          
          <Carousel/>
          
        </div>
      </div>
    </div>
  );
}