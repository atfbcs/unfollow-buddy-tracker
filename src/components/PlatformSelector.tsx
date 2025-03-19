
import React from "react";
import { usePlatform } from "@/contexts/PlatformContext";
import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Twitter } from "lucide-react";

export const PlatformSelector = ({ className = "" }: { className?: string }) => {
  const { platform, setPlatform } = usePlatform();

  return (
    <div className={`${className}`}>
      {/* Desktop view */}
      <div className="hidden md:block">
        <RadioGroup
          defaultValue={platform}
          onValueChange={(value) => setPlatform(value as "instagram" | "twitter")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instagram" id="instagram" />
            <Label htmlFor="instagram" className="flex items-center cursor-pointer">
              <Instagram className="h-4 w-4 mr-2" />
              <span>Instagram</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="twitter" id="twitter" />
            <Label htmlFor="twitter" className="flex items-center cursor-pointer">
              <Twitter className="h-4 w-4 mr-2" />
              <span>Twitter</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Select value={platform} onValueChange={(value) => setPlatform(value as "instagram" | "twitter")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram" className="flex items-center">
              <div className="flex items-center">
                <Instagram className="h-4 w-4 mr-2" />
                <span>Instagram</span>
              </div>
            </SelectItem>
            <SelectItem value="twitter" className="flex items-center">
              <div className="flex items-center">
                <Twitter className="h-4 w-4 mr-2" />
                <span>Twitter</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
