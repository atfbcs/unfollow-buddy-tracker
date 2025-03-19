
import React from "react";
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <motion.div 
      className={`flex items-center gap-2 font-semibold ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 10 }}
        transition={{ 
          repeat: Infinity, 
          repeatType: "reverse", 
          duration: 2,
        }}
        className="text-primary"
      >
        <Navigation size={size === "lg" ? 28 : size === "md" ? 24 : 20} />
      </motion.div>
      <span className="gradient-text">NotFollowing</span>
    </motion.div>
  );
};

export default Logo;
