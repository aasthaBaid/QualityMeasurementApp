import { getConversion } from "./api.js";

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

export async function convert(value, fromUnit, toUnit) {
  try {
    if (fromUnit === toUnit) return value;

    // 1. Try API
    const convObj = await getConversion(fromUnit, toUnit);

    if (convObj) {
      return applyConversion(value, convObj);
    }

    // 2. Fallback (THIS WAS BROKEN BEFORE)
    if (toBase[fromUnit] !== undefined && toBase[toUnit] !== undefined) {
      const baseValue = value * toBase[fromUnit];
      const result = baseValue / toBase[toUnit];

      return parseFloat(result.toFixed(6));
    }

    throw new Error("Conversion not available");

  } catch (err) {
    console.error("Conversion failed:", err.message);
    return null;
  }
}

export function applyConversion(value, convObj) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid number");
  }

  if (!convObj || (convObj.factor === 1 && convObj.formula === null)) {
    return value;
  }

  if (convObj.factor !== null) {
    return parseFloat((value * convObj.factor).toFixed(6));
  }

  if (convObj.formula) {
    const expr = convObj.formula.replace(/x/g, value);
    return parseFloat(eval(expr).toFixed(6));
  }

  throw new Error("Invalid conversion object");
}

export function compareValues(v1, u1, v2, u2) {
  // invalid check
  if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
    return "Invalid values — cannot compare";
  }

  // same unit → direct compare
  if (u1 === u2) {
    if (v1 > v2) return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
    if (v1 < v2) return `${v1} ${u1} is LESS than ${v2} ${u2}`;
    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
  }

  // convert both to base
  const base1 = toBaseUnit(v1, u1);
  const base2 = toBaseUnit(v2, u2);

  if (base1 === null || base2 === null) {
    return "Invalid values — cannot compare";
  }

  if (base1 > base2) {
    return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
  }

  if (base1 < base2) {
    return `${v1} ${u1} is LESS than ${v2} ${u2}`;
  }

  return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}

function toBaseUnit(value, unit) {
  // temperature handled separately
  if (["C", "F", "K"].includes(unit)) {
    if (unit === "C") return value;
    if (unit === "F") return (value - 32) * 5 / 9;
    if (unit === "K") return value - 273.15;
  }

  if (toBase[unit] !== undefined) {
    return value * toBase[unit];
  }

  return null;
}