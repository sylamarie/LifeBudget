import BillRow from "./BillRow";

function BillsTable({ bills }) {
  return (
    <table className="bills-table">
      <thead>
        <tr>
          <th>Bill</th>
          <th>Due Date</th>
          <th>Amount</th>
          <th>Frequency</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bills.length === 0 ? (
          <tr>
            <td colSpan="5" className="empty">
              No bills to display
            </td>
          </tr>
        ) : (
          bills.map((bill) => <BillRow key={bill.id} bill={bill} />)
        )}
      </tbody>
    </table>
  );
}

export default BillsTable;

