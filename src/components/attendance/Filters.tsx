"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./css/filter.css";

type Props = {
  date: string;
  dept: string;
  device_id: string;
  devices: any[];
  departments: any[];
  onChange: (filters: any) => void;
};

export default function Filters({
  date,
  dept,
  device_id,
  devices,
  departments,
  onChange,
}: Props) {
  return (
    <div className="filter-card">
      <h2 className="filter-title">Data Attendances</h2>

      <div className="filter-grid">
        {/* DATE */}
        <div className="filter-group">
          <label>Tanggal</label>

          <DatePicker
            selected={date ? new Date(date) : null}
            onChange={(date: Date | null) => {
              if (!date) return;

              const formatted = date.toISOString().split("T")[0];

              onChange({
                date: formatted,
              });
            }}
            dateFormat="dd MMMM yyyy"
            placeholderText="Select date"
            className="modern-date-input"
          />
        </div>

        {/* DEPARTMENT */}
        <div className="filter-group">
          <label>Department</label>

          <select
            value={dept}
            disabled={!date}
            onChange={(e) => onChange({ dept: e.target.value })}
          >
            <option value="">All Dept</option>

            {departments.map((d) => (
              <option key={d.department} value={d.department}>
                {d.department}
              </option>
            ))}
          </select>
        </div>

        {/* DEVICE */}
        <div className="filter-group">
          <label>Device</label>

          <select
            value={device_id}
            disabled={!date}
            onChange={(e) => onChange({ device_id: e.target.value })}
          >
            <option value="">All Device</option>

            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!date && (
        <p className="filter-warning">Select Date first to filter data</p>
      )}
    </div>
  );
}
