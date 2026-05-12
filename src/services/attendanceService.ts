import axios from "axios";

const BASE_URL = "http://localhost:5503/api";

// =====================
// ATTENDANCE TABLE
// =====================
export async function getAttendance(filters: {
  date?: string;
  dept?: string;
  device_id?: string;
}) {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams(filters as any).toString();

  const res = await fetch(`${BASE_URL}/attendances/by-filters?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// =====================
// SUMMARY
// =====================
export async function getSummary(filters: {
  date?: string;
  dept?: string;
  device_id?: string;
}) {
  const token = localStorage.getItem("token");

  const query = new URLSearchParams(filters as any).toString();

  const res = await fetch(`${BASE_URL}/attendances/summary?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// =====================
// DEVICES
// =====================
export async function getDevices() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

// =====================
// IT REPORT
// =====================
export async function sendItReport(date: string) {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/send-it-report`, {
    params: { date },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// =====================
// SERVER REPORT
// =====================
export async function sendItReportServer(date: string) {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/send-it-report-server`, {
    params: { date },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// =====================
// DEPARTMENTS
// =====================
export async function getDepartments() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/departments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
