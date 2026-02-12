type Violation<T> = { item: T; index: number };

export function findAllOrNoneViolations<T>(
  items: readonly T[],
  hasProperty: (item: T) => boolean,
): Violation<T>[] | null {
  const violations: Violation<T>[] = [];

  for (const [index, item] of items.entries()) {
    if (!hasProperty(item)) {
      violations.push({ item, index });
    }
  }

  if (violations.length === 0 || violations.length === items.length) {
    return null;
  }

  return violations;
}
