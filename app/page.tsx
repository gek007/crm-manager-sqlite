"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, CheckCircle, DollarSign, FileSpreadsheet } from "lucide-react";

interface Project {
  id: number;
  projectName: string;
  date: string;
  city: { city: string };
  serviceType: { description: string };
  totalPaid: number;
}

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  recentProjects: Project[];
}

async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch('/api/dashboard/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string; filePath?: string; fileName?: string } | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleExportToExcel = async () => {
    setExporting(true);
    setExportResult(null);

    try {
      const response = await fetch('/api/export/excel', {
        method: 'POST',
      });

      const result = await response.json();
      setExportResult(result);
    } catch (error) {
      setExportResult({ success: false, message: 'Failed to export to Excel' });
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    {
      title: "Total Projects",
      value: stats?.totalProjects || 0,
      icon: Building2,
      color: "text-primary",
    },
    {
      title: "Active Projects",
      value: stats?.activeProjects || 0,
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: stats?.completedProjects || 0,
      icon: CheckCircle,
      color: "text-primary",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
    },
  ];

  return (
    <AppLayout>
      <Header
        title="Dashboard"
        action={{ label: "New Project", href: "/projects/new" }}
      />

      <div className="p-6 space-y-6">
        {/* Export Button */}
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Export to Excel</h3>
                  <p className="text-sm text-muted-foreground">
                    Export all data from all tables to Excel format
                  </p>
                </div>
              </div>
              <Button
                onClick={handleExportToExcel}
                disabled={exporting || loading}
                className="neon-glow"
              >
                {exporting ? "Exporting..." : "Convert to Excel"}
              </Button>
            </div>

            {exportResult && (
              <div className={`mt-4 p-3 rounded-lg ${exportResult.success ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                {exportResult.success ? (
                  <div className="text-sm">
                    <p className="font-medium mb-1">{exportResult.message}</p>
                    {exportResult.filePath && (
                      <p className="text-xs">File saved to: <code className="bg-background px-1 rounded">{exportResult.filePath}</code></p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{exportResult.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Loading...</p>
            ) : !stats || stats.recentProjects.length === 0 ? (
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
                        ${project.totalPaid.toLocaleString()}
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
        {stats && stats.totalProjects === 0 && (
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
