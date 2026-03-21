// Import API helper
import { getConversion } from "./api.js";

// Convert a value from one unit to another
export async function convert(value, fromUnit, toUnit) {
  try {
    // Get conversion record from API
    const conversion = await getConversion(fromUnit, toUnit);

    let result;

    if (conversion.factor !== null) {
      // factor-based conversion
      result = value * conversion.factor;
    } else if (conversion.formula) {
      // formula-based conversion (e.g., temperature)
      // 'x' is the value to convert
      result = eval(conversion.formula.replace(/x/g, value));
    } else {
      throw new Error("Invalid conversion record");
    }

    return result;

  } catch (error) {
    console.error("Conversion failed:", error.message);
    throw error; // caller (UI) can handle error display
  }
}

// Compare two values after converting them to the same unit
export async function compare(value1, unit1, value2, unit2) {
  const convertedValue1 = await convert(value1, unit1, unit2);
  if (convertedValue1 > value2) return 1;
  if (convertedValue1 < value2) return -1;
  return 0;
}

// Arithmetic operation: +, -, *, /
export async function arithmetic(value1, unit1, value2, unit2, operator) {
  const convertedValue2 = await convert(value2, unit2, unit1);
  switch (operator) {
    case "+": return value1 + convertedValue2;
    case "-": return value1 - convertedValue2;
    case "*": return value1 * convertedValue2;
    case "/": return value1 / convertedValue2;
    default: throw new Error("Invalid operator");
  }
}