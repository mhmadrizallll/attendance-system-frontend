// src/components/users/UserDetailModal.tsx

"use client";

type Props = {
  user: any;
  onClose: () => void;
};

export default function UserDetailModal({ user, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="detail-header">
          <h2>User Detail</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* DETAIL */}
        <div className="detail-grid">
          <div className="detail-item">
            <label>ID</label>
            <span>-</span>
          </div>

          <div className="detail-item">
            <label>NIK</label>
            <span>{user.device_user_id}</span>
          </div>

          <div className="detail-item">
            <label>Name</label>
            <span>{user.name}</span>
          </div>

          <div className="detail-item">
            <label>Department</label>
            <span>{user.department || "-"}</span>
          </div>

          <div className="detail-item">
            <label>Card Number</label>
            <span>{user.card_number || "-"}</span>
          </div>

          <div className="detail-item">
            <label>Created At</label>

            <span>
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "-"}
            </span>
          </div>

          <div className="detail-item">
            <label>Updated At</label>

            <span>
              {user.updated_at
                ? new Date(user.updated_at).toLocaleString()
                : "-"}
            </span>
          </div>

          <div className="detail-item">
            <label>Status</label>

            <span
              className={user.deleted_at ? "status-deleted" : "status-active"}
            >
              {user.deleted_at ? "Deleted" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
