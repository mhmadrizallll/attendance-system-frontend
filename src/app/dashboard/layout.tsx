"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ kalau tidak ada token → paksa login
    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(false);
  }, []);

  // 🔥 biar tidak flash dashboard sebelum check selesai
  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

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
