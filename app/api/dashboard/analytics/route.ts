import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [projects, employeePrices] = await Promise.all([
      prisma.project.findMany({
        include: { city: true, serviceType: true },
        orderBy: { totalPaid: "desc" },
      }),
      prisma.employeePrice.findMany({
        include: { employeeType: true },
      }),
    ]);

    // KPIs
    const totalProjects = projects.length;
    const totalRevenue = projects.reduce((s, p) => s + p.totalPaid, 0);
    const avgRevenue = totalProjects > 0 ? totalRevenue / totalProjects : 0;
    const totalWorkDays = projects.reduce((s, p) => s + (p.days ?? 0), 0);
    const totalEmployeeCost = employeePrices.reduce((s, ep) => s + ep.totalPrice, 0);

    // Revenue by month — last 12 months
    const now = new Date();
    const monthlyMap = new Map<string, { label: string; revenue: number; count: number }>();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, {
        label: d.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" }),
        revenue: 0,
        count: 0,
      });
    }
    projects.forEach((p) => {
      const d = new Date(p.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const entry = monthlyMap.get(key);
      if (entry) {
        entry.revenue += p.totalPaid;
        entry.count += 1;
      }
    });
    const revenueByMonth = Array.from(monthlyMap.values()).map((e) => ({
      month: e.label,
      revenue: e.revenue,
      projects: e.count,
    }));

    // By service type
    const stMap = new Map<number, { name: string; value: number; revenue: number }>();
    projects.forEach((p) => {
      const e = stMap.get(p.serviceTypeId) ?? { name: p.serviceType.description, value: 0, revenue: 0 };
      e.value++;
      e.revenue += p.totalPaid;
      stMap.set(p.serviceTypeId, e);
    });
    const byServiceType = Array.from(stMap.values()).sort((a, b) => b.value - a.value);

    // By city
    const cityMap = new Map<number, { name: string; value: number; revenue: number }>();
    projects.forEach((p) => {
      const e = cityMap.get(p.cityId) ?? { name: p.city.city, value: 0, revenue: 0 };
      e.value++;
      e.revenue += p.totalPaid;
      cityMap.set(p.cityId, e);
    });
    const byCity = Array.from(cityMap.values()).sort((a, b) => b.value - a.value);

    // Employee cost by type
    const empMap = new Map<number, { name: string; value: number; days: number }>();
    employeePrices.forEach((ep) => {
      const e = empMap.get(ep.employeeTypeId) ?? { name: ep.employeeType.description, value: 0, days: 0 };
      e.value += ep.totalPrice;
      e.days += ep.workDays;
      empMap.set(ep.employeeTypeId, e);
    });
    const employeeCostByType = Array.from(empMap.values()).sort((a, b) => b.value - a.value);

    // Top 5 projects by revenue
    const topProjects = projects.slice(0, 5).map((p) => ({
      id: p.id,
      projectName: p.projectName,
      city: p.city.city,
      serviceType: p.serviceType.description,
      totalPaid: p.totalPaid,
      days: p.days,
      date: p.date,
    }));

    return NextResponse.json({
      kpis: { totalProjects, totalRevenue, avgRevenue, totalWorkDays, totalEmployeeCost },
      revenueByMonth,
      byServiceType,
      byCity,
      employeeCostByType,
      topProjects,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Не удалось загрузить аналитику" }, { status: 500 });
  }
}
