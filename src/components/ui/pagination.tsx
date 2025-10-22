"use client";

import { Button } from "./button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  // Calculate the range of items shown
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("...");
        }
      }

      // Show pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("bg-white rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          {/* Page Numbers */}
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {typeof page === "number" ? (
                <Button
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "h-8 w-8 p-0 text-sm font-medium",
                    page === currentPage
                      ? "bg-[#ff6900] hover:bg-[#e55a00] text-white border-[#ff6900]"
                      : "hover:border-[#ff6900] hover:text-[#ff6900]"
                  )}
                >
                  {page}
                </Button>
              ) : (
                <span className="px-2 text-sm text-gray-500">...</span>
              )}
            </div>
          ))}

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1 ml-2">
            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 hover:border-[#ff6900] hover:text-[#ff6900] disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* First Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirst}
              disabled={currentPage <= 1}
              className="h-8 w-8 p-0 hover:border-[#ff6900] hover:text-[#ff6900] disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 hover:border-[#ff6900] hover:text-[#ff6900] disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLast}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 p-0 hover:border-[#ff6900] hover:text-[#ff6900] disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Text */}
        <div className="text-sm text-gray-600">
          Показано с {startItem} по {endItem} из {totalItems} (всего {totalPages} страниц)
        </div>
      </div>
    </div>
  );
}
