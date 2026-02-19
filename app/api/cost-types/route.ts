import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const costTypes = await prisma.costType.findMany({
    orderBy: { description: "asc" },
  });
  return NextResponse.json(costTypes);
}
