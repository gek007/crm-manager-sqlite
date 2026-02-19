import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit, Trash2 } from "lucide-react";

async function getServiceTypes() {
  return prisma.serviceType.findMany({
    orderBy: { description: "asc" },
  });
}

export default async function ServiceTypesPage() {
  const serviceTypes = await getServiceTypes();

  return (
    <AppLayout>
      <Header title="Service Types" action={{ label: "Add Service Type", href: "/service-types/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All Service Types</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No service types found. Add your first service type to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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
