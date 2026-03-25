import { cn } from '@/utils/cn';

interface TableBodyProps<T> {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    parseNumber?: boolean;
    width?: string;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
}

export default function TableBody<T>({ columns, data }: TableBodyProps<T>) {
  return (
    <tbody>
      {data?.map((item: any, index: number) => (
        <tr key={index} className={cn('border-b border-gray-300')}>
          {columns.map((col: any) => (
            <td
              key={col.key || index}
              style={{ width: col.width }}
              className={`h-12 px-4 py-2 text-sm font-semibold text-gray-500 whitespace-normal wrap-break-word ${col.maxWidth ? `max-w-${col.maxWidth}` : ''}`}
            >
              {col.render ? col.render(item) : item[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
