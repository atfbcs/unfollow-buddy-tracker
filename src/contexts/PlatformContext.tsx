
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Platform = "instagram" | "twitter";

interface PlatformContextType {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [platform, setPlatform] = useState<Platform>("instagram");

  return (
    <PlatformContext.Provider value={{ platform, setPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
};
