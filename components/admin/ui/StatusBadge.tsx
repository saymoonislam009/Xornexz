import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

export default function StatusBadge({ status, type = 'default', className }: StatusBadgeProps) {
  const variants = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    default: 'bg-white/5 text-white/70 border-white/10',
  };

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-xs font-medium border",
      variants[type],
      className
    )}>
      {status}
    </span>
  );
}
