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
      title: "Нормативно-справочная информация",
      description: "Справочники, которые используются в проектах",
      items: [
        { label: "Города", count: stats.citiesCount, href: "/cities" },
        { label: "Типы услуг", count: stats.serviceTypesCount, href: "/service-types" },
        { label: "Типы сотрудников", count: stats.employeeTypesCount, href: "/employee-types" },
        { label: "Типы затрат", count: stats.costTypesCount, href: "/cost-types" },
      ],
    },
    {
      title: "Учёт затрат",
      description: "Общие затраты и типы затрат",
      items: [
        { label: "Общие затраты", count: "-", href: "/general-costs" },
      ],
    },
    {
      title: "База данных",
      description: "Сводная информация",
      items: [
        { label: "Всего проектов", count: stats.projectsCount, href: "/projects" },
      ],
    },
  ];

  return (
    <AppLayout>
      <Header title="Настройки" />

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
                    <span className="text-sm text-muted-foreground">{typeof item.count === "number" ? `${item.count} записей` : item.count}</span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">О приложении</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Версия</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">База данных</span>
              <span>SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Окружение</span>
              <span>Разработка</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
