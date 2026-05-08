// src/app/users/page.tsx

"use client";

import { useEffect, useState } from "react";

import { useUsers } from "@/hooks/useUsers";

import { getDepartments } from "@/services/attendanceService";

import UserFilters from "@/components/users/UserFilters";
import UserTable from "@/components/users/UserTable";

export default function UsersPage() {
  const { users, fetchUsers: fetchUsersHook } = useUsers();

  const [departments, setDepartments] = useState<any[]>([]);

  // ✅ loading khusus table
  const [tableLoading, setTableLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    department: "",
    show_deleted: false,
  });

  // ✅ INITIAL LOAD
  useEffect(() => {
    const init = async () => {
      try {
        setTableLoading(true);

        // fetch users
        await fetchUsersHook(filters, false);

        // fetch departments
        const deptRes = await getDepartments();

        setDepartments(deptRes.data || []);

        // ✅ delay biar smooth
        await new Promise((resolve) => setTimeout(resolve, 700));
      } catch (err) {
        console.error(err);
      } finally {
        setTableLoading(false);
      }
    };

    init();
  }, []);

  // ✅ HANDLE FILTER
  const handleChange = async (newFilter: any) => {
    const updated = {
      ...filters,
      ...newFilter,
    };

    setFilters(updated);

    // ✅ refresh smooth
    await fetchUsersHook(updated, false);
  };

  return (
    <div>
      {/* FILTER */}
      <UserFilters
        search={filters.search}
        department={filters.department}
        showDeleted={filters.show_deleted}
        departments={departments}
        onChange={handleChange}
      />

      {/* ✅ LOADING TABLE */}
      {tableLoading ? (
        <div className="table-loading">
          <div className="loading-spinner" />

          <div className="loading-content">
            {/* <h3>Preparing Users Table</h3> */}

            <p>Fetching employee data...</p>
          </div>
        </div>
      ) : (
        <UserTable
          data={users}
          refresh={() => fetchUsersHook(filters, false)}
        />
      )}
    </div>
  );
}
