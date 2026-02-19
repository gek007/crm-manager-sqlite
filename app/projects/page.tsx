import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { Edit, Trash2, Eye } from "lucide-react";

async function getProjects() {
  return prisma.project.findMany({
    include: {
      city: true,
      serviceType: true,
    },
    orderBy: { date: "desc" },
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <AppLayout>
      <Header title="Projects" action={{ label: "New Project", href: "/projects/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No projects found. Create your first project to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>{project.id}</TableCell>
                      <TableCell className="font-medium">{project.projectName}</TableCell>
                      <TableCell>{project.city.city}</TableCell>
                      <TableCell>{project.serviceType.description}</TableCell>
                      <TableCell>{new Date(project.date).toLocaleDateString()}</TableCell>
                      <TableCell>{project.days || "-"}</TableCell>
                      <TableCell className="text-primary font-medium">
                        ${project.totalCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/projects/${project.id}`}>
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/projects/${project.id}/edit`}>
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
