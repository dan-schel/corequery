export function findDuplicates<T>(
  items: readonly T[],
  getId: (item: T) => number | string,
): Map<number | string, number[]> {
  const seen = new Map<number | string, number[]>();

  items.forEach((item, index) => {
    const id = getId(item);
    const indices = seen.get(id) || [];
    indices.push(index);
    seen.set(id, indices);
  });

  const duplicates = new Map<number | string, number[]>();
  seen.forEach((indices, id) => {
    if (indices.length > 1) {
      duplicates.set(id, indices);
    }
  });

  return duplicates;
}

export function findAllOrNoneViolations<T>(
  items: readonly T[],
  hasProperty: (item: T) => boolean,
): Array<{ item: T; index: number }> | null {
  const violations: Array<{ item: T; index: number }> = [];

  items.forEach((item, index) => {
    if (!hasProperty(item)) {
      violations.push({ item, index });
    }
  });

  if (violations.length === 0 || violations.length === items.length) {
    return null;
  }

  return violations;
}
