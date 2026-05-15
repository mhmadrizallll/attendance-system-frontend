"use client";

import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import "./css/navbar.css";

import { logout } from "@/utils/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // =========================
  // CLOSE DROPDOWN
  // =========================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    const confirmLogout = window.confirm("Yakin ingin logout?");

    if (!confirmLogout) return;

    logout();

    router.push("/login");
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <h1>Dashboard</h1>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* PROFILE */}
        <div className="profile-wrapper" ref={dropdownRef}>
          <button
            type="button"
            className="profile-btn"
            onClick={() => setOpen(!open)}
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="avatar"
              className="avatar"
            />

            <div className="profile-text">
              <span className="profile-name">Super Admin</span>

              <span className="profile-role">Administrator</span>
            </div>

            <ChevronDown
              size={18}
              className={`arrow ${open ? "rotate" : ""}`}
            />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="dropdown">
              <button type="button" className="dropdown-item">
                <User size={16} />
                Profile
              </button>

              <button type="button" className="dropdown-item">
                <Settings size={16} />
                Settings
              </button>

              <div className="dropdown-divider"></div>

              <button
                type="button"
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
