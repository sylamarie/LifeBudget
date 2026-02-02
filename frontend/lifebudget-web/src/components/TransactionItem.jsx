import "./TransactionItem.css";

function TransactionItem({ transaction }) {
  return (
    <li
      className={`transaction-item ${
        transaction.type === "income" ? "income" : "expense"
      }`}
    >
      <div className="transaction-main">
        <span className="description">{transaction.description}</span>
        <span className="transaction-type">
          {transaction.type === "income" ? "Income" : "Expense"}
        </span>
      </div>
      <strong className="amount">${transaction.amount}</strong>
    </li>
  );
}

export default TransactionItem;
