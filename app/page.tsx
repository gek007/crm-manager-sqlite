import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Building2, TrendingUp, CheckCircle, DollarSign } from "lucide-react";

async function getDashboardStats() {
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalRevenue,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { days: { gt: 0 } } }),
    prisma.project.count({ where: { days: { lte: 0 } } }),
    prisma.project.aggregate({ _sum: { totalCost: true } }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        city: true,
        serviceType: true,
      },
    }),
  ]);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalRevenue: totalRevenue._sum.totalCost || 0,
    recentProjects,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      icon: Building2,
      color: "text-primary",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "text-primary",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <AppLayout>
      <Header title="Dashboard" action={{ label: "New Project", href: "/projects/new" }} />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Projects */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No projects yet. Create your first project to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{project.projectName}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.city.city} • {project.serviceType.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">
                        ${project.totalCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(project.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Welcome Card - Show when no projects */}
        {stats.totalProjects === 0 && (
          <Card className="border-primary/20 neon-glow">
            <CardHeader>
              <CardTitle className="text-xl">Welcome to CRM Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Get started by creating your first project. You'll need to set up some
                reference data first.
              </p>
              <div className="flex gap-4">
                <a
                  href="/cities"
                  className="text-primary hover:underline"
                >
                  Add Cities →
                </a>
                <a
                  href="/service-types"
                  className="text-primary hover:underline"
                >
                  Add Service Types →
                </a>
                <a
                  href="/employee-types"
                  className="text-primary hover:underline"
                >
                  Add Employee Types →
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
