import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteServiceType } from "@/app/actions";

export default async function ServiceTypesPage() {
  const serviceTypes = await prisma.serviceType.findMany({ orderBy: { description: "asc" } });

  return (
    <AppLayout>
      <Header title="Типы услуг" action={{ label: "Add Service Type", href: "/service-types/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Все типы услуг</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Типов услуг пока нет. Добавьте тип для начала работы.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/service-types/${type.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={type.id} action={deleteServiceType} />
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
