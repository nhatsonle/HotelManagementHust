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
    <section className="container mx-auto px-4 py-16 font-body">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature) => (
          <div 
            key={feature.title}
            className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
          >
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;