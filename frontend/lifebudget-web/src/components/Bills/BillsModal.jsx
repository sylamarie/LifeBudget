import BillForm from "./BillForm";

function BillsModal({ onClose, onAdd }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header>
          <h2>Add Bill</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <BillForm onAdd={onAdd} />
      </div>
    </div>
  );
}

export default BillsModal;
