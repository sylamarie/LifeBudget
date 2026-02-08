const API_URL = "http://localhost:5272/api/Bills";

export async function getBills(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch bills");
  return res.json();
}

export async function createBill(bill) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  });
  
  if (!res.ok) throw new Error("Failed to create bill");
  
  if (res.status === 204) {
    return null;
  }
  
  return res.json();
}

export async function deleteBill(id, userId) {
  const res = await fetch(`${API_URL}/${id}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete bill");
}
