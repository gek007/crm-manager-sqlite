import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.generalCost.findUnique({
    where: { id: parseInt(id) },
    include: { costType: true },
  });

  if (!item) {
    return NextResponse.json({ error: "General cost not found" }, { status: 404 });
  }

  return NextResponse.json(item);
}
