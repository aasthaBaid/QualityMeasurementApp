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