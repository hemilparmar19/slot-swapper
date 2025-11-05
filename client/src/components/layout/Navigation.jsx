import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Users, Bell } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", label: "My Calendar", icon: Calendar },
    { to: "/marketplace", label: "Marketplace", icon: Users },
    { to: "/requests", label: "Requests", icon: Bell },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
