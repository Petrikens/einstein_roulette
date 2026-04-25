export function pickWeightedIndex(weights: readonly number[], random: () => number = Math.random): number | null {
  const validWeights = weights.map((weight) => (Number.isFinite(weight) && weight > 0 ? weight : 0));
  const total = validWeights.reduce((sum, weight) => sum + weight, 0);

  if (total <= 0) {
    return null;
  }

  const target = random() * total;
  let cursor = 0;

  for (let index = 0; index < validWeights.length; index += 1) {
    cursor += validWeights[index] ?? 0;
    if (target < cursor) {
      return index;
    }
  }

  return validWeights.length - 1;
}
