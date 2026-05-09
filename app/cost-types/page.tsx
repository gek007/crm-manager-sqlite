import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteCostType } from "@/app/actions";

export default async function CostTypesPage() {
  const costTypes = await prisma.costType.findMany({ orderBy: { description: "asc" } });

  return (
    <AppLayout>
      <Header title="Cost Types" action={{ label: "Add Cost Type", href: "/cost-types/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All Cost Types</CardTitle>
          </CardHeader>
          <CardContent>
            {costTypes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No cost types found. Add your first cost type to get started.
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
                  {costTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>{type.id}</TableCell>
                      <TableCell className="font-medium">{type.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/cost-types/${type.id}/edit`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={type.id} action={deleteCostType} />
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
