import { useEffect, useMemo, useState } from "react";
import "./InsightsPage.css";
import "../components/DashboardShell.css";

const OVERSPEND_THRESHOLD = 0.3;
const CATEGORY_OPTIONS = [
  "Other",
  "Groceries",
  "Rent",
  "Utilities",
  "Transportation",
  "Dining",
  "Entertainment",
  "Savings",
  "Income",
];

function InsightsPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("lifebudgetUserId") || "";
  const [monthOffset, setMonthOffset] = useState(0);
  const [budgetCategory, setBudgetCategory] = useState("Other");
  const [customCategory, setCustomCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);

  const parseExpenseAmount = (tx) => {
    const amount = Number(tx.amount);
    if (!Number.isFinite(amount)) return 0;
    if (tx.type === "expense") return Math.abs(amount);
    if (tx.type === "income") return 0;
    return amount < 0 ? Math.abs(amount) : 0;
  };

  const getDateValue = (tx) => tx.dateUtc || tx.date || tx.createdAt;

  const isSameMonth = (value, targetDate) => {
    if (!value) return false;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;
    return (
      date.getFullYear() === targetDate.getFullYear() &&
      date.getMonth() === targetDate.getMonth()
    );
  };

  const selectedMonthDate = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset]);

  const monthLabel = selectedMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setBudgets([]);
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

    const loadBudgets = async () => {
      try {
        const monthKey = selectedMonthDate.toISOString().slice(0, 7);
        const response = await fetch(
          `/api/budgets?userId=${userId}&month=${monthKey}`
        );
        if (!response.ok) {
          throw new Error("Failed to load budgets.");
        }
        const data = await response.json();
        setBudgets(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      }
    };

    loadTransactions();
    loadBudgets();
  }, [userId, selectedMonthDate]);

  const insights = useMemo(() => {
    const currentMonth = selectedMonthDate;

    const expensesThisMonth = transactions.filter((tx) =>
      isSameMonth(getDateValue(tx), currentMonth)
    );

    const totalSpent = expensesThisMonth.reduce(
      (sum, tx) => sum + parseExpenseAmount(tx),
      0
    );

    const categoryTotals = new Map();
    expensesThisMonth.forEach((tx) => {
      const amount = parseExpenseAmount(tx);
      if (!amount) return;
      const category = tx.category || "Other";
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
    });

    let topCategory = null;
    categoryTotals.forEach((value, key) => {
      if (!topCategory || value > topCategory.amount) {
        topCategory = { category: key, amount: value };
      }
    });

    const overspending = [];
    if (totalSpent > 0) {
      categoryTotals.forEach((value, key) => {
        const share = value / totalSpent;
        if (share >= OVERSPEND_THRESHOLD) {
          overspending.push({ category: key, amount: value, share });
        }
      });
    }

    const categoryList = Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4);

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - (5 - index),
        1
      );
      return date;
    });

    const monthlyTotals = months.map((month) => {
      const total = transactions.reduce((sum, tx) => {
        if (!isSameMonth(getDateValue(tx), month)) return sum;
        return sum + parseExpenseAmount(tx);
      }, 0);
      return {
        label: month.toLocaleDateString("en-US", { month: "short" }),
        total,
      };
    });

    const budgetsWithSpend = budgets.map((budget) => {
      const spent = expensesThisMonth.reduce((sum, tx) => {
        const amount = parseExpenseAmount(tx);
        if (!amount) return sum;
        const category = tx.category || "Other";
        if (category !== budget.category) return sum;
        return sum + amount;
      }, 0);
      const limit = Number(budget.monthlyLimit || 0);
      const pct = limit > 0 ? Math.min((spent / limit) * 100, 999) : 0;
      return { ...budget, spent, pct, limit };
    });

    return {
      totalSpent,
      topCategory,
      overspending,
      categoryList,
      monthlyTotals,
      budgetsWithSpend,
    };
  }, [transactions, budgets, selectedMonthDate]);

  const formatMoney = (value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const maxMonthly = Math.max(
    1,
    ...insights.monthlyTotals.map((item) => item.total)
  );

  const resetBudgetForm = () => {
    setBudgetCategory("Other");
    setCustomCategory("");
    setBudgetLimit("");
    setEditingBudget(null);
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Please log in first.");
      return;
    }

    const monthKey = selectedMonthDate.toISOString().slice(0, 7);
    const resolvedCategory =
      budgetCategory === "Other" ? customCategory.trim() : budgetCategory;

    if (!resolvedCategory) {
      setError("Category is required.");
      return;
    }

    const payload = {
      userId,
      category: resolvedCategory,
      monthlyLimit: Number(budgetLimit),
      monthUtc: new Date(`${monthKey}-01T00:00:00.000Z`).toISOString(),
    };

    if (!Number.isFinite(payload.monthlyLimit) || payload.monthlyLimit <= 0) {
      setError("Monthly limit must be greater than 0.");
      return;
    }

    const isEdit = Boolean(editingBudget);
    const endpoint = isEdit
      ? `/api/budgets/${editingBudget.id || editingBudget._id}`
      : "/api/budgets";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update budget." : "Failed to create budget.");
      }

      const saved = await response.json();
      setBudgets((prev) =>
        isEdit
          ? prev.map((b) =>
              (b.id || b._id) === (saved.id || saved._id) ? saved : b
            )
          : [saved, ...prev]
      );
      resetBudgetForm();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const handleBudgetEdit = (budget) => {
    setEditingBudget(budget);
    const incomingCategory = budget.category || "Other";
    if (CATEGORY_OPTIONS.includes(incomingCategory)) {
      setBudgetCategory(incomingCategory);
      setCustomCategory("");
    } else {
      setBudgetCategory("Other");
      setCustomCategory(incomingCategory);
    }
    setBudgetLimit(
      budget.monthlyLimit !== undefined && budget.monthlyLimit !== null
        ? String(budget.monthlyLimit)
        : ""
    );
  };

  const handleBudgetDelete = async (budget) => {
    setError("");
    if (!userId) {
      setError("Please log in first.");
      return;
    }
    const id = budget.id || budget._id;
    if (!id) {
      setError("Budget id is missing.");
      return;
    }
    try {
      const response = await fetch(`/api/budgets/${id}?userId=${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete budget.");
      }
      setBudgets((prev) => prev.filter((b) => (b.id || b._id) !== id));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <section className="lb-insights-page">
      <header className="lb-insights-header">
        <div>
          <h2>Spending Insights</h2>
          <p className="lb-muted">
            Provides visual insights into spending patterns to help users
            understand and control expenses.
          </p>
        </div>
        <div className="lb-month-nav">
          <button
            className="lb-ghost"
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            aria-label="Previous month"
          >
            ◀
          </button>
          <span className="lb-month-label">{monthLabel}</span>
          <button
            className="lb-ghost"
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            aria-label="Next month"
          >
            ▶
          </button>
        </div>
      </header>

      <div className="lb-insights-kpis">
        <div className="lb-kpi-card">
          <span className="lb-muted">Total Spent (This Month)</span>
          <strong>{formatMoney(insights.totalSpent)}</strong>
          <span className="lb-muted lb-kpi-caption">
            Based on expense transactions
          </span>
        </div>
        <div className="lb-kpi-card">
          <span className="lb-muted">Top Category</span>
          <strong>
            {insights.topCategory ? insights.topCategory.category : "—"}
          </strong>
          <span className="lb-muted lb-kpi-caption">
            {insights.topCategory
              ? formatMoney(insights.topCategory.amount)
              : "No categories yet"}
          </span>
        </div>
        <div className="lb-kpi-card">
          <span className="lb-muted">Overspending Alerts</span>
          <strong>{insights.overspending.length}</strong>
          <span className="lb-muted lb-kpi-caption">
            Categories &gt; {(OVERSPEND_THRESHOLD * 100).toFixed(0)}% of spend
          </span>
        </div>
      </div>

      <div className="lb-insights-grid">
        <article className="lb-card lb-insight-card">
          <div className="lb-card-header">
            <h3>View Spending Charts</h3>
          </div>
          <p className="lb-muted">
            As a user, I want to view charts of my spending so I can understand
            where my money goes.
          </p>
          <div className="lb-insight-chart">
            {insights.monthlyTotals.map((item) => {
              const pct = item.total > 0 ? (item.total / maxMonthly) * 100 : 0;
              return (
                <div
                  key={item.label}
                  className="lb-chart-bar"
                  style={{ height: `${Math.max(pct, 6)}%` }}
                  title={formatMoney(item.total)}
                />
              );
            })}
            <div className="lb-chart-axis">
              {insights.monthlyTotals.map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="lb-card lb-insight-card">
          <div className="lb-card-header">
            <h3>Overspending Insight</h3>
          </div>
          <p className="lb-muted">
            As a user, I want to see overspending alerts so I can adjust my
            expenses early.
          </p>
          <div className="lb-alert-list">
            {loading ? (
              <div className="lb-alert-item">
                <span>Loading alerts...</span>
              </div>
            ) : !userId ? (
              <div className="lb-alert-item">
                <span>Log in to view alerts.</span>
              </div>
            ) : error ? (
              <div className="lb-alert-item">
                <span>{error}</span>
              </div>
            ) : insights.overspending.length === 0 ? (
              <div className="lb-alert-item">
                <span>No overspending alerts this month.</span>
                <span className="lb-muted">
                  You are within the category threshold.
                </span>
              </div>
            ) : (
              insights.overspending.map((item) => (
                <div key={item.category} className="lb-alert-item">
                  <span>
                    {item.category} is {Math.round(item.share * 100)}% of spend
                  </span>
                  <span className="lb-muted">
                    {formatMoney(item.amount)} this month
                  </span>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="lb-card lb-insight-card">
          <div className="lb-card-header">
            <h3>Category Breakdown</h3>
          </div>
          <p className="lb-muted">
            See which categories drive most of your spending.
          </p>
          <div className="lb-category-list">
            {loading ? (
              <div>
                <span>Loading categories...</span>
                <strong>—</strong>
              </div>
            ) : !userId ? (
              <div>
                <span>Log in to view categories</span>
                <strong>—</strong>
              </div>
            ) : insights.categoryList.length === 0 ? (
              <div>
                <span>No categories yet</span>
                <strong>—</strong>
              </div>
            ) : (
              insights.categoryList.map((item) => (
                <div key={item.category}>
                  <span>{item.category}</span>
                  <strong>{formatMoney(item.amount)}</strong>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="lb-card lb-insight-card">
          <div className="lb-card-header">
            <h3>Spending Goals</h3>
          </div>
          <p className="lb-muted">
            Set monthly spending limits to get proactive alerts.
          </p>
          <>
            <form className="lb-budget-form" onSubmit={handleBudgetSubmit}>
              <select
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {budgetCategory === "Other" ? (
                <input
                  placeholder="Custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              ) : null}
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Monthly limit"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
              />
              <button className="primary-button" type="submit">
                {editingBudget ? "Update" : "Add"}
              </button>
              {editingBudget ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={resetBudgetForm}
                >
                  Cancel
                </button>
              ) : null}
            </form>
            <div className="lb-budget-list">
              {loading ? (
                <div className="lb-budget-item">Loading budgets...</div>
              ) : !userId ? (
                <div className="lb-budget-item">Log in to manage budgets.</div>
              ) : insights.budgetsWithSpend.length === 0 ? (
                <div className="lb-budget-item">No budgets yet.</div>
              ) : (
                insights.budgetsWithSpend.map((budget) => (
                  <div key={budget.id || budget._id} className="lb-budget-item">
                    <div className="lb-budget-row">
                      <strong>{budget.category}</strong>
                      <span>
                        {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
                      </span>
                    </div>
                    <div className="lb-budget-progress">
                      <div
                        className="lb-budget-progress-bar"
                        style={{ width: `${Math.min(budget.pct, 100)}%` }}
                      />
                    </div>
                    <div className="lb-budget-actions">
                      <button
                        className="lb-link"
                        type="button"
                        onClick={() => handleBudgetEdit(budget)}
                      >
                        Edit
                      </button>
                      <button
                        className="lb-link lb-delete"
                        type="button"
                        onClick={() => handleBudgetDelete(budget)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        </article>
      </div>
    </section>
  );
}

export default InsightsPage;
