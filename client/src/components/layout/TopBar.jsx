import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Settings, Moon, Sun, Palette } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "../../hooks/useThemes";

// export const TopBar: React.FC = () => {
export const TopBar = () => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white hidden sm:block">
              Chatify
            </h1>
          </div>
        </div>

        {/* Center Section - Global Search */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <Input
            placeholder="Search messages, people, or groups..."
            icon={<Search size={16} />}
            className="w-full"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search size={18} />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Theme Selector */}
          <Button variant="ghost" size="sm">
            <Palette size={18} />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings size={18} />
          </Button>

          {/* User Avatar */}
          <Avatar
            src=""
            alt="Your Name"
            size="sm"
            status="online"
            className="ml-2"
          />
        </div>
      </div>
    </motion.header>
  );
};
