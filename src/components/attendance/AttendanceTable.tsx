"use client";

import { useMemo } from "react";

import { Attendance } from "@/hooks/useAttendance";

type Props = {
  data: Attendance[];
  selectedType: string;
  setSelectedType: (type: string) => void;
};

export default function AttendanceTable({
  data,
  selectedType,
  setSelectedType,
}: Props) {
  // =====================
  // DETECT IN / OUT
  // =====================
  const getAttendanceType = (deviceId: number, time: string) => {
    // DEVICE SERVER
    if (Number(deviceId) === 1) {
      return "ENTER";
    }

    // JAM PULANG
    if (time >= "15:00:00") {
      return "OUT";
    }

    return "IN";
  };

  // =====================
  // BADGE STYLE
  // =====================
  const getBadgeClass = (type: string) => {
    if (type === "IN") {
      return "badge-in";
    }

    if (type === "ENTER") {
      return "badge-enter";
    }

    return "badge-out";
  };

  // =====================
  // FILTER DATA
  // =====================
  const filteredData = useMemo(() => {
    if (selectedType === "ALL") {
      return data;
    }

    return data.filter((item) => {
      const type = getAttendanceType(item.device_id, item.time);

      return type === selectedType;
    });
  }, [data, selectedType]);

  return (
    <div className="card-table">
      {/* HEADER */}
      <div className="table-header">
        <div>
          <h2>📊 Data Kehadiran</h2>

          <span>{filteredData.length} Records</span>
        </div>

        {/* FILTER BUTTON */}
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
              filteredData.map((item, i) => {
                const type = getAttendanceType(item.device_id, item.time);

                return (
                  <tr key={i} className="row-animate">
                    {/* NAME */}
                    <td className="font-semibold">{item.name}</td>

                    {/* NIK */}
                    <td>{item.device_user_id}</td>

                    {/* DEPARTMENT */}
                    <td>{item.department || "-"}</td>

                    {/* DATE */}
                    <td>{item.date}</td>

                    {/* TIME */}
                    <td>
                      <span className="badge-time">{item.time}</span>
                    </td>

                    {/* STATUS */}
                    <td>
                      <span className={getBadgeClass(type)}>{type}</span>
                    </td>

                    {/* DEVICE */}
                    <td>{item.device_name || "-"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
