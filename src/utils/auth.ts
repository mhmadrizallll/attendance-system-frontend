export function setAuth(data: any) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// =========================
// CHECK ADMIN
// =========================
export function isAdmin() {
  const user = getUser();

  const role = user?.role?.toLowerCase();

  return role === "admin" || role === "superadmin";
}
