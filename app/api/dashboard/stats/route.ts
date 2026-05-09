import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue,
      recentProjects,
      projectsByServiceType,
      projectsByCity,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { days: { gt: 0 } } }),
      prisma.project.count({ where: { days: { lte: 0 } } }),
      prisma.project.aggregate({ _sum: { totalPaid: true } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { city: true, serviceType: true },
      }),
      prisma.serviceType.findMany({
        include: { _count: { select: { projects: true } } },
        orderBy: { description: "asc" },
      }),
      prisma.city.findMany({
        include: { _count: { select: { projects: true } } },
        orderBy: { city: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue: totalRevenue._sum.totalPaid || 0,
      recentProjects,
      byServiceType: projectsByServiceType
        .filter((s) => s._count.projects > 0)
        .map((s) => ({ name: s.description, value: s._count.projects })),
      byCity: projectsByCity
        .filter((c) => c._count.projects > 0)
        .map((c) => ({ name: c.city, value: c._count.projects })),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
