import fsp from "fs/promises";
import path from "path";
import sharp from "sharp";

// TODO: This script should be moved to a new folder for scripts which are
// compiled for use in the consumer project. I initially thought it should go in
// the `server` folder and just run on boot, but that's a bit rough making the
// server do it each time it starts when it could just be done in advance.

// TODO: Should be configurable.
const faviconSvgPath = "web/public/favicon.svg";
const outputDir = "web/public";

const whiteRectSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" width="1" height="1">
    <rect x="0" y="0" width="1" height="1" fill="white"/>
  </svg>
`;

const whiteCircleSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2" width="2" height="2">
    <circle cx="1" cy="1" r="1" fill="white"/>
  </svg>
`;

export async function main() {
  const faviconSvg = await fsp.readFile(faviconSvgPath, "utf-8");

  const appleTouchIcon = {
    background: whiteRectSvg,
    foreground: faviconSvg,
    foregroundScale: 0.66,
    outputDir,
  };
  const pwaRegular = {
    background: whiteCircleSvg,
    foreground: faviconSvg,
    foregroundScale: 0.66,
    outputDir,
  };
  const pwaMaskable = {
    background: whiteRectSvg,
    foreground: faviconSvg,
    foregroundScale: 0.57,
    outputDir,
  };

  await createIcon({
    name: "apple-touch-icon.png",
    size: 180,
    ...appleTouchIcon,
  });
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

async function createIcon({
  name,
  size,
  background,
  foreground,
  foregroundScale,
  outputDir,
}: {
  readonly name: string;
  readonly size: number;
  readonly background: string;
  readonly foreground: string;
  readonly foregroundScale: number;
  readonly outputDir: string;
}) {
  const foregroundSize = Math.round(size * foregroundScale);

  const foregroundImg = await sharp(Buffer.from(foreground))
    .resize(foregroundSize, foregroundSize)
    .png()
    .toBuffer();

  await sharp(Buffer.from(background))
    .resize(size, size)
    .composite([
      {
        input: foregroundImg,
        gravity: "centre",
      },
    ])
    .png()
    .toFile(path.join(outputDir, name));
}
