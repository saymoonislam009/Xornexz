export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, ExternalLink, Code, Smartphone, Cloud, Brain, Shield, Cpu, Layers, Palette } from "lucide-react";
import StatusBadge from "@/components/admin/ui/StatusBadge";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  Code,
  Smartphone,
  Cloud,
  Brain,
  Shield,
  Cpu,
  Layers,
  Palette,
};

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Services</h1>
          <p className="text-gray-400 text-sm mt-1">Manage core engineering and consulting services.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-500/20 transition-all"
        >
          <Plus size={16} /> Add Service
        </Link>
      </div>

      <div className="bg-[#0B0D14] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-gray-400 font-medium border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Tagline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/90">
              {services.map((service) => {
                const IconComponent = ICON_MAP[service.icon] || Code;
                return (
                  <tr key={service.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-white">{service.title}</div>
                          <div className="text-xs text-gray-500">/services/{service.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-400">
                      {service.tagline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={service.isActive ? "Active" : "Inactive"}
                        type={service.isActive ? "success" : "default"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {service.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-white transition-colors"
                          title="View on public site"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/30 text-xs font-medium text-gray-300 hover:text-violet-300 transition-all"
                        >
                          <Edit size={13} /> Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No services configured. Click &quot;Add Service&quot; to create one.
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
