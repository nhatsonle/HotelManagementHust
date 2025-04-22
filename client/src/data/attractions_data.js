import tourist from '../assets/images/tourist.jpg';
import museum from '../assets/images/facilities.jpg';
import park from '../assets/images/sports.jpg';
import theater from '../assets/images/meetings.jpg';
import shopping from '../assets/images/facilities.jpg';
import restaurant from '../assets/images/dining.avif';

const attractions = [
  {
    id: 1,
    title: 'Tourist Spots',
    image: tourist,
    features: [
      'Historical landmarks',
      'Cultural sites',
      'Guided tours available',
      'Transportation services'
    ]
  },
  {
    id: 2,
    title: 'Museums & Galleries',
    image: museum,
    features: [
      'Art exhibitions',
      'Historical artifacts',
      'Interactive displays',
      'Guided tours'
    ]
  },
  {
    id: 3,
    title: 'Parks & Recreation',
    image: park,
    features: [
      'Public gardens',
      'Walking trails',
      'Outdoor activities',
      'Family-friendly areas'
    ]
  },
  {
    id: 4,
    title: 'Entertainment',
    image: theater,
    features: [
      'Theater performances',
      'Live music venues',
      'Cinema complexes',
      'Cultural events'
    ]
  },
  {
    id: 5,
    title: 'Shopping Districts',
    image: shopping,
    features: [
      'Local markets',
      'Shopping malls',
      'Boutique stores',
      'Souvenir shops'
    ]
  },
  {
    id: 6,
    title: 'Local Cuisine',
    image: restaurant,
    features: [
      'Traditional restaurants',
      'Food markets',
      'Cooking classes',
      'Food tours'
    ]
  }
];

export default attractions;