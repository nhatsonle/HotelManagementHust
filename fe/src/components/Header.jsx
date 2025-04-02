import Logo from '../assets/Logo.svg'
import Notification from '../assets/Vector.svg'
import Avatar from '../assets/Avatar.svg'
import Search from '../assets/Search.svg'
function Header(){
  return (
    <div className="fixed flex items-center justify-between h-16 px-8 bg-white top-0 left-0 right-0 z-50 shadow-md">
    {/* Left Section: Logo and Text */}
    <div className="flex items-center gap-x-2">
      <img className="h-8 cursor-pointer" src={Logo} alt="Logo" />
      <div className="text-blue-600 font-bold text-lg ml-2 cursor-pointer">HustHotel</div>
    </div>

    <div className="relative w-96">
        <input
          type="text"
          placeholder="Search for rooms and offers"
          className="w-full h-10 pl-10 pr-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <img src={Search} className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" '/>
      </div>


    {/* Right Section: Notification and Avatar */}
    <div className="flex items-center gap-x-4">
        <button className="h-6 w-6 cursor-pointer">
          <img src={Notification} alt="Notification" />
        </button>
        <button className="h-8 w-8 rounded-full overflow-hidden cursor-pointer">
          <img src={Avatar} alt="Avatar" />
        </button>
      </div>
    </div>
  );
};

export default Header;