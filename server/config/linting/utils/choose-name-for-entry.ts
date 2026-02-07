export function chooseNameForEntry(name: string | null, index: number): string {
  return name != null ? `"${name}"` : `<Entry ${index + 1}>`;
}
