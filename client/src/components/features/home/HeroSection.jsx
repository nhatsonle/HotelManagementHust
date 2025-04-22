

function HeroSection({heroImage}) {
  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat font-body"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-6xl font-bold text-center max-w-4xl">
          Discover Extraordinary Comfort in Our Hotel
        </h1>
      
      </div>
    </section>
  );
}

export default HeroSection;