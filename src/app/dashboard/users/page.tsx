"use client";

import { useEffect, useState } from "react";

import { useUsers } from "@/hooks/useUsers";

import { getDepartments } from "@/services/attendanceService";

import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";

import ProbationReminderModal from "@/components/users/ProbationReminderModal";

export default function UsersPage() {
  const { users, loading, fetchUsers } = useUsers();

  const [departments, setDepartments] = useState<any[]>([]);

  const [openReminder, setOpenReminder] = useState(false);

  // =========================
  // FILTERS
  // =========================
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    show_deleted: false,
  });

  // =========================
  // FIRST LOAD
  // =========================
  useEffect(() => {
    fetchUsers(filters);
  }, []);

  // =========================
  // LOAD DEPARTMENT
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDepartments();

        setDepartments(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  // =========================
  // HANDLE FILTER
  // =========================
  const handleChange = (newFilter: any) => {
    const updated = {
      ...filters,
      ...newFilter,
    };

    setFilters(updated);

    fetchUsers(updated);
  };

  return (
    <div className="users-page">
      {/* FILTER */}
      <UserFilters
        search={filters.search}
        department={filters.department}
        showDeleted={filters.show_deleted}
        departments={departments}
        onChange={handleChange}
      />

      {/* ACTION */}
      <div className="users-action">
        <button className="probation-btn" onClick={() => setOpenReminder(true)}>
          Probation Reminder
        </button>
      </div>

      {/* MODAL */}
      <ProbationReminderModal
        open={openReminder}
        onClose={() => setOpenReminder(false)}
      />

      {/* TABLE */}
      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <UserTable data={users} refresh={() => fetchUsers(filters)} />
      )}
    </div>
  );
}
