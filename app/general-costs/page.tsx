import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteGeneralCost } from "@/app/actions";

export default async function GeneralCostsPage() {
  const generalCosts = await prisma.generalCost.findMany({
    include: { costType: true },
    orderBy: { id: "asc" },
  });

  const costTypes = await prisma.costType.findMany({
    orderBy: { description: "asc" },
  });

  return (
    <AppLayout>
      <Header title="General Costs" action={{ label: "Add General Cost", href: "/general-costs/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All General Costs</CardTitle>
          </CardHeader>
          <CardContent>
            {generalCosts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No general costs found. Add your first general cost to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cost Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generalCosts.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.id}</TableCell>
                      <TableCell className="font-medium">{cost.costType.description}</TableCell>
                      <TableCell>
                        {cost.fromDay}/{cost.fromYear} - {cost.toDay}/{cost.toYear}
                      </TableCell>
                      <TableCell>${cost.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/general-costs/${cost.id}/edit`}
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={cost.id} action={deleteGeneralCost} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {costTypes.length > 0 && (
          <Card className="border-border/50 mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Available Cost Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {costTypes.map((type) => (
                  <span
                    key={type.id}
                    className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {type.description}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
