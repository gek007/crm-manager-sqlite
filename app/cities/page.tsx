import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit, Trash2 } from "lucide-react";

async function getCities() {
  return prisma.city.findMany({
    orderBy: { city: "asc" },
  });
}

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <AppLayout>
      <Header title="Cities" action={{ label: "Add City", href: "/cities/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All Cities</CardTitle>
          </CardHeader>
          <CardContent>
            {cities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No cities found. Add your first city to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell>{city.id}</TableCell>
                      <TableCell className="font-medium">{city.city}</TableCell>
                      <TableCell>{city.region || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/cities/${city.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
