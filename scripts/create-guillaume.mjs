#!/usr/bin/env node
/**
 * Creates or updates Guillaume Le Goff as a team-member document in Payload CMS.
 * Run: node scripts/create-guillaume.mjs
 * Uses BASE_URL env var (default: http://localhost:3000).
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SECRET = process.env.TRANSLATE_SECRET || "791a98805d94c41c3449503402bd590e01653fa168091192bb38665c4439f229";

const MEMBER = {
  name: "Guillaume Le Goff",
  role: "Founder & Partner",
  image: "/assets/v2/about/guillaume-le-goff.webp",
  linkedinUrl: "https://www.linkedin.com/in/glegoff/",
  bio: "With 20 years of experience in motorsport, Guillaume has worked across multiple roles in the paddock. He served as a simulation & race engineer for ART Grand Prix for six years before co-founding AOTech — a company specialising in simulators, aerodynamics, and composite parts manufacturing — in 2010. After a two-year stint at McLaren in a business development position, Guillaume went on to found Soter Analytics, a tech start-up, and The Grid Agency simultaneously in 2018. Both businesses thrived, and Guillaume chose to focus exclusively on The Grid in 2021.",
  order: 1,
};

async function run() {
  // Check existing
  const listR = await fetch(`${BASE}/api/team-members?where[name][equals]=Guillaume Le Goff&limit=1`, {
    headers: { "x-translate-secret": SECRET },
  });
  const list = await listR.json();

  if (list.docs && list.docs.length > 0) {
    const id = list.docs[0].id;
    console.log(`Updating existing Guillaume (id: ${id})…`);
    const r = await fetch(`${BASE}/api/team-members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-translate-secret": SECRET },
      body: JSON.stringify(MEMBER),
    });
    if (r.ok) {
      console.log("✅ Updated");
    } else {
      console.error("❌", r.status, await r.text());
    }
  } else {
    console.log("Creating Guillaume…");
    const r = await fetch(`${BASE}/api/team-members`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-translate-secret": SECRET },
      body: JSON.stringify(MEMBER),
    });
    if (r.ok) {
      const d = await r.json();
      console.log("✅ Created, id:", d.doc?.id || d.id);
    } else {
      console.error("❌", r.status, await r.text());
    }
  }
}

run().catch(console.error);
