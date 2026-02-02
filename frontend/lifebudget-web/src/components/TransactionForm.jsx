import { useEffect, useState } from "react";
import "./TransactionForm.css";

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

function TransactionForm({ onSubmit, initialValues, submitLabel, onCancel }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");
  const [customCategory, setCustomCategory] = useState("");
  const [type, setType] = useState("expense");

  useEffect(() => {
    if (!initialValues) {
      setDescription("");
      setAmount("");
      setCategory("Other");
      setCustomCategory("");
      setType("expense");
      return;
    }

    setDescription(initialValues.description || "");
    setAmount(
      initialValues.amount !== undefined && initialValues.amount !== null
        ? String(initialValues.amount)
        : ""
    );

    const incomingCategory = initialValues.category || "Other";
    if (CATEGORY_OPTIONS.includes(incomingCategory)) {
      setCategory(incomingCategory);
      setCustomCategory("");
    } else {
      setCategory("Other");
      setCustomCategory(incomingCategory);
    }

    setType(initialValues.type || "expense");
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const resolvedCategory =
      category === "Other" ? customCategory.trim() : category;

    onSubmit({
      id: initialValues?.id || initialValues?._id || Date.now(),
      description,
      amount: Number(amount),
      type,
      category: resolvedCategory,
      date: new Date().toISOString(),
    });

    if (!initialValues) {
      setDescription("");
      setAmount("");
      setCategory("Other");
      setCustomCategory("");
      setType("expense");
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {category === "Other" ? (
        <input
          placeholder="Custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      ) : null}

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button type="submit" className="primary-button">
        {submitLabel || "Add Transaction"}
      </button>
      {onCancel ? (
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </form>
  );
}

export default TransactionForm;
