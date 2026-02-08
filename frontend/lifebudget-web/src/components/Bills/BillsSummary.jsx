function BillsSummary({ bills }) {
  const getEffectiveStatus = (bill) => {
    const rawStatus = (bill.status || "unpaid").toLowerCase();
    const normalizedStatus = rawStatus === "upcoming" ? "unpaid" : rawStatus;
    if (!bill.isRecurring) return normalizedStatus;
    if (!bill.lastPaidUtc) return "unpaid";
    const lastPaid = new Date(bill.lastPaidUtc);
    if (Number.isNaN(lastPaid.getTime())) return "unpaid";
    const now = new Date();
    const sameMonth =
      lastPaid.getFullYear() === now.getFullYear() &&
      lastPaid.getMonth() === now.getMonth();
    return sameMonth ? "paid" : "unpaid";
  };

  const totalUpcoming = bills
    .filter((b) => getEffectiveStatus(b) === "unpaid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="bills-summary">
      <span className="bills-summary-label">
        Total amount of upcoming bills
      </span>

      <span className="bills-summary-amount">
        ${totalUpcoming.toFixed(2)}
      </span>
    </div>
  );
}

export default BillsSummary;
