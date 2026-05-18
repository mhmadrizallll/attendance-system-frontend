// src/components/users/UserDetailModal.tsx

"use client";

type Props = {
  user?: any;
  onClose: () => void;
};

export default function UserDetailModal({ user, onClose }: Props) {
  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID");
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="detail-header">
          <div>
            <h2>User Detail</h2>

            <p className="detail-subtitle">Detail informasi user attendance</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* DETAIL */}
        <div className="detail-grid">
          <div className="detail-item">
            <label>ID</label>
            <span>{user?.id ?? "-"}</span>
          </div>

          <div className="detail-item">
            <label>NIK</label>
            <span>{user?.device_user_id ?? "-"}</span>
          </div>

          <div className="detail-item">
            <label>Name</label>
            <span>{user?.name ?? "-"}</span>
          </div>

          <div className="detail-item">
            <label>Department</label>
            <span>{user?.department ?? "-"}</span>
          </div>

          <div className="detail-item">
            <label>Employment Status</label>
            <span>{user?.status ?? "-"}</span>
          </div>

          <div className="detail-item">
            <label>Start Date</label>
            <span>{formatDate(user?.start_date)}</span>
          </div>

          <div className="detail-item">
            <label>Card Number</label>
            <span>{user?.card_number ?? "-"}</span>
          </div>

          {/* <div className="detail-item">
            <label>Created At</label>

            <span>{formatDateTime(user?.created_at)}</span>
          </div>

          <div className="detail-item">
            <label>Updated At</label>

            <span>{formatDateTime(user?.updated_at)}</span>
          </div> */}

          <div className="detail-item">
            <label>Status</label>

            <span
              className={user?.deleted_at ? "status-deleted" : "status-active"}
            >
              {user?.deleted_at ? "Deleted" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
