import { useEffect, useMemo, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import "../components/DashboardShell.css";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);

  const userId = localStorage.getItem("lifebudgetUserId") || "";

  const saveTransaction = async (transaction) => {
    setError("");
    if (!userId) {
      setError("Please log in first.");
      return;
    }
    const payload = {
      userId,
      description: transaction.description,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      dateUtc: transaction.date,
    };

    try {
      const isEdit = Boolean(editingTransaction);
      const endpoint = isEdit
        ? `/api/transactions/${editingTransaction.id || editingTransaction._id}`
        : "/api/transactions";
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update transaction." : "Failed to save transaction.");
      }

      const created = await response.json();
      if (isEdit) {
        setTransactions((prev) =>
          prev.map((item) =>
            (item.id || item._id) === (created.id || created._id) ? created : item
          )
        );
        setEditingTransaction(null);
      } else {
        setTransactions((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const deleteTransaction = async (transaction) => {
    setError("");
    if (!userId) {
      setError("Please log in first.");
      return;
    }

    const id = transaction.id || transaction._id;
    if (!id) {
      setError("Transaction id is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction.");
      }

      setTransactions((prev) => prev.filter((item) => (item.id || item._id) !== id));
      if (editingTransaction && (editingTransaction.id || editingTransaction._id) === id) {
        setEditingTransaction(null);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
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

  return (
    <section className="lb-card">
      <div className="lb-card-header">
        <h2>Transactions</h2>
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

      {error ? <p className="lb-empty">{error}</p> : null}

      <TransactionForm
        onSubmit={saveTransaction}
        initialValues={editingTransaction}
        submitLabel={editingTransaction ? "Update Transaction" : "Add Transaction"}
        onCancel={editingTransaction ? () => setEditingTransaction(null) : null}
      />

      {!userId ? (
        <div className="lb-empty-panel">
          <p className="lb-empty">Please log in to see your transactions.</p>
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
          <div className="lb-table-row header">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Amount</span>
            <span className="lb-actions-header">Actions</span>
            <span></span>
          </div>
          {transactions.map((tx) => {
            const key = tx.id || tx._id || `${tx.description}-${tx.dateUtc}`;
            const isIncome = tx.type === "income";
            const amount = Number(tx.amount) || 0;
            const displayAmount = `${isIncome ? "+" : "-"}${formatMoney(
              Math.abs(amount)
            )}`;
            return (
              <div key={key} className="lb-table-row">
                <span>{formatDate(tx.dateUtc || tx.date)}</span>
                <span>{tx.description}</span>
                <span>{tx.category || (isIncome ? "Income" : "Expense")}</span>
                <span className={isIncome ? "lb-income" : "lb-expense"}>
                  {displayAmount}
                </span>
                <div className="lb-actions-cell">
                  <button
                    type="button"
                    className="lb-link lb-edit"
                    onClick={() => setEditingTransaction(tx)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="lb-link lb-delete"
                    onClick={() => deleteTransaction(tx)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TransactionsPage;
