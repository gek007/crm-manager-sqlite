import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
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
      <Header title="Типы сотрудников" action={{ label: "Add Employee Type", href: "/employee-types/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Все типы сотрудников</CardTitle>
          </CardHeader>
          <CardContent>
            {employeeTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Типов сотрудников пока нет. Добавьте тип для начала работы.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Ставка</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.description}</TableCell>
                      <TableCell>${type.dayRate}/день</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/employee-types/${type.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            <Edit className="h-4 w-4" />
                          </Link>
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
