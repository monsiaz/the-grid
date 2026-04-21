// Rollback CMS to old `/images/*` paths for everything EXCEPT the 4 images
// the client explicitly asked to change in website feedback.pdf, and pushes
// the PDF-requested Instagram URLs to the drivers collection.
//
// Usage:
//   BASE=https://the-grid-sa.vercel.app \
//   EMAIL=admin@thegrid.agency \
//   PASSWORD=... \
//   node scripts/apply-client-assets-to-prod.mjs

const BASE = process.env.BASE || "https://the-grid-sa.vercel.app";
const EMAIL = process.env.EMAIL || "admin@thegrid.agency";
const PASSWORD = process.env.PASSWORD;

if (!PASSWORD) {
  console.error("PASSWORD env var is required");
  process.exit(1);
}

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    console.error("Login failed:", res.status, await res.text());
    process.exit(1);
  }
  const setCookie = res.headers.getSetCookie();
  const cookies = setCookie.map((c) => c.split(";")[0]).join("; ");
  return cookies;
}

async function patchGlobal(cookies, slug, data) {
  const res = await fetch(`${BASE}/api/globals/${slug}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookies },
    body: JSON.stringify(data),
  });
  const body = await res.text();
  if (!res.ok) {
    console.error(`FAIL global ${slug}:`, res.status, body.slice(0, 400));
    return false;
  }
  console.log(`OK   global ${slug}`);
  return true;
}

async function findDocBy(cookies, collection, where) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(where)) q.set(`where[${k}][equals]`, v);
  q.set("limit", "1");
  const res = await fetch(`${BASE}/api/${collection}?${q}`, {
    headers: { Cookie: cookies },
  });
  const j = await res.json();
  return j.docs?.[0] || null;
}

async function patchDoc(cookies, collection, id, data) {
  const res = await fetch(`${BASE}/api/${collection}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: cookies },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    console.error(`FAIL ${collection}/${id}:`, res.status, (await res.text()).slice(0, 300));
    return false;
  }
  console.log(`OK   ${collection}/${id}`);
  return true;
}

// ==============================================================
// Driver metadata (Instagram URLs come from client drive PDF).
// ==============================================================
const DRIVERS = [
  { slug: "pierre-gasly",       image: "/images/drivers/driver-01-gasly.webp",       instagramUrl: "https://www.instagram.com/pierregasly" },
  { slug: "isack-hadjar",       image: "/images/drivers/driver-02-hadjar.webp",      instagramUrl: "https://www.instagram.com/isackhadjar" },
  { slug: "kush-maini",         image: "/images/drivers/driver-03-maini.webp",       instagramUrl: "https://www.instagram.com/kushmainiofficial" },
  { slug: "fred-makowiecki",    image: "/images/drivers/driver-04-makowiecki.webp",  instagramUrl: "https://www.instagram.com/fred.makowiecki" },
  { slug: "alessandro-giusti",  image: "/images/drivers/driver-05-giusti.webp",      instagramUrl: "https://www.instagram.com/giusti_alessandro_" },
  { slug: "enzo-deligny",       image: "/images/drivers/driver-06-deligny.webp",     instagramUrl: "https://www.instagram.com/forza.enzo" },
  { slug: "andrea-dupe",        image: "/images/drivers/driver-07-dupe.webp",        instagramUrl: "https://www.instagram.com/andrea_dupe" },
  { slug: "nathan-tye",         image: "/images/drivers/driver-08-tye.webp",         instagramUrl: "https://www.instagram.com/nathantyejnr" },
  { slug: "vivek-kanthan",      image: "/images/drivers/driver-09-kanthan.webp",     instagramUrl: "https://www.instagram.com/vivekkanthan" },
  { slug: "jack-iliffe",        image: "/images/drivers/driver-10-iliffe.webp",      instagramUrl: "https://www.instagram.com/jack.iliffe" },
  { slug: "louis-cochet",       image: "/images/drivers/driver-11-cochet.webp",      instagramUrl: "https://www.instagram.com/louis_cochet_official" },
  { slug: "luka-scelles",       image: "/images/drivers/driver-12-scelles.webp",     instagramUrl: "https://www.instagram.com/lukascelles" },
  { slug: "alex-truchot",       image: "/images/drivers/driver-13-truchot.webp",     instagramUrl: "https://www.instagram.com/sandrotruchot" },
  { slug: "stan-ratajski",      image: "/images/drivers/driver-14-ratajski.webp",    instagramUrl: "https://www.instagram.com/magicstan01" },
];

async function main() {
  console.log(`→ Logging in on ${BASE} as ${EMAIL}…`);
  const cookies = await login();
  console.log("✔ Logged in");

  // ------------------------------------------------------------
  // Homepage — rollback all to /images/* (PDF asks only for text
  // changes on this page, not image changes).
  // ------------------------------------------------------------
  await patchGlobal(cookies, "homepage", {
    heroBackgroundImage: "/images/hero.webp",
  });

  // ------------------------------------------------------------
  // About page — rollback everything to original /images/* except
  // the ACCÉLÈRE banner which was explicitly updated by the client
  // (p6: "je l'ai retravaillé sur photoshop, il est dispo sur le drive").
  // Uses /assets/v2/about/accelere.webp (regenerated from drive asset).
  // ------------------------------------------------------------
  await patchGlobal(cookies, "about-page", {
    heroBackgroundImage: "/images/about/hero.webp",
    coreAreas: [
      { number: "01", title: "Sport\nManagement",       text: "We guide drivers to the highest level of motorsport. Built on over two decades of experience, our deep understanding of the racing ecosystem allows us to identify talent early and shape tailored career strategies. Each driver is unique: one profile, one strategy.",                                       image: "/images/about/core-sport-management.webp" },
      { number: "02", title: "Image &\nBranding",       text: "We build influential profiles on and off the track. Through tailored positioning, media strategy and long-term personal branding, we strengthen the visibility, credibility and influence of drivers and rights holders.",                                                                        image: "/images/about/core-image-branding.webp" },
      { number: "03", title: "Commercial\nDevelopment", text: "We create high-impact partnerships across the motorsport ecosystem. By connecting drivers, brands and key stakeholders, we structure collaborations that generate long-term value for all parties involved.",                                                                                      image: "/images/about/core-commercial-development.webp" },
    ],
    instagramImages: [
      { image: "/images/about/instagram-1.webp" },
      { image: "/images/about/instagram-2.webp" },
      { image: "/images/about/instagram-3.webp" },
      { image: "/images/about/instagram-4.webp" },
      { image: "/images/about/instagram-5.webp" },
    ],
  });

  // ------------------------------------------------------------
  // Services page — hero image + Hintsa partnership image are the
  // ONLY two the client asked to change in the PDF (p8 & p11).
  // Everything else rolls back to the original /images/services/*.
  // ------------------------------------------------------------
  await patchGlobal(cookies, "services-page", {
    heroBackgroundImage: "/assets/v2/services/hero.webp",
    talentCards: [
      { title: "Mentorship", image: "/images/services/talent-mentorship.webp" },
      { title: "Commercial", image: "/images/services/talent-commercial.webp" },
      { title: "Network",    image: "/images/services/talent-network.webp" },
      { title: "Contracts",  image: "/images/services/talent-contracts.webp" },
      { title: "Branding",   image: "/images/services/talent-branding.webp" },
    ],
    valueCards: [
      { title: "Partnerships &\nStructuring",    image: "/images/services/value-partnerships.webp" },
      { title: "Network &\nIntroductions",       image: "/images/services/value-network.webp" },
      { title: "Activation &\nContent",          image: "/images/services/value-activation.webp" },
      { title: "Private\nExperiences",           image: "/images/services/value-private.webp" },
    ],
    caseStudies: [
      { title: "",                              image: "/images/services/case-left.webp",   dimmed: true },
      { title: "Scuderia Alpha Tauri x Fantom", image: "/images/services/case-center.webp",
        description: "During the 2022 season, The Grid structured the partnership between fintech company Fantom and Scuderia AlphaTauri, positioning Fantom as one of the team's main sponsors. Throughout the year, the brand gained high-profile visibility through Pierre Gasly and Yuki Tsunoda, with logo placement on their helmets and on the AT03's nose and halo.", dimmed: false },
      { title: "Nyck de Vries x Omnes",         image: "/images/services/case-right.webp",  dimmed: true },
    ],
  });

  // ------------------------------------------------------------
  // Contact page — rollback to /images/ (client did not request a
  // photo change for this page).
  // ------------------------------------------------------------
  await patchGlobal(cookies, "contact-page", {
    heroBackgroundImage: "/images/contact/backdrop.webp",
  });

  // ------------------------------------------------------------
  // Drivers page — hero-collage is the ONE thing the client asked
  // to change on this page ("la photo du fond a été modifiée,
  // disponible dans le drive"). Uses /assets/v2/drivers/hero-collage.webp
  // regenerated from the client's drive asset.
  // ------------------------------------------------------------
  await patchGlobal(cookies, "drivers-page", {
    heroBackgroundImage: "/assets/v2/drivers/hero-collage.webp",
  });

  // ------------------------------------------------------------
  // Drivers collection — rollback images + apply Instagram URLs
  // from the client drive PDF.
  // ------------------------------------------------------------
  for (const { slug, image, instagramUrl } of DRIVERS) {
    const doc = await findDocBy(cookies, "drivers", { slug });
    if (!doc) {
      console.error(`!! driver not found: ${slug}`);
      continue;
    }
    await patchDoc(cookies, "drivers", doc.id, { image, instagramUrl });
  }

  // ------------------------------------------------------------
  // Team members — rollback photos + apply LinkedIn URLs from PDF.
  // ------------------------------------------------------------
  const teamJeremy = await findDocBy(cookies, "team-members", { name: "Jérémy Satis" });
  if (teamJeremy) {
    await patchDoc(cookies, "team-members", teamJeremy.id, {
      image: "/images/about/team-jeremy.webp",
      linkedinUrl: "https://www.linkedin.com/in/j%C3%A9r%C3%A9my-satis-7a386294/",
    });
  }
  const teamLaura = await findDocBy(cookies, "team-members", { name: "Laura Fredel" });
  if (teamLaura) {
    await patchDoc(cookies, "team-members", teamLaura.id, {
      image: "/images/about/team-laura.webp",
      linkedinUrl: "https://www.linkedin.com/in/laura-fredel-35b27a1b8/",
    });
  }

  console.log("\n✔ Rollback + client-requested updates applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
