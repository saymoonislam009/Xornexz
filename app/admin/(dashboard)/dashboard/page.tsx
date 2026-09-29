"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Plus, Briefcase } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/admin/ui/StatusBadge";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  status: string;
  createdAt: string;
}

interface ChartItem {
  name: string;
  leads: number;
  conversions: number;
}

interface DashboardData {
  stats: {
    totalLeads: number;
    newLeads: number;
    totalProjects: number;
    totalPosts: number;
  };
  recentLeads: LeadItem[];
  chartData: ChartItem[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((res) => res.json())
      .then((d) => {
        if (d?.stats) setData(d);
      })
      .catch((err) => console.error("Failed to load dashboard stats", err));
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading telemetry...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Leads",
      value: data.stats.totalLeads,
      icon: Users,
      trend: "+12% this month",
      gradient: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20",
      text: "text-blue-400",
    },
    {
      title: "New Inquiries",
      value: data.stats.newLeads,
      icon: CheckCircle,
      trend: "Requires attention",
      gradient: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
    },
    {
      title: "Active Projects",
      value: data.stats.totalProjects,
      icon: Briefcase,
      trend: "Portfolio showcase",
      gradient: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/20",
      text: "text-violet-400",
    },
    {
      title: "Articles Published",
      value: data.stats.totalPosts,
      icon: FileText,
      trend: "Knowledge base",
      gradient: "from-cyan-500/20 to-cyan-600/5",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mission Control</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time analytics, pipeline conversion, and system health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all"
          >
            <Plus size={14} /> Add Project
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-xs font-medium text-white shadow-lg shadow-violet-500/20 transition-all"
          >
            <Plus size={14} /> New Article
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl bg-[#0B0D14] border ${kpi.border} relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">{kpi.title}</span>
                <div className={`p-2 rounded-lg bg-white/5 ${kpi.text}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className={kpi.text} />
                  <span>{kpi.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Inquiries vs Conversions */}
        <div className="p-6 rounded-xl bg-[#0B0D14] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Pipeline Traffic & Conversions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly trajectory of inbound leads</p>
            </div>
            <span className="text-xs text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1F2430" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0E1018",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#leadGrad)"
                  name="Leads"
                />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#convGrad)"
                  name="Conversions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Deal Distribution */}
        <div className="p-6 rounded-xl bg-[#0B0D14] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Deal Volume Breakdown</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribution across key engineering verticals</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid stroke="#1F2430" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    backgroundColor: "#0E1018",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="leads" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={32} name="Qualified" />
                <Bar dataKey="conversions" fill="#06B6D4" radius={[4, 4, 0, 0]} maxBarSize={32} name="Won Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Inquiries & Leads</h2>
            <p className="text-xs text-gray-400 mt-0.5">Prospective clients requesting architectural audits</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors"
          >
            Open CRM <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">Contact</th>
                <th className="px-6 py-3.5">Company</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {data.recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    {lead.company || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={lead.status}
                      type={lead.status === "NEW" ? "info" : lead.status === "WON" ? "success" : "default"}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href="/admin/leads"
                      className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded border border-white/10 hover:border-white/20 transition-all"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {data.recentLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No inquiries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
