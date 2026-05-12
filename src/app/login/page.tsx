"use client";

import { useState, useEffect } from "react";

import { login } from "@/services/authService";

import { setAuth } from "@/utils/auth";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await login(username, password);

      setAuth(res);

      alert("Login success");

      router.push("/dashboard/users");
    } catch (err) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.href = "/dashboard/users";
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login System</h2>

        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
