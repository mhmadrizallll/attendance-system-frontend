"use client";

import { useState, useEffect } from "react";

import {
  getDevices,
  sendItReport,
  sendItReportServer,
  getDepartments,
} from "@/services/attendanceService";

import Filters from "@/components/attendance/Filters";
import SummaryCards from "@/components/attendance/SummaryCard";
import AttendanceTable from "@/components/attendance/AttendanceTable";

import { useAttendance } from "@/hooks/useAttendance";

export default function Page() {
  const { data, summary, fetchData } = useAttendance();
  const [departments, setDepartments] = useState<any[]>([]);

  // 🔥 FILTER STATE
  const [filters, setFilters] = useState({
    date: "",
    dept: "",
    device_id: "",
  });

  // 🔥 DEVICES
  const [devices, setDevices] = useState<any[]>([]);

  // 🔥 HANDLE FILTER
  const handleChange = (newFilter: any) => {
    const updated = {
      ...filters,
      ...newFilter,
    };

    setFilters(updated);

    fetchData(updated);
  };

  // 🔥 SEND IT REPORT
  const handleSendEmail = async () => {
    try {
      if (!filters.date) {
        alert("Pilih tanggal dulu");
        return;
      }

      console.log("SEND IT REPORT:", filters.date);

      await sendItReport(filters.date);

      alert("IT Report berhasil dikirim");
    } catch (err) {
      console.error("ERROR SEND REPORT:", err);

      alert("Gagal kirim IT Report");
    }
  };

  // 🔥 SEND SERVER REPORT
  const handleSendEmailServer = async () => {
    try {
      if (!filters.date) {
        alert("Pilih tanggal dulu");
        return;
      }

      console.log("SEND SERVER REPORT:", filters.date);

      await sendItReportServer(filters.date);

      alert("IT Report Server berhasil dikirim");
    } catch (err) {
      console.error("ERROR SEND SERVER REPORT:", err);

      alert("Gagal kirim IT Report Server");
    }
  };

  // 🔥 FETCH DEVICES
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await getDevices();

        setDevices(res.data || []);
      } catch (err) {
        console.error("Gagal fetch devices:", err);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();

        setDepartments(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      {/* FILTER */}
      <Filters
        date={filters.date}
        dept={filters.dept}
        device_id={filters.device_id}
        devices={devices}
        departments={departments}
        onChange={handleChange}
      />

      {/* ACTION BUTTON */}
      <div className="action-bar">
        <button onClick={handleSendEmail} className="send-btn">
          Send IT Report
        </button>

        <button onClick={handleSendEmailServer} className="send-btn">
          Send IT Report Server
        </button>
      </div>

      {/* SUMMARY */}
      <SummaryCards summary={summary} />

      {/* TABLE */}
      <AttendanceTable data={data} />
    </div>
  );
}
