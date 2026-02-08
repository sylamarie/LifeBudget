function BillsSummary({ bills }) {
  const totalUpcoming = bills
    .filter((b) => b.status === "upcoming")
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
