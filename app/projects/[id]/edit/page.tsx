import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/projects/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id);

  const [project, cities, serviceTypes, employeeTypes] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: {
        employeePrices: {
          select: { employeeTypeId: true, workDays: true, byPlan: true },
        },
      },
    }),
    prisma.city.findMany({ orderBy: { city: "asc" } }),
    prisma.serviceType.findMany({ orderBy: { description: "asc" } }),
    prisma.employeeType.findMany({ orderBy: { description: "asc" } }),
  ]);

  if (!project) {
    notFound();
  }

  const projectData = {
    ...project,
    date: project.date.toISOString().split("T")[0],
  };

  return (
    <AppLayout>
      <Header title="Edit Project" />
      <div className="p-6">
        <ProjectForm
          cities={cities}
          serviceTypes={serviceTypes}
          employeeTypes={employeeTypes}
          project={projectData}
        />
      </div>
    </AppLayout>
  );
}
