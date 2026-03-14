export function trimIfHash(str: string | null | undefined): string | null {
  if (str == null) return null;
  if (str.length < 32 || !/^[0-9a-f]+$/.test(str)) return str;

  return str.slice(0, 7);
}
