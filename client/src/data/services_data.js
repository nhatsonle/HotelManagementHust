import roomService from '../assets/images/rooms.jpg';
import hotelService from '../assets/images/facilities.jpg';
import breakfast from '../assets/images/dining.avif';
import meeting from '../assets/images/meetings.jpg';
import wedding from '../assets/images/wedding.jpg';
import spa from '../assets/images/facilities.jpg';

const services = [
  {
    id: 1,
    title: 'Room Services',
    image: roomService,
    features: [
      'Free Wi-Fi',
      'Late check-out (12 P)',
      'Daily bed',
      'Mini bar',
      'Telephone',
      'Laundry and cleaning'
    ]
  },
  {
    id: 2,
    title: 'Hotel Services',
    image: hotelService,
    features: [
      'Airport transfer',
      'Foreign exchange',
      'Reserved parking space',
      'Free parking',
      'Medical assistance',
      'Special care express service',
      'Extended contact with front PC',
      'Safe'
    ]
  },
  {
    id: 3,
    title: 'Breakfast Buffet',
    image: breakfast,
    features: [
      'Enjoy our Mediterranean buffet breakfast and',
      'get energized for a day full of surprises in',
      'this charming destination'
    ]
  },
  {
    id: 4,
    title: 'Meeting & Events',
    image: meeting,
    features: [
      'Professional event planning',
      'State-of-the-art equipment',
      'Customizable spaces',
      'Catering services'
    ]
  },
  {
    id: 5,
    title: 'Wedding Services',
    image: wedding,
    features: [
      'Wedding planning assistance',
      'Customizable wedding packages',
      'Indoor and outdoor venues',
      'Professional catering'
    ]
  },
  {
    id: 6,
    title: 'Spa & Wellness',
    image: spa,
    features: [
      'Professional massage services',
      'Facial treatments',
      'Wellness programs',
      'Relaxation areas'
    ]
  }
];

export default services;