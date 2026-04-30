import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');
const LOGO = resolve(PUBLIC, 'logo.png');

async function genWebp() {
  await sharp(LOGO)
    .webp({ quality: 90 })
    .toFile(resolve(PUBLIC, 'logo.webp'));

  await sharp(LOGO)
    .avif({ quality: 70 })
    .toFile(resolve(PUBLIC, 'logo.avif'));

  console.log('logo.webp + logo.avif generated');
}

async function genOgImage() {
  const logoBuf = await readFile(LOGO);
  const logoB64 = logoBuf.toString('base64');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B3954"/>
      <stop offset="100%" stop-color="#062638"/>
    </linearGradient>
    <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1a4d6e" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#2a7aa8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#1a4d6e" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <path d="M 0 480 Q 300 440 600 470 T 1200 460 L 1200 630 L 0 630 Z" fill="url(#water)"/>
  <path d="M 0 530 Q 300 500 600 520 T 1200 510 L 1200 630 L 0 630 Z" fill="#1a4d6e" opacity="0.5"/>
  <image x="80" y="160" width="220" height="220" href="data:image/png;base64,${logoB64}"/>
  <text x="350" y="245" font-family="Outfit, system-ui, sans-serif" font-size="72" font-weight="800" fill="#ffffff" letter-spacing="-1">Transporte</text>
  <text x="350" y="320" font-family="Outfit, system-ui, sans-serif" font-size="72" font-weight="800" fill="#ffffff" letter-spacing="-1">Fluvial</text>
  <text x="350" y="380" font-family="Outfit, system-ui, sans-serif" font-size="32" font-weight="500" fill="#E9A319" letter-spacing="2">DELTA DEL TIGRE</text>
  <text x="80" y="560" font-family="Outfit, system-ui, sans-serif" font-size="22" font-weight="500" fill="#9aa3b3">Mapa interactivo · Líneas 450 a 455 · Horarios y posición en vivo</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(resolve(PUBLIC, 'og-image.png'));

  console.log('og-image.png generated');
}

await genWebp();
await genOgImage();
