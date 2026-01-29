import { useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function MonthlyDashboard() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  return (
    <section>
      <h1>Monthly Budget</h1>
      <TransactionForm onAdd={addTransaction} />
      <TransactionList transactions={transactions} />
    </section>
  );
}

export default MonthlyDashboard;
