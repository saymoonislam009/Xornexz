import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShoppingBag, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-[#0E1018] border-r border-white/10 h-screen transition-all duration-300 flex flex-col relative",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center font-bold text-white">
            X
          </div>
        ) : (
          <h1 className="text-xl font-bold text-white tracking-wide">
            Xorn<span className="text-[#7C3AED]">exz</span>
          </h1>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#0E1018] border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                isActive 
                  ? "bg-[#7C3AED]/10 text-[#7C3AED]" 
                  : "text-white/70 hover:bg-white/5 hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-[#7C3AED]" : "text-white/70 group-hover:text-white")} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/10">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 flex items-center justify-center">
              <span className="text-[#7C3AED] font-semibold">AD</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-white/50 truncate">admin@xornexz.com</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#7C3AED] font-semibold">A</span>
          </div>
        )}
        
        <button className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors w-full",
          collapsed && "justify-center"
        )}>
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
