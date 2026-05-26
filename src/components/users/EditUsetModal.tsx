"use client";

import { useState } from "react";

type Props = {
  user: any;
  onClose: () => void;
  onSave: (data: any) => void;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    device_user_id: user.device_user_id || "",
    name: user.name || "",
    department: user.department || "",
    card_number: user.card_number || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit User</h2>

        {/* NIK */}
        <div className="form-group">
          <label>NIK</label>

          <input name="device_user_id" value={form.device_user_id} disabled />
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>Name</label>

          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        {/* DEPARTMENT */}
        <div className="form-group">
          <label>Department</label>

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
          />
        </div>

        {/* CARD */}
        <div className="form-group">
          <label>Card Number</label>

          <input
            name="card_number"
            value={form.card_number}
            onChange={handleChange}
          />
        </div>

        {/* ACTION */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-save" onClick={() => onSave(form)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
