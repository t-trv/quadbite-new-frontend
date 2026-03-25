import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface TableBodyProps {
  cols: any;
  data: any;
  motionKey?: string;
}

export default function TableBody({ cols, data, motionKey }: TableBodyProps) {
  return (
    <tbody>
      {data?.map((item: any, index: number) => (
        <motion.tr
          key={motionKey ? item[motionKey] : index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.075 }}
          className={cn('border-b border-gray-300')}
        >
          {cols.map((col: any) => (
            <td
              key={col.key || index}
              style={{ width: col.width }}
              className={`h-12 px-4 py-2 text-sm font-semibold text-gray-500 whitespace-normal wrap-break-word ${col.maxWidth ? `max-w-${col.maxWidth}` : ''}`}
            >
              {col.render ? col.render(item) : item[col.key]}
            </td>
          ))}
        </motion.tr>
      ))}
    </tbody>
  );
}
