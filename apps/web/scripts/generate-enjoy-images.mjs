import fs from "fs";
import path from "path";

const API_KEY = process.env.OPENAI_API_KEY;
const OUT_DIR = path.resolve("public/marketing");

const prompts = [
  {
    name: "partners-hero",
    prompt: "Professional photo of a restaurant owner and a tech partner shaking hands in a modern restaurant, warm golden hour lighting, partnership concept, diverse professionals, photorealistic",
  },
  {
    name: "how-it-works-hero",
    prompt: "Photorealistic image showing the journey of a food order: a phone screen with an app, a restaurant kitchen preparing food, and a delivery rider on a scooter, split composition, warm lighting, professional photography",
  },
  {
    name: "cities-hero",
    prompt: "Aerial view of Amsterdam city center with canals and bikes, golden hour, photorealistic, showing the vibrant food delivery culture of a European city, high quality photography",
  },
  {
    name: "about-team",
    prompt: "Group photo of a diverse young tech startup team in a modern office with plants and warm lighting, some holding laptops, casual but professional, photorealistic, friendly atmosphere",
  },
  {
    name: "about-mission",
    prompt: "Close-up photorealistic image of hands passing a beautifully plated gourmet meal from a delivery bag to a smiling customer at their doorstep, warm evening light, premium feel",
  },
  {
    name: "careers-office",
    prompt: "Modern tech startup office with standing desks, collaboration spaces, plants, and natural light, a few people working on laptops, warm and inviting atmosphere, photorealistic",
  },
  {
    name: "press-media",
    prompt: "Professional flat lay photo of a press kit on a desk: brand guidelines, product screenshots on tablet and phone, business cards, coffee cup, minimal modern aesthetic, photorealistic",
  },
  {
    name: "contact-support",
    prompt: "Warm photo of a friendly customer support agent wearing a headset, smiling, modern office background with screens, warm professional lighting, photorealistic",
  },
  {
    name: "promotions-deals",
    prompt: "Vibrant overhead photo of multiple colorful food boxes arranged artistically on a table, each with a discount tag, festive warm lighting, promotional feel, photorealistic food photography",
  },
  {
    name: "blog-food-culture",
    prompt: "Photorealistic image of a cozy restaurant table with a notebook, coffee, and a tablet showing a food blog, warm ambient lighting, editorial style photography",
  },
];

async function generateImage(item) {
  console.log(`Generating: ${item.name}...`);
  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: "dall-e-3", prompt: item.prompt, n: 1, size: "1792x1024", quality: "standard", response_format: "b64_json" }),
    });
    if (!res.ok) { console.error(`  FAILED (${res.status})`); return false; }
    const data = await res.json();
    const b64 = data.data?.[0]?.b64_json;
    if (b64) {
      const outPath = path.join(OUT_DIR, `${item.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
      console.log(`  OK → ${item.name}.png (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
      return true;
    }
    return false;
  } catch (err) { console.error(`  ERROR: ${err.message}`); return false; }
}

async function main() {
  if (!API_KEY) { console.error("OPENAI_API_KEY not set"); process.exit(1); }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${prompts.length} images via DALL-E 3\n`);
  let ok = 0, fail = 0;
  for (const item of prompts) {
    const success = await generateImage(item);
    if (success) ok++; else fail++;
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log(`\nDone: ${ok} success, ${fail} failed`);
}
main();
