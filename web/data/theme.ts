export type Theme = "auto" | "light" | "dark";

declare global {
  interface Window {
    applyTheme?: () => void;
  }
}

export function updateTheme() {
  window.applyTheme?.();
}
