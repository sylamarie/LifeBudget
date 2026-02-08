import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../components/DashboardShell.css";

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState("");
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsError, setBillsError] = useState("");
  const { monthOffset, monthLabel } = useOutletContext();
  const userId = localStorage.getItem("lifebudgetUserId") || "";
  const navigate = useNavigate();

  const selectedMonthDate = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);

  const isSameMonth = (value) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return (
      date.getFullYear() === selectedMonthDate.getFullYear() &&
      date.getMonth() === selectedMonthDate.getMonth()
    );
  };

  const isSameMonthFor = (value, targetDate) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth()
    );
  };

  const {
    totalIncome,
    totalExpenses,
    remaining,
    totalIncomeAll,
    totalExpensesAll,
    hasMonthTransactions,
  } = useMemo(() => {
    const monthTransactions = transactions.filter((t) =>
      isSameMonth(t.dateUtc || t.date)
    );
    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const incomeAll = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expensesAll = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      remaining: income - expenses,
      totalIncomeAll: incomeAll,
      totalExpensesAll: expensesAll,
      hasMonthTransactions: monthTransactions.length > 0,
    };
  }, [transactions, selectedMonthDate]);

  const displayTotals = hasMonthTransactions
    ? { income: totalIncome, expenses: totalExpenses, remaining }
    : {
        income: totalIncomeAll,
        expenses: totalExpensesAll,
        remaining: totalIncomeAll - totalExpensesAll,
      };

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

  const formatDueDate = (date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const parseTransactionAmount = (tx) => {
    const amount = Number(tx.amount);
    if (!Number.isFinite(amount)) return 0;
    if (tx.type === "income") return Math.abs(amount);
    if (tx.type === "expense") return Math.abs(amount);
    return amount;
  };

  const getMonthKey = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return `${date.getFullYear()}-${date.getMonth()}`;
  };

  const getDueDateForMonth = (bill) => {
    const currentMonth = selectedMonthDate.getMonth();
    const currentYear = selectedMonthDate.getFullYear();
    const dueDay = Number(bill.dueDay || 1);
    const dueDate = new Date(currentYear, currentMonth, dueDay);
    return dueDate;
  };

  const getEffectiveStatus = (bill) => {
    const rawStatus = (bill.status || "unpaid").toLowerCase();
    const normalizedStatus = rawStatus === "upcoming" ? "unpaid" : rawStatus;
    if (!bill.isRecurring) return normalizedStatus;
    if (!bill.lastPaidUtc) return "unpaid";
    const lastPaid = new Date(bill.lastPaidUtc);
    if (Number.isNaN(lastPaid.getTime())) return "unpaid";
    const sameMonth =
      lastPaid.getFullYear() === selectedMonthDate.getFullYear() &&
      lastPaid.getMonth() === selectedMonthDate.getMonth();
    return sameMonth ? "paid" : "unpaid";
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
        console.log("dashboard transactions:", data);
        setTransactions(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();

    if (!userId) {
      setGoals([]);
      return;
    }

    const loadGoals = async () => {
      setGoalsLoading(true);
      setGoalsError("");
      try {
        const response = await fetch(`/api/goals?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to load goals.");
        }
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setGoalsError(err.message || "Something went wrong.");
      } finally {
        setGoalsLoading(false);
      }
    };

    loadGoals();

    const loadBills = async () => {
      setBillsLoading(true);
      setBillsError("");
      try {
        const response = await fetch(`/api/bills?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to load bills.");
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setBillsError(err.message || "Something went wrong.");
      } finally {
        setBillsLoading(false);
      }
    };

    loadBills();
  }, [userId, monthOffset]);

  const goalsSummary = useMemo(() => {
    if (!goals.length) {
      return { totalTarget: 0, totalCurrent: 0, completionPercent: 0 };
    }
    const totalTarget = goals.reduce(
      (sum, g) => sum + Number(g.targetAmount || 0),
      0
    );
    const totalCurrent = goals.reduce(
      (sum, g) => sum + Number(g.currentAmount || 0),
      0
    );
    const pct =
      totalTarget > 0 ? Math.min((totalCurrent / totalTarget) * 100, 100) : 0;
    return {
      totalTarget,
      totalCurrent,
      completionPercent: Math.round(pct),
    };
  }, [goals]);

  const upcomingBills = useMemo(() => {
    if (!bills.length) return [];
    return bills
      .map((bill) => ({
        ...bill,
        effectiveStatus: getEffectiveStatus(bill),
        dueDate: getDueDateForMonth(bill),
      }))
      .filter((bill) => bill.effectiveStatus === "unpaid")
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 5);
  }, [bills, selectedMonthDate]);

  return (
    <>
      <section className="lb-grid lb-grid-top">
        <article className="lb-card">
          <div className="lb-card-header">
            <h2>Overall Balance</h2>
            <span className="lb-muted">
              {hasMonthTransactions || transactions.length === 0
                ? monthLabel
                : "All Time"}
            </span>
          </div>
          <div className="lb-balance">{formatMoney(displayTotals.remaining)}</div>
          <div className="lb-totals">
            <div>
              <p className="lb-muted">Income</p>
              <strong>{formatMoney(displayTotals.income)}</strong>
            </div>
            <div>
              <p className="lb-muted">Expenses</p>
              <strong>{formatMoney(displayTotals.expenses)}</strong>
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
          {transactions.length === 0 ? (
            <div className="lb-chart lb-empty-panel">
              <p className="lb-empty">Add transactions to see the chart.</p>
            </div>
          ) : (
            <div className="lb-chart lb-chart-months">
              {(() => {
                const months = Array.from({ length: 4 }, (_, index) => {
                  const date = new Date(selectedMonthDate);
                  date.setMonth(date.getMonth() - (3 - index));
                  return date;
                });

                const buckets = months.map((date) => ({
                  key: `${date.getFullYear()}-${date.getMonth()}`,
                  label: date.toLocaleDateString("en-US", { month: "short" }),
                  income: 0,
                  expenses: 0,
                }));

                const bucketMap = new Map(buckets.map((b) => [b.key, b]));

                transactions.forEach((tx) => {
                  const key = getMonthKey(tx.dateUtc || tx.date || tx.createdAt);
                  if (!key || !bucketMap.has(key)) return;
                  const amount = parseTransactionAmount(tx);
                  if (!Number.isFinite(amount) || amount === 0) return;

                  if (tx.type === "income") {
                    bucketMap.get(key).income += Math.abs(amount);
                  } else if (tx.type === "expense") {
                    bucketMap.get(key).expenses += Math.abs(amount);
                  } else {
                    if (amount > 0) bucketMap.get(key).income += amount;
                    if (amount < 0) bucketMap.get(key).expenses += Math.abs(amount);
                  }
                });

                const maxValue = Math.max(
                  1,
                  ...buckets.map((b) => Math.max(b.income, b.expenses))
                );

                const calcHeight = (value) => {
                  if (value <= 0) return 0;
                  const pct = Math.round((value / maxValue) * 100);
                  return Math.max(6, pct);
                };

                return buckets.map((bucket) => (
                  <div key={bucket.key} className="lb-bar-group">
                    <div className="lb-bar-stack">
                      <span
                        className="lb-bar income"
                        style={{ height: `${calcHeight(bucket.income)}%` }}
                      />
                      <span
                        className="lb-bar expense"
                        style={{ height: `${calcHeight(bucket.expenses)}%` }}
                      />
                    </div>
                    <span className="lb-bar-label">{bucket.label}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </article>

        <article className="lb-card">
          <div className="lb-card-header">
            <h2>Upcoming Bills</h2>
            <button
              className="lb-link"
              type="button"
              onClick={() => navigate("/app/bills")}
            >
              View All
            </button>
          </div>
          {!userId ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Please log in to see your bills.</p>
            </div>
          ) : billsLoading ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Loading bills...</p>
            </div>
          ) : billsError ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">{billsError}</p>
            </div>
          ) : upcomingBills.length === 0 ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">No upcoming bills.</p>
            </div>
          ) : (
            <ul className="lb-bills-list">
              {upcomingBills.map((bill) => {
                const key = bill.id || bill._id || bill.name;
                return (
                  <li key={key}>
                    <span className="lb-bill-name">{bill.name}</span>
                    <span className="lb-bill-due">
                      Due {formatDueDate(bill.dueDate)}
                    </span>
                    <strong className="lb-bill-amount">
                      {formatMoney(Number(bill.amount) || 0)}
                    </strong>
                  </li>
                );
              })}
            </ul>
          )}
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
        </div>
      </section>

      <section className="lb-grid lb-grid-full">
        <article className="lb-card lb-card-full">
          <div className="lb-card-header">
            <h2>Savings Goals</h2>
            <button
              className="lb-link"
              type="button"
              onClick={() => navigate("/app/goals")}
            >
              View All
            </button>
          </div>
          {!userId ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Log in to see your goals.</p>
            </div>
          ) : goalsLoading ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">Loading goals...</p>
            </div>
          ) : goalsError ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">{goalsError}</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="lb-empty-panel">
              <p className="lb-empty">No goals yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="lb-goals-grid">
              <div className="lb-goals-summary">
                <div className="lb-summary-list">
                  <div>
                    <span>Total Saved</span>
                    <strong>
                      {formatMoney(goalsSummary.totalCurrent)}
                    </strong>
                  </div>
                  <div>
                    <span>Total Target</span>
                    <strong>
                      {formatMoney(goalsSummary.totalTarget)}
                    </strong>
                  </div>
                  <div>
                    <span>Overall Progress</span>
                    <strong className="lb-success">
                      {goalsSummary.completionPercent}%
                    </strong>
                  </div>
                </div>
              </div>
              <div className="lb-goals-list">
                {goals.slice(0, 3).map((goal) => {
                  const key = goal.id || goal._id || goal.name;
                  const target = Number(goal.targetAmount || 0);
                  const current = Number(goal.currentAmount || 0);
                  const pct =
                    target > 0
                      ? Math.min((current / target) * 100, 100)
                      : 0;
                  return (
                    <div key={key} className="lb-goal">
                      <div className="lb-goal-header">
                        <span>{goal.name}</span>
                        <span className="lb-muted">
                          {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="lb-progress">
                        <div
                          className="lb-progress-bar"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default DashboardPage;
