import axios from "axios";
const BASE_URL = "http://localhost:5503/api/attendances";

// export async function getByDate(date: string) {
//   const res = await fetch(`${BASE_URL}/by-date?date=${date}`);
//   return res.json();
// }

// export async function getSummary(date: string) {
//   const res = await fetch(`${BASE_URL}/summary-by-date?date=${date}`);
//   return res.json();
// }

// export async function getByDateAndDept(date: string, dept: string) {
//   const res = await fetch(
//     `${BASE_URL}/by-date-and-dept?date=${date}&dept=${dept}`,
//   );
//   return res.json();
// }

export async function getAttendance(filters: {
  date?: string;
  dept?: string;
  device_id?: string;
}) {
  const query = new URLSearchParams(filters as any).toString();

  const res = await fetch(
    `http://localhost:5503/api/attendances/by-filters?${query}`,
  );

  return res.json();
}

export async function getDevices() {
  const res = await fetch("http://localhost:5503/api/devices");
  return res.json();
}

export async function sendItReport(date: string) {
  const res = await axios.get(`http://localhost:5503/api/send-it-report`, {
    params: { date },
  });

  return res.data;
}
export async function sendItReportServer(date: string) {
  const res = await axios.get(
    `http://localhost:5503/api/send-it-report-server`,
    {
      params: { date },
    },
  );

  return res.data;
}

export async function getDepartments() {
  const res = await fetch("http://localhost:5503/api/departments");

  return res.json();
}
