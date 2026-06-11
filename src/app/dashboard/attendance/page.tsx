"use client";

import { useState, useEffect } from "react";

import {
  getDevices,
  sendItReport,
  sendItReportServer,
  getDepartments,
  exportAttendance,
} from "@/services/attendanceService";

import Filters from "@/components/attendance/Filters";
import SummaryCards from "@/components/attendance/SummaryCard";
import AttendanceTable from "@/components/attendance/AttendanceTable";

import { useAttendance } from "@/hooks/useAttendance";

// CONTOH
const user =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

export default function Page() {
  const { data, fetchData } = useAttendance();

  // =====================
  // FILTER STATE
  // =====================
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    dept: "",
    device_id: "",
  });

  // =====================
  // TYPE FILTER
  // =====================
  const [selectedType, setSelectedType] = useState("ALL");

  // =====================
  // MASTER DATA
  // =====================
  const [devices, setDevices] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  // =====================
  // HANDLE FILTER
  // =====================
  const handleChange = (newFilter: any) => {
    const updated = {
      ...filters,
      ...newFilter,
    };

    setFilters(updated);

    if (updated.start_date && updated.end_date) {
      fetchData(updated);
    }
  };

  // =====================
  // SEND IT REPORT
  // =====================
  const handleSendEmail = async () => {
    try {
      if (!filters.start_date || !filters.end_date) {
        alert("Pilih range tanggal dulu");
        return;
      }

      await sendItReport(filters.start_date, filters.end_date);

      alert("IT Report berhasil dikirim");
    } catch (err) {
      console.error(err);
      alert("Gagal kirim IT Report");
    }
  };

  const handleExportAttendance = async () => {
    try {
      const blob = await exportAttendance({
        type: filters.start_date && filters.end_date ? "range" : "today",
        start_date: filters.start_date,
        end_date: filters.end_date,
        dept: filters.dept,
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `attendance-${new Date().toISOString().slice(0, 10)}.txt`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Gagal export attendance");
    }
  };

  // =====================
  // SEND SERVER REPORT
  // =====================
  const handleSendEmailServer = async () => {
    try {
      if (!filters.start_date || !filters.end_date) {
        alert("Pilih range tanggal dulu");
        return;
      }

      await sendItReportServer(filters.start_date, filters.end_date);

      alert("IT Report Server berhasil dikirim");
    } catch (err) {
      console.error(err);
      alert("Gagal kirim IT Report Server");
    }
  };

  // =====================
  // FETCH DEVICES
  // =====================
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await getDevices();

        setDevices(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDevices();
  }, []);

  // =====================
  // FETCH DEPARTMENTS
  // =====================
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
        start_date={filters.start_date}
        end_date={filters.end_date}
        dept={filters.dept}
        device_id={filters.device_id}
        devices={devices}
        departments={departments}
        onChange={handleChange}
      />

      {/* ACTION BUTTON */}
      <div className="action-bar">
        <button onClick={handleExportAttendance} className="send-btn">
          Export Attendance
        </button>

        {user?.role === "superadmin" && (
          <>
            <button onClick={handleSendEmail} className="send-btn">
              Send IT Report
            </button>

            <button onClick={handleSendEmailServer} className="send-btn">
              Send IT Report Server
            </button>
          </>
        )}
      </div>

      {/* SUMMARY */}
      <SummaryCards data={data} selectedType={selectedType} />

      {/* TABLE */}
      <AttendanceTable
        data={data}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </div>
  );
}
