/**
 * Read THE GRID AGENCY WEBSITE 2.0 PNG files via Vision to extract text collection
 */
import OpenAI from "openai";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FILES = [
  "/Users/simonazoulay/Downloads/COLLECTE IMAGES/ABOUT/THE GRID AGENCY WEBSITE 2.0.png",
  "/Users/simonazoulay/Downloads/COLLECTE IMAGES/ABOUT/THE GRID AGENCY WEBSITE 2.0 (1).png",
  "/Users/simonazoulay/Downloads/COLLECTE IMAGES/DRIVERS/THE GRID AGENCY WEBSITE 2.0 (2).png",
];

async function analyzeImage(filePath) {
  const buf = readFileSync(filePath);
  const b64 = buf.toString("base64");
  const ext = filePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const resp = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: `You are a precise text extraction assistant. This image contains a document titled "COLLECTE DES TEXTES THE GRID WEBSITE 2.0" or similar. 
Extract ALL visible text verbatim, preserving structure (sections, labels, paragraphs). 
Return as structured JSON with this shape:
{
  "sections": [
    {
      "title": "section name",
      "fields": [
        { "label": "field name or zone", "value": "exact text content" }
      ]
    }
  ]
}
If the image has plain text, return all of it. Be exhaustive.`,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:${ext};base64,${b64}`, detail: "high" },
          },
          { type: "text", text: "Extract ALL text from this document image." },
        ],
      },
    ],
  });

  return resp.choices[0].message.content;
}

async function main() {
  const results = [];
  for (const file of FILES) {
    console.log(`Processing: ${file}`);
    try {
      const text = await analyzeImage(file);
      results.push({ file, content: text });
      console.log(`✅ Done: ${file}`);
    } catch (e) {
      console.error(`❌ Error for ${file}:`, e.message);
      results.push({ file, error: e.message });
    }
  }

  const outPath = resolve("/tmp/collecte-textes-extract.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");
  console.log(`\nResults saved to ${outPath}`);

  // Print summary
  for (const r of results) {
    if (r.content) {
      console.log(`\n=== ${r.file.split("/").pop()} ===`);
      console.log(r.content.slice(0, 500));
    }
  }
}

main().catch(console.error);
