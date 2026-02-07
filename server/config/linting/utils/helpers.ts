import type { LintIssue } from "../types.js";

export function createIssue(message: string, path?: string): LintIssue {
  return { message, path };
}

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

export function allOrNone<T>(
  items: readonly T[],
  hasProperty: (item: T) => boolean,
): "all" | "none" | "mixed" {
  const withProperty = items.filter(hasProperty).length;

  if (withProperty === 0) return "none";
  if (withProperty === items.length) return "all";
  return "mixed";
}
