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
                  No cities found. <a href="/cities/new" className="text-primary hover:underline">Add a city</a> first.
                </p>
              )}
              {!hasServiceTypes && (
                <p className="text-muted-foreground">
                  No service types found. <a href="/service-types/new" className="text-primary hover:underline">Add a service type</a> first.
                </p>
              )}
              {!hasEmployeeTypes && (
                <p className="text-muted-foreground">
                  No employee types found. <a href="/employee-types/new" className="text-primary hover:underline">Add an employee type</a> first.
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
