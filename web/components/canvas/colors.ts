export type Colors = ReturnType<typeof getColors>;

export function getColors() {
  const css = window.getComputedStyle(document.body);

  return {
    "bg": css.getPropertyValue("--color-bg"),
    "fg": css.getPropertyValue("--color-fg"),
    "fg-strong": css.getPropertyValue("--color-fg-strong"),
    "fg-weak": css.getPropertyValue("--color-fg-weak"),
  };
}
