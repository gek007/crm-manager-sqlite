import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewServiceTypePage() {
  async function createServiceType(formData: FormData) {
    "use server";
    const description = formData.get("description") as string;

    if (!description) {
      return { error: "Description is required" };
    }

    await prisma.serviceType.create({
      data: { description },
    });

    redirect("/service-types");
  }

  return (
    <AppLayout>
      <Header title="Add Service Type" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createServiceType} className="space-y-4">
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
                  placeholder="e.g., Flooring, Painting, Electrical"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">Save Service Type</Button>
                <Button type="button" variant="secondary" asChild>
                  <a href="/service-types">Cancel</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
