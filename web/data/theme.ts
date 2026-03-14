export const themes = ["auto", "light", "dark"] as const;
export type Theme = (typeof themes)[number];

declare global {
  interface Window {
    applyTheme?: () => void;
  }
}

export function updateTheme() {
  window.applyTheme?.();
}
