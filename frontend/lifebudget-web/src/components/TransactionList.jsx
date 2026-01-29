import TransactionItem from "./TransactionItem";

function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return <p>No transactions yet.</p>;
  }

  return (
    <ul>
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </ul>
  );
}

export default TransactionList;
