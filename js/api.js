export const BASE_URL = "http://localhost:5000";

export async function getUnits(type) {
  try {
    const res = await fetch(`${BASE_URL}/units?type=${type}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching units:", err);
    return [];
  }
}

export async function getConversion(from, to) {
  if (from === to) return { from, to, factor: 1, formula: null };

  try {
    const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.length) throw new Error("Conversion not available for this pair");
    return data[0];
  } catch (err) {
    console.error("Error fetching conversion:", err);
    throw err;
  }
}

export async function saveHistory(record) {
  try {
    const res = await fetch(`${BASE_URL}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record)
    });
    console.log("POST status:", res.status);
    return await res.json();
  } catch (err) {
    console.error("Error saving history:", err);
  }
}

export async function getHistory() {
  try {
    const res = await fetch(
      `${BASE_URL}/history`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching history:", err);
    return [];
  }
}