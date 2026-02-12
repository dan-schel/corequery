export function findDuplicates<T>(
  items: readonly T[],
  getId: (item: T) => number | string,
): Map<number | string, number[]> {
  const duplicates = new Map<number | string, number[]>();
  const seen = new Set<number | string>();

  for (const [index, item] of items.entries()) {
    const id = getId(item);
    if (seen.has(id)) {
      const indices = duplicates.get(id) || [];
      indices.push(index);
      duplicates.set(id, indices);
      continue;
    }

    seen.add(id);
  }

  return duplicates;
}
