function BookingSection() {
  return (
    <section className="container mx-auto px-4 -mt-24 relative z-10 font-body">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-header text-center mb-2 font-bold">Book a Room</h2>
        <p className="text-gray-600 text-center mb-6">Discover the perfect space for you!</p>
        
        <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Date</label>
            <input 
              type="date" 
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Adults</label>
            <select className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Children</label>
            <select className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 text-white rounded-lg p-2 h-full mt-auto hover:bg-blue-700 transition-colors font-header font-bold"
          >
            BOOK NOW
          </button>
        </form>
      </div>
    </section>
  );
}

export default BookingSection;