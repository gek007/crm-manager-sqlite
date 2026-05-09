import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteCity } from "@/app/actions";

export default async function CitiesPage() {
  const cities = await prisma.city.findMany({ orderBy: { city: "asc" } });

  return (
    <AppLayout>
      <Header title="Города" action={{ label: "Add City", href: "/cities/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Все города</CardTitle>
          </CardHeader>
          <CardContent>
            {cities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Городов пока нет. Добавьте город для начала.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Город</TableHead>
                    <TableHead>Регион</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
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
                          <Link
                            href={`/cities/${city.id}/edit`}
                            className={buttonVariants({ variant: "ghost", size: "sm" })}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton id={city.id} action={deleteCity} />
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
