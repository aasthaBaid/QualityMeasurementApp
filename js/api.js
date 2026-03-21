const BASE_URL = "http://localhost:5000";

// Fetch units by type
export async function getUnits(type) {
  try {
    const res = await fetch(`http://localhost:5000/units?type=${type}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching units:", error.message);
    return [];
  }
}

export async function getConversion(from, to) {
  if (from === to) {
    // same unit: factor 1, no formula needed
    return { from, to, factor: 1, formula: null };
  }

  try {
    const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.length) throw new Error("Conversion not available for this pair");

    return data[0];
  } catch (error) {
    console.error("Error fetching conversion:", error.message);
    throw error; // caller can show message in UI
  }
}