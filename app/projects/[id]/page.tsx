import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Edit, Trash2, Plus } from "lucide-react";
import { notFound } from "next/navigation";

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: {
      city: true,
      serviceType: true,
      employeePrices: {
        include: { employeeType: true },
        orderBy: { id: "asc" },
      },
    },
  });

  return project;
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  // Calculate employee costs total
  const employeeCostsTotal = project.employeePrices.reduce((sum, ep) => sum + ep.totalPrice, 0);
  const otherCostsTotal = project.gasFoodWater + project.bama + project.checker;

  return (
    <AppLayout>
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
        <Button variant="ghost" size="sm" asChild>
          <a href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-xl font-semibold">{project.projectName}</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm" asChild>
            <a href={`/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Project Overview */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium">{project.city.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium">{project.serviceType.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{new Date(project.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{project.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Floors</p>
                <p className="font-medium">{project.floors || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Days</p>
                <p className="font-medium">{project.days || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Material</p>
                <p className="font-medium">{project.material || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  {project.days && project.days > 0 ? "Active" : "Completed"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Prices */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-primary">Employee Prices</CardTitle>
            <Button size="sm" asChild>
              <a href={`/projects/${project.id}/employee-prices/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee Price
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {project.employeePrices.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No employee prices added yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Type</TableHead>
                    <TableHead>Day Rate</TableHead>
                    <TableHead>Work Days</TableHead>
                    <TableHead>By Plan</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.employeePrices.map((ep) => (
                    <TableRow key={ep.id}>
                      <TableCell className="font-medium">{ep.employeeType.description}</TableCell>
                      <TableCell>${ep.employeeType.dayRate}/day</TableCell>
                      <TableCell>{ep.workDays}</TableCell>
                      <TableCell>{ep.byPlan === 1 ? "By Plan" : "By Mistake"}</TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        ${ep.totalPrice.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="border-t-2 border-border bg-secondary/50">
                    <TableCell className="font-bold" colSpan={4}>
                      Employee Costs Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      ${employeeCostsTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Cost Summary */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas/Food/Water</span>
                <span>${project.gasFoodWater.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bama</span>
                <span>${project.bama.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checker</span>
                <span>${project.checker.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Costs</span>
                <span>${employeeCostsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-lg">Total Project Cost</span>
                <span className="font-bold text-xl text-primary neon-glow-text">
                  ${project.totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
