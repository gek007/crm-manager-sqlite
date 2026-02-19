import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmployeePricesForm } from "@/components/projects/employee-prices-form";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const cities = await prisma.city.findMany({ orderBy: { city: "asc" } });
  const serviceTypes = await prisma.serviceType.findMany({ orderBy: { description: "asc" } });
  const employeeTypes = await prisma.employeeType.findMany({ orderBy: { description: "asc" } });

  async function createProject(formData: FormData) {
    "use server";

    const projectName = formData.get("projectName") as string;
    const date = formData.get("date") as string;
    const cityId = parseInt(formData.get("cityId") as string);
    const address = formData.get("address") as string;
    const serviceTypeId = parseInt(formData.get("serviceTypeId") as string);
    const floors = formData.get("floors") ? parseInt(formData.get("floors") as string) : null;
    const days = formData.get("days") ? parseInt(formData.get("days") as string) : null;
    const material = formData.get("material") as string || null;
    const gasFoodWater = formData.get("gasFoodWater") ? parseFloat(formData.get("gasFoodWater") as string) : 0;
    const bama = formData.get("bama") ? parseFloat(formData.get("bama") as string) : 0;
    const checker = formData.get("checker") ? parseFloat(formData.get("checker") as string) : 0;
    const totalPaid = formData.get("totalPaid") ? parseFloat(formData.get("totalPaid") as string) : 0;

    if (!projectName || !date || !cityId || !address || !serviceTypeId) {
      return { error: "Required fields are missing" };
    }

    const project = await prisma.project.create({
      data: {
        projectName,
        date: new Date(date),
        cityId,
        address,
        serviceTypeId,
        floors,
        days,
        material,
        gasFoodWater,
        bama,
        checker,
        totalPaid,
      },
    });

    // Handle employee prices - get all entries from the dynamic form
    const employeeTypeIds = formData.getAll("employeeTypeId");
    const workDaysList = formData.getAll("workDays");
    const byPlanList = formData.getAll("byPlan");

    for (let i = 0; i < employeeTypeIds.length; i++) {
      const empTypeId = parseInt(employeeTypeIds[i] as string);
      const workDays = parseInt(workDaysList[i] as string);
      const byPlan = parseInt(byPlanList[i] as string) as 1 | 2;

      if (empTypeId && workDays > 0) {
        const employeeType = await prisma.employeeType.findUnique({
          where: { id: empTypeId },
        });

        if (employeeType) {
          const totalPrice = workDays * employeeType.dayRate;
          await prisma.employeePrice.create({
            data: {
              projectId: project.id,
              employeeTypeId: empTypeId,
              workDays,
              totalPrice,
              byPlan,
            },
          });
        }
      }
    }

    redirect(`/projects/${project.id}`);
  }

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
                  • No cities found. <a href="/cities/new" className="text-primary hover:underline">Add a city</a> first.
                </p>
              )}
              {!hasServiceTypes && (
                <p className="text-muted-foreground">
                  • No service types found. <a href="/service-types/new" className="text-primary hover:underline">Add a service type</a> first.
                </p>
              )}
              {!hasEmployeeTypes && (
                <p className="text-muted-foreground">
                  • No employee types found. <a href="/employee-types/new" className="text-primary hover:underline">Add an employee type</a> first.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-5xl border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createProject} className="space-y-6" id="projectForm">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="projectName" className="text-sm font-medium">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium">
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cityId" className="text-sm font-medium">
                        City *
                      </label>
                      <select
                        id="cityId"
                        name="cityId"
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="serviceTypeId" className="text-sm font-medium">
                        Service Type *
                      </label>
                      <select
                        id="serviceTypeId"
                        name="serviceTypeId"
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select service type</option>
                        {serviceTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Project Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="floors" className="text-sm font-medium">
                        Floors
                      </label>
                      <input
                        type="number"
                        id="floors"
                        name="floors"
                        min="0"
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="days" className="text-sm font-medium">
                        Days
                      </label>
                      <input
                        type="number"
                        id="days"
                        name="days"
                        min="0"
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="material" className="text-sm font-medium">
                        Material
                      </label>
                      <input
                        type="text"
                        id="material"
                        name="material"
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Material type"
                      />
                    </div>
                  </div>
                </div>

                {/* Costs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Additional Costs</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="gasFoodWater" className="text-sm font-medium">
                        Gas/Food/Water ($)
                      </label>
                      <input
                        type="number"
                        id="gasFoodWater"
                        name="gasFoodWater"
                        step="0.01"
                        min="0"
                        defaultValue={0}
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bama" className="text-sm font-medium">
                        Bama ($)
                      </label>
                      <input
                        type="number"
                        id="bama"
                        name="bama"
                        step="0.01"
                        min="0"
                        defaultValue={0}
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="checker" className="text-sm font-medium">
                        Checker ($)
                      </label>
                      <input
                        type="number"
                        id="checker"
                        name="checker"
                        step="0.01"
                        min="0"
                        defaultValue={0}
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="totalPaid" className="text-sm font-medium">
                        Total Paid ($) *
                      </label>
                      <input
                        type="number"
                        id="totalPaid"
                        name="totalPaid"
                        step="0.01"
                        min="0"
                        defaultValue={0}
                        required
                        className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Employee Prices - Dynamic Form */}
                <EmployeePricesForm employeeTypes={employeeTypes} />

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button type="submit" className="neon-glow">Create Project</Button>
                  <Button type="button" variant="secondary" asChild>
                    <a href="/projects">Cancel</a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
