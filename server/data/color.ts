export type Color =
  | "red"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "pink"
  | "purple"
  | "gray";

type HexCodes = {
  readonly lightModeHexCode: string;
  readonly darkModeHexCode: string;
};

const hexCodes: Record<Color, HexCodes> = {
  red: {
    lightModeHexCode: "#db0f0f",
    darkModeHexCode: "#ff5252",
  },
  yellow: {
    lightModeHexCode: "#d19600",
    darkModeHexCode: "#ffc124",
  },
  green: {
    lightModeHexCode: "#1caf0e",
    darkModeHexCode: "#33d025",
  },
  cyan: {
    lightModeHexCode: "#00a7cc",
    darkModeHexCode: "#1ad5ff",
  },
  blue: {
    lightModeHexCode: "#3352c1",
    darkModeHexCode: "#8aa3ff",
  },
  pink: {
    lightModeHexCode: "#d73cab",
    darkModeHexCode: "#ff61d2",
  },
  purple: {
    lightModeHexCode: "#a135e3",
    darkModeHexCode: "#cc7aff",
  },
  gray: {
    lightModeHexCode: "#000714cc",
    darkModeHexCode: "#ebf1ffcc",
  },
};

export function getHexCodesForColor(color: Color): HexCodes {
  return hexCodes[color];
}
