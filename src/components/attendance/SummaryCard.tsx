type Props = {
  summary: {
    totalAttendance: number;
    uniqueUsers: number;
    activeDevices: number;
  };
};

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Total Absen",
      value: summary.totalAttendance,
      className: "primary",
    },
    {
      title: "User Hadir",
      value: summary.uniqueUsers,
      className: "success",
    },
    {
      title: "Device Aktif",
      value: summary.activeDevices,
      className: "purple",
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((item, i) => (
        <div key={i} className={`summary-card ${item.className}`}>
          <div className="summary-info">
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
