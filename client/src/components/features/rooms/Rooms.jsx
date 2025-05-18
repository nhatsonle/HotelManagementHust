import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Loader2 } from "lucide-react";
import SubHeroSection from '@/components/ui/SubHeroSection';
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";

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

  useEffect(() => {
    fetchRooms();
  }, []);

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
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || room.type === selectedType;
    const matchesBedType = selectedBedType === 'all' || room.bed_type === selectedBedType;
    const matchesFacilities = selectedFacilities.length === 0 || 
      selectedFacilities.every(facility => room.amenities.includes(facility));
    
    return matchesSearch && matchesType && matchesBedType && matchesFacilities;
  });

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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 mt-30 bg-[#000000]/20 p-6 rounded-lg shadow-sm">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px] bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
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
          <Select value={selectedBedType} onValueChange={setSelectedBedType}>
            <SelectTrigger className="w-[180px] bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
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
          <Select
            value={selectedFacilities}
            onValueChange={handleFacilityChange}
          >
            <SelectTrigger className="w-[180px] bg-white border-none outline-none focus:outline-none focus:ring-0 ring-0 shadow-none">
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

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredRooms.map((room) => (
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

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No rooms found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms; 