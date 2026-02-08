import { useState } from "react";

function BillForm({ onAdd }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onAdd({
      name,
      amount: Number(amount),
      dueDay: Number(dueDay),
      status: "upcoming",
      isRecurring,
    });

    setName("");
    setAmount("");
    setDueDay("");
    setIsRecurring(false);
  };

  return (
    <form className="bill-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="billName">Bill Name</label>
        <input
          id="billName"
          type="text"
          placeholder="e.g., Electric Bill, Netflix"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDay">Due Day of Month</label>
        <input
          id="dueDay"
          type="number"
          min="1"
          max="31"
          placeholder="e.g., 15"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          required
        />
        <small style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
          Enter a day between 1-31
        </small>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <span>Recurring bill</span>
        </label>
        <small style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px', display: 'block', marginLeft: '28px' }}>
          Check if this bill repeats every month
        </small>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit">
          Add Bill
        </button>
      </div>
    </form>
  );
}

export default BillForm;