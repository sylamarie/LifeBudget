import { useState } from "react";

function BillForm({ onAdd }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onAdd({
      id: Date.now(),
      name,
      amount: Number(amount),
      dueDate,
      frequency: "monthly",
      status: "upcoming",
    });


    setName("");
    setAmount("");
    setDueDate("");
  };

  return (
    <form className="bill-form" onSubmit={handleSubmit}>
      <input
        placeholder="Bill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />

      <button type="submit">Add Bill</button>
    </form>
  );
}

export default BillForm;
