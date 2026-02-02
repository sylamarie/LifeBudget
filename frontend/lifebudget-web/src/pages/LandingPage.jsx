import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="lb-landing">
      <header className="lb-landing-header">
        <div className="lb-landing-brand">
          <img src="/images/logo.svg" alt="LifeBudget" />
          <span>LifeBudget</span>
        </div>
        <nav className="lb-landing-nav">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a className="ghost" href="/login">Log In</a>
          <a className="primary" href="/login">Sign Up</a>
        </nav>
      </header>

      <section className="lb-hero">
        <div className="lb-hero-copy">
          <h1>Take control of your personal finances</h1>
          <p>
            Track your income, expenses, and savings in one calm, easy-to-use
            dashboard. Plan your budget, set goals, and manage your money with
            confidence.
          </p>
          <div className="lb-hero-actions">
            <a className="primary" href="/login">Get Started</a>
            <a className="ghost" href="#features">See how it works</a>
          </div>
        </div>
        <div className="lb-hero-visual">
          <div className="lb-hero-card">
            <div className="lb-hero-screen">
              <div className="lb-hero-topbar">
                <span>LifeBudget</span>
              </div>
              <div className="lb-hero-content">
                <div className="lb-hero-stat">
                  <span>Overall Balance</span>
                  <strong>$3,250.00</strong>
                </div>
                <div className="lb-hero-bars">
                  <div className="bar income" />
                  <div className="bar expense" />
                  <div className="bar income" />
                  <div className="bar expense" />
                </div>
                <div className="lb-hero-list">
                  <div>
                    <span>Groceries</span>
                    <strong>-$85</strong>
                  </div>
                  <div>
                    <span>Salary</span>
                    <strong>+$2,500</strong>
                  </div>
                  <div>
                    <span>Rent</span>
                    <strong>-$1,200</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="lb-hero-plant" aria-hidden="true" />
            <div className="lb-hero-coins" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="features" className="lb-section">
        <h2>Manage your budget with ease</h2>
        <p className="lb-section-subtitle">
          Track income, expenses, and savings in one easy-to-use experience.
        </p>
        <div className="lb-feature-grid">
          <article>
            <h3>Expense Tracking</h3>
            <p>Record updates, transactions, and dates in seconds.</p>
          </article>
          <article>
            <h3>Custom Budgets</h3>
            <p>Create budgets by category and keep spending on track.</p>
          </article>
          <article>
            <h3>Bill Reminders</h3>
            <p>Stay on top of due dates and avoid late fees.</p>
          </article>
          <article>
            <h3>Savings Goals</h3>
            <p>Set goals and monitor progress without the pressure.</p>
          </article>
        </div>
      </section>

      <section id="about" className="lb-section lb-split">
        <div className="lb-split-card">
          <div className="lb-hero-screen">
            <div className="lb-hero-topbar">
              <span>LifeBudget</span>
            </div>
            <div className="lb-hero-content">
              <div className="lb-hero-stat">
                <span>Monthly Summary</span>
                <strong>$3,250.00</strong>
              </div>
              <div className="lb-hero-list">
                <div>
                  <span>Income</span>
                  <strong>$5,200</strong>
                </div>
                <div>
                  <span>Expenses</span>
                  <strong>$1,950</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lb-split-copy">
          <h2>All your accounts in one place</h2>
          <p>
            Connect your accounts to LifeBudget and view your entire financial
            picture at a glance. Keep everything organized without the clutter.
          </p>
        </div>
      </section>

      <section id="contact" className="lb-cta">
        <h2>Ready to take control of your finances?</h2>
        <a className="primary" href="/login">Get Started</a>
      </section>

      <footer className="lb-landing-footer">
        <div className="lb-landing-brand">
          <img src="/images/logo.svg" alt="LifeBudget" />
          <span>LifeBudget</span>
        </div>
        <div className="lb-footer-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="lb-footer-legal">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
