const filters = [
  { key: "upcoming", label: "Upcoming" },
  { key: "recurring", label: "Recurring" },
  { key: "paid", label: "Paid" },
  { key: "all", label: "All Bills" },
];

function BillsFilters({ active, onChange }) {
  return (
    <div className="bills-filters">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`filter-btn ${active === f.key ? "active" : ""}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default BillsFilters;
