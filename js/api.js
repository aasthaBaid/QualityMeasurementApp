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