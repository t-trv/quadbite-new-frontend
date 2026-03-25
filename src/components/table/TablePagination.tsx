import getPaginationButtons from '@/utils/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalRecords: number;
  className?: string;
}

const TablePagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  totalRecords,
  className,
}: TablePaginationProps) => {
  const buttons = getPaginationButtons(currentPage, totalPages);

  if (currentPage <= 1 && totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {totalRecords && (
        <p className="text-sm font-semibold text-gray-500">Tổng {totalRecords} kết quả</p>
      )}
      {/* Left arrow button */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm ${
          currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {buttons.map((button, index) => (
        <button
          className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 text-sm font-semibold ${
            button == currentPage.toString() ? 'text-primary border-primary' : ''
          }
            ${button == '...' ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'}
            `}
          key={index}
          disabled={button == '...'}
          onClick={() => setCurrentPage(Number(button))}
        >
          {button}
        </button>
      ))}

      {/* Right arrow button */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-md hover:bg-gray-100 text-sm ${
          currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TablePagination;
