import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormatLogo from "../ui/Logo";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import authService from '../../services/auth.service';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to update user state
  const updateUserState = () => {
    const currentUser = authService.getCurrentUser();
    console.log('Updating user state:', currentUser);
    setUser(currentUser);
  };

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    // Initial user state
    updateUserState();

    // Create a custom event listener for auth state changes
    const handleAuthChange = () => {
      console.log('Auth state change detected');
      updateUserState();
    };

    // Add event listener for custom auth state change
    window.addEventListener('authStateChange', handleAuthChange);

    // Add event listener for storage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Storage change detected:', e.key);
        updateUserState();
      }
    });

    return () => {
      // Cleanup event listeners
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []); // Remove user from dependency array since we don't need continuous updates

  const navLinks = [
    { to: "/about", label: "About Us" },
    { to: "/rooms", label: "Rooms" },
    { to: "/dining", label: "Dining" },
    { to: "/services", label: "Services" },
    { to: "/attractions", label: "Attractions" },
    { to: "/sports", label: "Sports" },
  ];

  // Close mobile menu on navigation
  const handleNavClick = () => setMobileOpen(false);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      // Dispatch custom event for auth state change
      window.dispatchEvent(new Event('authStateChange'));
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const UserDropdown = () => (
    <div 
      className="fixed right-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]"
      style={{ top: '72px' }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        <Link
          to="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          role="menuitem"
          onClick={() => setShowDropdown(false)}
        >
          Your Profile
        </Link>
        <Link
          to="/my-bookings"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          role="menuitem"
          onClick={() => setShowDropdown(false)}
        >
          Your Bookings
        </Link>
        <button
          onClick={() => {
            handleSignOut();
            setShowDropdown(false);
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          role="menuitem"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black text-white flex justify-between items-center px-4 md:px-8 h-[72px]">
      <div className="flex items-center gap-4 md:gap-12 w-full">
        <FormatLogo />
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 md:gap-8 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium uppercase tracking-wider px-3 py-2 rounded-md transition-colors duration-200
                ${location.pathname === link.to ? "bg-[#181f2a] text-white" : "text-gray-200 hover:bg-[#181f2a] hover:text-white"}
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Hamburger Icon */}
        <button
          className="md:hidden ml-auto flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open navigation menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <IoMdClose className="w-7 h-7" />
          ) : (
            <GiHamburgerMenu className="w-7 h-7" />
          )}
        </button>
      </div>
      {/* Desktop Auth Button/Avatar */}
      <div className="hidden md:flex items-center">
        {user ? (
          <div className="relative user-dropdown-container">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <FaUserCircle className="w-8 h-8 text-gray-200 hover:text-white transition-colors duration-200" />
            </button>
            {showDropdown && <UserDropdown />}
          </div>
        ) : (
          <Link
            to="/sign-in"
            className="ml-4 px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold uppercase tracking-wider shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex justify-center w-full whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}
      {/* Mobile Slide-down Menu */}
      <div
        className={`fixed top-[72px] left-0 right-0 z-50 bg-black md:hidden transition-all duration-300 ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden shadow-lg`}
        style={{
          boxShadow: mobileOpen ? '0 8px 32px 0 rgba(0,0,0,0.25)' : undefined,
        }}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-2 px-6 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={`text-base font-semibold uppercase tracking-wider px-3 py-3 rounded-md transition-colors duration-200
                ${location.pathname === link.to ? "bg-[#181f2a] text-white" : "text-gray-200 hover:bg-[#181f2a] hover:text-white"}
              `}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={handleNavClick}
                className="text-base font-semibold uppercase tracking-wider px-3 py-3 rounded-md text-gray-200 hover:bg-[#181f2a] hover:text-white"
              >
                Your Profile
              </Link>
              <Link
                to="/my-bookings"
                onClick={handleNavClick}
                className="text-base font-semibold uppercase tracking-wider px-3 py-3 rounded-md text-gray-200 hover:bg-[#181f2a] hover:text-white"
              >
                Your Bookings
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  handleNavClick();
                }}
                className="text-base font-semibold uppercase tracking-wider px-3 py-3 rounded-md text-gray-200 hover:bg-[#181f2a] hover:text-white text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/sign-in"
              onClick={handleNavClick}
              className="mt-4 px-6 py-3 rounded-md bg-blue-600 text-white text-base font-semibold uppercase tracking-wider shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-center flex justify-center w-full whitespace-nowrap"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
