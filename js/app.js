import { getUnits, saveHistory, getHistory } from "./api.js";
import { convert } from "./conversion.js";

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

    // ✅ IMPORTANT: trigger first conversion so history is created
    await performConversion();

  } catch (error) {
    console.error(error);
    alert("Server unavailable");
  }
});

// attach all listeners
function attachEventListeners() {
  console.log("Listeners attached");

  document.querySelector("#from-value")
    .addEventListener("input", performConversion);

  document.querySelector("#unit-from")
    .addEventListener("change", performConversion);

  document.querySelector("#unit-to")
    .addEventListener("change", performConversion);

  document.querySelector("#action-comparison")
    .addEventListener("click", () => setAction("Comparison"));

  document.querySelector("#action-conversion")
    .addEventListener("click", () => setAction("Conversion"));

  document.querySelector("#action-arithmetic")
    .addEventListener("click", () => setAction("Arithmetic"));
}

// handle action switching
function setAction(action) {
  state.action = action;

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelector(`#action-${action.toLowerCase()}`)
    .classList.add("active");

  console.log("Action changed to:", action);

  performConversion();
}

// load units
async function loadUnits(type) {
  console.log("Loading units for type:", type);

  const units = await getUnits(type);

  if (units.length === 0) {
    console.warn("No units found for type:", type);
  }

  console.log("Units from API:", units);
}

// placeholder
function toggleOperators(show) {
  console.log("Operator row visible?", show);
}

// load history
async function loadHistory() {
  console.log("Loading history...");

  const history = await getHistory();

  if (!history.length) {
    console.log("No history yet");
    return;
  }

  console.log("History:", history);
}

// MAIN LOGIC
async function performConversion() {
  const fromVal = parseFloat(document.querySelector("#from-value").value);
  const fromUnit = document.querySelector("#unit-from").value;
  const toUnit = document.querySelector("#unit-to").value;

  if (isNaN(fromVal)) return;

  try {
    const result = await convert(fromVal, fromUnit, toUnit);

    // ✅ prevent saving invalid results
    if (result === null) return;

    document.querySelector(".value-display").textContent = result;

    // save history
    if (state.action === "Conversion" || state.action === "Comparison") {
      const record = {
        type: state.type,
        action: state.action,
        expression: `${fromVal} ${fromUnit} → ${toUnit}`,
        result,
        timestamp: new Date().toISOString()
      };

      console.log("Saving record:", record);

      await saveHistory(record);
      setTimeout(loadHistory, 200);
      await getHistory();
    }

  } catch (error) {
    console.error("Operation failed:", error.message);
  }
}