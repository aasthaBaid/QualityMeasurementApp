// arithmetic operation
export function performArithmetic(v1, v2, op) {

  switch (op) {
    case "+": return +(v1 + v2).toFixed(6);
    case "-": return +(v1 - v2).toFixed(6);
    case "*": return +(v1 * v2).toFixed(6);

    case "/":
      if (v2 === 0) throw new Error("Divide by zero");
      return +(v1 / v2).toFixed(6);

    default:
      throw new Error("Unknown operator");
  }
}


// base conversion map
const toBase = {

  // length (meter base)
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.34,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,

  // weight (kg base)
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,

  // volume (liter base)
  L: 1,
  mL: 0.001,
  m3: 1000
};


// conversion function
export async function convert(v, from, to) {

  if (from === to) return v;

  // temperature conversion
  if (["C", "F", "K"].includes(from) && ["C", "F", "K"].includes(to)) {

    let result;

    if (from === "C" && to === "F") result = (v * 9/5) + 32;
    else if (from === "F" && to === "C") result = (v - 32) * 5/9;
    else if (from === "C" && to === "K") result = v + 273.15;
    else if (from === "K" && to === "C") result = v - 273.15;
    else if (from === "F" && to === "K") result = (v - 32) * 5/9 + 273.15;
    else if (from === "K" && to === "F") result = (v - 273.15) * 9/5 + 32;

    return +result.toFixed(6);
  }

  // normal conversion
  if (toBase[from] !== undefined && toBase[to] !== undefined) {
    return +((v * toBase[from]) / toBase[to]).toFixed(6);
  }

  // unsupported conversion
  console.warn("Conversion not supported:", from, to);
  return null;
}


// comparison
export function compareValues(v1, u1, v2, u2) {

  let b1 = v1;
  let b2 = v2;

  // temperature → convert to Celsius
  if (["C","F","K"].includes(u1) && ["C","F","K"].includes(u2)) {

    if (u1 === "F") b1 = (v1 - 32) * 5/9;
    if (u1 === "K") b1 = v1 - 273.15;

    if (u2 === "F") b2 = (v2 - 32) * 5/9;
    if (u2 === "K") b2 = v2 - 273.15;
  }
  else {
    b1 = toBase[u1] ? v1 * toBase[u1] : v1;
    b2 = toBase[u2] ? v2 * toBase[u2] : v2;
  }

  if (b1 > b2) return `${v1} ${u1} > ${v2} ${u2}`;
  if (b1 < b2) return `${v1} ${u1} < ${v2} ${u2}`;
  return "Equal";
}