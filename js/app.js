import { getUnits } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const state = {
    type: "length",
    action: "Conversion",
    fromVal: null,
    fromUnit: "",
    toVal: null,
    toUnit: "",
    operator: "+"
  };

  console.log("App Initialized");

  try {
    attachEventListeners();
    await loadUnits(state.type);
    toggleOperators(false);
    await loadHistory();
  } catch (error) {
    console.error(error);
    alert("Server unavailable");
  }
});

function attachEventListeners() {
  console.log("Listeners attached");
  // add click handlers for type cards, action buttons here later
}

async function loadUnits(type) {
  console.log("Loading units for type:", type);

  const units = await getUnits(type);

  if (units.length === 0) {
    console.warn("No units found for type:", type);
  }

  console.log("Units from API:", units);

  // later: populate FROM and TO dropdowns
}

function toggleOperators(show) {
  console.log("Operator row visible?", show);
}

async function loadHistory() {
  console.log("Loading history...");
  // later: fetch history from API
}