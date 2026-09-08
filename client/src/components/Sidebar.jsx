import "./Sidebar.css";

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  User,
  Settings,
  LogOut
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "My Items",
      path: "/items",
      icon: Package
    },
    {
      name: "Lending",
      path: "/lending",
      icon: ArrowUpRight
    },
    {
      name: "Borrowing",
      path: "/borrowing",
      icon: ArrowDownLeft
    },
    {
      name: "Requests",
      path: "/requests",
      icon: Bell
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User
    }
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">L</div>
        <span>LendLoop</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={21} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={21} />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/" className="sidebar-link logout-link">
          <LogOut size={21} />
          <span>Logout</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;