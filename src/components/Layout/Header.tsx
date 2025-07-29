import React, { useState } from "react";
import { Menu, Bell, Search, LogOut, User } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();

interface HeaderProps {
  onMenuClick: () => void;
}

const pages = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Properties", path: "/properties" },
  { name: "Users", path: "/users" },
  { name: "Analytics", path: "/analytics" },
  { name: "Reports", path: "/reports" },
  { name: "Calendar", path: "/calendar" },
  { name: "Message", path: "/Messages" },
  { name: "Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
];

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  // const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box with Suggestions */}
          <div className="relative hidden md:block w-80">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dashboard, users..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => {
                if (searchTerm) setShowSuggestions(true);
              }}
            />
            {showSuggestions && filteredPages.length > 0 && (
              <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-md mt-1 w-full">
                {filteredPages.map((page) => (
                  <div
                    key={page.name}
                    onClick={() => handleSearchSelect(page.path)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {page.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-zoom-pulse"></span>
          </button>

          <div className="relative group">
            {/* <button className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <img
                src={
                  user?.avatar ||
                  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
                }
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </button> */}

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
