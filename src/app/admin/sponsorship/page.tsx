"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import {
  getAdminSponsorships,
  markAdminSponsorshipAsPaid,
  markAdminSponsorshipAsUnpaid,
} from "@/services/admin.services";
import { FiSearch } from "react-icons/fi";

const SPONSORSHIP_STATUSES = [
  "invoice_requested",
  "pending_payment",
  "paid",
  "failed",
  "voided",
  "cancelled",
] as const;

type SponsorshipStatus = (typeof SPONSORSHIP_STATUSES)[number];

type SponsorshipRow = {
  id: string | number;
  employerName: string;
  employerEmail: string;
  companyName: string;
  cohortName: string;
  programName: string;
  totalSeats: string;
  usedSeats: string;
  amount: string;
  status: SponsorshipStatus | string;
};

type SponsorshipPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

const DEFAULT_PAGINATION: SponsorshipPagination = {
  totalRecords: 0,
  totalPages: 1,
  currentPage: 1,
  perPage: 10,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function firstText(...values: unknown[]) {
  const match = values.find(
    (value) => value !== undefined && value !== null && String(value).trim() !== ""
  );

  return asText(match);
}

function formatCurrency(amount: unknown, currency: unknown) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return asText(amount);
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: asText(currency, "usd").toUpperCase(),
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `${numericAmount} ${asText(currency, "usd").toUpperCase()}`;
  }
}

function formatStatus(value: unknown) {
  return asText(value)
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusTone(status: string): "success" | "warning" | "danger" | undefined {
  const normalized = status.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("completed")) {
    return "success";
  }

  if (normalized.includes("failed") || normalized.includes("cancel")) {
    return "danger";
  }

  return "warning";
}

function normalizeSponsorshipStatus(value: unknown): SponsorshipStatus | string {
  const status = asText(value, "invoice_requested");

  return SPONSORSHIP_STATUSES.includes(status as SponsorshipStatus)
    ? (status as SponsorshipStatus)
    : status;
}

function normalizeSponsorshipsResponse(payload: unknown) {
  const raw = asRecord(payload);
  const data = asRecord(raw.data ?? raw);
  const source = Array.isArray(data.items)
    ? data.items
    : Array.isArray(raw.data)
      ? raw.data
      : [];
  const pagination = asRecord(data.pagination);

  const rows: SponsorshipRow[] = source.map((item, index) => {
    const row = asRecord(item);
    const employer = asRecord(row.employer ?? row.company_details);
    const cohort = asRecord(row.cohort);
    const program = asRecord(row.program);

    return {
      id: firstText(row.id, index + 1),
      employerName: firstText(
        row.manager_name,
        row.employer_name,
        employer.name,
        employer.employer_name
      ),
      employerEmail: firstText(row.manager_email, row.employer_email, employer.email),
      companyName: firstText(
        row.company_name,
        row.company,
        employer.company_name,
        employer.company
      ),
      cohortName: firstText(row.cohort_name, cohort.name),
      programName: firstText(row.program_name, program.name, program.program_name),
      totalSeats: firstText(row.total_seats, row.totalSeats),
      usedSeats: firstText(row.used_seats, row.usedSeats),
      amount: formatCurrency(row.amount, row.currency),
      status: normalizeSponsorshipStatus(row.status),
    };
  });

  return {
    rows,
    pagination: {
      totalRecords: Number(pagination.total_records ?? rows.length),
      totalPages: Number(pagination.total_pages ?? 1),
      currentPage: Number(pagination.current_page ?? 1),
      perPage: Number(pagination.per_page ?? 10),
    } satisfies SponsorshipPagination,
  };
}

export default function SponsorshipPage() {
  const [rows, setRows] = useState<SponsorshipRow[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] =
    useState<SponsorshipPagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingSponsorshipId, setUpdatingSponsorshipId] = useState<
    string | number | null
  >(null);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const fetchSponsorships = useCallback(
    async ({ showLoader = true }: { showLoader?: boolean } = {}) => {
      try {
        if (showLoader) {
          setIsLoading(true);
        }
        setError("");

        const response = await getAdminSponsorships({
          page: currentPage,
          limit: perPage,
          search: debouncedSearch,
        });

        const normalized = normalizeSponsorshipsResponse(response);
        setRows(normalized.rows);
        setPagination(normalized.pagination);
      } catch (err) {
        setRows([]);
        setPagination(DEFAULT_PAGINATION);
        setError(
          err instanceof Error ? err.message : "Failed to load sponsorships."
        );
      } finally {
        if (showLoader) {
          setIsLoading(false);
        }
      }
    },
    [currentPage, perPage, debouncedSearch]
  );

  useEffect(() => {
    fetchSponsorships();
  }, [fetchSponsorships]);

  const handleTogglePaidStatus = async (row: SponsorshipRow) => {
    const isPaid = row.status === "paid";

    try {
      setUpdatingSponsorshipId(row.id);
      setError("");

      let response;
      if (isPaid) {
        response = await markAdminSponsorshipAsUnpaid(row.id);
        setToast({
          message: response?.message || response?.data?.message || "Sponsorship marked as unpaid successfully.",
          tone: "success",
        });
      } else {
        response = await markAdminSponsorshipAsPaid(row.id);
        setToast({
          message: response?.message || response?.data?.message || "Sponsorship marked as paid successfully.",
          tone: "success",
        });
      }

      await fetchSponsorships({ showLoader: false });
    } catch (err) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as any).response?.data?.message || (err as any).response?.data?.data?.details?.[0]
          : err instanceof Error
            ? err.message
            : "Failed to update status.";

      setError(message);
      setToast({
        message,
        tone: "error",
      });
    } finally {
      setUpdatingSponsorshipId(null);
    }
  };

  const columns = useMemo<AdminTableColumn<SponsorshipRow>[]>(
    () => [
      {
        key: "employerName",
        header: "Employer Name",
        render: (row) => (
          <span className="admin-table-primary">{row.employerName}</span>
        ),
      },
      {
        key: "employerEmail",
        header: "Employer Email",
        render: (row) => <span className="admin-muted">{row.employerEmail}</span>,
      },
      {
        key: "companyName",
        header: "Company",
        render: (row) => <span className="admin-muted">{row.companyName}</span>,
      },
      {
        key: "cohortName",
        header: "Cohort",
        render: (row) => (
          <span className="admin-linkish">{row.cohortName}</span>
        ),
      },
      {
        key: "programName",
        header: "Program",
        render: (row) => (
          <span className="admin-muted">{row.programName}</span>
        ),
      },
      {
        key: "totalSeats",
        header: "Total Seats",
        render: (row) => (
          <span className="admin-table-primary">{row.totalSeats}</span>
        ),
      },
      {
        key: "usedSeats",
        header: "Used Seats",
        render: (row) => <span className="admin-muted">{row.usedSeats}</span>,
      },
      {
        key: "amount",
        header: "Amount",
        render: (row) => <span className="admin-muted">{row.amount}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <AdminStatusBadge tone={statusTone(row.status)}>
            {formatStatus(row.status)}
          </AdminStatusBadge>
        ),
      },
      {
        key: "action",
        header: "Action",
        render: (row) => {
          const isPaid = row.status === "paid";
          const isUpdating = updatingSponsorshipId === row.id;

          return (
            <button
              type="button"
              className="admin-table-button"
              style={{ minWidth: "132px", whiteSpace: "nowrap" }}
              disabled={isUpdating}
              onClick={() => handleTogglePaidStatus(row)}
            >
              {isUpdating
                ? "Updating..."
                : isPaid
                  ? "Mark as unpaid"
                  : "Mark as paid"}
            </button>
          );
        },
      },
    ],
    [updatingSponsorshipId, fetchSponsorships]
  );

  const footerText = error
    ? error
    : isLoading
      ? "Loading sponsorships..."
      : rows.length === 0
        ? "No sponsorship records found."
        : `Showing ${rows.length} of ${pagination.totalRecords} sponsorship records`;

  return (
    <div className="admin-page">
      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.tone}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Sponsorship" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro admin-page-intro--leads">
              <div>
                <h2 className="admin-page-title">Sponsorship</h2>
                <p className="admin-page-subtitle">
                  Employer block-seat sponsorship requests and invoice status.
                </p>
              </div>
            </section>

            <section className="admin-panel leads-panel">
              <div className="admin-table-tools !justify-start">
                <label className="admin-search admin-search--wide">
                  <FiSearch size={16} />
                  <input
                    type="text"
                    placeholder="Search by employer name and  email"  
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
            </section>

            <AdminTable
              title="Sponsorship"
              columns={columns}
              rows={rows}
              showToolbar={false}
              pagination={{
                currentPage,
                totalPages: pagination.totalPages,
                totalRecords: pagination.totalRecords,
                rowsPerPage: perPage,
                onPageChange: setCurrentPage,
                onRowsPerPageChange: (value) => {
                  setPerPage(value);
                  setCurrentPage(1);
                },
              }}
              footer={footerText}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
