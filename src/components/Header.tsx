
import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 px-4 md:px-8 relative z-10", className)}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span className="text-primary">Unfollowed</span>Finder
          </h1>
        </div>
        <nav className="hidden md:flex space-x-8 items-center animate-fade-in">
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#tutorial" className="text-sm font-medium hover:text-primary transition-colors">
            Tutorial
          </a>
          <a href="#code" className="text-sm font-medium hover:text-primary transition-colors">
            Get Script
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
