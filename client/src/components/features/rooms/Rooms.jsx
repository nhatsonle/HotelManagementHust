import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Calendar, Plus, Minus } from "lucide-react";
import { FaCalendarAlt } from 'react-icons/fa';
import SubHeroSection from '@/components/ui/SubHeroSection';
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Rooms = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBedType, setSelectedBedType] = useState('all');
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allFacilities, setAllFacilities] = useState([]);
  const [allBedTypes, setAllBedTypes] = useState([]);
  const [allRoomTypes, setAllRoomTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 9;
  const [sortBy, setSortBy] = useState('price-asc');
  const [priceRange, setPriceRange] = useState([10000, 3000000]);
  const [minPrice, setMinPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(3000000);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState('');

  // Refs for date pickers
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'capacity-asc', label: 'Capacity: Low to High' },
    { value: 'capacity-desc', label: 'Capacity: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
  ];

  const floorOptions = [
    { value: 'all', label: 'All Floors' },
    { value: '1-5', label: '1st - 5th Floor' },
    { value: '6-10', label: '6th - 10th Floor' },
    { value: '11-15', label: '11th - 15th Floor' },
    { value: '16+', label: '16th Floor & Above' }
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (checkIn && checkOut && (adults > 0 || children > 0)) {
      fetchRooms();
    }
  }, [checkIn, checkOut, adults, children]);

  useEffect(() => {
    if (rooms.length > 0) {
      const prices = rooms.map(room => parseInt(room.price.replace(/\D/g, '')));
      const min = Math.max(10000, Math.min(...prices));
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
      
      let response;
      if (checkIn && checkOut && (adults > 0 || children > 0)) {
        // Format dates to YYYY-MM-DD
        const formattedCheckIn = checkIn.toISOString().split('T')[0];
        const formattedCheckOut = checkOut.toISOString().split('T')[0];
        
        console.log('Calling availability API with params:', {
          checkin: formattedCheckIn,
          checkout: formattedCheckOut,
          adult: adults,
          child: children
        });
        
        // Call availability API with parameters
        response = await axios.get(`/api/rooms/available`, {
          params: {
            checkin: formattedCheckIn,
            checkout: formattedCheckOut,
            adult: adults,
            child: children
          }
        });
      } else {
        console.log('Calling default rooms API');
        // Default API call without parameters
        response = await axios.get('/api/rooms');
      }
      
      console.log('Raw API Response:', response);
      console.log('API Response Data:', response.data);
      
      if (response.data.success) {
        console.log('API Response Data.data:', response.data.data);
        // Transform API data to match UI requirements
        const transformedRooms = response.data.data.map(room => {
          console.log('Processing room:', room);
          
          // Handle both API response formats
          const roomType = room.roomType || room;
          console.log('Room type object:', roomType);
          
          const typeName = roomType.type_name || roomType.name || 'Standard Room';
          const basePrice = roomType.base_price || roomType.price || 0;
          
          const transformedRoom = {
            id: room.room_id || room.id || Math.random().toString(36).substr(2, 9),
            name: typeName,
            type: (typeName || 'standard').toLowerCase(),
            price: Math.round(basePrice).toLocaleString('vi-VN'),
            capacity: (room.adult_number || room.adults || 0) + (room.child_number || room.children || 0),
            amenities: (room.room_facility || room.amenities || '').split(', ').filter(Boolean),
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3", // Default image
            available: room.room_status === 'Available' || room.available,
            bed_type: room.bed_type || 'Standard'
          };
          
          console.log('Transformed room:', transformedRoom);
          return transformedRoom;
        });
        
        console.log('Final transformed rooms:', transformedRooms);
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
    const matchesType = selectedType === 'all' || room.type === selectedType;
    const matchesBedType = selectedBedType === 'all' || room.bed_type === selectedBedType;
    const matchesFacilities = selectedFacilities.length === 0 || 
      selectedFacilities.every(facility => room.amenities.includes(facility));
    const matchesFloor = selectedFloor === 'all' || 
      (selectedFloor === '1-5' && room.room_floor >= 1 && room.room_floor <= 5) ||
      (selectedFloor === '6-10' && room.room_floor >= 6 && room.room_floor <= 10) ||
      (selectedFloor === '11-15' && room.room_floor >= 11 && room.room_floor <= 15) ||
      (selectedFloor === '16+' && room.room_floor >= 16);
    
    return matchesPrice && matchesType && matchesBedType && matchesFacilities && matchesFloor;
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
  }, [selectedType, selectedBedType, selectedFacilities]);

  // Function to get image URL based on room type
  const getRoomImage = (type) => {
    const images = {
      standard: "https://media.sojohotels.com/anh-phong/ba5c5a98f1e4dd688c451701680201538.png",
      deluxe: "https://media.sojohotels.com/sojo-da-nang/6c7c0b2c6f1efce78e5f1715066875943.png",
      suite: "https://www.hafh.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fhafh-prod-property_room_type_image%2Frl8kr0el4a2zfrafs9yl53p2xmvu&w=3840&q=75",
    };
    return images[type] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3"; // Default image
  };

  // Function to fetch feedback for a specific room
  const fetchFeedback = async (roomId) => {
    try {
      console.log(`Fetching feedback for room ID: ${roomId}`);
      const response = await axios.get(`https://hotelmanagementhust.onrender.com/api/feedback/room/${roomId}`);
      console.log('API Response:', response.data);
      if (response.data) {
        setFeedback(response.data);
      } else {
        console.error('API Error: No feedback data found');
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  // Function to handle room click
  const handleRoomClick = (roomId) => {
    setSelectedRoomType(roomId);
    fetchFeedback(roomId);
    setIsModalOpen(true);
  };

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

        {/* Booking Details Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-xl p-8 mb-16 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Book Your Stay</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Check-in Date */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="font-medium text-gray-700 mb-3">Check-in Date</div>
              <div className="relative w-full">
                <DatePicker
                  selected={checkIn}
                  onChange={date => setCheckIn(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 datepicker-fullwidth bg-white text-gray-700 placeholder-gray-400"
                  wrapperClassName="w-full"
                  minDate={new Date()}
                  ref={checkInRef}
                  autoComplete="off"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => checkInRef.current && checkInRef.current.setFocus && checkInRef.current.setFocus()}
                >
                  <FaCalendarAlt className="text-blue-500 text-xl" />
                </span>
              </div>
            </div>

            {/* Check-out Date */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="font-medium text-gray-700 mb-3">Check-out Date</div>
              <div className="relative w-full">
                <DatePicker
                  selected={checkOut}
                  onChange={date => setCheckOut(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date"
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 datepicker-fullwidth bg-white text-gray-700 placeholder-gray-400"
                  wrapperClassName="w-full"
                  minDate={checkIn || new Date()}
                  ref={checkOutRef}
                  autoComplete="off"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => checkOutRef.current && checkOutRef.current.setFocus && checkOutRef.current.setFocus()}
                >
                  <FaCalendarAlt className="text-blue-500 text-xl" />
                </span>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="font-medium text-gray-700 mb-3">Guests</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adults */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Adults</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </Button>
                  <span className="w-8 text-center font-medium text-gray-700">{adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => setAdults(adults + 1)}
                    disabled={adults >= 10}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Children</div>
                  <div className="text-sm text-gray-500">Ages 0-12</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </Button>
                  <span className="w-8 text-center font-medium text-gray-700">{children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    onClick={() => setChildren(children + 1)}
                    disabled={children >= 10}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4 w-full flex flex-col gap-6 min-w-[220px]">
            {/* Room Type Filter */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Room Type</div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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

            {/* Floor Level Filter */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Floor Level</div>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Floor Level" />
                </SelectTrigger>
                <SelectContent>
                  {floorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bed Type Filter */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Bed Type</div>
              <Select value={selectedBedType} onValueChange={setSelectedBedType}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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

            {/* Facilities Filter */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Facilities</div>
              <Select
                value={selectedFacilities}
                onValueChange={handleFacilityChange}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Your budget (per night)</div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600">Min: {priceRange[0].toLocaleString('vi-VN')} VND</div>
                  <div className="text-sm text-gray-600">Max: {priceRange[1].toLocaleString('vi-VN')} VND</div>
                </div>
                <div className="relative px-2">
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                    step={10000}
                    trackStyle={[
                      { backgroundColor: '#4f46e5', height: 4 },
                      { backgroundColor: '#4f46e5', height: 4 }
                    ]}
                    handleStyle={[
                      { 
                        backgroundColor: '#4f46e5',
                        borderColor: '#4f46e5',
                        height: 20,
                        width: 20,
                        marginTop: -8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: 1,
                        cursor: 'pointer',
                        ':hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      },
                      { 
                        backgroundColor: '#4f46e5',
                        borderColor: '#4f46e5',
                        height: 20,
                        width: 20,
                        marginTop: -8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        opacity: 1,
                        cursor: 'pointer',
                        ':hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }
                      }
                    ]}
                    railStyle={{ 
                      backgroundColor: '#e5e7eb',
                      height: 4,
                      borderRadius: 2
                    }}
                    dotStyle={{
                      backgroundColor: '#e5e7eb',
                      borderColor: '#e5e7eb',
                      height: 8,
                      width: 8,
                      marginTop: -2
                    }}
                    activeDotStyle={{
                      backgroundColor: '#4f46e5',
                      borderColor: '#4f46e5',
                      height: 8,
                      width: 8,
                      marginTop: -2
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-sm text-gray-600">Selected Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    <span className="text-sm text-gray-600">Available Range</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="font-medium text-gray-800 mb-3">Sort by</div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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
                <Card key={room.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => handleRoomClick(room.id)}>
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={getRoomImage(room.type)}
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

      {/* Add modal component to display feedback */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Room Feedback</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              {feedback.length > 0 ? (
                feedback.map((item) => (
                  <div key={item.feedback_id} className="border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg p-3">
                    <p className="text-gray-700 mb-2">{item.comment}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Guest #{item.guest_id}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No feedback available for this room.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {console.log('Modal Opened')}
      {console.log('Feedback:', feedback)}
    </div>
  );
};

export default Rooms; 