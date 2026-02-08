function BillRow({
  bill,
  onToggleStatus,
  onEdit,
  onDelete,
  showActions,
  showToggle,
  isTransitioning,
}) {
  // Calculate the next due date from a day-of-month value.
  const getDueDate = (dueDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, currentMonth, dueDay);

    if (dueDate < today) {
      dueDate.setMonth(currentMonth + 1);
    }

    return dueDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const rawStatus = (bill.status || "unpaid").toLowerCase();
  const statusKey = rawStatus === "upcoming" ? "unpaid" : rawStatus;
  const statusLabel = statusKey === "paid" ? "Paid" : "Unpaid";

  const frequencyLabel =
    bill.frequency || (bill.isRecurring ? "Monthly" : "One-time");

  return (
    <tr className={isTransitioning ? "bill-row transitioning" : "bill-row"}>
      <td>{bill.name}</td>
      <td>{getDueDate(bill.dueDay)}</td>
      <td>${bill.amount.toFixed(2)}</td>
      <td>{frequencyLabel}</td>
      <td>
        {showToggle ? (
          <button
            type="button"
            className={`status-pill ${statusKey}`}
            onClick={() => onToggleStatus?.(bill)}
            aria-pressed={statusKey === "paid"}
          >
            <span className="status-label">{statusLabel}</span>
            <span
              className={`status-toggle ${statusKey === "paid" ? "on" : ""}`}
              aria-hidden="true"
            />
          </button>
        ) : (
          <span className={`status-text ${statusKey}`}>{statusLabel}</span>
        )}
      </td>
      {showActions ? (
        <td className="bills-actions">
          <button type="button" className="lb-link" onClick={() => onEdit?.(bill)}>
            Edit
          </button>
          <button type="button" className="lb-link lb-delete" onClick={() => onDelete?.(bill)}>
            Delete
          </button>
        </td>
      ) : null}
    </tr>
  );
}

export default BillRow;
