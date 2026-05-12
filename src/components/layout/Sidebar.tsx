"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { LayoutDashboard, Users, Cpu } from "lucide-react";

import { isAdmin } from "@/utils/auth";

export default function Sidebar() {
  const pathname = usePathname();

  // =========================
  // CHECK ROLE
  // =========================
  const allowedDevice = isAdmin();

  // =========================
  // MENUS
  // =========================
  const menus = [
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: LayoutDashboard,
    },

    {
      name: "Users",
      href: "/dashboard/users",
      icon: Users,
    },

    // =========================
    // ADMIN ONLY
    // =========================
    ...(allowedDevice
      ? [
          {
            name: "Devices",
            href: "/dashboard/devices",
            icon: Cpu,
          },
        ]
      : []),
  ];

  return (
    <aside className="sidebar">
      <div>
        {/* LOGO */}
        <div className="logo">
          ⚡ <span>Admin Panel</span>
        </div>

        {/* MENU */}
        <nav className="menu">
          {menus.map((item, i) => {
            const isActive = pathname === item.href;

            const Icon = item.icon;

            return (
              <Link
                key={i}
                href={item.href}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <p>v1.0</p>
      </div>
    </aside>
  );
}
