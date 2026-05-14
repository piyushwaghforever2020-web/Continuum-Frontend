/** Zero-based row index: 0 → "Program A —", 1 → "Program B —", … */
export function programRowDefaultName(zeroBasedIndex: number): string {
  if (zeroBasedIndex >= 0 && zeroBasedIndex < 26) {
    return `Program ${String.fromCharCode(65 + zeroBasedIndex)} —`;
  }
  return `Program ${zeroBasedIndex + 1} —`;
}
