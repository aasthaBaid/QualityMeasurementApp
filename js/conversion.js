import { getConversion } from "./api.js";

const toBase = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,
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

