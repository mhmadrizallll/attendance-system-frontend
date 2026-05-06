"use client";

import { useEffect, useState } from "react";
import { socket } from "../../../lib/socket";

type Attendance = {
  device_id: number;
  device_user_id: string;
  name: string;
  date: string;
  time: string;
};

export default function AttendancePage() {
  const [data, setData] = useState<Attendance[]>([]);
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState({
    totalAttendance: 0,
    uniqueUsers: 0,
    activeDevices: 0,
  });
  const [dept, setDept] = useState("");

  const fetchByDateAndDept = async (selectedDate: string, dept?: string) => {
    const res = await fetch(
      `http://localhost:5503/api/attendances/by-date-and-dept?date=${selectedDate}&dept=${dept || ""}`,
    );

    const result = await res.json();
    setData(result.data || []);
  };

  const fetchSummary = async (selectedDate: string) => {
    try {
      const res = await fetch(
        `http://localhost:5503/api/attendances/summary-by-date?date=${selectedDate}`,
      );

      const result = await res.json();

      setSummary(result.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchByDate = async (selectedDate: string) => {
    try {
      const res = await fetch(
        `http://localhost:5503/api/attendances/by-date?date=${selectedDate}`,
      );

      const result = await res.json();

      setData(result.data || []);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    console.log("🚀 INIT SOCKET");

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ DISCONNECTED");
    });

    socket.on("connect_error", (err) => {
      console.log("💥 CONNECT ERROR:", err.message);
    });

    // 🔥 REALTIME SINGLE DATA (kayak dulu)
    socket.on("attendance:new", (item: Attendance) => {
      console.log("🔥 SINGLE:", item);

      setData((prev) => [item, ...prev].slice(0, 100));
    });

    // 🔥 BATCH DATA (kode sekarang)
    socket.on("attendance:batch", (incoming: any) => {
      console.log("📡 BATCH:", incoming);

      const newData: Attendance[] = Array.isArray(incoming)
        ? incoming
        : [incoming];

      setData((prev) => {
        const merged = [...newData, ...prev];
        return merged.slice(0, 100);
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("attendance:new"); // 🔥 tambahin ini
      socket.off("attendance:batch");
    };
  }, []);

  console.log("DATA:", data);
  const formatTime = (time: string) => {
    try {
      return new Date(time).toLocaleString("id-ID");
    } catch {
      return time;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📡 Realtime Attendance</h1>

      {/* 🔍 DEBUG VIEW */}
      {/* <div className="mb-4 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
            <strong>DEBUG DATA:</strong>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div> */}

      <div className="mb-4 flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => {
            const selected = e.target.value;
            setDate(selected);
            fetchByDate(selected);
            fetchSummary(selected); // 🔥 tambah ini
          }}
          className="border px-3 py-2 rounded"
        />
      </div>

      <select
        value={dept}
        onChange={(e) => {
          const d = e.target.value;
          setDept(d);
          fetchByDateAndDept(date, d);
        }}
        className="border px-3 py-2 rounded"
      >
        <option value="">All</option>
        <option value="FIG">FIG</option>
        <option value="FIO">FIO</option>
      </select>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-xl shadow">
          <h3 className="text-sm">Total Absen</h3>
          <p className="text-2xl font-bold">{summary.totalAttendance}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-xl shadow">
          <h3 className="text-sm">User Hadir</h3>
          <p className="text-2xl font-bold">{summary.uniqueUsers}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-xl shadow">
          <h3 className="text-sm">Device Aktif</h3>
          <p className="text-2xl font-bold">{summary.activeDevices}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">NIK</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Waktu</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-black">
                  Tidak ada data
                </td>
              </tr>
            )}

            {data.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-black font-medium">
                  {item.name || "-"}
                </td>

                <td className="px-4 py-3 text-black">{item.device_user_id}</td>

                <td className="px-4 py-3 text-black">{item.date}</td>

                <td className="px-4 py-3 text-black">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
