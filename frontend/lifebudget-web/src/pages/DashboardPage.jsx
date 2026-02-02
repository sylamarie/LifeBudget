import { useEffect, useMemo, useState } from "react";
import "../components/DashboardShell.css";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("lifebudgetUserId") || "";

  const { totalIncome, totalExpenses, remaining } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      remaining: income - expenses,
    };
  }, [transactions]);

  const formatMoney = (value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const formatDate = (value) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      return;
    }
    const loadTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/transactions?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to load transactions.");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [userId]);

  return (
    <>
      <section className="lb-grid lb-grid-top">
        <article className="lb-card">
          <div className="lb-card-header">
            <h2>Overall Balance</h2>
            <span className="lb-muted">This Month</span>
          </div>
          <div className="lb-balance">{formatMoney(remaining)}</div>
          <div className="lb-totals">
            <div>
              <p className="lb-muted">Income</p>
              <strong>{formatMoney(totalIncome)}</strong>
            </div>
            <div>
              <p className="lb-muted">Expenses</p>
              <strong>{formatMoney(totalExpenses)}</strong>
            </div>
          </div>
        </article>

        <article className="lb-card lb-card-wide">
          <div className="lb-card-header">
            <h2>Income vs. Expenses</h2>
            <div className="lb-legend">
              <span className="lb-dot income" /> Income
              <span className="lb-dot expense" /> Expenses
            </div>
          </div>
          <div className="lb-chart lb-empty-panel">
            <p className="lb-empty">Add transactions to see the chart.</p>
          </div>
        </article>

        <article className="lb-card">
          <div className="lb-card-header">
            <h2>Upcoming Bills</h2>
            <button className="lb-link" type="button">
              View All
            </button>
          </div>
          <div className="lb-empty-panel">
            <p className="lb-empty">No bills yet.</p>
          </div>
        </article>
      </section>

      <section className="lb-grid lb-grid-bottom">
        <article className="lb-card lb-table-card">
          <div className="lb-card-header">
            <h2>Recent Transactions</h2>
          </div>
          {!userId ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Please log in to see transactions.</p>
            </div>
          ) : loading ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">No transactions yet.</p>
            </div>
          ) : (
            <div className="lb-transactions-table">
              <div className="lb-table-row header compact">
                <span>Date</span>
                <span>Description</span>
                <span>Category</span>
                <span>Amount</span>
              </div>
              {transactions.slice(0, 5).map((tx) => {
                const key = tx.id || tx._id || `${tx.description}-${tx.dateUtc}`;
                const isIncome = tx.type === "income";
                const amount = Number(tx.amount) || 0;
                const displayAmount = `${isIncome ? "+" : "-"}${formatMoney(
                  Math.abs(amount)
                )}`;
                return (
                  <div key={key} className="lb-table-row compact">
                    <span>{formatDate(tx.dateUtc || tx.date)}</span>
                    <span>{tx.description}</span>
                    <span>{tx.category || (isIncome ? "Income" : "Expense")}</span>
                    <span className={isIncome ? "lb-income" : "lb-expense"}>
                      {displayAmount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {error ? <p className="lb-empty">{error}</p> : null}
        </article>

        <div className="lb-stack">
          <article className="lb-card">
            <div className="lb-card-header">
              <h2>Budget Summary</h2>
            </div>
            <div className="lb-summary-list">
              <div>
                <span>Total Income</span>
                <strong>{formatMoney(totalIncome)}</strong>
              </div>
              <div>
                <span>Total Expenses</span>
                <strong>{formatMoney(totalExpenses)}</strong>
              </div>
              <div>
                <span>Remaining Budget</span>
                <strong className="lb-success">{formatMoney(remaining)}</strong>
              </div>
            </div>
          </article>

          <article className="lb-card">
            <div className="lb-card-header">
              <h2>Savings Goals</h2>
              <button className="lb-link" type="button">
                View All
              </button>
            </div>
            <div className="lb-empty-panel">
              <p className="lb-empty">No goals yet.</p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
