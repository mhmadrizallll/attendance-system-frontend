"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Navbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
