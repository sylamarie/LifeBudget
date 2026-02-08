<<<<<<< HEAD
<<<<<<< HEAD
=======
import { useEffect, useMemo, useState } from "react";
>>>>>>> 99d44fb5208103262f75752423cf5962d8c3fdc1
import "./GoalsPage.css";
import "../components/DashboardShell.css";

const PIE_COLORS = ["groceries", "housing", "dining", "entertainment", "transportation", "other"];

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const userId = localStorage.getItem("lifebudgetUserId") || "";

  useEffect(() => {
    if (!userId) {
      setGoals([]);
      return;
    }

    const loadGoals = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/goals?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to load goals.");
        }
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [userId]);

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
    setEditingGoal(null);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setName(goal.name || "");
    setTargetAmount(
      goal.targetAmount !== undefined && goal.targetAmount !== null
        ? String(goal.targetAmount)
        : ""
    );
    setCurrentAmount(
      goal.currentAmount !== undefined && goal.currentAmount !== null
        ? String(goal.currentAmount)
        : ""
    );
    if (goal.targetDateUtc || goal.targetDate) {
      const raw = goal.targetDateUtc || goal.targetDate;
      const date = new Date(raw);
      if (!Number.isNaN(date.getTime())) {
        setTargetDate(date.toISOString().slice(0, 10));
      } else {
        setTargetDate("");
      }
    } else {
      setTargetDate("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Please log in first.");
      return;
    }

    const payload = {
      userId,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      targetDateUtc: targetDate ? new Date(targetDate).toISOString() : null,
    };

    const isEdit = Boolean(editingGoal);
    const endpoint = isEdit
      ? `/api/goals/${editingGoal.id || editingGoal._id}`
      : "/api/goals";

    try {
      const response = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(isEdit ? "Failed to update goal." : "Failed to create goal.");
      }

      const saved = await response.json();
      if (isEdit) {
        setGoals((prev) =>
          prev.map((g) =>
            (g.id || g._id) === (saved.id || saved._id) ? saved : g
          )
        );
      } else {
        setGoals((prev) => [saved, ...prev]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const handleDelete = async (goal) => {
    setError("");
    if (!userId) {
      setError("Please log in first.");
      return;
    }

    const id = goal.id || goal._id;
    if (!id) {
      setError("Goal id is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/goals/${id}?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal.");
      }

      setGoals((prev) => prev.filter((g) => (g.id || g._id) !== id));
      if (editingGoal && (editingGoal.id || editingGoal._id) === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  const { totalSaved, totalTarget, completionPercent } = useMemo(() => {
    if (!goals.length) {
      return { totalSaved: 0, totalTarget: 0, completionPercent: 0 };
    }
    const target = goals.reduce(
      (sum, g) => sum + Number(g.targetAmount || 0),
      0
    );
    const current = goals.reduce(
      (sum, g) => sum + Number(g.currentAmount || 0),
      0
    );
    const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return {
      totalSaved: current,
      totalTarget: target,
      completionPercent: Math.round(pct),
    };
  }, [goals]);

  const formatMoney = (value) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const goalsForLegend = goals.slice(0, PIE_COLORS.length);

  return (
    <section className="lb-card">
      <div className="lb-card-header">
        <div>
          <h2>Savings Goals</h2>
          <p className="lb-muted">
            Track your savings targets and monitor progress over time.
          </p>
        </div>
        <div className="lb-goals-controls">
          <span className="lb-control-pill">All goals</span>
          <span className="lb-control-pill">
            {goals.length ? `${goals.length} goal${goals.length > 1 ? "s" : ""}` : "No goals yet"}
          </span>
        </div>
      </div>

      {error ? <p className="lb-empty">{error}</p> : null}

      <form className="lb-goal-form" onSubmit={handleSubmit}>
        <input
          placeholder="Goal name (e.g., Emergency Fund)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Current amount"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
        <button type="submit" className="primary-button">
          {editingGoal ? "Update Goal" : "Add Goal"}
        </button>
        {editingGoal ? (
          <button
            type="button"
            className="secondary-button"
            onClick={resetForm}
          >
            Cancel
          </button>
        ) : null}
      </form>

      <div className="lb-goals-summary">
        <span className="lb-muted">Total Saved</span>
        <span className="lb-pill">
          {formatMoney(totalSaved)}{" "}
          {totalTarget > 0 ? `of ${formatMoney(totalTarget)}` : ""}
        </span>
      </div>

      {loading ? (
        <div className="lb-empty-panel">
          <p className="lb-empty">Loading goals...</p>
        </div>
      ) : !userId ? (
        <div className="lb-empty-panel">
          <p className="lb-empty">Please log in to manage your goals.</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="lb-empty-panel">
          <p className="lb-empty">
            No goals yet. Add your first savings goal above.
          </p>
        </div>
      ) : (
        <div className="lb-goals-grid">
          {goals.map((goal) => {
            const key = goal.id || goal._id || goal.name;
            const target = Number(goal.targetAmount || 0);
            const current = Number(goal.currentAmount || 0);
            const pct =
              target > 0 ? Math.min((current / target) * 100, 100) : 0;
            return (
              <div key={key} className="lb-goal-card">
                <div className="lb-goal-header">
                  <strong>{goal.name}</strong>
                  <span className="lb-muted">
                    {formatMoney(current)} of {formatMoney(target)}
                  </span>
                </div>
                <div className="lb-progress">
                  <div
                    className="lb-progress-bar"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="lb-muted">{Math.round(pct)}% complete</span>
                <div className="lb-goal-actions">
                  <button
                    className="lb-link"
                    type="button"
                    onClick={() => handleEdit(goal)}
                  >
                    Edit
                  </button>
                  <button
                    className="lb-link lb-delete"
                    type="button"
                    onClick={() => handleDelete(goal)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="lb-goals-lower">
        <div className="lb-goals-chart">
          <div className="lb-pie-chart">
            <div className="lb-pie-center">
              <span className="lb-pie-value">{completionPercent}%</span>
              <span className="lb-pie-sub">Overall</span>
            </div>
          </div>
          <div className="lb-pie-legend">
            {goalsForLegend.length === 0 ? (
              <p className="lb-empty">Add goals to see breakdown.</p>
            ) : (
              goalsForLegend.map((goal, index) => (
                <div key={goal.id || goal._id || goal.name}>
                  <span
                    className={`lb-dot-label ${PIE_COLORS[index]}`}
                  />
                  <span>{goal.name}</span>
                  <span className="lb-legend-amount">
                    {formatMoney(Number(goal.currentAmount || 0))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lb-goals-alerts">
          <h3>Smart Tips</h3>
          <div className="lb-empty-panel">
            <p className="lb-empty">
              Try setting smaller milestones for long-term goals.
            </p>
          </div>
          <div className="lb-empty-panel">
            <p className="lb-empty">
              Consider adding a monthly transfer to keep progress steady.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
<<<<<<< HEAD
=======
function GoalsPage() {
  return <p className="lb-empty">This is the goals page.</p>;
>>>>>>> feature/frontend-docs
=======
>>>>>>> 99d44fb5208103262f75752423cf5962d8c3fdc1
}

export default GoalsPage;
