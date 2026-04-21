import puppeteer from "puppeteer";
import path from "node:path";

const OUT = "/tmp/about-vision";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const URLS = [
  ["home-sa", "https://the-grid-sa.vercel.app/"],
  ["about-sa", "https://the-grid-sa.vercel.app/about/"],
  ["services-sa", "https://the-grid-sa.vercel.app/services/"],
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
});
try {
  for (const [id, url] of URLS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
    console.log(`[${id}] visiting ${url}`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 800));
      const steps = 10;
      const h = document.documentElement.scrollHeight;
      for (let i = 0; i < steps; i++) {
        window.scrollTo(0, ((i + 1) / steps) * h);
        await new Promise((r) => setTimeout(r, 250));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    const out = path.join(OUT, `verify-${id}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`  saved ${out}`);
    await page.close();
  }
} finally {
  await browser.close();
}
