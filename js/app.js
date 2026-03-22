import { getUnits, saveHistory, getHistory } from "./api.js";
import { convert, compareValues, performArithmetic } from "./conversion.js";
import { populateDropdown, setActive } from "./ui.js";

const state = {
    type: "length",
    action: "Comparison"
};

document.addEventListener("DOMContentLoaded", async () => {
    attachEventListeners();
    await loadUnits(state.type);
    setAction(state.action);
    await loadHistory();
    performConversion();
});

function attachEventListeners() {

    // normal mode
    document.querySelector("#from-value").addEventListener("input", performConversion);
    document.querySelector("#unit-from").addEventListener("change", performConversion);
    document.querySelector("#unit-to").addEventListener("change", performConversion);

    // arithmetic mode
    document.querySelector("#arith-value1").addEventListener("input", performConversion);
    document.querySelector("#arith-value2").addEventListener("input", performConversion);

    document.querySelector("#arith-unit1").addEventListener("change", performConversion);
    document.querySelector("#arith-unit2").addEventListener("change", performConversion);
    document.querySelector("#arith-result-unit").addEventListener("change", performConversion);

    document.querySelector("#operator").addEventListener("change", performConversion);

    // action buttons
    document.querySelector("#action-comparison").onclick = () => setAction("Comparison");
    document.querySelector("#action-conversion").onclick = () => setAction("Conversion");
    document.querySelector("#action-arithmetic").onclick = () => setAction("Arithmetic");

    // type buttons
    document.querySelector("#type-length").onclick = () => setType("length");
    document.querySelector("#type-weight").onclick = () => setType("weight");
    document.querySelector("#type-temperature").onclick = () => setType("temperature");
    document.querySelector("#type-volume").onclick = () => setType("volume");

    const typeContainer = document.querySelectorAll(".row.g-3.mb-5")[0];

    document.querySelectorAll(".type-card").forEach(card => {
        card.addEventListener("click", (e) => {
            setActive(typeContainer, e.currentTarget, ".type-card");
            setType(card.id.replace("type-", ""));
        });
    });

    const actionContainer = document.querySelectorAll(".row.g-3.mb-5")[1];

document.querySelectorAll(".action-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    setActive(actionContainer, e.currentTarget, ".action-btn");

    const action = btn.id.replace("action-", "");
    setAction(action.charAt(0).toUpperCase() + action.slice(1));
  });
});
}

async function setType(type) {
    state.type = type;
    await loadUnits(type);   // 🔥 FIX (important)
    performConversion();
}
function setAction(action) {
    state.action = action;

    document.querySelectorAll(".action-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    document.querySelector(`#action-${action.toLowerCase()}`)
        .classList.add("active");

    const normal = document.querySelector("#normal-block");
    const arithmetic = document.querySelector("#arithmetic-layout");

    if (action === "Arithmetic") {
        normal.style.display = "none";
        arithmetic.style.display = "block";
    } else {
        normal.style.display = "flex";
        arithmetic.style.display = "none";
    }

    performConversion();
}

async function loadUnits(type) {
    const units = await getUnits(type);

    // normal mode
    populateDropdown(document.querySelector("#unit-from"), units);
    populateDropdown(document.querySelector("#unit-to"), units);

    // arithmetic mode
    populateDropdown(document.querySelector("#arith-unit1"), units);
    populateDropdown(document.querySelector("#arith-unit2"), units);
    populateDropdown(document.querySelector("#arith-result-unit"), units);

    // optional default selection (skip "-- Select Unit --")
    if (units.length > 0) {
        document.querySelector("#unit-from").selectedIndex = 1;
        document.querySelector("#unit-to").selectedIndex = 2;

        const u1 = document.querySelector("#arith-unit1");
        const u2 = document.querySelector("#arith-unit2");
        const ur = document.querySelector("#arith-result-unit");

        if (u1 && u2 && ur) {
            u1.selectedIndex = 1;
            u2.selectedIndex = 2;
            ur.selectedIndex = 1;
        }
    }
}

async function loadHistory() {
    console.log(await getHistory());
}

async function performConversion() {
    const fromVal = parseFloat(document.querySelector("#from-value").value);
    const fromUnit = document.querySelector("#unit-from").value;
    const toUnit = document.querySelector("#unit-to").value;

    if (!fromUnit || !toUnit || isNaN(fromVal)) return;

    let result;

    try {
        if (state.action === "Comparison") {
            result = compareValues(fromVal, fromUnit, 1, toUnit);
        }

        else if (state.action === "Arithmetic") {

            const v1 = parseFloat(document.querySelector("#arith-value1").value);
            const u1 = document.querySelector("#arith-unit1").value;

            const v2 = parseFloat(document.querySelector("#arith-value2").value);
            const u2 = document.querySelector("#arith-unit2").value;

            const resultUnit = document.querySelector("#arith-result-unit").value;
            const op = document.querySelector("#operator").value;

            if (isNaN(v1) || isNaN(v2)) return;

            // convert v2 → unit of v1
            const v2Converted = await convert(v2, u2, u1);
            if (v2Converted === null) return;

            const baseResult = performArithmetic(v1, v2Converted, op);

            const finalResult = await convert(baseResult, u1, resultUnit);

            document.querySelector("#arith-result").textContent =
                `${finalResult} ${resultUnit}`;
        }

        else {
            result = await convert(fromVal, fromUnit, toUnit);
        }

        document.querySelector("#result-display").textContent = result;

        await saveHistory({
            type: state.type,
            action: state.action,
            result,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        if (err.message === "Divide by zero") {
            document.querySelector("#result-display").textContent = "Cannot divide by zero";
        }
    }
}