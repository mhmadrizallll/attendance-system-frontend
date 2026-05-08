// src/hooks/useUsers.ts

import { useState } from "react";

import { getUsers } from "@/services/userService";

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  // ✅ HELPER DELAY
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // ✅ FETCH USERS
  const fetchUsers = async (filters?: any, showLoading = true) => {
    try {
      const start = Date.now();

      // ✅ tampil loading
      if (showLoading) {
        setLoading(true);
      }

      const res = await getUsers(filters);

      // ✅ jangan kosongin users
      setUsers(res.data || []);

      // ✅ minimum loading 700ms
      const elapsed = Date.now() - start;

      const minimumLoading = 700;

      if (showLoading && elapsed < minimumLoading) {
        await sleep(minimumLoading - elapsed);
      }
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  return {
    users,
    loading,
    fetchUsers,
  };
}
