import path from "path";
import sharp from "sharp";

export async function createIcon({
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
