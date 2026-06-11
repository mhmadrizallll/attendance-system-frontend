"use client";

import { useMemo } from "react";
import { Attendance } from "@/hooks/useAttendance";

type Props = {
  data: Attendance[];
  selectedType: string;
  setSelectedType: (type: string) => void;
};

// =====================
// UTIL TIME
// =====================
const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// =====================
// TYPE DETECTOR
// =====================
const getType = (item: Attendance) => {
  const minutes = toMinutes(item.time);

  // ENTER (MESIN SERVER)
  if (Number(item.device_id) === 3) {
    return "ENTER";
  }

  // IN
  if (minutes >= 435 && minutes < 900) return "IN";

  // OUT
  if (minutes >= 900) return "OUT";

  return null;
};

// =====================
// COMPONENT
// =====================
export default function AttendanceTable({
  data,
  selectedType,
  setSelectedType,
}: Props) {
  // =====================
  // GROUP PER USER PER DAY
  // =====================
  const processedData = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        device_user_id: string;
        department?: string;
        date: string;
        in?: Attendance;
        out?: Attendance;
        enter?: Attendance[];
      }
    >();

    data.forEach((item) => {
      const key = `${item.device_user_id}-${item.date}`;
      const type = getType(item);

      if (!type) return;

      if (!map.has(key)) {
        map.set(key, {
          name: item.name,
          device_user_id: item.device_user_id,
          department: item.department,
          date: item.date,
          enter: [],
        });
      }

      const user = map.get(key)!;

      // =====================
      // ENTER (server device)
      // =====================
      if (type === "ENTER") {
        user.enter!.push(item);
      }

      // =====================
      // IN (first)
      // =====================
      if (type === "IN") {
        if (!user.in || toMinutes(item.time) < toMinutes(user.in.time)) {
          user.in = item;
        }
      }

      // =====================
      // OUT (last)
      // =====================
      if (type === "OUT") {
        if (!user.out || toMinutes(item.time) > toMinutes(user.out.time)) {
          user.out = item;
        }
      }
    });

    // =====================
    // FLATTEN
    // =====================
    const result: any[] = [];

    map.forEach((v) => {
      // IN
      if (v.in) {
        result.push({
          name: v.name,
          device_user_id: v.device_user_id,
          department: v.department,
          date: v.date,
          time: v.in.time,
          type: "IN",
          device_name: v.in.device_name,
        });
      }

      // OUT
      if (v.out) {
        result.push({
          name: v.name,
          device_user_id: v.device_user_id,
          department: v.department,
          date: v.date,
          time: v.out.time,
          type: "OUT",
          device_name: v.out.device_name,
        });
      }

      // ENTER (bisa lebih dari 1)
      v.enter!.forEach((e) => {
        result.push({
          name: v.name,
          device_user_id: v.device_user_id,
          department: v.department,
          date: v.date,
          time: e.time,
          type: "ENTER",
          device_name: e.device_name,
        });
      });
    });

    return result;
  }, [data]);

  // =====================
  // FILTER
  // =====================
  const filteredData = useMemo(() => {
    if (selectedType === "ALL") return processedData;
    return processedData.filter((i) => i.type === selectedType);
  }, [processedData, selectedType]);

  return (
    <div className="card-table">
      {/* HEADER */}
      <div className="table-header">
        <div>
          <h2>📊 Data Kehadiran</h2>
          <span>{filteredData.length} Records</span>
        </div>

        <div className="type-filter">
          <button
            className={
              selectedType === "ALL" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setSelectedType("ALL")}
          >
            ALL
          </button>

          <button
            className={
              selectedType === "IN" ? "filter-btn active-in" : "filter-btn"
            }
            onClick={() => setSelectedType("IN")}
          >
            IN
          </button>

          <button
            className={
              selectedType === "OUT" ? "filter-btn active-out" : "filter-btn"
            }
            onClick={() => setSelectedType("OUT")}
          >
            OUT
          </button>

          <button
            className={
              selectedType === "ENTER"
                ? "filter-btn active-enter"
                : "filter-btn"
            }
            onClick={() => setSelectedType("ENTER")}
          >
            ENTER
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIK</th>
              <th>Departemen</th>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Status</th>
              <th>Device</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">
                  Tidak ada data 😴
                </td>
              </tr>
            ) : (
              filteredData.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.device_user_id}</td>
                  <td>{item.department || "-"}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td>
                    <span className={`badge-${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </td>
                  <td>{item.device_name || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
