import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import SubHeroSection from '@/components/ui/SubHeroSection';
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBedType, setSelectedBedType] = useState('all');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allFacilities, setAllFacilities] = useState([]);
  const [allBedTypes, setAllBedTypes] = useState([]);
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 9;
  const [sortBy, setSortBy] = useState('price-asc');
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3000000);

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'capacity-asc', label: 'Capacity: Low to High' },
    { value: 'capacity-desc', label: 'Capacity: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      const prices = rooms.map(room => parseInt(room.price.replace(/\D/g, '')));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setPriceRange([min, max]);
    }
  }, [rooms]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching rooms from API...');
      const response = await axios.get('/api/rooms');
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        // Transform API data to match UI requirements
        const transformedRooms = response.data.data.map(room => {
          console.log('Raw room data:', room);
          console.log('Bed type:', room.bed_type);
          return {
            id: room.room_id,
            name: room.roomType.type_name,
            type: room.roomType.type_name.toLowerCase(),
            price: Math.round(room.roomType.base_price).toLocaleString('vi-VN'),
            capacity: room.adult_number + room.child_number,
            amenities: room.room_facility ? room.room_facility.split(', ') : [],
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3", // Default image
            available: room.room_status === 'Available',
            bed_type: room.bed_type
          };
        });
        console.log('Transformed rooms:', transformedRooms);
        setRooms(transformedRooms);

        // Extract unique facilities and bed types from all rooms
        const facilities = new Set();
        const bedTypes = new Set();
        const roomTypes = new Set();
        transformedRooms.forEach(room => {
          room.amenities.forEach(amenity => facilities.add(amenity));
          if (room.bed_type) {
            bedTypes.add(room.bed_type);
          }
          if (room.type) {
            roomTypes.add(room.type);
          }
        });
        setAllFacilities(Array.from(facilities));
        setAllBedTypes(Array.from(bedTypes));
        setAllRoomTypes(Array.from(roomTypes));
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err.response?.data?.error?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = (facility) => {
    setSelectedFacilities(prev => 
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const filteredRooms = rooms.filter(room => {
    const price = parseInt(room.price.replace(/\D/g, ''));
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || room.type === selectedType;
    const matchesBedType = selectedBedType === 'all' || room.bed_type === selectedBedType;
    const matchesFacilities = selectedFacilities.length === 0 || 
      selectedFacilities.every(facility => room.amenities.includes(facility));
    
    return matchesPrice && matchesSearch && matchesType && matchesBedType && matchesFacilities;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
      case 'price-desc':
        return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
      case 'capacity-asc':
        return a.capacity - b.capacity;
      case 'capacity-desc':
        return b.capacity - a.capacity;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Calculate pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = sortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(sortedRooms.length / roomsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedBedType, selectedFacilities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-red-500">Error</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchRooms} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="pt-[72px] font-body">
      <SubHeroSection 
        title="Our Rooms" 
        description="Discover the best rooms and facilities in our hotel" 
        image={"https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3"}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-4xl uppercase tracking-wider mb-12 font-header font-bold">
          OUR ROOMS
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Discover luxury and comfort in our carefully curated selection of rooms
        </p>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4 w-full bg-[#000000]/10 p-6 rounded-lg shadow-sm flex flex-col gap-6 min-w-[220px]">
            <Input
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none mb-2"
            />
            <div>
              <div className="font-semibold mb-2">Room Type</div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {allRoomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="font-semibold mb-2">Bed Type</div>
              <Select value={selectedBedType} onValueChange={setSelectedBedType}>
                <SelectTrigger className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
                  <SelectValue placeholder="Bed Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bed Types</SelectItem>
                  {allBedTypes.map((bedType) => (
                    <SelectItem key={bedType} value={bedType}>
                      {bedType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="font-semibold mb-2">Facilities</div>
              <Select
                value={selectedFacilities}
                onValueChange={handleFacilityChange}
              >
                <SelectTrigger className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
                  <SelectValue placeholder="Facilities">
                    {selectedFacilities.length > 0 ? `${selectedFacilities.length} selected` : "Select facilities"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allFacilities.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={selectedFacilities.includes(facility)}
                          onCheckedChange={() => handleFacilityChange(facility)}
                        />
                        <Label htmlFor={facility} className="text-sm cursor-pointer">
                          {facility}
                        </Label>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Price Range Filter */}
            <div>
              <div className="font-semibold mb-2">Your budget (per night)</div>
              <div className="mb-2">
                VND {priceRange[0].toLocaleString('vi-VN')} – VND {priceRange[1].toLocaleString('vi-VN')}{priceRange[1] === maxPrice ? '+' : ''}
              </div>
              <Slider
                range
                min={minPrice}
                max={maxPrice}
                value={priceRange}
                onChange={setPriceRange}
                trackStyle={[{ backgroundColor: '#2563eb', height: 6 }]}
                handleStyle={[
                  { backgroundColor: '#2563eb', borderColor: '#2563eb', height: 24, width: 24, marginTop: -9 },
                  { backgroundColor: '#2563eb', borderColor: '#2563eb', height: 24, width: 24, marginTop: -9 }
                ]}
                railStyle={{ backgroundColor: '#d1d5db', height: 6 }}
              />
            </div>
            {/* Sort By */}
            <div>
              <div className="font-semibold mb-2">Sort by</div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Room Grid Content */}
          <div className="md:w-3/4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-0">
              {currentRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                    {!room.available && (
                      <Badge className="absolute top-2 right-2 bg-[#CBD0D7] text-[#7F7F7F]">
                        Not Available
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="bg-white">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-col gap-1">
                        <span>Capacity: {room.capacity} {room.capacity === 1 ? 'person' : 'people'}</span>
                        <span>Bed: {room.bed_type}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold">{room.price}</span>
                      <span className="text-sm font-normal text-muted-foreground ml-1">VND</span>
                      <span className="text-sm font-normal text-muted-foreground">/ night</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white">
                    <Button 
                      className={`w-full transition-all duration-300 ${room.available ? 'hover:bg-blue-700 hover:text-white' : 'bg-gray-400'}`} 
                      disabled={!room.available}
                    >
                      {room.available ? 'Book Now' : 'Not Available'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1;

                    if (!shouldShow) {
                      // Show ellipsis for skipped pages
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? undefined : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 font-bold transition-all duration-150
                          ${currentPage === page ? 'bg-black text-white border-black shadow-md cursor-default pointer-events-none !bg-[#000] !text-white !border-[#000] !opacity-100' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}
                        `}
                        disabled={currentPage === page}
                        tabIndex={currentPage === page ? -1 : 0}
                        style={currentPage === page ? { backgroundColor: '#000', color: '#fff', borderColor: '#000', opacity: 1 } : {}}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold">No rooms found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 