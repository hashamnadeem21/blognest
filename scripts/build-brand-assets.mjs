// Rasterizes the SVG logo mark into PNG icons (favicon, apple icon, Organization logo).
// Run with: npm run brand
import { readFile, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/brand/blognest-mark.svg");
const targets = [
  { file: "public/logo.png", size: 512 },
  { file: "src/app/apple-icon.png", size: 180 },
  { file: "public/brand/icon-192.png", size: 192 },
  { file: "public/brand/icon-512.png", size: 512 },
];
for (const { file, size } of targets) {
  await writeFile(file, await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer());
  console.log(`✓ ${file}`);
}
await copyFile("public/brand/blognest-mark.svg", "src/app/icon.svg");
console.log("✓ src/app/icon.svg");
