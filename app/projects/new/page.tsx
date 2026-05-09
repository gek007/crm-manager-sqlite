import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeePricesForm } from "@/components/projects/employee-prices-form";
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
      <Header title="New Project" />

      <div className="p-6">
        {!hasCities || !hasServiceTypes || !hasEmployeeTypes ? (
          <Card className="max-w-2xl mx-auto border-destructive/50">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Setup Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!hasCities && (
                <p className="text-muted-foreground">
                  No cities found. <Link href="/cities/new" className="text-primary hover:underline">Add a city</Link> first.
                </p>
              )}
              {!hasServiceTypes && (
                <p className="text-muted-foreground">
                  No service types found. <Link href="/service-types/new" className="text-primary hover:underline">Add a service type</Link> first.
                </p>
              )}
              {!hasEmployeeTypes && (
                <p className="text-muted-foreground">
                  No employee types found. <Link href="/employee-types/new" className="text-primary hover:underline">Add an employee type</Link> first.
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
