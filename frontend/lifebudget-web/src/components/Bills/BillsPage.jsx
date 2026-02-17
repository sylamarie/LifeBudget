import { useEffect, useMemo, useState } from "react";
import BillsHeader from "./BillsHeader";
import BillsFilters from "./BillsFilters";
import BillsSummary from "./BillsSummary";
import BillsTable from "./BillsTable";
import BillsModal from "./BillsModal";
import { getBills, createBill, updateBillStatus, updateBill, deleteBill } from "./services/billsApi";
import "../../pages/BillsPage.css";

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("lifebudgetUserId");

  useEffect(() => {
    if (!userId) return;

    const loadBills = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getBills(userId);
        setBills(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load bills.");
      } finally {
        setLoading(false);
      }
    };

    loadBills();
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

  const saveBill = async (bill) => {
    if (!userId) return;
    if (!editingBill) {
      await addBill(bill);
      return;
    }

    try {
      const updated = await updateBill(editingBill.id || editingBill._id || editingBill.Id, {
        ...bill,
        userId,
      });
      setBills((prev) =>
        prev.map((b) => {
          const currentId = b.id || b._id || b.Id;
          const updatedId = updated.id || updated._id || updated.Id;
          return currentId === updatedId ? updated : b;
        })
      );
      setEditingBill(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating bill:", error);
      setError(error.message || "Unable to update bill.");
    }
  };

  const handleDeleteBill = async (bill) => {
    if (!userId) return;
    const billId = bill.id || bill._id || bill.Id;
    if (!billId) {
      setError("Unable to delete bill (missing id).");
      return;
    }
    try {
      await deleteBill(billId, userId);
      setBills((prev) => prev.filter((b) => (b.id || b._id || b.Id) !== billId));
    } catch (error) {
      console.error("Error deleting bill:", error);
      setError(error.message || "Unable to delete bill.");
    }
  };

  const toggleBillStatus = async (bill) => {
    if (!userId) return;
    const currentStatus = getEffectiveStatus(bill);
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    const billId = bill.id || bill._id || bill.Id;

    if (!billId) {
      setError("Unable to update bill status (missing id).");
      return;
    }

    const transitionMs = 3000;
    const transitionUntil = Date.now() + transitionMs;
    const transitionMode = nextStatus === "paid" ? "toPaid" : "toUnpaid";

    setBills((prev) =>
      prev.map((b) => {
        const currentId = b.id || b._id || b.Id;
        return currentId === billId
          ? {
              ...b,
              status: nextStatus,
              statusTransitionUntil: transitionUntil,
              statusTransitionMode: transitionMode,
            }
          : b;
      })
    );

    try {
      const updated = await updateBillStatus(billId, userId, nextStatus);
      if (updated) {
        setBills((prev) =>
          prev.map((b) => {
            const currentId = b.id || b._id || b.Id;
            const updatedId = updated.id || updated._id || updated.Id;
            return currentId === updatedId
              ? {
                  ...updated,
                  statusTransitionUntil: transitionUntil,
                  statusTransitionMode: transitionMode,
                }
              : b;
          })
        );
      } else {
        setBills((prev) =>
          prev.map((b) => {
            const currentId = b.id || b._id || b.Id;
            return currentId === billId
              ? {
                  ...b,
                  status: nextStatus,
                  statusTransitionUntil: transitionUntil,
                  statusTransitionMode: transitionMode,
                }
              : b;
          })
        );
      }
      if (transitionUntil) {
        setTimeout(() => {
          setBills((prev) =>
            prev.map((b) => {
              const currentId = b.id || b._id || b.Id;
              return currentId === billId
                ? { ...b, statusTransitionUntil: 0, statusTransitionMode: "" }
                : b;
            })
          );
        }, transitionMs);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to update bill status.");
      setBills((prev) =>
        prev.map((b) => {
          const currentId = b.id || b._id || b.Id;
          return currentId === billId
            ? { ...b, status: currentStatus, statusTransitionUntil: 0, statusTransitionMode: "" }
            : b;
        })
      );
    }
  };

  const getNextDueDate = (bill) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDay = Number(bill.dueDay || 1);
    const dueDate = new Date(currentYear, currentMonth, dueDay);
    if (dueDate < today) {
      dueDate.setMonth(currentMonth + 1);
    }
    return dueDate;
  };

  const getEffectiveStatus = (bill) => {
    const rawStatus = (bill.status || "unpaid").toLowerCase();
    const normalizedStatus = rawStatus === "upcoming" ? "unpaid" : rawStatus;
    if (!bill.isRecurring) return normalizedStatus;
    if (!bill.lastPaidUtc) return "unpaid";
    const lastPaid = new Date(bill.lastPaidUtc);
    if (Number.isNaN(lastPaid.getTime())) return "unpaid";
    const now = new Date();
    const sameMonth =
      lastPaid.getFullYear() === now.getFullYear() &&
      lastPaid.getMonth() === now.getMonth();
    return sameMonth ? "paid" : "unpaid";
  };

  const filteredBills = useMemo(() => {
    const normalized = bills.map((bill) => {
      const normalizedStatus = getEffectiveStatus(bill);
      return {
        ...bill,
        status: normalizedStatus,
      };
    });

    const now = Date.now();
    const base = normalized.filter((bill) => {
      if (filter === "all") return true;
      if (filter === "upcoming") {
        if (bill.status === "unpaid") return true;
        return (
          bill.status === "paid" &&
          bill.statusTransitionMode === "toPaid" &&
          bill.statusTransitionUntil > now
        );
      }
      if (filter === "paid") {
        if (bill.status === "paid") return true;
        return (
          bill.status === "unpaid" &&
          bill.statusTransitionMode === "toUnpaid" &&
          bill.statusTransitionUntil > now
        );
      }
      if (filter === "recurring") return bill.isRecurring || bill.frequency === "Monthly";
      return true;
    });

    return base.sort((a, b) => getNextDueDate(a) - getNextDueDate(b));
  }, [bills, filter]);

  return (
    <div className="bills-page">
      <section className="lb-card bills-card">
        <div className="lb-card-header">
          <BillsHeader
            onAdd={() => {
              setEditingBill(null);
              setShowModal(true);
            }}
          />
        </div>
        <BillsFilters active={filter} onChange={setFilter} />
        <BillsSummary bills={bills} />
        {error ? <p className="bills-error">{error}</p> : null}
        {loading ? (
          <div className="bills-loading">Loading bills...</div>
        ) : (
          <BillsTable
            bills={filteredBills}
            onToggleStatus={toggleBillStatus}
            onEdit={(bill) => {
              setEditingBill(bill);
              setShowModal(true);
            }}
            onDelete={handleDeleteBill}
            showActions={filter === "all"}
            showToggle={filter !== "recurring" && filter !== "all"}
          />
        )}
      </section>
      {showModal && (
        <BillsModal
          onClose={() => {
            setShowModal(false);
            setEditingBill(null);
          }}
          onSubmit={saveBill}
          initialValues={editingBill}
          title={editingBill ? "Edit Bill" : "Add Bill"}
          submitLabel={editingBill ? "Save Changes" : "Add Bill"}
        />
      )}
    </div>
  );
}

export default BillsPage;
