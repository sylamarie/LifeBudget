import BillForm from "./BillForm";

function BillsModal({ onClose, onSubmit, initialValues, title, submitLabel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <header>
          <h2>{title || "Add Bill"}</h2>
          <button onClick={onClose} aria-label="Close">×</button>
        </header>
        <BillForm
          onSubmit={onSubmit}
          initialValues={initialValues}
          submitLabel={submitLabel}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default BillsModal;
