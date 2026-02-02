import DashboardShell from "./components/DashboardShell";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import TransactionsPage from "./pages/TransactionsPage";
import BillsPage from "./pages/BillsPage";
import GoalsPage from "./pages/GoalsPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/theme.css";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<DashboardShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
