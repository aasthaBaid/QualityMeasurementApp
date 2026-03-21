document.addEventListener("DOMContentLoaded", async () => {

  // 1️ State object
  const state = {
    type: "Length",
    action: "Conversion",
    fromVal: null,
    fromUnit: "",
    toVal: null,
    toUnit: "",
    operator: "+"
  };

  console.log("App Initialized");

  try {
    // 2️ Attach event listeners (stub)
    attachEventListeners();

    // 3️ Load default units (stub)
    await loadUnits("Length");

    // 4️ Hide operator row (stub)
    toggleOperators(false);

    // 5️ Load history (stub)
    await loadHistory();

  } catch (error) {
    console.error(error);
    alert("Server unavailable");
  }

});


// =======================
// Stub functions
// =======================

function attachEventListeners() {
  console.log("Listeners attached");
}

async function loadUnits(type) {
  console.log("Loading units for type:", type);
  //  For UC-02 we don’t fetch anything yet
}

function toggleOperators(show) {
  console.log("Operator row visible?", show);
}

async function loadHistory() {
  console.log("Loading history...");
}