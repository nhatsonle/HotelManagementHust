import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FormatLogo from "../ui/Logo";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
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
            // X icon
            <IoMdClose className="w-7 h-7" />
          ) : (
            // Hamburger icon
            <GiHamburgerMenu className="w-7 h-7" />
          )}
        </button>
      </div>
      {/* Desktop Check Rates Button */}
      <div className="hidden md:flex items-center">
        <Link
          to="/check-rates"
          className="ml-4 px-6 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold uppercase tracking-wider shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex justify-center w-full whitespace-nowrap"
        >
          Check Rates
        </Link>
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
          <Link
            to="/check-rates"
            onClick={handleNavClick}
            className="mt-4 px-6 py-3 rounded-md bg-blue-600 text-white text-base font-semibold uppercase tracking-wider shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-center flex justify-center w-full whitespace-nowrap"
          >
            Check Rates
          </Link>
        </nav>
      </div>
    </header>
  );
}
