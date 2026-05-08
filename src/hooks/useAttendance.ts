import { useState, useEffect } from "react";
import { socket } from "../../lib/socket";
import { getAttendance } from "../services/attendanceService";

export type Attendance = {
  device_id: number;
  device_name?: string;
  device_user_id: string;
  name: string;
  department: string;
  date: string;
  time: string;
};

export function useAttendance() {
  const [data, setData] = useState<Attendance[]>([]);

  const [summary, setSummary] = useState({
    totalAttendance: 0,
    uniqueUsers: 0,
    activeDevices: 0,
  });

  const fetchData = async (filters: {
    date?: string;
    dept?: string;
    device_id?: string;
  }) => {
    try {
      const res = await getAttendance(filters);

      setData(res.data || []);
      setSummary(
        res.summary || {
          totalAttendance: 0,
          uniqueUsers: 0,
          activeDevices: 0,
        },
      );
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

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
