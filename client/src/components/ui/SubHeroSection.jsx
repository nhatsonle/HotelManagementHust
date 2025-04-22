

export default function SubHeroSection({title, description, image }) {
  return(
    <section className="relative h-[600px]">
      <img
        src={image}
        
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">{title}</h1>
          <p className="text-xl max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
