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
            selected={date ? new Date(date + "T00:00:00") : null}
            onChange={(selectedDate: Date | null) => {
              if (!selectedDate) return;

              // ✅ FORMAT LOCAL DATE (ANTI MUNDUR 1 HARI)
              const year = selectedDate.getFullYear();

              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0",
              );

              const day = String(selectedDate.getDate()).padStart(2, "0");

              const formatted = `${year}-${month}-${day}`;

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
            onChange={(e) =>
              onChange({
                dept: e.target.value,
              })
            }
          >
            <option value="">All Dept</option>

            {[...departments]
              // FILTER NULL / EMPTY
              .filter((d) => d?.department && d.department.trim() !== "")
              // SORT A-Z
              .sort((a, b) =>
                (a.department || "").localeCompare(b.department || ""),
              )
              .map((d) => (
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
            onChange={(e) =>
              onChange({
                device_id: e.target.value,
              })
            }
          >
            <option value="">All Device</option>

            {[...devices]
              // FILTER NULL
              .filter((d) => d?.name)
              // SORT A-Z
              .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
              .map((d) => (
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
