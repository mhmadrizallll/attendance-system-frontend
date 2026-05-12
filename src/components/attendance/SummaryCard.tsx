"use client";

import { useMemo } from "react";

import { Attendance } from "@/hooks/useAttendance";

type Props = {
  data: Attendance[];
  selectedType: string;
};

export default function SummaryCards({ data, selectedType }: Props) {
  // =====================
  // DETECT TYPE
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

  // =====================
  // SUMMARY
  // =====================
  const summary = useMemo(() => {
    const uniqueUsers = new Set(filteredData.map((item) => item.device_user_id))
      .size;

    const activeDevices = new Set(filteredData.map((item) => item.device_id))
      .size;

    return {
      totalAttendance: filteredData.length,
      uniqueUsers,
      activeDevices,
    };
  }, [filteredData]);

  // =====================
  // CARD DATA
  // =====================
  const cards = [
    {
      title: "Total Absen",
      value: summary.totalAttendance,
      className: "primary",
    },
    {
      title: "User Hadir",
      value: summary.uniqueUsers,
      className: "success",
    },
    {
      title: "Device Aktif",
      value: summary.activeDevices,
      className: "purple",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((item) => (
        <div key={item.title} className={`summary-card ${item.className}`}>
          <div className="summary-info">
            <h4>{item.title}</h4>

            <h2>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
