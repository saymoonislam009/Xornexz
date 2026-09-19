import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number; // percentage
  trendLabel?: string;
}

export default function StatsCard({ title, value, icon, trend, trendLabel }: StatsCardProps) {
  return (
    <div className="bg-[#0E1018] border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/50 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className={cn(
            "flex items-center gap-1 font-medium",
            trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-white/50"
          )}>
            {trend > 0 ? <TrendingUp size={14} /> : trend < 0 ? <TrendingDown size={14} /> : null}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-white/40">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
