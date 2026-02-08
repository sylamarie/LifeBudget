function BillsHeader({ onAdd }) {
  return (
    <div className="bills-header">
      <h1>Bills & Reminders</h1>
      <button className="btn-primary" onClick={onAdd}>
        Add Bill
      </button>
    </div>
  );
}

export default BillsHeader;
