const API_URL = "/api/Bills";

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

export async function updateBillStatus(id, userId, status) {
  const primaryUrl = `${API_URL}/${id}/status`;

  const payload = JSON.stringify({ userId, status });

  let res = await fetch(primaryUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });

  if (res.status === 405) {
    res = await fetch(primaryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
  }

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
    const suffix = detail ? ` (${detail})` : "";
    throw new Error(`Failed to update bill status [${res.status}]${suffix}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function updateBill(id, bill) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bill),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      detail = "";
    }
    const suffix = detail ? ` (${detail})` : "";
    throw new Error(`Failed to update bill${suffix}`);
  }

  return res.json();
}
