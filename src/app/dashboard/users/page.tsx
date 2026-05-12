"use client";

import { useEffect, useState } from "react";

import { useUsers } from "@/hooks/useUsers";

import { getDepartments } from "@/services/attendanceService";

import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";

export default function UsersPage() {
  const { users, loading, fetchUsers } = useUsers();

  const [departments, setDepartments] = useState<any[]>([]);

  // ✅ PENTING: konsisten snake_case
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    show_deleted: false,
  });

  // FIRST LOAD
  useEffect(() => {
    fetchUsers(filters);
  }, []);

  // FETCH DEPT
  useEffect(() => {
    const load = async () => {
      const res = await getDepartments();
      setDepartments(res.data || []);
    };

    load();
  }, []);

  // HANDLE FILTER
  const handleChange = (newFilter: any) => {
    const updated = {
      ...filters,
      ...newFilter,
    };

    setFilters(updated);
    fetchUsers(updated);
  };

  return (
    <div>
      <UserFilters
        search={filters.search}
        department={filters.department}
        showDeleted={filters.show_deleted}
        departments={departments} // nanti sudah auto terfilter backend
        onChange={handleChange}
      />

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : (
        <UserTable data={users} refresh={() => fetchUsers(filters)} />
      )}
    </div>
  );
}
