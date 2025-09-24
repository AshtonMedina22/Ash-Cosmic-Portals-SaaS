'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const buttonBase =
    'px-4 py-2 text-white font-semibold transition-all duration-300 hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40 hover:rounded-md';

  return (
    <nav className="border-b border-purple-300/5 shadow-[0_4px_20px_-10px] bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white">
              Cosmic Portals
            </Link>

        {/* Desktop Nav */}
        <div className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${buttonBase} text-white/70 hover:text-white`}
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            <div className="flex items-center gap-2">
              {user?.firstName && (
                <span className="text-white font-semibold">{user.firstName}</span>
              )}
              <SignOutButton>
                <button className={buttonBase}>Sign Out</button>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
            <Link href="/sign-in" className="px-4 py-2 bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] text-white font-semibold rounded-full hover:opacity-90 transition-opacity">
              Sign In
            </Link>
          </SignedOut>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu} className="p-2">
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-t border-purple-400/20 px-4 pt-4 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`${buttonBase} block w-full text-left`}
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            <div className="flex items-center justify-between">
              {user?.firstName && (
                <span className="text-white font-semibold">{user.firstName}</span>
              )}
              <SignOutButton>
                <button className={buttonBase}>Sign Out</button>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="px-4 py-2 bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navbar;