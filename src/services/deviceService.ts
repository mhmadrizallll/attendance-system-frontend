// src/services/deviceService.ts

const BASE_URL = "http://localhost:5503/api/devices";

// =========================
// GET TOKEN
// =========================
function getToken() {
  return localStorage.getItem("token");
}

// =========================
// REQUEST HELPER
// =========================
async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${getToken()}`,

      ...(options?.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  // =========================
  // HANDLE ERROR
  // =========================
  if (!res.ok) {
    throw new Error(
      data?.message ||
        (res.status === 403
          ? "Forbidden"
          : res.status === 401
            ? "Unauthorized"
            : "Request failed"),
    );
  }

  return data;
}

// =========================
// GET DEVICES
// =========================
export async function getDevices() {
  return request(BASE_URL);
}

// =========================
// CREATE DEVICE
// =========================
export async function createDevice(payload: any) {
  return request(BASE_URL, {
    method: "POST",

    body: JSON.stringify(payload),
  });
}

// =========================
// UPDATE DEVICE
// =========================
export async function updateDevice(id: number, payload: any) {
  return request(`${BASE_URL}/${id}`, {
    method: "PUT",

    body: JSON.stringify(payload),
  });
}

// =========================
// DELETE DEVICE
// =========================
export async function deleteDevice(id: number) {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
}
