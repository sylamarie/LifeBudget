function BillRow({ bill }) {
  // Calcular la próxima fecha de vencimiento basada en dueDay
  const getDueDate = (dueDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, currentMonth, dueDay);
    
    // Si ya pasó este mes, mostrar el próximo mes
    if (dueDate < today) {
      dueDate.setMonth(currentMonth + 1);
    }
    
    return dueDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <tr>
      <td>{bill.name}</td>
      <td>{getDueDate(bill.dueDay)}</td>
      <td>${bill.amount.toFixed(2)}</td>
      <td>{bill.isRecurring ? 'Monthly' : 'One-time'}</td>
      <td>
        <span className={`status ${bill.status}`}>
          {bill.status}
        </span>
      </td>
    </tr>
  );
}

export default BillRow;