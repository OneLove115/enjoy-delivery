/**
 * Generates placeholder PWA icons as minimal valid PNGs.
 * Each icon is a solid #5A31F4 (brand purple) square with no text.
 * TODO: Replace these placeholder PNGs with final brand art before launch.
 *
 * Run: node apps/web/scripts/gen-icons.mjs
 * No external deps required — uses raw PNG binary encoding.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/icons');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// SIZES to generate — 192 and 512 already exist; we still overwrite consistently
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Brand color #5A31F4 → R=90 G=49 B=244 A=255
const R = 90, G = 49, B = 244, A = 255;

function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (0xedb88320 * (crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth 8, color type 2 (RGB) → use RGBA color type 6
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // color type RGB (no alpha, simpler)
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  // Raw image data: each row = filter byte (0) + RGB * width
  const rowLen = 1 + size * 3;
  const raw = Buffer.alloc(size * rowLen);
  for (let y = 0; y < size; y++) {
    const base = y * rowLen;
    raw[base] = 0; // filter none
    for (let x = 0; x < size; x++) {
      raw[base + 1 + x * 3 + 0] = R;
      raw[base + 1 + x * 3 + 1] = G;
      raw[base + 1 + x * 3 + 2] = B;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  const png = Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
}

for (const size of SIZES) {
  const filename = join(OUT_DIR, `icon-${size}.png`);
  // Don't overwrite 192/512 that may already have real art
  if ((size === 192 || size === 512) && existsSync(filename)) {
    console.log(`  skip  icon-${size}.png (already exists)`);
    continue;
  }
  writeFileSync(filename, makePng(size));
  console.log(`  wrote icon-${size}.png`);
}

// apple-touch-icon = 180px
const atPath = join(OUT_DIR, 'apple-touch-icon.png');
if (!existsSync(atPath)) {
  writeFileSync(atPath, makePng(180));
  console.log('  wrote apple-touch-icon.png');
} else {
  console.log('  skip  apple-touch-icon.png (already exists)');
}

console.log('Done. TODO: replace placeholder icons with final brand art.');
