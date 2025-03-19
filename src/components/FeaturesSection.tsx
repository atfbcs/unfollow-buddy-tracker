
import React from "react";
import { motion } from "framer-motion";
import { Users, UserMinus, UserCheck, Shield } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      className="glass-card hover-lift p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="h-12 w-12 flex items-center justify-center bg-primary/10 rounded-lg mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </motion.div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Follower Analytics",
      description: "Get detailed insights about your followers and account engagement patterns."
    },
    {
      icon: <UserMinus size={24} />,
      title: "Unfollower Tracking",
      description: "Keep track of who unfollowed you and when it happened."
    },
    {
      icon: <UserCheck size={24} />,
      title: "Mutual Followers",
      description: "Identify users who follow you back and strengthen those connections."
    },
    {
      icon: <Shield size={24} />,
      title: "Privacy Focused",
      description: "Your data stays on your device, we never store your credentials or personal information."
    }
  ];

  return (
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-r from-blue-400 to-purple-500 opacity-10 blur-3xl rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-primary opacity-10 blur-3xl rounded-full transform translate-x-1/4 translate-y-1/4"></div>
      
      {/* Noise Grain Effect */}
      <div className="noise"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto">
            Everything you need to manage your social media following effectively in one place.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
