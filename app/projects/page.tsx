import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { prisma } from "@/lib/prisma";
import { Edit, Eye } from "lucide-react";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";

const PAGE_SIZE = 20;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1"));

  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      include: { city: true, serviceType: true },
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.project.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AppLayout>
      <Header title="Projects" action={{ label: "New Project", href: "/projects/new" }} />

      <div className="p-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">
              All Projects
              {totalCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({totalCount} total)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No projects found. Create your first project to get started.
              </p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Total Paid</TableHead>
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
                          ${project.totalPaid.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <a href={`/projects/${project.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </a>
                            <a href={`/projects/${project.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </a>
                            <DeleteProjectButton projectId={project.id} projectName={project.projectName} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/projects" />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
