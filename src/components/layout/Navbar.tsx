"use client";

import { Bell, Search } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      {/* Left */}
      <div className="navbar-left">
        <h1 className="title">Dashboard</h1>
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Notification */}
        <div className="icon-btn">
          <Bell size={18} />
          <span className="notif-dot"></span>
        </div>

        {/* Profile */}
        <div className="profile" onClick={() => setOpen(!open)}>
          <img src="https://i.pravatar.cc/40" className="avatar" alt="avatar" />
          <span className="name">Admin</span>

          {open && (
            <div className="dropdown">
              <p>Profile</p>
              <p>Settings</p>
              <p className="logout">Logout</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
