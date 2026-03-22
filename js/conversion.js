export function performArithmetic(v1, v2, op) {
  switch (op) {
    case "+": return +(v1 + v2).toFixed(6);
    case "-": return +(v1 - v2).toFixed(6);
    case "*": return +(v1 * v2).toFixed(6);
    case "/":
      if (v2 === 0) throw new Error("Divide by zero");
      return +(v1 / v2).toFixed(6);
    default: throw new Error("Unknown operator");
  }
}

const toBase = {
  km:1000,m:1,cm:0.01,mm:0.001,
  kg:1,g:0.001,mg:0.000001,lb:0.453592,
  L:1,mL:0.001,m3:1000
};

export async function convert(v, from, to) {
  if (from === to) return v;

  if (toBase[from] !== undefined && toBase[to] !== undefined) {
    return +((v * toBase[from]) / toBase[to]).toFixed(6);
  }

  return null;
}

export function compareValues(v1,u1,v2,u2){
  const b1 = toBase[u1] ? v1 * toBase[u1] : v1;
  const b2 = toBase[u2] ? v2 * toBase[u2] : v2;

  if (b1 > b2) return `${v1} ${u1} > ${v2} ${u2}`;
  if (b1 < b2) return `${v1} ${u1} < ${v2} ${u2}`;
  return `Equal`;
}