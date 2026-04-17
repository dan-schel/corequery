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

const hexCodes: Record<Color, HexCodes> = {};

export function getHexCodesForColor(color: Color): HexCodes {
  return hexCodes[color];
}
