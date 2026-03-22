// Universal base-unit conversion system
// Base conversion factors (to base unit)
const toBase = {
  // length → meters
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,

  // weight → kg
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,

  // volume → liter
  L: 1,
  mL: 0.001,
  m3: 1000
};

// Main conversion function
export async function convert(value, fromUnit, toUnit) {
  try {
    if (fromUnit === toUnit) return value;

    // Temperature (special case)
    if (["C", "F", "K"].includes(fromUnit) && ["C", "F", "K"].includes(toUnit)) {
      return convertTemperature(value, fromUnit, toUnit);
    }

    // invalid units
    if (!toBase[fromUnit] || !toBase[toUnit]) {
      throw new Error("Unsupported unit");
    }

    // 1️ convert to base unit
    const baseValue = value * toBase[fromUnit];

    // 2️ convert to target unit
    const result = baseValue / toBase[toUnit];

    return result;

  } catch (err) {
    console.error("Conversion failed:", err.message);
    return null;
  }
}

// Temperature conversion helper
function convertTemperature(value, from, to) {
  let celsius;

  // convert → Celsius
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * 5 / 9;
  else if (from === "K") celsius = value - 273.15;

  // convert from Celsius → target
  if (to === "C") return celsius;
  if (to === "F") return (celsius * 9 / 5) + 32;
  if (to === "K") return celsius + 273.15;
}

// (optional, keep if used elsewhere)
export function compareValues(val1, val2) {
  if (val1 > val2) return "From is greater";
  if (val1 < val2) return "To is greater";
  return "Both are equal";
}