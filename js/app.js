import { getUnits, getHistory } from "./api.js";
import { convert, compareValues, performArithmetic } from "./conversion.js";
import { populateDropdown, setActive, showResult, toggleLayout } from "./ui.js";

const state = {
  type: "length",
  action: "Comparison"
};

document.addEventListener("DOMContentLoaded", async () => {

  attachEventListeners();

  await loadUnits(state.type);

  setAction(state.action); // sets UI + toggle

  await loadHistory();

  performConversion();
});


// attach all listeners
function attachEventListeners() {

  // normal mode inputs
  document.querySelector("#from-value").addEventListener("input", performConversion);
  document.querySelector("#unit-from").addEventListener("change", performConversion);
  document.querySelector("#unit-to").addEventListener("change", performConversion);

  // arithmetic inputs
  document.querySelector("#arith-value1").addEventListener("input", performConversion);
  document.querySelector("#arith-value2").addEventListener("input", performConversion);
  document.querySelector("#arith-unit1").addEventListener("change", performConversion);
  document.querySelector("#arith-unit2").addEventListener("change", performConversion);
  document.querySelector("#arith-result-unit").addEventListener("change", performConversion);
  document.querySelector("#operator").addEventListener("change", performConversion);

  // type selection
  const typeContainer = document.querySelectorAll(".row.g-3.mb-5")[0];

  document.querySelectorAll(".type-card").forEach(card => {
    card.addEventListener("click", (e) => {
      setActive(typeContainer, e.currentTarget, ".type-card");
      setType(card.id.replace("type-", ""));
    });
  });

  // action selection (ONLY ONE HANDLER)
  const actionContainer = document.querySelectorAll(".row.g-3.mb-5")[1];

  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {

      setActive(actionContainer, e.currentTarget, ".action-btn");

      const action = btn.id.replace("action-", "");
      setAction(action.charAt(0).toUpperCase() + action.slice(1));
    });
  });
}


// set type
async function setType(type) {
  state.type = type;
  await loadUnits(type);
  performConversion();
}


// set action and toggle UI
function setAction(action) {

  state.action = action;

  // highlight active button
  document.querySelectorAll(".action-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  document.querySelector(`#action-${action.toLowerCase()}`)
    .classList.add("active");

  // toggle layout
  toggleLayout(action);

  performConversion();
}


// load units into dropdowns
async function loadUnits(type) {

  const units = await getUnits(type);

  populateDropdown(document.querySelector("#unit-from"), units);
  populateDropdown(document.querySelector("#unit-to"), units);

  populateDropdown(document.querySelector("#arith-unit1"), units);
  populateDropdown(document.querySelector("#arith-unit2"), units);
  populateDropdown(document.querySelector("#arith-result-unit"), units);

  // set default selections
  if (units.length > 0) {

    document.querySelector("#unit-from").selectedIndex = 1;
    document.querySelector("#unit-to").selectedIndex = 2;

    document.querySelector("#arith-unit1").selectedIndex = 1;
    document.querySelector("#arith-unit2").selectedIndex = 2;
    document.querySelector("#arith-result-unit").selectedIndex = 1;
  }
}


// load history
async function loadHistory() {
  console.log(await getHistory());
}


// main logic
async function performConversion() {

  try {

    // comparison
    if (state.action === "Comparison") {

      const v = parseFloat(document.querySelector("#from-value").value);
      const from = document.querySelector("#unit-from").value;
      const to = document.querySelector("#unit-to").value;

      if (!from || !to || isNaN(v)) return;

      const result = compareValues(v, from, 1, to);

      showResult(result, "");
    }

    // arithmetic
    else if (state.action === "Arithmetic") {

      const v1 = parseFloat(document.querySelector("#arith-value1").value);
      const u1 = document.querySelector("#arith-unit1").value;

      const v2 = parseFloat(document.querySelector("#arith-value2").value);
      const u2 = document.querySelector("#arith-unit2").value;

      const resultUnit = document.querySelector("#arith-result-unit").value;
      const op = document.querySelector("#operator").value;

      if (!u1 || !u2 || !resultUnit || isNaN(v1) || isNaN(v2)) return;

      const v2Converted = await convert(v2, u2, u1);
      if (v2Converted === null) return;

      const base = performArithmetic(v1, v2Converted, op);

      const finalResult = await convert(base, u1, resultUnit);
      if (finalResult === null) return;

      showResult(finalResult, resultUnit);
    }

    // conversion
    else {

      const v = parseFloat(document.querySelector("#from-value").value);
      const from = document.querySelector("#unit-from").value;
      const to = document.querySelector("#unit-to").value;

      if (!from || !to || isNaN(v)) return;

      const result = await convert(v, from, to);

      showResult(result, to);
    }

  } catch (err) {

    if (err.message === "Divide by zero") {
      showResult("Cannot divide by zero", "");
    }
  }
}