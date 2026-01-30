import { useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import "./MonthlyDashboard.css";

function MonthlyDashboard() {
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  // ---- Monthly Summary ----
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const remaining = totalIncome - totalExpenses;

  // ---- Category Breakdown ----
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const category = t.category || "Other";
      acc[category] = (acc[category] || 0) + Number(t.amount);
      return acc;
    }, {});

  return (
    <section className="dashboard">
      <h1>Monthly Budget</h1>

      {/* Monthly Summary */}
      <div className="summary">
        <div className="summary-card">
          <span>Total Income</span>
          <strong>${totalIncome}</strong>
        </div>

        <div className="summary-card">
          <span>Total Expenses</span>
          <strong>${totalExpenses}</strong>
        </div>

        <div
          className={`summary-card ${
            remaining < 0 ? "negative" : "positive"
          }`}
        >
          <span>Remaining Balance</span>
          <strong>${remaining}</strong>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown">
        <h2>Spending by Category</h2>

        {Object.keys(expensesByCategory).length === 0 ? (
          <p className="empty">No expenses yet.</p>
        ) : (
          <ul>
            {Object.entries(expensesByCategory).map(
              ([category, amount]) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong>${amount}</strong>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <TransactionForm onAdd={addTransaction} />
      <TransactionList transactions={transactions} />
    </section>
  );
}

export default MonthlyDashboard;
