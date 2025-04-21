import { Link } from 'react-router-dom';
import FormatLogo from "./ui/Logo";

function Header() {
  return (
    <header className="
      fixed top-0 left-0 right-0 z-50
      bg-black text-white
      flex justify-between items-center px-8 h-[72px]
    ">
      {/* Left side with logo and navigation */}
      <div className="flex items-center gap-20">
        <FormatLogo />

        {/* Navigation links */}
        <nav className="flex items-center gap-12">
          <Link 
            to="/about" 
            className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors font-bold"
          >
            About Us
          </Link>
          <Link 
            to="/rooms" 
            className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors font-bold"
          >
            Rooms
          </Link>
          <Link 
            to="/pricing" 
            className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors font-bold"
          >
            Pricing
          </Link>
        </nav>
      </div>

      {/* Right side with Check Rates button */}
      <div>
        <Link 
          to="/check-rates" 
          className="
            px-6 py-2
            border border-white
            text-sm uppercase tracking-wider
            hover:bg-white hover:text-black
            transition-all duration-300
          "
        >
          Check Rates
        </Link>
      </div>
    </header>
  );
}

export default Header;