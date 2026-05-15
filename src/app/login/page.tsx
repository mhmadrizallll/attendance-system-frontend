"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { login } from "@/services/authService";
import { setAuth } from "@/utils/auth";

import "./css/login.css";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================
  // HANDLE LOGIN
  // ======================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      if (!form.username.trim()) {
        setError("Username wajib diisi");

        return;
      }

      if (!form.password.trim()) {
        setError("Password wajib diisi");

        return;
      }

      setLoading(true);

      const res = await login(form.username, form.password);

      setAuth(res);

      router.push("/dashboard/users");
    } catch (err: any) {
      console.error(err);

      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CHECK TOKEN
  // ======================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard/users");
    }
  }, [router]);

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="overlay"></div>

        <div className="left-content">
          <div className="brand-badge">Attendance System</div>

          <h1>
            Smart Attendance <br />
            Monitoring Dashboard
          </h1>

          <p>
            Manage employee attendance, devices, and reports in one modern
            dashboard system.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="login-header">
            <h2
              style={{
                color: "#000103",
                fontWeight: "bold",
              }}
            >
              Login
            </h2>
          </div>

          {/* ERROR */}
          {error && <div className="error-message">{error}</div>}

          {/* USERNAME */}
          <div className="input-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* BUTTON */}
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
