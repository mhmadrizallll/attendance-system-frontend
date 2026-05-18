// src/components/users/ProbationReminderModal.tsx

"use client";

import axios from "axios";

import { useEffect, useState } from "react";

import "./css/probation.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProbationReminderModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [sending, setSending] = useState(false);

  const [users, setUsers] = useState<any[]>([]);

  // =========================
  // TOKEN
  // =========================
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5503/api/probation/reminder-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEND EMAIL
  // =========================
  const sendReminderEmail = async () => {
    try {
      setSending(true);

      await axios.post(
        "http://localhost:5503/api/probation/send-reminder",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Reminder email sent!");

      fetchUsers();
    } catch (err) {
      console.error(err);

      alert("Failed send email");
    } finally {
      setSending(false);
    }
  };

  // =========================
  // OPEN MODAL
  // =========================
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box probation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="detail-header">
          <div>
            <h2>Probation Reminder</h2>

            <p className="detail-subtitle">
              Employee probation evaluation reminder
            </p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No probation employee reminder</p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="table-wrapper">
              <table className="probation-table">
                <thead>
                  <tr>
                    <th>NIK</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Start Date</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.device_user_id}</td>

                      <td>{u.name}</td>

                      <td>{u.department || "-"}</td>

                      <td>{u.status || "-"}</td>

                      <td>
                        {new Date(u.start_date).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <div className="probation-footer">
              <button
                className="send-reminder-btn"
                onClick={sendReminderEmail}
                disabled={sending}
              >
                {sending ? "Sending..." : `Send Reminder (${users.length})`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
