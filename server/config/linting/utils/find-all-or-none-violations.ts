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
