import "./GoalsPage.css";
import "../components/DashboardShell.css";

function GoalsPage() {
  return (
    <section className="lb-card">
      <div className="lb-card-header">
        <div>
          <h2>Savings Goals</h2>
          {/* TODO (copy): add helper text (e.g., "Track progress toward savings goals"). */}
        </div>
        {/* TODO (controls): replace these pills with a real month/year selector and view toggle state. */}
        <div className="lb-goals-controls">
          <span className="lb-control-pill">Month</span>
          <span className="lb-control-pill">View</span>
          <button className="primary-button" type="button" disabled>
            Goals
          </button>
        </div>
      </div>

      {/* TODO (summary): compute total saved across all goals and display here. */}
      <div className="lb-goals-summary">
        <span className="lb-muted">Total Saved</span>
        <span className="lb-pill">--</span>
      </div>

      {/* TODO (cards): map over goals[] and render one card per goal. */}
      <div className="lb-goals-grid">
        <div className="lb-goal-card">
          {/* TODO (card): show goal name + target amount (e.g., "Vacation Fund — $3,000"). */}
          <p className="lb-muted">Goal placeholder</p>
          {/* TODO (card): progress bar based on saved/target percentage. */}
          <div className="lb-empty-panel">Progress</div>
          {/* TODO (card): Edit button should open edit form for this goal. */}
          <button className="lb-link" type="button" disabled>
            Edit
          </button>
        </div>
        <div className="lb-goal-card">
          {/* TODO (card): duplicate structure when mapping real data. */}
          <p className="lb-muted">Goal placeholder</p>
          <div className="lb-empty-panel">Progress</div>
          <button className="lb-link" type="button" disabled>
            Edit
          </button>
        </div>
        <div className="lb-goal-card">
          {/* TODO (card): duplicate structure when mapping real data. */}
          <p className="lb-muted">Goal placeholder</p>
          <div className="lb-empty-panel">Progress</div>
          <button className="lb-link" type="button" disabled>
            Edit
          </button>
        </div>
      </div>

      <div className="lb-goals-lower">
        {/* TODO (chart): implement a pie chart with center % and a legend list like the mockup. */}
        <div className="lb-goals-chart">
          <div className="lb-pie-chart">
            <div className="lb-pie-center">
              <span className="lb-pie-value">28%</span>
              <span className="lb-pie-sub">2026</span>
            </div>
          </div>
          <div className="lb-pie-legend">
            {/* TODO (legend): map categories + amounts from data */}
            <div>
              <span className="lb-dot-label groceries" />
              <span>Groceries</span>
              <span className="lb-legend-amount">$420.00</span>
            </div>
            <div>
              <span className="lb-dot-label housing" />
              <span>Housing</span>
              <span className="lb-legend-amount">$200.00</span>
            </div>
            <div>
              <span className="lb-dot-label dining" />
              <span>Dining</span>
              <span className="lb-legend-amount">$250.00</span>
            </div>
            <div>
              <span className="lb-dot-label entertainment" />
              <span>Entertainment</span>
              <span className="lb-legend-amount">$100.00</span>
            </div>
            <div>
              <span className="lb-dot-label transportation" />
              <span>Transportation</span>
              <span className="lb-legend-amount">$120.00</span>
            </div>
            <div>
              <span className="lb-dot-label other" />
              <span>Other</span>
              <span className="lb-legend-amount">$150.00</span>
            </div>
          </div>
        </div>

        {/* TODO (alerts): add toggles for overspending / goal reminders. */}
        <div className="lb-goals-alerts">
          <h3>Smart Alerts</h3>
          <div className="lb-empty-panel">Alert toggle placeholder</div>
          <div className="lb-empty-panel">Alert toggle placeholder</div>
          {/* TODO (action): "View Budget" should navigate to budget page. */}
          <button className="primary-button" type="button" disabled>
            View Budget
          </button>
        </div>
      </div>
    </section>
  );
}

export default GoalsPage;
