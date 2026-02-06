function BillRow({ bill }) {
  return (
    <tr>
      <td>{bill.name}</td>
      <td>{bill.dueDate}</td>
      <td>${bill.amount}</td>
      <td>{bill.frequency}</td>
      <td>
        <span className={`status ${bill.status}`}>
          {bill.status}
        </span>
      </td>
    </tr>
  );
}

export default BillRow;
