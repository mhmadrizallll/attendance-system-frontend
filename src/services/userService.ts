// src/services/userService.ts

const BASE_URL = "http://localhost:5503/api/users";

// =========================
// GET USERS
// =========================
export async function getUsers(filters?: {
  search?: string;
  department?: string;
  show_deleted?: boolean;
}) {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append("search", filters.search);
  }

  if (filters?.department) {
    params.append("department", filters.department);
  }

  // ✅ FIX: pastikan selalu string konsisten
  if (filters?.show_deleted === true) {
    params.append("show_deleted", "true");
  }

  const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

// =========================
// UPDATE USER
// =========================
export async function updateUser(id: number, payload: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed update user");
  }

  return res.json();
}

// =========================
// SOFT DELETE
// =========================
export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed delete user");
  }

  return res.json();
}

// =========================
// RESTORE USER
// =========================
export async function restoreUser(id: number) {
  const res = await fetch(`${BASE_URL}/${id}/restore`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Failed restore user");
  }

  return res.json();
}
