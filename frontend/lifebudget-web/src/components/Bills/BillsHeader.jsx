function BillsHeader({ onAdd }) {
  return (
    <>
      <h2>Bills</h2>
      <button className="btn-primary add-bill-btn" onClick={onAdd}>
        Add Bill
      </button>
    </>
  );
}

export default BillsHeader;
