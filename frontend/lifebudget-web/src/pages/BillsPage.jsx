import "./BillsPage.css";

function BillsPage() {
  return (
    <section className="lb-card">
      <div className="lb-card-header">
        <h2>Bills &amp; Reminders</h2>
        {/* TODO: wire Add Bill modal */}
        <button className="primary-button" type="button" disabled>
          Add Bill
        </button>
      </div>

      {/* TODO: hook up tab state and filtering */}
      <div className="lb-bills-tabs">
        {/* TODO: show upcoming bills only */}
        <button className="lb-tab active" type="button">
          Upcoming
        </button>
        {/* TODO: show recurring bills only */}
        <button className="lb-tab" type="button">
          Recurring
        </button>
        {/* TODO: show paid bills only */}
        <button className="lb-tab" type="button">
          Paid
        </button>
        {/* TODO: show all bills */}
        <button className="lb-tab" type="button">
          All Bills
        </button>
      </div>

      {/* TODO: compute total from upcoming bills */}
      <div className="lb-bills-summary">
        <span className="lb-muted">Total amount of upcoming bills</span>
        <span className="lb-pill">--</span>
      </div>

      {/* TODO: replace placeholders with mapped rows from API */}
      <div className="lb-bills-table">
        <div className="lb-table-row header compact">
          {/* TODO: bill name/title */}
          <span>Bill</span>
          {/* TODO: due date of the bill */}
          <span>Due Date</span>
          {/* TODO: amount owed */}
          <span>Amount</span>
          {/* TODO: frequency (Monthly, Bi-Weekly, etc.) */}
          <span>Frequency</span>
          {/* TODO: status toggle buttons (Paid / Unpaid) */}
          <span>Status</span>
        </div>
        <div className="lb-table-row compact">
          <span>—</span>
          <span>—</span>
          <span>—</span>
          <span>—</span>
          <span>—</span>
        </div>
      </div>
    </section>
  );
}

export default BillsPage;
