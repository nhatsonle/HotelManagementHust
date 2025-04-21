import { Link } from 'react-router-dom';
import Logo from "../assets/logo.svg"; // Make sure this path is correct

function Header() {
  return (
    <header className="
      fixed top-0 left-0 right-0 z-50 // <-- Added positioning and z-index
      flex justify-between items-center px-8 py-4 bg-white shadow-md font-header
    ">
      <Link to="/" className="text-blue-600 font-bold text-lg flex items-center">
        <img src={Logo} className="h-8 mr-2" alt="Logo" />
        Novotel
      </Link>
      <nav className="flex gap-4">
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/rooms" className="hover:text-blue-600">Rooms</Link>
        <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
        {/* Add other links as needed */}
      </nav>
    </header>
  );
}

export default Header;