import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./DashboardShell.css";

const navItems = [
  { label: "Dashboard", to: "/app", icon: "/images/dashboard.svg" },
  { label: "Transactions", to: "/app/transactions", icon: "/images/transactions.svg" },
  { label: "Bills", to: "/app/bills", icon: "/images/bills.svg" },
  { label: "Goals", to: "/app/goals", icon: "/images/goals.svg" },
  { label: "Insights", to: "/app/insights", icon: "/images/insights.svg" },
  { label: "Logout", action: "logout", icon: "/images/logout.svg" },
];

const headerCopy = {
  "/app": { kicker: "Dashboard", title: "Welcome!" },
  "/app/transactions": { kicker: "Transactions", title: "Transactions" },
  "/app/bills": { kicker: "Bills", title: "Bills" },
  "/app/goals": { kicker: "Goals", title: "Goals" },
  "/app/insights": { kicker: "Insights", title: "Insights" },
};

function DashboardShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const copy = headerCopy[location.pathname] || headerCopy["/"];
  const showMonthButton = location.pathname === "/app";
  const displayName =
    localStorage.getItem("lifebudgetName") ||
    localStorage.getItem("lifebudgetEmail") ||
    "Account";
  const storedName = localStorage.getItem("lifebudgetName") || "";
  const email = localStorage.getItem("lifebudgetEmail") || "";
  const firstNameFromName = storedName.trim().split(/\s+/)[0] || "";
  const firstNameFromEmail = email.split("@")[0] || "";
  const firstName = firstNameFromName || firstNameFromEmail;
  const pageTitle =
    location.pathname === "/app" && firstName
      ? `Welcome, ${firstName}!`
      : copy.title;

  const handleLogout = () => {
    localStorage.removeItem("lifebudgetUserId");
    localStorage.removeItem("lifebudgetEmail");
    localStorage.removeItem("lifebudgetName");
    navigate("/login");
  };

  const selectedMonthDate = new Date();
  selectedMonthDate.setDate(1);
  selectedMonthDate.setMonth(selectedMonthDate.getMonth() + monthOffset);
  const monthLabel = selectedMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="lb-app">
      <header className="lb-topbar">
        <div className="lb-brand">
          <button
            className="lb-icon-btn lb-hamburger"
            type="button"
            aria-label="Open navigation"
            onClick={() => setShowNav(true)}
          >
            <span className="lb-hamburger-lines" aria-hidden="true" />
          </button>
          <img className="lb-logo-image" src="/images/logo.svg" alt="LifeBudget" />
          <span className="lb-brand-text">LifeBudget</span>
        </div>
        <div className="lb-top-actions">
          <button
            className="lb-icon-btn"
            type="button"
            aria-label="Profile"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            <img className="lb-profile-image" src="/images/profile.svg" alt="Profile" />
            <span className="lb-icon" aria-hidden="true"></span>
          </button>
        </div>
        {showProfile ? (
          <div className="lb-profile-card">
            <span className="lb-profile-name">{displayName}</span>
          </div>
        ) : null}
      </header>

      <div className="lb-body">
        <aside className={`lb-sidebar ${showNav ? "open" : ""}`}>
          <div className="lb-sidebar-inner">
            {navItems.map((item) => {
              if (item.action === "logout") {
                return (
                  <button
                    key={item.label}
                    className="lb-nav-item lb-logout"
                    type="button"
                    onClick={() => {
                      setShowNav(false);
                      handleLogout();
                    }}
                  >
                    <span className="lb-nav-icon" aria-hidden="true">
                      {item.icon ? (
                        <img
                          className="lb-nav-icon-image"
                          src={item.icon}
                          alt=""
                        />
                      ) : null}
                    </span>
                    <span className="lb-nav-label">{item.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/app"}
                  className={({ isActive }) =>
                    `lb-nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => setShowNav(false)}
                >
                  <span className="lb-nav-icon" aria-hidden="true">
                    {item.icon ? (
                      <img
                        className="lb-nav-icon-image"
                        src={item.icon}
                        alt=""
                      />
                    ) : null}
                  </span>
                  <span className="lb-nav-label">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>
        {showNav ? (
          <button
            className="lb-nav-backdrop"
            type="button"
            aria-label="Close navigation"
            onClick={() => setShowNav(false)}
          />
        ) : null}

        <main className="lb-main">
          <div className="lb-main-header">
            <div>
              <p className="lb-kicker">{copy.kicker}</p>
              <h1>{pageTitle}</h1>
            </div>
            {showMonthButton ? (
              <div className="lb-month-nav" role="group" aria-label="Month navigation">
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
            ) : null}
          </div>

          <Outlet context={{ monthOffset, monthLabel }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
