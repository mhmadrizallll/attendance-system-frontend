import { useState, useEffect } from "react";

import { socket } from "../../lib/socket";

import { getAttendance, getSummary } from "../services/attendanceService";

export type Attendance = {
  device_id: number;
  device_name?: string;
  device_user_id: string;
  name: string;
  department: string;
  date: string;
  time: string;
};

type Filters = {
  date?: string;
  dept?: string;
  device_id?: string;
};

export function useAttendance() {
  // =====================
  // TABLE DATA
  // =====================
  const [data, setData] = useState<Attendance[]>([]);

  // =====================
  // SUMMARY
  // =====================
  const [summary, setSummary] = useState({
    totalAttendance: 0,
    uniqueUsers: 0,
    activeDevices: 0,
  });

  // =====================
  // FETCH DATA
  // =====================
  const fetchData = async (filters: Filters) => {
    try {
      console.log("FETCH FILTERS:", filters);

      // =====================
      // FETCH TABLE
      // =====================
      const attendanceRes = await getAttendance(filters);

      console.log("ATTENDANCE RES:", attendanceRes);

      setData(attendanceRes.data || []);

      // =====================
      // FETCH SUMMARY
      // =====================
      const summaryRes = await getSummary(filters);

      console.log("SUMMARY RES:", summaryRes);

      setSummary(
        summaryRes.data || {
          totalAttendance: 0,
          uniqueUsers: 0,
          activeDevices: 0,
        },
      );
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // =====================
  // SOCKET REALTIME
  // =====================
  useEffect(() => {
    socket.connect();

    socket.on("attendance:new", (item: Attendance) => {
      setData((prev) => [item, ...prev].slice(0, 100));
    });

    socket.on("attendance:batch", (incoming: Attendance[]) => {
      const newData = Array.isArray(incoming) ? incoming : [incoming];

      setData((prev) => [...newData, ...prev].slice(0, 100));
    });

    return () => {
      socket.off("attendance:new");
      socket.off("attendance:batch");
    };
  }, []);

  return {
    data,
    summary,
    fetchData,
  };
}
