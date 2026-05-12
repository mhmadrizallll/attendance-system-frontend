// src/app/devices/page.tsx

"use client";

import { useEffect, useState } from "react";

import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from "@/services/deviceService";

import { isAdmin } from "@/utils/auth";

import "./css/device.css";

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    ip_address: "",
    port: 4370,
    location: "",
  });

  // =========================
  // CHECK ROLE
  // =========================
  const allowed = isAdmin();

  // =========================
  // FETCH DEVICES
  // =========================
  const fetchDevices = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await getDevices();

      setDevices(res.data || []);
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Failed fetch devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) {
      fetchDevices();
    }
  }, []);

  // =========================
  // CREATE
  // =========================
  const handleCreate = async () => {
    try {
      setLoading(true);

      await createDevice(form);

      setOpenAdd(false);

      setForm({
        name: "",
        ip_address: "",
        port: 4370,
        location: "",
      });

      await fetchDevices();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await updateDevice(selectedDevice.id, form);

      setSelectedDevice(null);

      await fetchDevices();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: number) => {
    const ok = confirm("Delete this device?");

    if (!ok) return;

    try {
      setLoading(true);

      await deleteDevice(id);

      await fetchDevices();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // OPEN EDIT
  // =========================
  const openEdit = (device: any) => {
    setSelectedDevice(device);

    setForm({
      name: device.name,
      ip_address: device.ip_address,
      port: device.port,
      location: device.location || "",
    });
  };

  // =========================
  // BLOCK NON ADMIN
  // =========================
  if (!allowed) {
    return (
      <div className="device-forbidden">
        <h1>403 Forbidden</h1>

        <p>Only admin or superadmin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="devices-page">
      {/* HEADER */}
      <div className="devices-header">
        <div>
          <h1>Devices</h1>

          <p>Monitoring Devices Information</p>
        </div>

        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={fetchDevices}
            disabled={loading}
          >
            ↻ Reload
          </button>

          <button
            className="add-device-btn"
            onClick={() => setOpenAdd(true)}
            disabled={loading}
          >
            + Add Device
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="device-error">{error}</div>}

      {/* WRAPPER */}
      <div className="device-wrapper">
        {/* LOADING */}
        {loading && (
          <div className="device-overlay">
            <div className="device-spinner" />
          </div>
        )}

        {/* EMPTY */}
        {!loading && devices.length === 0 && (
          <div className="device-empty">No devices found</div>
        )}

        {/* GRID */}
        <div className="device-grid">
          {devices.map((device) => (
            <div className="device-card" key={device.id}>
              <div className="device-status-wrapper">
                <span
                  className={
                    device.status === "online"
                      ? "device-status online"
                      : "device-status offline"
                  }
                >
                  {device.status}
                </span>
              </div>

              <h2>{device.name}</h2>

              <div className="device-info">
                <div className="info-item">
                  <span>IP Address</span>
                  <strong>{device.ip_address}</strong>
                </div>

                <div className="info-item">
                  <span>Port</span>
                  <strong>{device.port}</strong>
                </div>

                <div className="info-item">
                  <span>Location</span>
                  <strong>{device.location || "-"}</strong>
                </div>

                <div className="info-item">
                  <span>Last Sync</span>

                  <strong>
                    {device.last_sync
                      ? new Date(device.last_sync).toLocaleString("id-ID")
                      : "-"}
                  </strong>
                </div>
              </div>

              <div className="device-actions">
                <button
                  className="edit-btn-device"
                  onClick={() => openEdit(device)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn-device"
                  onClick={() => handleDelete(device.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MODAL */}
      {openAdd && (
        <DeviceModal
          title="Add Device"
          form={form}
          setForm={setForm}
          onClose={() => setOpenAdd(false)}
          onSave={handleCreate}
          saveText="Save"
        />
      )}

      {/* EDIT MODAL */}
      {selectedDevice && (
        <DeviceModal
          title="Edit Device"
          form={form}
          setForm={setForm}
          onClose={() => setSelectedDevice(null)}
          onSave={handleUpdate}
          saveText="Update"
        />
      )}
    </div>
  );
}

// =========================
// REUSABLE MODAL
// =========================
function DeviceModal({ title, form, setForm, onClose, onSave, saveText }: any) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title}</h2>

        <div className="form-group">
          <label>Device Name</label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>IP Address</label>

          <input
            value={form.ip_address}
            onChange={(e) =>
              setForm({
                ...form,
                ip_address: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Port</label>

          <input
            type="number"
            value={form.port}
            onChange={(e) =>
              setForm({
                ...form,
                port: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Location</label>

          <input
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="save-btn" onClick={onSave}>
            {saveText}
          </button>
        </div>
      </div>
    </div>
  );
}
