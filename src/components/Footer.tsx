
import React from "react";
import { motion } from "framer-motion";
import { GitHubIcon, HeartIcon, InstagramIcon } from "./Icons";

const Footer: React.FC = () => {
  return (
    <footer className="py-16 relative mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/50 to-transparent z-[-1]"></div>
      <div className="noise opacity-[0.03]"></div>
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              <span className="gradient-text">Not</span>Following
            </h3>
            <p className="text-sm text-muted-foreground">
              A simple tool to discover Instagram users who don't follow you back.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#tutorial" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Tutorial
                </a>
              </li>
              <li>
                <a href="#code" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Get Script
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
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
        </div>
        
        <div className="pt-8 border-t border-gray-200 text-center">
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
