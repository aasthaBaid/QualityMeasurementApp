import { getUnits, saveHistory, getHistory } from "./api.js";
import { convert } from "./conversion.js";

const state = {
  type: "length",
  action: "Conversion"
};

document.addEventListener("DOMContentLoaded", async () => {
  console.log("App Initialized");

  try {
    attachEventListeners();
    await loadUnits(state.type);
    toggleOperators(false);
    await loadHistory();

    // run once on load
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

// switch between actions
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

// load units (no UI binding yet)
async function loadUnits(type) {
  console.log("Loading units for type:", type);

  const units = await getUnits(type);

  if (!units.length) {
    console.warn("No units found");
  }

  console.log("Units from API:", units);
}

// placeholder
function toggleOperators(show) {
  console.log("Operator row visible?", show);
}

// fetch and log history
async function loadHistory() {
  console.log("Loading history...");

  const history = await getHistory();

  if (!history.length) {
    console.log("No history yet");
    return;
  }

  console.log("History:", history);
}

// main conversion logic
async function performConversion() {
  const fromVal = parseFloat(document.querySelector("#from-value").value);
  const fromUnit = document.querySelector("#unit-from").value;
  const toUnit = document.querySelector("#unit-to").value;

  if (isNaN(fromVal)) return;

  try {
    const result = await convert(fromVal, fromUnit, toUnit);

    // skip invalid results
    if (result === null) return;

    document.querySelector(".value-display").textContent = result;

    // save history (only for relevant actions)
    if (state.action === "Conversion" || state.action === "Comparison") {
      const record = {
        type: state.type,
        action: state.action,
        expression: `${fromVal} ${fromUnit} → ${toUnit}`,
        result,
        timestamp: new Date().toISOString()
      };

      await saveHistory(record);

      // small delay to allow json-server to update
      setTimeout(loadHistory, 200);
    }

  } catch (error) {
    console.error("Operation failed:", error.message);
  }
}