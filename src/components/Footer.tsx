
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-secondary/30 mt-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          UnfollowedFinder is not affiliated with or endorsed by Instagram or Meta.
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} UnfollowedFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
