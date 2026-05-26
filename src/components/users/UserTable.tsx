"use client";

import { useEffect, useMemo, useState } from "react";

import EditUserModal from "./EditUsetModal";
import UserDetailModal from "./UserDetailModal";

import { updateUser, deleteUser, restoreUser } from "@/services/userService";

import "./css/users.css";

type Props = {
  data: any[];
  refresh: (showLoading?: boolean) => void;
};

export default function UserTable({ data, refresh }: Props) {
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [detailUser, setDetailUser] = useState<any>(null);

  const [logUser, setLogUser] = useState<any>(null);

  const [logs, setLogs] = useState<any[]>([]);

  const [logLoading, setLogLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const limit = 10;

  // =========================
  // RESET PAGE
  // =========================
  useEffect(() => {
    setPage(1);
  }, [data]);

  // =========================
  // SORT DATA
  // =========================
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "", "id", {
        sensitivity: "base",
      }),
    );
  }, [data]);

  // =========================
  // SUMMARY
  // =========================
  const totalUsers = data.length;

  const activeUsers = data.filter((u) => !u.deleted_at).length;

  const inactiveUsers = data.filter((u) => u.deleted_at).length;

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(sortedData.length / limit);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;

    return sortedData.slice(start, start + limit);
  }, [sortedData, page]);

  const handlePage = (p: number) => {
    if (p < 1 || p > totalPages) return;

    setPage(p);
  };

  // =========================
  // DEPARTMENT BADGE
  // =========================
  const getDeptClass = (dept: string) => {
    const code = dept?.substring(0, 3).toUpperCase();

    if (code === "FIG") return "dept-badge dept-fig";

    if (code === "FIO") return "dept-badge dept-fio";

    return "dept-badge dept-other";
  };

  // =========================
  // USER ACTIONS
  // =========================
  const handleSave = async (payload: any) => {
    setLoading(true);

    try {
      await updateUser(selectedUser.id, payload);

      setSelectedUser(null);

      await refresh(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate user?")) return;

    setLoading(true);

    try {
      await deleteUser(id);

      await refresh(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    if (!confirm("Restore user?")) return;

    setLoading(true);

    try {
      await restoreUser(id);

      await refresh(false);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN LOGS
  // =========================
  const openLogs = async (user: any) => {
    try {
      setLogUser(user);

      setLogLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5503/api/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed fetch logs");

      const data = await res.json();

      console.log("LOG RESPONSE:", data);

      setLogs(data?.attendances || data?.data?.attendances || []);
    } catch (err) {
      console.error(err);

      setLogs([]);
    } finally {
      setLogLoading(false);
    }
  };

  // =========================
  // LOG TYPE
  // =========================
  const getLogType = (deviceName: string = "", time: string) => {
    const hour = Number(time.split(":")[0]);

    const normalized = deviceName.toLowerCase().trim();

    if (normalized.includes("mesin server")) return "ENTER";

    if (hour >= 6 && hour < 15) return "IN";

    return "OUT";
  };

  const getLogBadgeClass = (type: string) => {
    if (type === "IN") return "badge-in";

    if (type === "ENTER") return "badge-enter";

    return "badge-out";
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      <div className="table-wrapper">
        {/* =========================
            LOADING
        ========================= */}
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>

            <div className="loading-content">
              <p>Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIK</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((user: any, index: number) => (
                  <tr key={user.id}>
                    <td>{(page - 1) * limit + index + 1}</td>

                    <td>{user.device_user_id}</td>

                    <td>{user.name}</td>

                    <td>
                      <span className={getDeptClass(user.department)}>
                        {user.department || "-"}
                      </span>
                    </td>

                    <td>
                      {user.deleted_at ? (
                        <span className="status-inactive">Inactive</span>
                      ) : (
                        <span className="status-active">Active</span>
                      )}
                    </td>

                    <td>
                      <div className="action-group">
                        <button
                          className="detail-btn"
                          onClick={() => setDetailUser(user)}
                        >
                          Detail
                        </button>

                        {!user.deleted_at ? (
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => setSelectedUser(user)}
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(user.id)}
                            >
                              Nonaktifkan
                            </button>

                            <button
                              className="log-btn"
                              onClick={() => openLogs(user)}
                            >
                              Logs
                            </button>
                          </>
                        ) : (
                          <button
                            className="restore-btn"
                            onClick={() => handleRestore(user.id)}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-text">No users found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* =========================
                PAGINATION + SUMMARY
            ========================= */}
            {data.length > 0 && (
              <>
                {/* PAGINATION */}
                <div className="pagination-wrapper">
                  {/* LEFT */}
                  <div className="pagination-left">
                    <p className="total-users-text">
                      Total Users: <b>{data.length}</b>
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="pagination-right">
                    <button
                      className="page-btn"
                      onClick={() => handlePage(page - 1)}
                      disabled={page === 1}
                    >
                      Prev
                    </button>

                    <div className="page-info">
                      Page <b>{page}</b> of <b>{totalPages}</b>
                    </div>

                    <button
                      className="page-btn"
                      onClick={() => handlePage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* =========================
          LOG MODAL
      ========================= */}
      {logUser && (
        <div className="modal-overlay">
          <div className="modal-box log-modal">
            <div className="modal-header">
              <h2>Logs - {logUser.name}</h2>

              <button onClick={() => setLogUser(null)}>✕</button>
            </div>

            {logLoading ? (
              <div className="log-loading">Loading logs...</div>
            ) : (
              <div className="log-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Device</th>
                      <th>Type</th>
                    </tr>
                  </thead>

                  <tbody
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {logs.map((log: any) => {
                      const d = new Date(log.timestamp);

                      const date = d.toISOString().split("T")[0];

                      const time = d.toTimeString().split(" ")[0];

                      const type = getLogType(log.device_name, time);

                      return (
                        <tr key={log.id}>
                          <td>{date}</td>

                          <td>{time}</td>

                          <td>{log.device_name}</td>

                          <td>
                            <span className={getLogBadgeClass(type)}>
                              {type}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          EDIT MODAL
      ========================= */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}

      {/* =========================
          DETAIL MODAL
      ========================= */}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
        />
      )}
    </>
  );
}
