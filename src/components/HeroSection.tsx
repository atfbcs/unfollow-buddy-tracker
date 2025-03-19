
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code } from "lucide-react";

const HeroSection: React.FC = () => {
  const scrollToTutorial = () => {
    const tutorialSection = document.getElementById("tutorial");
    tutorialSection?.scrollIntoView({ behavior: "smooth" });
  };
  
  const scrollToCode = () => {
    const codeSection = document.getElementById("code");
    codeSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-radial z-0"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-primary opacity-10 blur-3xl rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-3xl rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
      
      {/* Noise Grain Effect */}
      <div className="noise"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block">Find Who's</span>
            <span className="gradient-text">Not Following</span>
            <span className="block">You Back</span>
          </motion.h1>
          
          <motion.p
            className="text-lg text-foreground/70 mb-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover who unfollowed you, who's not following back, and manage your social media presence more effectively.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" className="group" onClick={scrollToTutorial}>
              Get Started
              <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToCode}>
              <Code className="mr-2" size={18} />
              Get The Script
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
