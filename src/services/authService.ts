const BASE_URL = "http://localhost:5503/api/auth";

// =========================
// LOGIN
// =========================
export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
