import { Search, Bell, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminTopBar() {
  const pathname = usePathname();
  
  // Basic breadcrumb generation
  const paths = pathname.split('/').filter(p => p);
  const title = paths[paths.length - 1] || 'Dashboard';

  return (
    <header className="h-16 bg-[#0A0B10] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <h2 className="text-lg font-semibold text-white capitalize">
          {title.replace(/-/g, ' ')}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-[#0E1018] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-white/70 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7C3AED] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
