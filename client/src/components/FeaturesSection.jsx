import roomsImage from '../assets/images/rooms.jpg';
import diningImage from '../assets/images/dining.avif';
import meetingsImage from '../assets/images/meetings.jpg';
import facilitiesImage from '../assets/images/facilities.jpg';
import weddingImage from '../assets/images/wedding.jpg';

const features = [
  {
    title: "Rooms",
    image: roomsImage,
    description: "Luxurious and comfortable accommodations"
  },
  {
    title: "Dining",
    image: diningImage,
    description: "Exquisite culinary experiences"
  },
  {
    title: "Conferences & Meetings",
    image: meetingsImage,
    description: "Professional meeting spaces"
  },
  {
    title: "Service & Facilities",
    image: facilitiesImage,
    description: "Top-notch amenities and services"
  },
  {
    title: "Wedding Package",
    image: weddingImage,
    description: "Create your perfect wedding day"
  }
];

function FeaturesSection() {
  return (
    <section className="bg-gray-100 py-16 font-body">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rooms - Large Card */}
          <div className="lg:row-span-2 relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <img
              src={roomsImage}
              alt="Rooms"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-3xl font-semibold pt-110">Rooms</h3>
            </div>
          </div>

          {/* Other Features */}
          {features.slice(1).map((feature) => (
            <div 
              key={feature.title}
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-transparent bg-opacity-100 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold text-center pt-50">{feature.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;