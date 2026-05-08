// src/components/users/UserFilters.tsx

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
      <div className="filter-header">
        <h2 className="filter-title">Data Users</h2>

        {/* SHOW INACTIVE */}
        <button
          type="button"
          className={`inactive-toggle ${showDeleted ? "active" : ""}`}
          onClick={() =>
            onChange({
              show_deleted: !showDeleted,
            })
          }
        >
          <div className="toggle-circle" />

          <span>{showDeleted ? "Showing Inactive" : "Active Users"}</span>
        </button>
      </div>

      <div className="filter-grid">
        {/* SEARCH */}
        <div className="filter-group">
          <label>Search</label>

          <input
            type="text"
            placeholder="Search name / NIK"
            value={search}
            onChange={(e) =>
              onChange({
                search: e.target.value,
              })
            }
          />
        </div>

        {/* DEPARTMENT */}
        <div className="filter-group">
          <label>Department</label>

          <select
            value={department}
            onChange={(e) =>
              onChange({
                department: e.target.value,
              })
            }
          >
            <option value="">All Department</option>

            {departments.map((d) => (
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
