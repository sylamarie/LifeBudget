import BillRow from "./BillRow";

function BillsTable({
  bills,
  onToggleStatus,
  onEdit,
  onDelete,
  showActions,
  showToggle,
}) {
  return (
    <div className="bills-table-wrap">
      <table className="bills-table">
        <thead>
          <tr>
            <th>Bill</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Frequency</th>
            <th>Status</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="empty">
                No bills to display.
              </td>
            </tr>
          ) : (
            bills.map((bill) => (
              <BillRow
                key={bill.id || bill._id || bill.Id || bill.name}
                bill={bill}
                onToggleStatus={onToggleStatus}
                isTransitioning={(bill.statusTransitionUntil || 0) > Date.now()}
                onEdit={onEdit}
                onDelete={onDelete}
                showActions={showActions}
                showToggle={showToggle}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BillsTable;

