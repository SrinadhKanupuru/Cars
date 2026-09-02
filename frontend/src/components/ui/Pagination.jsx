import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - 2 ||
        i === currentPage + 2
      ) {
        pages.push('...');
      }
    }
    return [...new Set(pages)];
  };

  return (
    <div className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}>
      <Button
        variant="white"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) => (
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 text-sm font-semibold rounded-xl transition-all duration-200",
                currentPage === page
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-slate-700 hover:bg-slate-100 bg-white border border-slate-200/80"
              )}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-slate-400 font-bold">
              ...
            </span>
          )
        ))}
      </div>

      <Button
        variant="white"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
