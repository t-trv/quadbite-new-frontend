import { cn } from '@/utils/cn';

interface TableHeaderProps {
  cols: any;
}

export default function TableHeader({ cols }: TableHeaderProps) {
  return (
    <thead>
      <tr>
        {cols.map((col: any) => (
          <th
            key={col.key}
            style={{ width: col.width }}
            className={cn(
              'border-b border-gray-300 px-4 py-2 text-left text-sm h-12 text-gray-700 whitespace-normal wrap-break-word hover:text-bk-black ',
            )}
          >
            <div className="flex items-center">
              <span
                className={cn('select-none', col.sortable && 'cursor-pointer')}
                onClick={() => {
                  if (col.sortable) {
                  }
                }}
              >
                {col.label}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
