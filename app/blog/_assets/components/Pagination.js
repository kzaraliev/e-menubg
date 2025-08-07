"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Reusable pagination component
 * @param {Object} props
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {string} props.basePath - Base path for pagination links (e.g., "/blog")
 * @param {number} props.maxVisiblePages - Maximum number of page links to show (default: 5)
 */
const Pagination = ({
  currentPage,
  totalPages,
  basePath = "/blog",
  maxVisiblePages = 5,
}) => {
  const searchParams = useSearchParams();

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Create URL with page parameter while preserving other search params
  const createPageUrl = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const PaginationButton = ({ children, href, isActive = false, isDisabled = false, ...props }) => {
    const baseClasses = "join-item btn btn-sm";
    const activeClasses = isActive ? "btn-active btn-primary" : "btn-outline";
    const disabledClasses = isDisabled ? "btn-disabled" : "";
    
    if (isDisabled) {
      return (
        <button className={`${baseClasses} ${disabledClasses}`} disabled {...props}>
          {children}
        </button>
      );
    }

    return (
      <Link
        href={href}
        className={`${baseClasses} ${activeClasses}`}
        {...props}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="flex justify-center mt-12 mb-8">
      <div className="join">
        {/* Previous button */}
        <PaginationButton
          href={createPageUrl(currentPage - 1)}
          isDisabled={currentPage === 1}
          title="Предишна страница"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>

        {/* First page */}
        {showFirstPage && (
          <PaginationButton href={createPageUrl(1)} title="Първа страница">
            1
          </PaginationButton>
        )}

        {/* Left ellipsis */}
        {showLeftEllipsis && (
          <button className="join-item btn btn-sm btn-disabled">...</button>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            href={createPageUrl(page)}
            isActive={page === currentPage}
            title={`Страница ${page}`}
          >
            {page}
          </PaginationButton>
        ))}

        {/* Right ellipsis */}
        {showRightEllipsis && (
          <button className="join-item btn btn-sm btn-disabled">...</button>
        )}

        {/* Last page */}
        {showLastPage && (
          <PaginationButton href={createPageUrl(totalPages)} title="Последна страница">
            {totalPages}
          </PaginationButton>
        )}

        {/* Next button */}
        <PaginationButton
          href={createPageUrl(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          title="Следваща страница"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </PaginationButton>
      </div>
    </div>
  );
};

export default Pagination;