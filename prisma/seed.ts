import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Deterministic pseudo-random (LCG) ───────────────────────────────────────
// Fixed seed → same data every reset, no randomness surprises.
function makeRng(seed: number) {
  let s = seed >>> 0;
  const next = () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0x100000000; };
  const int  = (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min;
  const pick = <T>(arr: T[]): T => arr[Math.floor(next() * arr.length)];
  const bool = (p = 0.5) => next() < p;
  return { next, int, pick, bool };
}

// ─── Reference data ───────────────────────────────────────────────────────────

const CITIES = [
  { id: 1, city: "Tel Aviv",   region: "Tel Aviv District" },
  { id: 2, city: "Jerusalem",  region: "Jerusalem District" },
  { id: 3, city: "Haifa",      region: "Haifa District" },
  { id: 4, city: "Beer Sheva", region: "Southern District" },
];

const SERVICE_TYPES = [
  { id: 1, description: "Flooring" },
  { id: 2, description: "Painting" },
  { id: 3, description: "Electrical" },
  { id: 4, description: "Plumbing" },
];

const EMPLOYEE_TYPES = [
  { id: 1, description: "Technician", dayRate: 200 },
  { id: 2, description: "Laborer",    dayRate: 150 },
  { id: 3, description: "Supervisor", dayRate: 300 },
  { id: 4, description: "Engineer",   dayRate: 400 },
];

const COST_TYPES = [
  { id: 1, description: "Transportation" },
  { id: 2, description: "Equipment Rental" },
  { id: 3, description: "Office Supplies" },
  { id: 4, description: "Utilities" },
];

// ─── Project name pools ───────────────────────────────────────────────────────

const TELAVIV_NAMES = [
  "Rothschild Blvd Office Tower", "Neve Tzedek Penthouse", "HaYarkon Beachfront Residence",
  "Sarona Market Retail Space", "Azrieli Center Renovation", "Port Area Warehouse",
  "Florentin Loft Conversion", "Ramat Aviv Mall Unit", "HaTachana Complex",
  "Old North Apartment Block", "Jaffa Boutique Hotel", "Dizengoff Tower Fit-out",
  "Tel Aviv University Annex", "Holon Industrial Park", "Bat Yam Seafront Building",
  "Ramat HaSharon Villa", "Givatayim Office Campus", "HaShalom Tower Lobby",
];

const JERUSALEM_NAMES = [
  "Mamilla Hotel Renovation", "German Colony Residence", "Rehavia Heritage Villa",
  "Givat Ram University Hub", "Talpiot Industrial Unit", "Mount Scopus Campus Wing",
  "Malha Mall Fit-out", "Old City Guesthouse", "Har Hotzvim Tech Park",
  "Baka Townhouse Renovation", "Ein Kerem Medical Centre", "City Hall Annex",
  "Ramot Residential Block", "Gilo Community Centre", "Pisgat Ze'ev School",
];

const HAIFA_NAMES = [
  "Hadar Quarter Renovation", "Carmel Beach Residence", "Port of Haifa Terminal",
  "Technion Campus Building", "Bat Galim Promenade", "Nesher Industrial Unit",
  "German Colony Boutique", "Horev Centre Retail", "Kiryat Motzkin Apartments",
  "Matam Tech Park Fit-out", "Carmelite Tunnel Facility", "Haifa University Wing",
  "Kiryat Haim Warehouse", "Merkaz HaCarmel Tower", "Grand Canary Hotel Lobby",
];

const BEERSHEVA_NAMES = [
  "BGU Campus Expansion", "Old City Market Renovation", "Soroka Medical Centre",
  "Beer Sheva Mall Unit", "Omer Industrial Zone", "Ramat HaNegev Research Hub",
  "Gav Yam Negev Tech Park", "Ramot Residential Block", "City Tower Office",
];

const CITY_NAMES: Record<number, string[]> = {
  1: TELAVIV_NAMES,
  2: JERUSALEM_NAMES,
  3: HAIFA_NAMES,
  4: BEERSHEVA_NAMES,
};

const CITY_ADDRESSES: Record<number, string[]> = {
  1: ["Rothschild Blvd", "Dizengoff St", "Ben Yehuda St", "HaYarkon St", "Ibn Gabirol St", "Allenby St"],
  2: ["Jaffa Rd", "King George St", "Emek Refaim St", "Ben Yehuda St", "Hillel St", "Keren HaYesod St"],
  3: ["HaNassi Blvd", "Moriah Ave", "Sderot HaZionut", "HaAtzmaut Rd", "Allenby St", "Derech HaYam"],
  4: ["Rager Blvd", "Ben Gurion Blvd", "HaAtzmaut St", "Herzl St", "Henrietta Szold St", "Derech Hebron"],
};

const MATERIALS: Record<number, (string | null)[]> = {
  1: ["Ceramic tiles", "Marble", "Porcelain", "Hardwood", "Vinyl", "Granite", "Epoxy coating", null],
  2: ["Interior emulsion", "Exterior paint", "Textured finish", "Anti-mould paint", "Epoxy paint", null],
  3: [null, null, "Cable 2.5mm", "LED panels", "Distribution boards", null],
  4: ["PVC pipes", "Copper pipes", null, "CPVC fittings", null],
};

// ─── Monthly project count distribution (May 2025 – Apr 2026) ────────────────
// Simulates a realistic construction business: busy autumn, slower summer.
const MONTHLY_COUNTS = [4, 5, 3, 3, 6, 7, 7, 5, 6, 6, 7, 5]; // 64 total

async function main() {
  // ── Lookup data ─────────────────────────────────────────────────────────────
  for (const { id, ...data } of CITIES)        await prisma.city.upsert({ where: { id }, update: data, create: { id, ...data } });
  for (const { id, ...data } of SERVICE_TYPES) await prisma.serviceType.upsert({ where: { id }, update: data, create: { id, ...data } });
  for (const { id, ...data } of EMPLOYEE_TYPES) await prisma.employeeType.upsert({ where: { id }, update: data, create: { id, ...data } });
  for (const { id, ...data } of COST_TYPES)    await prisma.costType.upsert({ where: { id }, update: data, create: { id, ...data } });

  // ── General costs — one entry per cost type per month ───────────────────────
  await prisma.generalCost.deleteMany({});
  const gcEntries: { costTypeId: number; fromYear: number; toYear: number; fromDay: number; toDay: number; total: number }[] = [];
  const rngGC = makeRng(42);
  // May 2025 – Apr 2026 = 12 months
  for (let m = 0; m < 12; m++) {
    const year  = m < 7 ? 2025 : 2026;
    const month = m < 7 ? m + 5 : m - 6; // 1-based month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (const ct of COST_TYPES) {
      gcEntries.push({
        costTypeId: ct.id,
        fromYear: year,
        toYear: year,
        fromDay: 1,
        toDay: daysInMonth,
        total: rngGC.int(800, 6000),
      });
    }
  }
  await prisma.generalCost.createMany({ data: gcEntries });

  // ── Projects ─────────────────────────────────────────────────────────────────
  await prisma.employeePrice.deleteMany({});
  await prisma.project.deleteMany({});

  const rng = makeRng(1337);
  const usedNames = new Set<string>();

  for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
    const count = MONTHLY_COUNTS[monthIdx];
    const year  = monthIdx < 7 ? 2025 : 2026;
    const month = monthIdx < 7 ? monthIdx + 5 : monthIdx - 6; // 1-based month

    for (let p = 0; p < count; p++) {
      const cityId       = rng.pick([1, 1, 1, 2, 2, 3, 3, 4]); // Dubai-heavy
      const serviceTypeId = rng.pick([1, 1, 2, 2, 3, 4]);
      const floors       = rng.bool(0.7) ? rng.int(1, 25) : null;
      const days         = rng.int(10, 75);
      const isLarge      = days > 45;

      // Unique project name
      const pool = CITY_NAMES[cityId];
      let projectName = rng.pick(pool);
      let attempt = 0;
      while (usedNames.has(projectName) && attempt < 20) {
        projectName = rng.pick(pool);
        attempt++;
      }
      if (usedNames.has(projectName)) projectName = `${projectName} ${year}`;
      usedNames.add(projectName);

      const address    = `${rng.pick(CITY_ADDRESSES[cityId])}, ${CITIES[cityId - 1].city}`;
      const material   = rng.pick(MATERIALS[serviceTypeId]);
      const gasFoodWater = rng.int(400, 3500);
      const bama       = rng.int(200, 2500);
      const checker    = rng.int(100, 1200);

      // Employee prices — each project gets 2-4 employee type entries
      const empEntries: { employeeTypeId: number; workDays: number; totalPrice: number; byPlan: number }[] = [];

      // Always has a Supervisor
      const supDays = rng.int(Math.floor(days * 0.5), days);
      empEntries.push({ employeeTypeId: 3, workDays: supDays, totalPrice: supDays * 300, byPlan: 1 });

      // Technician (always)
      const techDays = rng.int(Math.floor(days * 0.6), days);
      empEntries.push({ employeeTypeId: 1, workDays: techDays, totalPrice: techDays * 200, byPlan: rng.bool(0.8) ? 1 : 2 });

      // Laborer (70% chance)
      if (rng.bool(0.7)) {
        const labDays = rng.int(Math.floor(days * 0.4), days);
        empEntries.push({ employeeTypeId: 2, workDays: labDays, totalPrice: labDays * 150, byPlan: rng.bool(0.75) ? 1 : 2 });
      }

      // Engineer on large projects (40% chance)
      if (isLarge && rng.bool(0.4)) {
        const engDays = rng.int(5, Math.floor(days * 0.3));
        empEntries.push({ employeeTypeId: 4, workDays: engDays, totalPrice: engDays * 400, byPlan: 1 });
      }

      const employeeCost = empEntries.reduce((s, e) => s + e.totalPrice, 0);
      const overhead     = gasFoodWater + bama + checker;
      // totalPaid is what the client paid — employee cost + overhead + margin (15-45%)
      const margin       = rng.next() * 0.3 + 0.15;
      const totalPaid    = Math.round((employeeCost + overhead) * (1 + margin) / 100) * 100;

      // Spread project dates across the month
      const day = rng.int(1, 28);
      const date = new Date(year, month - 1, day);

      await prisma.project.create({
        data: {
          date,
          projectName,
          cityId,
          address,
          serviceTypeId,
          floors,
          days,
          material,
          gasFoodWater,
          bama,
          checker,
          totalPaid,
          employeePrices: { create: empEntries },
        },
      });
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  const [projects, empPrices, generalCosts] = await Promise.all([
    prisma.project.count(),
    prisma.employeePrice.count(),
    prisma.generalCost.count(),
  ]);

  console.log("\n✓ Database seeded successfully!\n");
  console.log(`  Cities:          ${await prisma.city.count()}`);
  console.log(`  Service Types:   ${await prisma.serviceType.count()}`);
  console.log(`  Employee Types:  ${await prisma.employeeType.count()}`);
  console.log(`  Cost Types:      ${await prisma.costType.count()}`);
  console.log(`  General Costs:   ${generalCosts}`);
  console.log(`  Projects:        ${projects}`);
  console.log(`  Employee Prices: ${empPrices}\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
