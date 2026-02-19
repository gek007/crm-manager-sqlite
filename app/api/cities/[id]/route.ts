import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const city = await prisma.city.findUnique({ where: { id: parseInt(id) } });

  if (!city) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }

  return NextResponse.json(city);
}
