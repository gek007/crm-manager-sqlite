"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartEntry { name: string; value: number; revenue: number; }
interface MonthEntry { month: string; revenue: number; projects: number; }
interface TopProject {
  id: number;
  projectName: string;
  city: string;
  serviceType: string;
  totalPaid: number;
  days: number | null;
  date: string;
}
interface Analytics {
  kpis: { totalProjects: number; totalRevenue: number; avgRevenue: number; totalWorkDays: number; totalEmployeeCost: number; };
  revenueByMonth: MonthEntry[];
  byServiceType: ChartEntry[];
  byCity: ChartEntry[];
  employeeCostByType: ChartEntry[];
  topProjects: TopProject[];
}

function isAnalyticsBody(raw: unknown): raw is Analytics {
  if (raw == null || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  const kpis = o.kpis;
  if (kpis == null || typeof kpis !== "object") return false;
  const k = kpis as Record<string, unknown>;
  const kpisNums = ["totalProjects", "totalRevenue", "avgRevenue", "totalWorkDays", "totalEmployeeCost"] as const;
  for (const key of kpisNums) {
    if (typeof k[key] !== "number" || Number.isNaN(k[key] as number)) return false;
  }
  const arrays = ["revenueByMonth", "byServiceType", "byCity", "employeeCostByType", "topProjects"] as const;
  for (const key of arrays) {
    if (!Array.isArray(o[key])) return false;
  }
  return true;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = ["#d4a547", "#6a9e8a", "#5b8bb8", "#a07ab0", "#b87070"];

const fmt$ = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `$${(n / 1_000).toFixed(1)}k`
  : `$${n.toLocaleString()}`;

const tooltipStyle = {
  backgroundColor: "#14161e",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  fontSize: 12,
  color: "rgba(255,255,255,0.8)",
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, icon: Icon, color, trend,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string;
  trend?: "up" | "down" | "neutral";
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor = trend === "up" ? "#6a9e8a" : trend === "down" ? "#b87070" : "rgba(255,255,255,0.3)";

  return (
    <Card className="fade-up">
      <CardContent className="pt-3 pb-2.5">
        <div className="flex items-start justify-between mb-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: color + "20" }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color }} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs font-medium" style={{ color: trendColor }}>
              <TrendIcon className="h-3 w-3" />
              {trend === "up" ? "Up" : trend === "down" ? "Down" : "—"}
            </div>
          )}
        </div>
        <p
          className="text-xl font-bold mono tracking-tight mb-0.5"
          style={{ color: "#e8dfc8" }}
        >
          {value}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.6)" }}>
          {label}
        </p>
        {sub && (
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Donut center (uses polar viewBox from <Label /> inside <Pie />)

function donutCenterTexts(viewBox: unknown, totalProjects: number) {
  if (viewBox == null || typeof viewBox !== "object" || !("cx" in viewBox) || !("cy" in viewBox)) return null;
  const cx = (viewBox as { cx?: unknown }).cx;
  const cy = (viewBox as { cy?: unknown }).cy;
  if (typeof cx !== "number" || typeof cy !== "number" || Number.isNaN(cx) || Number.isNaN(cy)) return null;
  return (
    <>
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" fill="#e8dfc8" fontSize={20} fontWeight={700}>
        {totalProjects}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.6)" fontSize={10}>
        total
      </text>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    (async () => {
      try {
        const r = await fetch("/api/dashboard/analytics");
        let body: unknown = null;
        try {
          body = await r.json();
        } catch {
          body = {};
        }

        if (cancelled) return;

        if (!r.ok) {
          const errMsg =
            body != null && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
              ? (body as { error: string }).error
              : `Request failed (${r.status})`;
          setFetchError(errMsg);
          setData(null);
          return;
        }

        if (!isAnalyticsBody(body)) {
          setFetchError("Unexpected analytics response.");
          setData(null);
          return;
        }

        setData(body);
      } catch (e) {
        if (!cancelled) {
          setFetchError(e instanceof Error ? e.message : "Unable to reach the server.");
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadKey]);

  const kpis = data?.kpis;

  const revTrend = (() => {
    if (!data) return "neutral" as const;
    const months = data.revenueByMonth.filter((m) => m.revenue > 0);
    if (months.length < 2) return "neutral" as const;
    const last = months[months.length - 1].revenue;
    const prev = months[months.length - 2].revenue;
    return last > prev ? "up" as const : last < prev ? "down" as const : "neutral" as const;
  })();

  if (loading) {
    return (
      <AppLayout>
        <Header title="Dashboard"  />
        <div className="flex items-center justify-center h-96">
          <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
            Loading analytics…
          </p>
        </div>
      </AppLayout>
    );
  }

  if (fetchError) {
    return (
      <AppLayout>
        <Header title="Dashboard"  />
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
              <p className="font-bold text-base" style={{ color: "#e8dfc8" }}>Analytics unavailable</p>
              <p className="text-sm text-center max-w-md" style={{ color: "rgba(255,255,255,0.3)" }}>
                {fetchError}
              </p>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-md border border-white/[0.12] hover:border-white/25 transition-colors"
                style={{ color: "#d4a547" }}
                onClick={() => setLoadKey((k) => k + 1)}
              >
                Retry
              </button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!data || kpis?.totalProjects === 0) {
    return (
      <AppLayout>
        <Header title="Dashboard"  />
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-20">
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(212,165,71,0.1)" }}
              >
                <Building2 className="h-7 w-7" style={{ color: "#d4a547" }} />
              </div>
              <div className="text-center">
                <p className="font-bold text-base" style={{ color: "#e8dfc8" }}>No projects yet</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Create your first project to see analytics here.
                </p>
              </div>
              <div className="flex gap-5 text-xs" style={{ color: "#d4a547" }}>
                <a href="/cities" className="hover:opacity-70 transition-opacity">Add Cities →</a>
                <a href="/service-types" className="hover:opacity-70 transition-opacity">Add Service Types →</a>
                <a href="/projects/new" className="hover:opacity-70 transition-opacity">New Project →</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header title="Dashboard"  />

      <div className="p-3 space-y-2">

        {/* ── KPI Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          <KpiCard label="Total Projects" value={String(kpis.totalProjects)} icon={Building2} color="#d4a547" trend="neutral" />
          <KpiCard label="Total Revenue" value={fmt$(kpis.totalRevenue)} sub="across all projects" icon={DollarSign} color="#6a9e8a" trend={revTrend} />
          <KpiCard label="Avg per Project" value={fmt$(kpis.avgRevenue)} icon={TrendingUp} color="#5b8bb8" />
          <KpiCard label="Work Days" value={kpis.totalWorkDays.toLocaleString()} sub="combined" icon={CalendarDays} color="#a07ab0" />
          <KpiCard
            label="Employee Costs"
            value={fmt$(kpis.totalEmployeeCost)}
            sub={`${Math.round((kpis.totalEmployeeCost / (kpis.totalRevenue || 1)) * 100)}% of revenue`}
            icon={Users}
            color="#b87070"
          />
        </div>

        {/* ── Revenue Trend ────────────────────────────────────────── */}
        <Card className="fade-up fade-up-1">
          <CardHeader className="pb-2">
            <CardTitle>Revenue — Last 12 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={data.revenueByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a547" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#d4a547" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmt$(v)} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} width={52} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [fmt$(value as number), "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d4a547"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={{ r: 3, fill: "#d4a547", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#d4a547", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ── Middle Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

          {/* By service type */}
          <Card className="fade-up fade-up-2">
            <CardHeader className="pb-2">
              <CardTitle>By Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={data.byServiceType}
                    cx="40%" cy="50%"
                    innerRadius={56} outerRadius={86}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.byServiceType.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                    <Label content={(p) => donutCenterTexts(p.viewBox, kpis.totalProjects)} />
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [
                      `${value} · ${fmt$((data.byServiceType.find((s) => s.name === name)?.revenue) ?? 0)}`,
                      name,
                    ]}
                  />
                  <Legend
                    layout="vertical" align="right" verticalAlign="middle"
                    iconType="circle" iconSize={7}
                    formatter={(value) => (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* By city */}
          <Card className="fade-up fade-up-2">
            <CardHeader className="pb-2">
              <CardTitle>By City</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data.byCity} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.6)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12, fill: "rgba(255,255,255,0.75)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, _name, props) => [
                      `${value} project${value !== 1 ? "s" : ""} · ${fmt$(props.payload.revenue)}`,
                      props.payload.name,
                    ]}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
                    {data.byCity.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* ── Bottom Row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

          {/* Employee cost breakdown */}
          <Card className="fade-up fade-up-3">
            <CardHeader className="pb-2">
              <CardTitle>Employee Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {data.employeeCostByType.length === 0 ? (
                <p className="text-center py-10 text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                  No employee data
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie
                      data={data.employeeCostByType}
                      cx="40%" cy="50%"
                      innerRadius={56} outerRadius={86}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.employeeCostByType.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name, props) => [
                        `${fmt$(value as number)} · ${props.payload.days} days`,
                        name,
                      ]}
                    />
                    <Legend
                      layout="vertical" align="right" verticalAlign="middle"
                      iconType="circle" iconSize={7}
                      formatter={(value, entry: any) => (
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                          {value}
                          <span style={{ color: "rgba(255,255,255,0.55)", marginLeft: 6 }}>
                            {fmt$(entry.payload.value)}
                          </span>
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top projects */}
          <Card className="fade-up fade-up-3">
            <CardHeader className="pb-2">
              <CardTitle>Top Projects by Revenue</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <th className="text-left px-5 pb-2 text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Project</th>
                    <th className="text-left pb-2 text-[10px] font-semibold tracking-[0.1em] uppercase hidden sm:table-cell" style={{ color: "rgba(255,255,255,0.6)" }}>City</th>
                    <th className="text-right px-5 pb-2 text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProjects.map((p, i) => (
                    <tr
                      key={p.id}
                      className="table-row-hover transition-colors"
                      style={{ borderBottom: i < data.topProjects.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                            style={{ background: COLORS[i % COLORS.length] + "30", color: COLORS[i % COLORS.length] }}
                          >
                            {i + 1}
                          </span>
                          <span className="font-medium truncate max-w-[130px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {p.projectName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {p.city}
                      </td>
                      <td className="px-5 py-3 text-right font-bold mono" style={{ color: "#d4a547" }}>
                        {fmt$(p.totalPaid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
