export function populateDropdown(selectEl, units) {

  // exception flow
  if (!selectEl) {
    console.warn("Dropdown element not found");
    return;
  }

  // clear existing options
  selectEl.innerHTML = "";

  // default option
  const defaultOpt = document.createElement("option");
  defaultOpt.textContent = "-- Select Unit --";
  defaultOpt.disabled = true;
  defaultOpt.selected = true;

  selectEl.appendChild(defaultOpt);

  // main flow
  units.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.symbol;
    opt.textContent = `${u.label} (${u.symbol})`;
    selectEl.appendChild(opt);
  });
}

export function setActive(parentEl, clickedEl, childSelector) {

  if (!parentEl) return;

  parentEl.querySelectorAll(childSelector).forEach(el => {
    el.classList.remove("active");
  });

  clickedEl.classList.add("active");
}

export function showResult(value, unitSymbol) {

  const valueEl = document.querySelector("#result-value");
  const unitEl = document.querySelector("#result-unit");

  // exception case
  if (!valueEl || !unitEl) return;

  // handle null
  if (value === null || value === undefined) {
    valueEl.textContent = "—";
    unitEl.textContent = "";
    return;
  }

  // set values
  valueEl.textContent = value;
  unitEl.textContent = unitSymbol || "";

  // highlight animation
  valueEl.classList.add("highlight");

  setTimeout(() => {
    valueEl.classList.remove("highlight");
  }, 1500);
}