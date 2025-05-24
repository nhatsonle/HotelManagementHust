import { NavLink } from 'react-router-dom';
import Dashboard from '../assets/Dashboard.svg';
import Front_desk from '../assets/Front_desk.svg';
import Guest from '../assets/Guest.svg';
import Room from '../assets/Room.svg';
import Rate from '../assets/Rate.svg';
import RoomType from '../assets/RoomType.svg';

const NavItem = ({ icon, label }) => (
  <li>
    <NavLink
      to={label === 'Dashboard' ? '/' : `/${label.toLowerCase().replace(/\s+/g, '')}`}
      className={({ isActive }) =>
        `flex items-center gap-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors duration-200 ${
          isActive ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600'
        }`
      }
      aria-label={`Navigate to ${label}`}
    >
      {({ isActive }) => (
        <>
          <img
            src={icon}
            alt={`${label} icon`}
            className={`h-5 w-5 transition duration-200 ${
              isActive ? 'filter-blue-icon' : ''
            }`}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  </li>
);

function Sidebar() {
  const navItems = [
    { icon: Dashboard, label: 'Dashboard' },
    { icon: Front_desk, label: 'Front Desk' },
    { icon: Guest, label: 'Guest' },
    { icon: Room, label: 'Room' },
    { icon: Rate, label: 'Rate' },
    { icon: RoomType, label: 'Room Type' }, // ✅ Mục mới đã được thêm
  ];

  return (
    <nav
      className="fixed left-0 top-16 bottom-0 bg-white w-64 z-20 pt-4 shadow-md"
      aria-label="Main navigation"
    >
      <ul className="space-y-2 px-4">
        {navItems.map((item) => (
          <NavItem key={item.label} icon={item.icon} label={item.label} />
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
