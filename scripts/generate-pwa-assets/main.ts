import fsp from "fs/promises";
import { createIcon } from "@/scripts/generate-pwa-assets/create-icon.js";
import {
  whiteCircleSvg,
  whiteRectSvg,
} from "@/scripts/generate-pwa-assets/svgs.js";

const scriptName = "corequery-generate-pwa-assets";

export async function main() {
  const faviconSvgPath = process.argv[2];
  const outputDir = process.argv[3];

  if (faviconSvgPath == null || outputDir == null) {
    console.log(`Usage: ${scriptName} <faviconSvgPath> <outputDir>`);
    return;
  }

  const faviconSvg = await fsp.readFile(faviconSvgPath, "utf-8");

  // ===========================================================================
  // Apple touch icon
  // ===========================================================================
  await createIcon({
    name: "apple-touch-icon.png",
    size: 180,
    background: whiteRectSvg,
    foreground: faviconSvg,
    foregroundScale: 0.66,
    outputDir,
  });

  // ===========================================================================
  // PWA regular (circle) icons
  // ===========================================================================
  const pwaRegular = {
    background: whiteCircleSvg,
    foreground: faviconSvg,
    foregroundScale: 0.66,
    outputDir,
  };
  await createIcon({
    name: "pwa-192x192.png",
    size: 192,
    ...pwaRegular,
  });
  await createIcon({
    name: "pwa-512x512.png",
    size: 512,
    ...pwaRegular,
  });

  // ===========================================================================
  // PWA maskable icons
  // ===========================================================================
  const pwaMaskable = {
    background: whiteRectSvg,
    foreground: faviconSvg,
    foregroundScale: 0.57,
    outputDir,
  };
  await createIcon({
    name: "pwa-maskable-192x192.png",
    size: 192,
    ...pwaMaskable,
  });
  await createIcon({
    name: "pwa-maskable-512x512.png",
    size: 512,
    ...pwaMaskable,
  });
}
