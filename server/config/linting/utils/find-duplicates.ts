export function findDuplicates<T>(
  items: readonly T[],
  getId: (item: T) => number | string,
): Map<number | string, number[]> {
  const duplicates = new Map<number | string, number[]>();
  const seen = new Set<number | string>();

  items.forEach((item, index) => {
    const id = getId(item);
    if (seen.has(id)) {
      const indices = duplicates.get(id) || [];
      indices.push(index);
      duplicates.set(id, indices);
      return;
    }

    seen.add(id);
  });

  return duplicates;
}
