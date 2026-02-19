import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteEmployeeType } from "@/app/actions";

export default async function EmployeeTypesPage() {
  const employeeTypes = await prisma.employeeType.findMany({ orderBy: { description: "asc" } });

  return (
    <AppLayout>
      <Header title="Employee Types" action={{ label: "Add Employee Type", href: "/employee-types/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All Employee Types</CardTitle>
          </CardHeader>
          <CardContent>
            {employeeTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No employee types found. Add your first employee type to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Day Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.description}</TableCell>
                      <TableCell>${type.dayRate}/day</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <a href={`/employee-types/${type.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </a>
                          <DeleteButton id={type.id} action={deleteEmployeeType} />
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
