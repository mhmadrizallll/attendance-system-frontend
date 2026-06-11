"use client";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./css/filter.css";

type Props = {
  start_date: string;
  end_date: string;
  dept: string;
  device_id: string;
  devices: any[];
  departments: any[];
  onChange: (filters: any) => void;
};

export default function Filters({
  start_date,
  end_date,
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
        {/* START DATE */}
        <div className="filter-group">
          <label>Start Date</label>

          <DatePicker
            selected={start_date ? new Date(start_date + "T00:00:00") : null}
            onChange={(selectedDate: Date | null) => {
              if (!selectedDate) return;

              const year = selectedDate.getFullYear();

              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0",
              );

              const day = String(selectedDate.getDate()).padStart(2, "0");

              onChange({
                start_date: `${year}-${month}-${day}`,
              });
            }}
            dateFormat="dd MMMM yyyy"
            placeholderText="Start Date"
            className="modern-date-input"
          />
        </div>

        {/* END DATE */}
        <div className="filter-group">
          <label>End Date</label>

          <DatePicker
            selected={end_date ? new Date(end_date + "T00:00:00") : null}
            onChange={(selectedDate: Date | null) => {
              if (!selectedDate) return;

              const year = selectedDate.getFullYear();

              const month = String(selectedDate.getMonth() + 1).padStart(
                2,
                "0",
              );

              const day = String(selectedDate.getDate()).padStart(2, "0");

              onChange({
                end_date: `${year}-${month}-${day}`,
              });
            }}
            dateFormat="dd MMMM yyyy"
            placeholderText="End Date"
            className="modern-date-input"
          />
        </div>

        {/* DEPARTMENT */}
        <div className="filter-group">
          <label>Department</label>

          <select
            value={dept}
            disabled={!start_date || !end_date}
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
            disabled={!start_date || !end_date}
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

      {(!start_date || !end_date) && (
        <p className="filter-warning">Select Start Date and End Date first</p>
      )}
    </div>
  );
}
