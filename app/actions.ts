"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  citySchema,
  serviceTypeSchema,
  employeeTypeSchema,
  costTypeSchema,
  generalCostSchema,
  projectSchema,
  employeePriceEntrySchema,
} from "@/lib/schemas";

export type ActionResult = { error?: string } | void;

// ─── Cities ──────────────────────────────────────────────────

export async function createCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = citySchema.safeParse({
    city: formData.get("city"),
    region: formData.get("region") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.city.create({
    data: { city: parsed.data.city, region: parsed.data.region || null },
  });

  redirect("/cities");
}

export async function updateCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = citySchema.safeParse({
    city: formData.get("city"),
    region: formData.get("region") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.city.update({
    where: { id },
    data: { city: parsed.data.city, region: parsed.data.region || null },
  });

  redirect("/cities");
}

export async function deleteCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);

  const hasProjects = await prisma.project.count({ where: { cityId: id } });
  if (hasProjects > 0) {
    return { error: `Cannot delete: ${hasProjects} project(s) use this city` };
  }

  await prisma.city.delete({ where: { id } });
  redirect("/cities");
}

// ─── Service Types ───────────────────────────────────────────

export async function createServiceType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = serviceTypeSchema.safeParse({
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.serviceType.create({ data: parsed.data });
  redirect("/service-types");
}

export async function updateServiceType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = serviceTypeSchema.safeParse({
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.serviceType.update({ where: { id }, data: parsed.data });
  redirect("/service-types");
}

export async function deleteServiceType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);

  const hasProjects = await prisma.project.count({ where: { serviceTypeId: id } });
  if (hasProjects > 0) {
    return { error: `Cannot delete: ${hasProjects} project(s) use this service type` };
  }

  await prisma.serviceType.delete({ where: { id } });
  redirect("/service-types");
}

// ─── Employee Types ──────────────────────────────────────────

export async function createEmployeeType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = employeeTypeSchema.safeParse({
    description: formData.get("description"),
    dayRate: parseFloat(formData.get("dayRate") as string),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.employeeType.create({ data: parsed.data });
  redirect("/employee-types");
}

export async function updateEmployeeType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = employeeTypeSchema.safeParse({
    description: formData.get("description"),
    dayRate: parseFloat(formData.get("dayRate") as string),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.employeeType.update({ where: { id }, data: parsed.data });
  redirect("/employee-types");
}

export async function deleteEmployeeType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);

  const hasEmployeePrices = await prisma.employeePrice.count({ where: { employeeTypeId: id } });
  if (hasEmployeePrices > 0) {
    return { error: `Cannot delete: ${hasEmployeePrices} employee price record(s) reference this type` };
  }

  await prisma.employeeType.delete({ where: { id } });
  redirect("/employee-types");
}

// ─── Cost Types ──────────────────────────────────────────────

export async function createCostType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = costTypeSchema.safeParse({
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.costType.create({ data: parsed.data });
  redirect("/cost-types");
}

export async function updateCostType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = costTypeSchema.safeParse({
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.costType.update({ where: { id }, data: parsed.data });
  redirect("/cost-types");
}

export async function deleteCostType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);

  const hasGeneralCosts = await prisma.generalCost.count({ where: { costTypeId: id } });
  if (hasGeneralCosts > 0) {
    return { error: `Cannot delete: ${hasGeneralCosts} general cost(s) use this cost type` };
  }

  await prisma.costType.delete({ where: { id } });
  redirect("/cost-types");
}

// ─── General Costs ───────────────────────────────────────────

export async function createGeneralCost(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = generalCostSchema.safeParse({
    costTypeId: parseInt(formData.get("costTypeId") as string),
    fromYear: parseInt(formData.get("fromYear") as string),
    toYear: parseInt(formData.get("toYear") as string),
    fromDay: parseInt(formData.get("fromDay") as string),
    toDay: parseInt(formData.get("toDay") as string),
    total: parseFloat(formData.get("total") as string),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.generalCost.create({ data: parsed.data });
  redirect("/general-costs");
}

export async function updateGeneralCost(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = generalCostSchema.safeParse({
    costTypeId: parseInt(formData.get("costTypeId") as string),
    fromYear: parseInt(formData.get("fromYear") as string),
    toYear: parseInt(formData.get("toYear") as string),
    fromDay: parseInt(formData.get("fromDay") as string),
    toDay: parseInt(formData.get("toDay") as string),
    total: parseFloat(formData.get("total") as string),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.generalCost.update({ where: { id }, data: parsed.data });
  redirect("/general-costs");
}

export async function deleteGeneralCost(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  await prisma.generalCost.delete({ where: { id } });
  redirect("/general-costs");
}

// ─── Projects ────────────────────────────────────────────────

export async function createProject(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = projectSchema.safeParse({
    projectName: formData.get("projectName"),
    date: formData.get("date"),
    cityId: parseInt(formData.get("cityId") as string),
    address: formData.get("address"),
    serviceTypeId: parseInt(formData.get("serviceTypeId") as string),
    floors: formData.get("floors") ? parseInt(formData.get("floors") as string) : null,
    days: formData.get("days") ? parseInt(formData.get("days") as string) : null,
    material: (formData.get("material") as string) || null,
    gasFoodWater: parseFloat(formData.get("gasFoodWater") as string) || 0,
    bama: parseFloat(formData.get("bama") as string) || 0,
    checker: parseFloat(formData.get("checker") as string) || 0,
    totalPaid: parseFloat(formData.get("totalPaid") as string) || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const employeeTypeIds = formData.getAll("employeeTypeId");
  const workDaysList = formData.getAll("workDays");
  const byPlanList = formData.getAll("byPlan");

  const employeeEntries = [];
  for (let i = 0; i < employeeTypeIds.length; i++) {
    const entry = employeePriceEntrySchema.safeParse({
      employeeTypeId: parseInt(employeeTypeIds[i] as string),
      workDays: parseInt(workDaysList[i] as string),
      byPlan: parseInt(byPlanList[i] as string),
    });
    if (entry.success) {
      employeeEntries.push(entry.data);
    }
  }

  const employeeTypes = employeeEntries.length > 0
    ? await prisma.employeeType.findMany({
        where: { id: { in: employeeEntries.map((e) => e.employeeTypeId) } },
      })
    : [];

  const empTypeMap = new Map(employeeTypes.map((et) => [et.id, et.dayRate]));

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
      employeePrices: {
        create: employeeEntries
          .filter((e) => empTypeMap.has(e.employeeTypeId))
          .map((e) => ({
            employeeTypeId: e.employeeTypeId,
            workDays: e.workDays,
            totalPrice: e.workDays * (empTypeMap.get(e.employeeTypeId) ?? 0),
            byPlan: e.byPlan,
          })),
      },
    },
  });

  redirect(`/projects/${project.id}`);
}

export async function updateProject(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = parseInt(formData.get("id") as string);
  const parsed = projectSchema.safeParse({
    projectName: formData.get("projectName"),
    date: formData.get("date"),
    cityId: parseInt(formData.get("cityId") as string),
    address: formData.get("address"),
    serviceTypeId: parseInt(formData.get("serviceTypeId") as string),
    floors: formData.get("floors") ? parseInt(formData.get("floors") as string) : null,
    days: formData.get("days") ? parseInt(formData.get("days") as string) : null,
    material: (formData.get("material") as string) || null,
    gasFoodWater: parseFloat(formData.get("gasFoodWater") as string) || 0,
    bama: parseFloat(formData.get("bama") as string) || 0,
    checker: parseFloat(formData.get("checker") as string) || 0,
    totalPaid: parseFloat(formData.get("totalPaid") as string) || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const employeeTypeIds = formData.getAll("employeeTypeId");
  const workDaysList = formData.getAll("workDays");
  const byPlanList = formData.getAll("byPlan");

  const employeeEntries = [];
  for (let i = 0; i < employeeTypeIds.length; i++) {
    const entry = employeePriceEntrySchema.safeParse({
      employeeTypeId: parseInt(employeeTypeIds[i] as string),
      workDays: parseInt(workDaysList[i] as string),
      byPlan: parseInt(byPlanList[i] as string),
    });
    if (entry.success) {
      employeeEntries.push(entry.data);
    }
  }

  const employeeTypes = employeeEntries.length > 0
    ? await prisma.employeeType.findMany({
        where: { id: { in: employeeEntries.map((e) => e.employeeTypeId) } },
      })
    : [];

  const empTypeMap = new Map(employeeTypes.map((et) => [et.id, et.dayRate]));

  await prisma.$transaction([
    prisma.employeePrice.deleteMany({ where: { projectId: id } }),
    prisma.project.update({
      where: { id },
      data: {
        ...parsed.data,
        date: new Date(parsed.data.date),
        employeePrices: {
          create: employeeEntries
            .filter((e) => empTypeMap.has(e.employeeTypeId))
            .map((e) => ({
              employeeTypeId: e.employeeTypeId,
              workDays: e.workDays,
              totalPrice: e.workDays * (empTypeMap.get(e.employeeTypeId) ?? 0),
              byPlan: e.byPlan,
            })),
        },
      },
    }),
  ]);

  redirect(`/projects/${id}`);
}
