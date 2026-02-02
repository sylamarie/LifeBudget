import { useState } from "react";
import "./TransactionForm.css";

function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      date: new Date().toISOString(),
    });

    setDescription("");
    setAmount("");
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

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button type="submit" className="primary-button">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;
