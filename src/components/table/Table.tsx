import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// components
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableNoData from './TableNoData';

// hooks

interface TableProps<T> {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    parseNumber?: boolean;
    width?: string;
    render?: (item: T) => React.ReactNode;
  }[];
  cardView?: (item: T[]) => React.ReactNode;
  data: T[];
}

export default function Table<T>({ columns, data, cardView }: TableProps<T>) {
  const isMobile = useMediaQuery({ breakpoint: '1024px' });

  return (
    <>
      {/* Desktop view */}
      <table className={cn('table w-full table-fixed', { hidden: isMobile && cardView })}>
        <TableHeader columns={columns} />
        <TableBody<T> columns={columns} data={data} />
      </table>
      {data?.length === 0 && <TableNoData />}

      {/* Mobile view */}
      {cardView && isMobile && cardView(data)}
    </>
  );
}
