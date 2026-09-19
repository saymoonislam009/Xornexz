import { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

export default function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, b: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-[#0E1018] border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-white/70 font-medium border-b border-white/10">
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`px-6 py-4 ${col.sortable ? 'cursor-pointer select-none hover:text-white' : ''}`}
                  onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && sortConfig?.key === col.accessorKey && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((item, i) => (
              <tr 
                key={i} 
                className={`text-white/90 hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 whitespace-nowrap">
                    {col.cell ? col.cell(item) : (item as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-white/50">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Basic Pagination placeholder */}
      <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between text-white/50 text-sm">
        <span>Showing {data.length} results</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
