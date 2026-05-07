"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiSearch,
} from "react-icons/fi";

export type AdminTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type AdminTableFilter = {
  label: string;
  value?: string;
  options?: Array<{ label: string; value: string }>;
  onChange?: (value: string) => void;
};

type AdminTableProps<T> = {
  title: string;
  columns: AdminTableColumn<T>[];
  rows: T[];
  searchPlaceholder?: string;
  filters?: AdminTableFilter[];
  actionLabel?: string;
  showToolbar?: boolean;
  footer?: ReactNode;
  enablePagination?: boolean;
  defaultRowsPerPage?: 10 | 20 | 30;
  showTitleInside?: boolean;
  onSearchChange?: (value: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (value: number) => void;
  };
  onActionClick?: () => void;
  isActionLoading?: boolean;
};

export function AdminStatusBadge({
  tone,
  customColor,
  children,
}: {
  tone?: "success" | "warning" | "danger";
  customColor?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`admin-status-badge ${tone ? `admin-status-badge--${tone}` : ""}`}
      style={customColor ? { backgroundColor: customColor } : {}}
    >
      {children}
    </div>
  );
}

export function AdminToggle({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`admin-toggle ${checked ? "is-active" : ""} ${disabled ? "is-disabled" : ""}`}
    >
      <span className="admin-toggle__thumb" />
    </button>
  );
}

export default function AdminTable<T>({
  title,
  columns,
  rows,
  searchPlaceholder = "Search...",
  filters = [],
  actionLabel = "Export CSX",
  showToolbar = true,
  footer,
  enablePagination = true,
  defaultRowsPerPage = 10,
  showTitleInside = false,
  pagination,
  onSearchChange,
  onActionClick,
  isActionLoading = false,
}: AdminTableProps<T>) {
  const [rowsPerPage, setRowsPerPage] = useState<10 | 20 | 30>(
    defaultRowsPerPage
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);
  const filtersContainerRef = useRef<HTMLDivElement | null>(null);
  const isServerPagination = Boolean(pagination);

  console.log("Rows received in table:", rows);
  console.log("Pagination received in table:", pagination);
  console.log("default rows received in table:", defaultRowsPerPage);

  const totalRows = isServerPagination ? pagination!.totalRecords : rows.length;

  const totalPages = isServerPagination
    ? pagination!.totalPages
    : Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const currentPageFinal = isServerPagination
    ? pagination!.currentPage
    : currentPage;

  const rowsPerPageFinal = isServerPagination
    ? pagination!.rowsPerPage
    : rowsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage, totalRows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!openFilterKey) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (filtersContainerRef.current?.contains(target)) return;
      setOpenFilterKey(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openFilterKey]);

  const paginatedRows = useMemo(() => {
    console.log("Handling the cohort table data....");
    console.log("rows:", rows);
    if (!enablePagination) return rows;

    if (isServerPagination) return rows;
    console.log("got out of the conditions...")

    const start = (currentPage - 1) * rowsPerPage;
    console.log("paginatedRows:", rows.slice(start, start + rowsPerPage));
    return rows.slice(start, start + rowsPerPage);
  }, [currentPage, enablePagination, rows, rowsPerPage, isServerPagination]);

  const startRow =
    totalRows === 0 ? 0 : (currentPageFinal - 1) * rowsPerPageFinal + 1;

  const endRow =
    totalRows === 0
      ? 0
      : Math.min(currentPageFinal * rowsPerPageFinal, totalRows);

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPageFinal <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPageFinal >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, index) => totalPages - 4 + index);
    }

    return [
      currentPageFinal - 2,
      currentPageFinal - 1,
      currentPageFinal,
      currentPageFinal + 1,
      currentPageFinal + 2,
    ];
  }, [currentPageFinal, totalPages]);

  const resolveFilterLabel = (filter: AdminTableFilter) => {
    if (!filter.options?.length || !filter.value) {
      return filter.label;
    }

    const selected = filter.options.find(
      (option) => option.value === filter.value
    );
    return selected?.label ?? filter.label;
  };

  return (
    <section className="admin-panel">
      {showTitleInside ? (
        <h3 className="admin-table-title-inside">{title}</h3>
      ) : null}

      {showToolbar && (
        <div className="admin-table-toolbar">
          <h3 className="admin-section-title">{title}</h3>

          <div className="admin-table-tools" ref={filtersContainerRef}>
            <label className="admin-search">
              <FiSearch size={16} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </label>

            {filters.map((filter, index) => {
              const filterKey = `${filter.label}-${index}`;
              const hasOptions = Boolean(filter.options?.length);
              const isOpen = openFilterKey === filterKey;

              return (
                <div key={filterKey} style={{ position: "relative" }}>
                  {/* <button
                    type="button"
                    className="admin-table-button !max-w-[130px] "
                    onClick={() => {
                      if (!hasOptions) return;
                      setOpenFilterKey(isOpen ? null : filterKey);
                    }}
                  >
                    <span className="font-chivo text-sm font-normal text-[#261736]">{resolveFilterLabel(filter)}</span>
                    <FiChevronDown size={14} />
                  </button> */}

                  <button
                    type="button"
                    className="admin-table-button !max-w-[135px] flex items-center justify-between"
                    onClick={() => {
                      if (!hasOptions) return;
                      setOpenFilterKey(isOpen ? null : filterKey);
                    }}
                  >
                    <span
                      className={`font-chivo text-sm font-normal text-[var(--color-nearBlack)] ${filter.value === ""
                          ? ""
                          : "truncate flex-1 min-w-0"
                        }`}
                    >
                      {resolveFilterLabel(filter)}
                    </span>

                    <FiChevronDown size={14} className="flex-shrink-0 ml-1" />
                  </button>

                  {hasOptions && isOpen ? (
                    <div className="absolute left-0 top-[calc(100%+8px)] min-w-[220px] max-h-[240px] overflow-y-auto rounded-xl border border-gray-200 bg-white z-30 shadow-lg p-1.5">
                      {filter.options?.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            filter.onChange?.(option.value);
                            setOpenFilterKey(null);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition
          ${option.value === filter.value ? "bg-purple-50" : ""}
        `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              className="admin-table-button"
              onClick={onActionClick}
              disabled={isActionLoading}
            >
              <FiDownload size={14} />
              <span className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]">{isActionLoading ? "Exporting..." : actionLabel}</span>
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`admin-table__cell ${column.className ?? ""}`.trim()}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`admin-table__cell ${column.className ?? ""}`.trim()}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination || footer ? (
        <div className="admin-table-footer admin-table-footer--with-pagination">
          <div className="admin-table-footer__meta">
            {enablePagination ? (
              <span>{`Showing ${startRow}-${endRow} of ${totalRows}`}</span>
            ) : null}
            {/* {footer ? <span>{footer}</span> : null} */}
          </div>

          {enablePagination ? (
            <div className="admin-pagination">
              <label className="admin-pagination__select-wrap">
                <span>Show per page</span>
                <select
                  className="admin-pagination__select"
                  value={rowsPerPageFinal}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    if (isServerPagination) {
                      pagination!.onRowsPerPageChange(value); // ✅ API mode
                    } else {
                      setRowsPerPage(value as 10 | 20 | 30); // ✅ local mode
                    }
                  }}
                >
                  {" "}
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </label>

              <div className="admin-pagination__controls">
                <button
                  type="button"
                  className="admin-pagination__nav"
                  onClick={() => {
                    if (isServerPagination) {
                      pagination!.onPageChange(currentPageFinal - 1);
                    } else {
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }
                  }}
                  disabled={currentPageFinal === 1}
                  aria-label="Previous page"
                >
                  <FiChevronLeft size={16} />
                </button>

                <div className="admin-pagination__pages">
                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"

                      onClick={() => {
                        if (isServerPagination) {
                          pagination!.onPageChange(pageNumber);
                        } else {
                          setCurrentPage(pageNumber);
                        }
                      }}
                      className={`admin-pagination__page ${pageNumber === currentPageFinal ? "is-active" : ""
                        }`}
                      aria-label={`Go to page ${pageNumber}`}
                      aria-current={
                        pageNumber === currentPage ? "page" : undefined
                      }
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="admin-pagination__nav"
                  onClick={() => {
                    if (isServerPagination) {
                      pagination!.onPageChange(currentPageFinal + 1);
                    } else {
                      setCurrentPage((page) => Math.min(totalPages, page + 1));
                    }
                  }}
                  disabled={currentPageFinal === totalPages}
                  aria-label="Next page"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}