import { apiFetch } from "@/utils/api";

const BASE_URL = "http://localhost:5503/api/users";

export async function getUsers(filters?: any) {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.department) params.append("department", filters.department);

  if (filters?.show_deleted) params.append("show_deleted", "true");

  return apiFetch(`${BASE_URL}?${params.toString()}`);
}

// =========================
// UPDATE USER
// =========================
export async function updateUser(id: number, payload: any) {
  return apiFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// =========================
// DELETE USER
// =========================
export async function deleteUser(id: number) {
  return apiFetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}

// =========================
// RESTORE USER
// =========================
export async function restoreUser(id: number) {
  return apiFetch(`${BASE_URL}/restore/${id}`, {
    method: "PATCH",
  });
}
