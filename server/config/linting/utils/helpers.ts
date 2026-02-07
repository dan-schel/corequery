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

export function chooseNameForEntry(name: string | null, index: number): string {
  return name != null ? `"${name}"` : `<Entry ${index + 1}>`;
}
