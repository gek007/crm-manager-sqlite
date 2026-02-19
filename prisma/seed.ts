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
  const transportation = await prisma.costType.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, description: "Transportation" },
  });

  const equipment = await prisma.costType.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, description: "Equipment Rental" },
  });

  const office = await prisma.costType.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, description: "Office Supplies" },
  });

  const utilities = await prisma.costType.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, description: "Utilities" },
  });

  // Create General Costs
  await prisma.generalCost.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      costTypeId: 1,
      fromYear: 2024,
      toYear: 2024,
      fromDay: 1,
      toDay: 31,
      total: 5000,
    },
  });

  await prisma.generalCost.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      costTypeId: 2,
      fromYear: 2024,
      toYear: 2024,
      fromDay: 1,
      toDay: 15,
      total: 3500,
    },
  });

  await prisma.generalCost.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      costTypeId: 3,
      fromYear: 2024,
      toYear: 2024,
      fromDay: 1,
      toDay: 30,
      total: 1200,
    },
  });

  await prisma.generalCost.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      costTypeId: 4,
      fromYear: 2024,
      toYear: 2024,
      fromDay: 1,
      toDay: 31,
      total: 2800,
    },
  });

  console.log("Database seeded successfully!");
  console.log("Cities:", await prisma.city.count());
  console.log("Service Types:", await prisma.serviceType.count());
  console.log("Employee Types:", await prisma.employeeType.count());
  console.log("Cost Types:", await prisma.costType.count());
  console.log("General Costs:", await prisma.generalCost.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
