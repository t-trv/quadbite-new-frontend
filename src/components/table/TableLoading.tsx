import TableHeader from './TableHeader';
import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TableLoadingProps {
  cols: {
    key: string;
    label: string;
    width?: string;
  }[];
  rows?: number;
  className?: string;
}

export default function TableLoading({ cols, rows = 10, className }: TableLoadingProps) {
  const isMobile = useMediaQuery({ breakpoint: '1024px' });

  if (isMobile) {
    return (
      <div className={cn('flex flex-col gap-4 w-full', className)}>
        {Array.from({ length: 5 }).map((_, cardIndex) => (
          <div
            key={cardIndex}
            className="flex flex-col gap-2 border-b border-gray-200 pb-4 rounded-lg p-4 bg-white"
          >
            {/* Title Skeleton */}
            <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4 mb-2" />

            {/* Content Skeletons */}
            <div className="flex flex-col gap-3 px-2 mt-2">
              {Array.from({ length: 4 }).map((_, fieldIndex) => (
                <div key={fieldIndex} className="grid grid-cols-6 gap-2 items-center">
                  <div className="col-span-2 h-3 bg-gray-50 rounded animate-pulse w-2/3" />
                  <div className="col-span-4 h-3 bg-gray-100 rounded animate-pulse w-full" />
                </div>
              ))}
            </div>

            {/* Button Skeleton */}
            <div className="flex justify-end mt-4">
              <div className="h-8 bg-gray-100 rounded animate-pulse w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden bg-white', className)}>
      <table className="table w-full table-fixed overflow-hidden">
        <TableHeader cols={cols} />
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-100 last:border-0 h-13">
              {cols.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-1.5" style={{ width: col.width }}>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full max-w-[85%] mx-auto md:mx-0" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
