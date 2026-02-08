import { useEffect, useState } from "react";
import BillsHeader from "./BillsHeader";
import BillsFilters from "./BillsFilters";
import BillsSummary from "./BillsSummary";
import BillsTable from "./BillsTable";
import BillsModal from "./BillsModal";
import { getBills, createBill } from "./services/billsApi";
import "./Bills.css"; 

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("lifebudgetUserId");

  useEffect(() => {
    if (!userId) return;

    getBills(userId)
      .then(setBills)
      .catch(console.error);
  }, [userId]);

  const addBill = async (bill) => {
  try {
    await createBill({
      ...bill,
      userId,
    });
    
    const updatedBills = await getBills(userId);
    setBills(updatedBills);
    setShowModal(false);
  } catch (error) {
    console.error("Error adding bill:", error);
    alert("Error al agregar el bill");
  }
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
      <BillsHeader onAdd={() => setShowModal(true)} />
      <BillsFilters active={filter} onChange={setFilter} />
      <BillsSummary bills={bills} />
      <BillsTable bills={filteredBills} />
      {showModal && (
        <BillsModal
          onClose={() => setShowModal(false)}
          onAdd={addBill}
        />
      )}
    </div>
  );
}

export default BillsPage;
