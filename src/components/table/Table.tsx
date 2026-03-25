import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// components
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableNoData from './TableNoData';

// hooks

interface TableProps {
  cols: {
    key: string;
    label: string;
    sortable?: boolean;
    parseNumber?: boolean;
    width?: string;
    render?: (item: any) => React.ReactNode;
  }[];
  cardView?: (item: any) => React.ReactNode;
  data: any[];
  motionKey?: string;
}

export default function Table({ cols, data, cardView, motionKey }: TableProps) {
  const isMobile = useMediaQuery({ breakpoint: '1024px' });

  return (
    <>
      {/* Desktop view */}
      <table className={cn('table w-full table-fixed', { hidden: isMobile && cardView })}>
        <TableHeader cols={cols} />
        <TableBody cols={cols} data={data} motionKey={motionKey} />
      </table>
      {data?.length === 0 && <TableNoData />}

      {/* Mobile view */}
      {cardView && isMobile && cardView(data)}
    </>
  );
}
