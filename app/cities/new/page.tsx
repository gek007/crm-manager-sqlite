import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewCityPage() {
  async function createCity(formData: FormData) {
    "use server";
    const city = formData.get("city") as string;
    const region = formData.get("region") as string;

    if (!city) {
      return { error: "City name is required" };
    }

    await prisma.city.create({
      data: { city, region: region || null },
    });

    redirect("/cities");
  }

  return (
    <AppLayout>
      <Header title="Add City" />

      <div className="p-6">
        <Card className="max-w-2xl border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">New City</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCity} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City Name *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter city name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="region" className="text-sm font-medium">
                  Region
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter region (optional)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">Save City</Button>
                <Button type="button" variant="secondary" asChild>
                  <a href="/cities">Cancel</a>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
