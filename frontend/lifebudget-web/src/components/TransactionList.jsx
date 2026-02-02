import TransactionItem from "./TransactionItem";
import "./TransactionList.css";

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p className="empty">No transactions yet.</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </ul>
  );
}

export default TransactionList;
