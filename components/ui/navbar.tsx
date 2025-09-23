"use client"

import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface NavbarProps {
  children: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const { user } = useUser();
  
  return (
    <nav className="border-b border-purple-300/5 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
      {children}
    </nav>
  );
};

export default Navbar;
