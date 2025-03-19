
import React from "react";
import { motion } from "framer-motion";
import { GitHubIcon, HeartIcon, InstagramIcon } from "./Icons";

const Footer: React.FC = () => {
  return (
    <footer className="py-8 relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent z-[-1]"></div>
      <div className="noise opacity-[0.03]"></div>
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="pt-5 border-t border-gray-200 text-center">
          <div>
            <div className="flex justify-center space-x-4 mb-2">
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitHubIcon />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <InstagramIcon />
              </motion.a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            NotFollowing is not affiliated with or endorsed by Instagram or Meta.
          </p>
          <p className="text-xs text-muted-foreground flex items-center justify-center">
            &copy; {new Date().getFullYear()} NotFollowing. All rights reserved. Made with <HeartIcon className="mx-1 text-red-500" size={14} /> for Instagram users.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
