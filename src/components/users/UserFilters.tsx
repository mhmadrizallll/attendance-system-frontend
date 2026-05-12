type Props = {
  search: string;
  department: string;
  showDeleted: boolean;
  departments: any[];
  onChange: (value: any) => void;
};

export default function UserFilters({
  search,
  department,
  showDeleted,
  departments,
  onChange,
}: Props) {
  return (
    <div className="filter-card">
      {/* HEADER */}
      <div className="filter-header">
        <h2 className="filter-title">Users</h2>

        <button
          className={`inactive-toggle ${showDeleted ? "active" : ""}`}
          onClick={() =>
            onChange({
              show_deleted: !showDeleted,
            })
          }
        >
          <div className="toggle-circle" />

          <span>{showDeleted ? "Inactive Mode" : "Active Only"}</span>
        </button>
      </div>

      {/* FILTER GRID */}
      <div className="filter-grid">
        {/* SEARCH */}
        <div className="filter-group small">
          <label>Search</label>

          <input
            value={search}
            placeholder="Name / NIK"
            onChange={(e) =>
              onChange({
                search: e.target.value,
              })
            }
          />
        </div>

        {/* DEPARTMENT */}
        <div className="filter-group small">
          <label>Department</label>

          <select
            value={department}
            onChange={(e) =>
              onChange({
                department: e.target.value,
              })
            }
          >
            <option value="">All</option>

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
      </div>
    </div>
  );
}
