import Dashboard from '../assets/Dashboard.svg'
import Front_desk from '../assets/Front_desk.svg'
import Guest from '../assets/Guest.svg'
import Room from '../assets/Room.svg'
import Employee from '../assets/Deal.svg'
import Rate from '../assets/Rate.svg'


function Sidebar() {
  return (
    <nav className="fixed left-0 top-16 bottom-0 bg-white w-64 z-20 pt-4 shadow-md">
      
      {/* Navigation Links */}
      <ul className="space-y-2 px-4">

        <li className="flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
          <img src={Dashboard} className='h-5 w-5'></img>
          <span>Dashboard</span>
        </li>

        <li className="flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
        <img src={Front_desk} className='h-5 w-5'></img>
          <span>Front Desk</span>
        </li>

        <li className="flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
        <img src={Guest} className='h-5 w-5'></img>
          <span>Guest</span>
        </li>

        <li className="flex items-center gap-x-3 p-2 text-gray-600 text-blue-600 rounded-md cursor-pointer">
          <img src={Room} className='h-5 w-5'></img>
          <span>Room</span>
        </li>

        <li className="flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
        <img src={Employee} className='h-5 w-5'></img>
          <span>Employees</span>
        </li>

        <li className="flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
        <img src={Rate} className='h-5 w-5'></img>
          <span>Rate</span>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;