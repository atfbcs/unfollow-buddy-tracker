
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onTutorialClick: () => void;
  onCodeClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onTutorialClick, onCodeClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo size="md" />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <motion.button 
            className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2"
            whileHover={{ y: -2 }}
            onClick={onCodeClick}
          >
            <Code size={20} />
            <span>Get Script</span>
          </motion.button>
          <Button className="relative overflow-hidden group" onClick={onTutorialClick}>
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-6">
              <motion.button 
                className="text-lg text-foreground/80 hover:text-primary transition-colors flex items-center gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => {
                  setIsOpen(false);
                  onCodeClick();
                }}
              >
                <Code size={20} />
                <span>Get Script</span>
              </motion.button>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    onTutorialClick();
                  }}
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
