import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewEmployeeTypePage() {
  async function createEmployeeType(formData: FormData) {
    "use server";
    const description = formData.get("description") as string;
    const dayRate = formData.get("dayRate") as string;

    if (!description || !dayRate) {
      return { error: "All fields are required" };
    }

    await prisma.employeeType.create({
      data: {
        description,
        dayRate: parseFloat(dayRate),
      },
    });

    redirect("/employee-types");
  }

  return (
    <AppLayout>
      <Header title="Add Employee Type" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New Employee Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEmployeeType} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="e.g., Technician, Laborer, Supervisor"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dayRate" className="text-sm font-medium">
                  Day Rate ($) *
                </label>
                <input
                  type="number"
                  id="dayRate"
                  name="dayRate"
                  step="0.01"
                  min="0"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">Save Employee Type</Button>
                <Button type="button" variant="secondary" asChild>
                  <a href="/employee-types">Cancel</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
