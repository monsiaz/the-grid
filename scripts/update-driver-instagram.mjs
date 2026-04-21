/**
 * Update driver Instagram URLs via Payload REST API.
 * Run: node scripts/update-driver-instagram.mjs
 */

const BASE = "http://localhost:3000";
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL || "test@mailto.com";
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD || "Thegrid2026!";

const INSTAGRAM_MAP = {
  "pierre-gasly":       "https://www.instagram.com/pierregasly",
  "isack-hadjar":       "https://www.instagram.com/isackhadjar",
  "frederic-makowiecki":"https://www.instagram.com/fred.makowiecki",
  "kush-maini":         "https://www.instagram.com/kushmainiofficial",
  "alessandro-giusti":  "https://www.instagram.com/giusti_alessandro_",
  "enzo-deligny":       "https://www.instagram.com/forza.enzo",
  "andrea-dupe":        "https://www.instagram.com/andrea_dupe",
  "nathan-tye":         "https://www.instagram.com/nathantyejnr",
  "vivek-kanthan":      "https://www.instagram.com/vivekkanthan",
  "jack-iliffe":        "https://www.instagram.com/jack.iliffe",
  "jack-illiffe":       "https://www.instagram.com/jack.iliffe",
  "louis-cochet":       "https://www.instagram.com/louis_cochet_official",
  "luka-scelles":       "https://www.instagram.com/lukascelles",
  "alessandro-truchot": "https://www.instagram.com/sandrotruchot",
  "stan-ratajski":      "https://www.instagram.com/magicstan01",
};

async function login() {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) throw new Error("Login failed: " + JSON.stringify(data));
  return data.token;
}

async function main() {
  const token = await login();
  console.log("✅ Logged in");

  // Fetch all drivers
  const res = await fetch(`${BASE}/api/drivers?limit=100&depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  });
  const { docs } = await res.json();
  console.log(`Found ${docs.length} drivers`);

  let updated = 0;
  for (const driver of docs) {
    const slug = driver.slug;
    const instagramUrl = INSTAGRAM_MAP[slug];
    if (!instagramUrl) {
      console.log(`⚠️  No Instagram mapping for: ${slug}`);
      continue;
    }
    const patch = await fetch(`${BASE}/api/drivers/${driver.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ instagramUrl }),
    });
    if (patch.ok) {
      console.log(`✅ ${driver.name} (${slug}) → ${instagramUrl}`);
      updated++;
    } else {
      console.log(`❌ Failed ${slug}: ${patch.status}`);
    }
  }

  console.log(`\nDone: ${updated}/${docs.length} updated.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
