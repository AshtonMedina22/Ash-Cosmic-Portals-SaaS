"use client"

import Link from "next/link";
import { ReactNode } from "react";

interface LinkButtonProps {
  children: ReactNode;
  href: string;
  variant?: "default" | "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LinkButton = ({ 
  children, 
  href,
  variant = "default", 
  size = "md", 
  className = "", 
  ...props 
}: LinkButtonProps) => {
  // Base styles
  const baseStyles = "font-bold rounded-md transition-all duration-300 hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black inline-block";
  
  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  // Color variants
  const variantStyles = {
    default: "text-white bg-transparent hover:text-white/90",
    primary: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white",
    secondary: "bg-purple-600 hover:bg-purple-700 text-white",
    ghost: "text-white/70 hover:text-white bg-transparent",
    destructive: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  
  return (
    <Link href={href} className={combinedStyles} {...props}>
      {children}
    </Link>
  );
};

export default LinkButton;
