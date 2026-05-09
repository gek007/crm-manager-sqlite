import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/projects/project-form";

export default async function NewProjectPage() {
  const cities = await prisma.city.findMany({ orderBy: { city: "asc" } });
  const serviceTypes = await prisma.serviceType.findMany({ orderBy: { description: "asc" } });
  const employeeTypes = await prisma.employeeType.findMany({ orderBy: { description: "asc" } });

  const hasCities = cities.length > 0;
  const hasServiceTypes = serviceTypes.length > 0;
  const hasEmployeeTypes = employeeTypes.length > 0;

  return (
    <AppLayout>
      <Header title="Новый проект" />

      <div className="p-6">
        {!hasCities || !hasServiceTypes || !hasEmployeeTypes ? (
          <Card className="max-w-2xl mx-auto border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Требуется настройка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!hasCities && (
                <p className="text-muted-foreground">
                  Города не найдены. Сначала <Link href="/cities/new" className="text-primary hover:underline">добавьте город</Link>.
                </p>
              )}
              {!hasServiceTypes && (
                <p className="text-muted-foreground">
                  Типы услуг не найдены. Сначала <Link href="/service-types/new" className="text-primary hover:underline">добавьте тип услуги</Link>.
                </p>
              )}
              {!hasEmployeeTypes && (
                <p className="text-muted-foreground">
                  Типы сотрудников не найдены. Сначала <Link href="/employee-types/new" className="text-primary hover:underline">добавьте тип сотрудника</Link>.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <ProjectForm
            cities={cities}
            serviceTypes={serviceTypes}
            employeeTypes={employeeTypes}
          />
        )}
      </div>
    </AppLayout>
  );
}
