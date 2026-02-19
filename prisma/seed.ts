import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Cities
  const dubai = await prisma.city.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, city: "Dubai", region: "Dubai" },
  });

  const abuDhabi = await prisma.city.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, city: "Abu Dhabi", region: "Abu Dhabi" },
  });

  const riyadh = await prisma.city.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, city: "Riyadh", region: "Riyadh" },
  });

  // Create Service Types
  const flooring = await prisma.serviceType.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, description: "Flooring" },
  });

  const painting = await prisma.serviceType.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, description: "Painting" },
  });

  const electrical = await prisma.serviceType.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, description: "Electrical" },
  });

  // Create Employee Types
  const technician = await prisma.employeeType.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, description: "Technician", dayRate: 200 },
  });

  const laborer = await prisma.employeeType.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, description: "Laborer", dayRate: 150 },
  });

  const supervisor = await prisma.employeeType.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, description: "Supervisor", dayRate: 300 },
  });

  // Create Cost Types
  await prisma.costType.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, description: "Transportation" },
  });

  await prisma.costType.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, description: "Equipment Rental" },
  });

  console.log("Database seeded successfully!");
  console.log("Cities:", await prisma.city.count());
  console.log("Service Types:", await prisma.serviceType.count());
  console.log("Employee Types:", await prisma.employeeType.count());
  console.log("Cost Types:", await prisma.costType.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
