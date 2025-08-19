import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  import { ChevronFirst, ChevronLast } from 'lucide-react'
  
  export default function SmartPagination({ page, onPageClick }) {
    const { number: currentPage, totalPages } = page
    const maxVisiblePages = 3
  
    // Generate the range of pages to show
    const generatePageRange = () => {
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        return Array.from({ length: totalPages }, (_, i) => i)
      }
  
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let startPage = Math.max(0, currentPage - halfVisible)
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)
  
      // Adjust start if we're near the end
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1)
      }
  
      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    }
  
    const pageRange = generatePageRange()
    const showFirstEllipsis = pageRange[0] > 1
    const showLastEllipsis = pageRange[pageRange.length - 1] < totalPages - 2
    const showFirstPage = pageRange[0] > 0
    const showLastPage = pageRange[pageRange.length - 1] < totalPages - 1
  
    const handlePageClick = (pageNumber) => {
      if (pageNumber >= 0 && pageNumber < totalPages && pageNumber !== currentPage) {
        onPageClick(pageNumber)
      }
    }
  
    if (totalPages <= 1) {
      return null
    }
  
    return (
      <Pagination>
        <PaginationContent className={"mt-6 mb-3"}>
          {/* First Page Button */}
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageClick(0)}
              className={`${currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              aria-label="Go to first page"
            >
              <ChevronFirst className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
  
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageClick(currentPage - 1)}
              className={`${currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            />
          </PaginationItem>
  
          {/* First Page Number */}
          {showFirstPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageClick(0)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
  
          {/* First Ellipsis */}
          {showFirstEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
  
          {/* Page Range */}
          {pageRange.map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => handlePageClick(pageNum)}
                isActive={pageNum === currentPage}
                className="cursor-pointer"
              >
                {pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
  
          {/* Last Ellipsis */}
          {showLastEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
  
          {/* Last Page Number */}
          {showLastPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => handlePageClick(totalPages - 1)}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
  
          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageClick(currentPage + 1)}
              className={`${currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            />
          </PaginationItem>
  
          {/* Last Page Button */}
          <PaginationItem>
            <PaginationLink
              onClick={() => handlePageClick(totalPages - 1)}
              className={`${currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              aria-label="Go to last page"
            >
              <ChevronLast className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }  