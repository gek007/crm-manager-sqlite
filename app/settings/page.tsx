import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [citiesCount, serviceTypesCount, employeeTypesCount, costTypesCount, projectsCount] =
    await Promise.all([
      prisma.city.count(),
      prisma.serviceType.count(),
      prisma.employeeType.count(),
      prisma.costType.count(),
      prisma.project.count(),
    ]);

  return {
    citiesCount,
    serviceTypesCount,
    employeeTypesCount,
    costTypesCount,
    projectsCount,
  };
}

export default async function SettingsPage() {
  const stats = await getStats();

  const sections = [
    {
      title: "Master Data",
      description: "Manage reference data used across projects",
      items: [
        { label: "Cities", count: stats.citiesCount, href: "/cities" },
        { label: "Service Types", count: stats.serviceTypesCount, href: "/service-types" },
        { label: "Employee Types", count: stats.employeeTypesCount, href: "/employee-types" },
        { label: "Cost Types", count: stats.costTypesCount, href: "/cost-types" },
      ],
    },
    {
      title: "Costs Management",
      description: "Manage general costs and cost types",
      items: [
        { label: "General Costs", count: "-", href: "/general-costs" },
      ],
    },
    {
      title: "Database",
      description: "Database information",
      items: [
        { label: "Total Projects", count: stats.projectsCount, href: "/projects" },
      ],
    },
  ];

  return (
    <AppLayout>
      <Header title="Settings" />

      <div className="p-6 space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{section.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {section.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">{typeof item.count === "number" ? `${item.count} items` : item.count}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Application Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Database</span>
              <span>SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment</span>
              <span>Development</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
