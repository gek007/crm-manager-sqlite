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
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { days: { gt: 0 } } }),
      prisma.project.count({ where: { days: { lte: 0 } } }),
      prisma.project.aggregate({ _sum: { totalPaid: true } }),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          city: true,
          serviceType: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalProjects,
      activeProjects,
      completedProjects,
      totalRevenue: totalRevenue._sum.totalPaid || 0,
      recentProjects,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
