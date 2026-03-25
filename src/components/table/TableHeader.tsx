import { cn } from '@/utils/cn';

interface TableHeaderProps<T> {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    parseNumber?: boolean;
    width?: string;
    render?: (item: T) => React.ReactNode;
  }[];
}

export default function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col: any) => (
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
