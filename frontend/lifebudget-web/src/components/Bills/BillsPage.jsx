import { useState } from "react";
import BillsHeader from "./BillsHeader";
import BillsFilters from "./BillsFilters";
import BillsSummary from "./BillsSummary";
import BillsTable from "./BillsTable";
import BillsModal from "./BillsModal";
import "./bills.css";

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);

  const addBill = (bill) => {
    setBills([...bills, bill]);
    setShowModal(false);
  };

  const filteredBills = bills.filter((bill) => {
    if (filter === "all") return true;
    if (filter === "paid") return bill.status === "paid";
    if (filter === "upcoming") return bill.status === "upcoming";
    if (filter === "recurring") return bill.frequency !== "one-time";
    return true;
  });

  return (
    <div className="bills-page">
      < div className="bills-card">
            <BillsHeader onAdd={() => setShowModal(true)} />
            <BillsFilters active={filter} onChange={setFilter} />
            <BillsSummary bills={bills} />
            <BillsTable bills={filteredBills} />
        </div>
      {showModal && <BillsModal onClose={() => setShowModal(false)} onAdd={addBill} />}
    </div>
  );
}

export default BillsPage;

