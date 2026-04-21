// Full-page screenshots with scroll-reveal trigger

import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";

const BASE = process.env.BASE || "https://the-grid-sa.vercel.app";
const OUT = process.env.OUT || "/tmp/grid-shots";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PAGES = [
  ["home", "/"],
  ["about", "/about"],
  ["services", "/services"],
  ["drivers", "/drivers"],
  ["news", "/news"],
  ["contact", "/contact"],
  ["gasly", "/drivers/pierre-gasly"],
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 240;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 140);
    });
  });
  await new Promise((r) => setTimeout(r, 1200));
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });
  for (const [name, url] of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      console.log(`→ ${name}`);
      await page.goto(`${BASE}${url}`, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 1500));
      await autoScroll(page);
      const file = path.join(OUT, `${name}_full.png`);
      await page.screenshot({ path: file, fullPage: true });
      const stat = await fs.stat(file);
      console.log(`  OK ${(stat.size / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.error(`  FAIL ${name}:`, e.message);
    } finally {
      await page.close();
    }
  }
  await browser.close();
}

run();
