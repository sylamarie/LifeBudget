function TransactionItem({ transaction }) {
  return (
    <li>
      <strong>{transaction.description}</strong> — $
      {transaction.amount} ({transaction.type})
    </li>
  );
}

export default TransactionItem;
