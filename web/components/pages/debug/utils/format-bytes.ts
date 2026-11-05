export function formatBytes(bytes: number): string {
  if (bytes < 2_000) {
    return `${bytes.toFixed(0)} bytes`;
  } else if (bytes < 2_000_000) {
    return `${(bytes / 1000).toFixed(2)} KB`;
  } else if (bytes < 2_000_000_000) {
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  } else if (bytes < 2_000_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
  } else {
    return `${(bytes / 1_000_000_000_000).toFixed(2)} TB`;
  }
}
