import { getUnits, saveHistory } from "./api.js";
import { convert } from "./conversion.js";

// ✅ state moved outside (fix scope issue)
const state = {
  type: "length",
  action: "Conversion",
  fromVal: null,
  fromUnit: "",
  toVal: null,
  toUnit: "",
  operator: "+"
};

document.addEventListener("DOMContentLoaded", async () => {
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

// ✅ attach all listeners
function attachEventListeners() {
  console.log("Listeners attached");

  // conversion triggers
  document.querySelector("#from-value")
    .addEventListener("input", performConversion);

  document.querySelector("#unit-from")
    .addEventListener("change", performConversion);

  document.querySelector("#unit-to")
    .addEventListener("change", performConversion);

  // ✅ action buttons (FIX)
  document.querySelector("#action-comparison")
    .addEventListener("click", () => setAction("Comparison"));

  document.querySelector("#action-conversion")
    .addEventListener("click", () => setAction("Conversion"));

  document.querySelector("#action-arithmetic")
    .addEventListener("click", () => setAction("Arithmetic"));
}

// ✅ handle action switching
function setAction(action) {
  state.action = action;

  // UI active toggle
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelector(`#action-${action.toLowerCase()}`)
    .classList.add("active");

  console.log("Action changed to:", action);

  // re-run logic immediately
  performConversion();
}

// load units (keeping your structure)
async function loadUnits(type) {
  console.log("Loading units for type:", type);

  const units = await getUnits(type);

  if (units.length === 0) {
    console.warn("No units found for type:", type);
  }

  console.log("Units from API:", units);
}

// not used yet
function toggleOperators(show) {
  console.log("Operator row visible?", show);
}

// not implemented yet
async function loadHistory() {
  console.log("Loading history...");
}

// ✅ MAIN LOGIC FIXED HERE
async function performConversion() {
  const fromVal = parseFloat(document.querySelector("#from-value").value);
  const fromUnit = document.querySelector("#unit-from").value;
  const toUnit = document.querySelector("#unit-to").value;

  if (isNaN(fromVal)) return;

  try {
    // ✅ ALWAYS convert (regardless of action)
    const result = await convert(fromVal, fromUnit, toUnit);

    document.querySelector(".value-display").textContent = result;

    // save history only for conversion (optional)
    if (state.action === "Conversion") {
      const record = {
        type: state.type,
        action: state.action,
        expression: `${fromVal} ${fromUnit} → ${toUnit}`,
        result,
        timestamp: new Date().toISOString()
      };

      await saveHistory(record);
    }

  } catch (error) {
    console.error("Operation failed:", error.message);
  }
}