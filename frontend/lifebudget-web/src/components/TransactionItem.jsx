import "./TransactionItem.css";

function TransactionItem({ transaction }) {
  return (
    <li
      className={`transaction-item ${
        transaction.type === "income" ? "income" : "expense"
      }`}
    >
      <span className="description">{transaction.description}</span>
      <strong className="amount">${transaction.amount}</strong>
    </li>
  );
}

export default TransactionItem;
