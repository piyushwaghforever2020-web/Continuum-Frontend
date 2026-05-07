"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import { formatCurrency } from "@/components/admin/cohortData";
import {
  getAdminCohorts,
  getAdminPaymentById,
  getAdminPayments,
  refundAdminPayment,
  type PaymentsQueryParams,
} from "@/services/admin.services";
import {
  FiChevronDown,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import Image from "next/image";

type PaymentStatus = "Paid" | "Failed" | "Refunded" | "Pending";

type PaymentRow = {
  id: number;
  userName: string;
  email: string;
  cohort: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  transactionId: string;
};

type PaymentDetails = PaymentRow & {
  email: string;
  phone: string;
  paymentMethod: string;
};

type PaymentsPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

type CohortOption = {
  id: string;
  name: string;
};

type PaymentsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedCohortId: string;
  onCohortChange: (value: string) => void;
  cohortOptions: CohortOption[];
};

type ViewPaymentModalProps = {
  payment: PaymentDetails | null;
  isLoading: boolean;
  error: string;
  isRefunding: boolean;
  onRefund: () => void;
  onClose: () => void;
};

type PaymentToast = {
  message: string;
  tone: "success" | "error";
};

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "paid" || normalized === "completed" || normalized === "success") {
    return "Paid";
  }
  if (normalized === "refunded") {
    return "Refunded";
  }
  if (normalized === "pending" || normalized === "processing") {
    return "Pending";
  }
  return "Failed";
}

function formatPaymentDate(value: unknown) {
  const dateValue = String(value ?? "");

  if (!dateValue) return "-";

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return dateValue;
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function normalizePaymentItem(payload: unknown): PaymentRow | null {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const participant = (raw.participant ?? raw.user ?? raw.student ?? {}) as Record<string, unknown>;
  const cohort = (raw.cohort ?? {}) as Record<string, unknown>;
  const id = raw.id ?? raw.payment_id;

  if (id === undefined || id === null) {
    return null;
  }

  return {
    id: Number(id),
    userName: String(
      raw.user_name ??
      raw.name ??
      participant.name ??
      participant.full_name ??
      "Unknown User"
    ),
    email: String(raw.email ?? participant.email ?? "-"),
    cohort: String(raw.cohort_name ?? cohort.name ?? raw.cohort ?? "-"),
    amount: Number(raw.amount ?? raw.total_amount ?? raw.price ?? 0),
    date: formatPaymentDate(
      raw.payment_date ?? raw.created_at ?? raw.updated_at ?? raw.date
    ),
    status: normalizePaymentStatus(raw.status ?? raw.payment_status),
    transactionId: String(
      raw.transaction_id ??
      raw.transactionId ??
      raw.reference_id ??
      raw.reference ??
      "-"
    ),
  };
}

function normalizePaymentDetails(payload: unknown): PaymentDetails | null {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const source = (raw.data ?? raw.payment ?? payload) as unknown;
  const summary = normalizePaymentItem(source);
  const item = (source ?? {}) as Record<string, unknown>;
  const participant = (item.participant ?? item.user ?? item.student ?? {}) as Record<string, unknown>;

  if (!summary) {
    return null;
  }

  return {
    ...summary,
    email: String(item.email ?? participant.email ?? "-"),
    phone: String(item.phone ?? participant.phone ?? participant.mobile ?? "-"),
    paymentMethod: String(
      item.payment_method ?? item.method ?? item.paymentMethod ?? "-"
    ),
  };
}

function normalizePaymentsResponse(payload: unknown) {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const source =
    data.items ??
    data.payments ??
    raw.items ??
    raw.payments ??
    [];
  const pagination = (data.pagination ?? raw.pagination ?? {}) as Record<
    string,
    unknown
  >;

  const items: PaymentRow[] = Array.isArray(source)
    ? source
      .map((item) => normalizePaymentItem(item))
      .filter((item): item is PaymentRow => Boolean(item))
    : [];

  return {
    items,
    pagination: {
      totalRecords: Number(pagination.total_records ?? pagination.total ?? items.length),
      totalPages: Number(pagination.total_pages ?? 1),
      currentPage: Number(pagination.current_page ?? pagination.page ?? 1),
      perPage: Number(pagination.per_page ?? pagination.limit ?? 10),
    } satisfies PaymentsPagination,
  };
}

function getPaymentColor(status: PaymentStatus) {
  if (status === "Paid") return "#2BAB6F";
  if (status === "Refunded") return "#D9AC26";
  if (status === "Pending") return "#F48C25";
  return "#DC2828";
}

function PaymentsFilters({
  search,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCohortId,
  onCohortChange,
  cohortOptions,
}: PaymentsFiltersProps) {
  const [openMenu, setOpenMenu] = useState<"status" | "cohort" | null>(null);

  const selectedStatusLabel =
    selectedStatus === "paid"
      ? "Paid"
      : selectedStatus === "failed"
        ? "Failed"
        : selectedStatus === "refunded"
          ? "Refunded"
          : selectedStatus === "pending"
            ? "Pending"
            : "All Status";

  const selectedCohortLabel =
    cohortOptions.find((option) => option.id === selectedCohortId)?.name ??
    "All Cohorts";

  useEffect(() => {
    if (!openMenu) return;

    const handleOutsideClick = () => setOpenMenu(null);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openMenu]);

  return (
    <section className="admin-panel admin-filter-bar">
      <label className="admin-search admin-search--wide">
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="admin-filter-bar__actions">
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="admin-table-button !max-w-[135px] flex items-center justify-between"
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu((current) => (current === "cohort" ? null : "cohort"));
            }}
          >
            <span
              className={`font-chivo text-sm font-normal text-[var(--color-nearBlack)] ${selectedCohortId === ""
                ? ""
                : "truncate flex-1 min-w-0"
                }`}
            >
              {selectedCohortLabel}
            </span>

            <FiChevronDown size={14} className="flex-shrink-0 ml-1" />
          </button>
          {openMenu === "cohort" ? (
            <div className="absolute left-0 top-[calc(100%+8px)] min-w-[220px] max-h-[240px] overflow-y-auto rounded-xl border border-gray-200 bg-white z-30 shadow-lg p-1.5">
              <button
                type="button"
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedCohortId === "" ? "bg-purple-50" : ""
                  }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onCohortChange("");
                  setOpenMenu(null);
                }}
              >
                All Cohorts
              </button>
              {cohortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedCohortId === option.id ? "bg-purple-50" : ""
                    }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCohortChange(option.id);
                    setOpenMenu(null);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="admin-table-button "
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu((current) => (current === "status" ? null : "status"));
            }}
          >
            <span className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]">
              {selectedStatusLabel}
            </span>
            <FiChevronDown size={14} />
          </button>

          {
            openMenu === "status" ? (
              <div className="absolute left-0 top-[calc(100%+8px)] min-w-[180px] overflow-y-auto rounded-xl border border-gray-200 bg-white z-30 shadow-lg p-1.5">
                {[
                  { label: "All Status", value: "" },
                  { label: "Paid", value: "paid" },
                  { label: "Failed", value: "failed" },
                  // { label: "Refunded", value: "refunded" },
                  { label: "Pending", value: "pending" },
                ].map((option) => (
                  <button
                    key={option.value || "all"}
                    type="button"
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedStatus === option.value ? "bg-purple-50" : ""
                      }`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onStatusChange(option.value);
                      setOpenMenu(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null
          }
        </div >


      </div >
    </section >
  );
}

function ViewPaymentModal({
  payment,
  isLoading,
  error,
  isRefunding,
  onRefund,
  onClose,
}: ViewPaymentModalProps) {
  if (!payment && !isLoading && !error) return null;

  const refundDisabled =
    !payment ||
    isRefunding ||
    payment.status === "Refunded" ||
    payment.status === "Failed" ||
    payment.status === "Pending";

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="admin-modal max-30 rounded-8px">
        <button
          type="button"
          className="admin-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>
        <div className="admin-modal__avatar_payment">
          <Image
            src="/admin/dollerEye.png"
            alt="payment icon"
            width={100}
            height={100}
          />
        </div>

        <div className="admin-modal__header capitalize">
          <h2 id="payment-modal-title" className="admin-modal__title font-chivo">
            Payment Status
          </h2>
        </div>

        {isLoading ? (
          <div className="admin-modal__details gap-1rem mt-2rem">
            <span className="admin-modal__row font-bold font-chivo text-[var(--color-nearBlack)]">
              Loading payment details...
            </span>
          </div>
        ) : error ? (
          <div className="admin-modal__details gap-1rem mt-2rem">
            <span className="admin-modal__row font-bold font-chivo text-[#DC2828]">
              {error}
            </span>
          </div>
        ) : payment ? (
          <>
            <div className="admin-modal__details gap-1rem mt-2rem">
              <span className="admin-modal__row font-bold font-chivo text-[var(--color-nearBlack)]">
                Payment Details
              </span>
              <div className="admin-modal__row">
                <span className="lefttext">Transaction ID:</span>
                <span className="text">{payment.transactionId}</span>
              </div>
              <div className="admin-modal__row">
                <span className="lefttext">Amount</span>
                <span className="text">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="admin-modal__row">
                <span className="lefttext">Date</span>
                <span className="text">{payment.date}</span>
              </div>
              <div className="admin-modal__row">
                <span className="lefttext">User</span>
                <span className="text">{payment.userName}</span>
              </div>

              <div className="admin-modal__row">
                <span className="lefttext">Cohort</span>
                <span className="text text-right w-72">{payment.cohort}</span>
              </div>

              <div className="admin-modal__row">
                <span className="lefttext">Status</span>
                <AdminStatusBadge customColor={getPaymentColor(payment.status)}>
                  {payment.status}
                </AdminStatusBadge>
              </div>
            </div>

            {/* <div className="mt-6">
              <button
                type="button"
                className="w-full admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]"
                disabled={refundDisabled}
                onClick={onRefund}
              >
                {isRefunding
                  ? "Processing Refund..."
                  : payment?.status === "Refunded"
                    ? "Refund Issued"
                    : "Issue Refund"}
              </button>
            </div> */}
          </>
        ) : null
        }
      </div >
    </div >
  );
}

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const initialCohortId = searchParams.get("cohort") ?? "";
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [paymentsError, setPaymentsError] = useState("");
  const [paymentDetailsError, setPaymentDetailsError] = useState("");
  const [cohortsError, setCohortsError] = useState("");
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [isPaymentDetailsLoading, setIsPaymentDetailsLoading] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);
  const [toast, setToast] = useState<PaymentToast | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [reloadKey, setReloadKey] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCohortId, setSelectedCohortId] = useState(initialCohortId);
  const [cohortOptions, setCohortOptions] = useState<CohortOption[]>([]);
  const [paymentsPagination, setPaymentsPagination] = useState<PaymentsPagination>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  });

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
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    let active = true;

    async function loadCohorts() {
      try {
        setCohortsError("");
        const response = await getAdminCohorts();
        const raw = (response ?? {}) as Record<string, unknown>;
        const data = (raw?.data ?? {}) as Record<string, unknown>;
        const source = data?.items;

        const normalizedOptions: CohortOption[] = Array.isArray(source)
          ? source
            .map((item) => {
              const cohort = (item ?? {}) as Record<string, unknown>;
              const id = cohort.id ?? cohort._id ?? cohort.cohort_id;

              if (!id) return null;

              return {
                id: String(id),
                name: String(cohort.name ?? cohort.title ?? "Untitled Cohort"),
              };
            })
            .filter((item): item is CohortOption => Boolean(item))
          : [];

        if (!active) return;
        setCohortOptions(normalizedOptions);
      } catch (error) {
        if (!active) return;
        setCohortsError(
          error instanceof Error ? error.message : "Failed to load cohorts"
        );
      }
    }

    loadCohorts();

    return () => {
      active = false;
    };
  }, []);


  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
    const cohortParam = searchParams.get("cohort");
    if (cohortParam) {
      setSelectedCohortId(cohortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setIsPaymentsLoading(true);
        setPaymentsError("");

        const params = {
          page: currentPage,
          limit: perPage,
          search: debouncedSearch,
          status: selectedStatus,
          cohort: selectedCohortId,
        } satisfies PaymentsQueryParams;

        const response = await getAdminPayments(params);
        const normalized = normalizePaymentsResponse(response?.data);

        if (!active) return;
        setPayments(normalized.items);
        setPaymentsPagination(normalized.pagination);
      } catch (error) {
        if (!active) return;
        setPaymentsError(
          error instanceof Error ? error.message : "Failed to load payments"
        );
      } finally {
        if (active) {
          setIsPaymentsLoading(false);
        }
      }
    }

    loadPayments();

    return () => {
      active = false;
    };
  }, [currentPage, perPage, reloadKey, debouncedSearch, selectedStatus, selectedCohortId]);

  useEffect(() => {
    if (selectedPaymentId === null) return;

    const paymentId = selectedPaymentId;
    let active = true;

    async function loadPaymentDetails() {
      try {
        setIsPaymentDetailsLoading(true);
        setPaymentDetailsError("");
        const response = await getAdminPaymentById(paymentId);
        const normalized = normalizePaymentDetails(response);

        if (!active) return;

        if (!normalized) {
          setPaymentDetailsError("Failed to load payment details");
          return;
        }

        setSelectedPayment(normalized);
      } catch (error) {
        if (!active) return;
        setPaymentDetailsError(
          error instanceof Error ? error.message : "Failed to load payment details"
        );
      } finally {
        if (active) {
          setIsPaymentDetailsLoading(false);
        }
      }
    }

    loadPaymentDetails();

    return () => {
      active = false;
    };
  }, [selectedPaymentId]);

  const handleRefund = async () => {
    if (!selectedPayment) return;

    try {
      setIsRefunding(true);
      await refundAdminPayment(selectedPayment.id);

      setSelectedPayment((current) =>
        current ? { ...current, status: "Refunded" } : current
      );
      setPayments((current) =>
        current.map((payment) =>
          payment.id === selectedPayment.id
            ? { ...payment, status: "Refunded" }
            : payment
        )
      );
      setReloadKey((current) => current + 1);

      setSelectedPaymentId(null);
      setSelectedPayment(null);
      setPaymentDetailsError("");
      setIsRefunding(false);

      setToast({
        message: "Refund issued successfully.",
        tone: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to issue refund.";
      setToast({
        message,
        tone: "error",
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const handleReloadPayments = () => {
    setSelectedPaymentId(null);
    setSelectedPayment(null);
    setPaymentDetailsError("");
    setReloadKey((current) => current + 1);
  };

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialCohortId) {
      setSelectedCohortId(initialCohortId);
    }
  }, [initialCohortId]);


  const columns = useMemo<AdminTableColumn<PaymentRow>[]>(
    () => [
      {
        key: "userName",
        header: "User Name",
        className: "admin-table-col-name",
        render: (row) => (
          <span className="admin-table-primary">{row.userName}</span>
        ),
      },
      {
        key: "cohort",
        header: "Cohort",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-linkish">{row.cohort}</span>,
      },
      {
        key: "amount",
        header: "Amount",
        render: (row) => formatCurrency(row.amount),
      },
      {
        key: "date",
        header: "Date",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-muted">{row.date}</span>,
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <AdminStatusBadge customColor={getPaymentColor(row.status)}>
            {row.status}
          </AdminStatusBadge>
        ),
      },
      {
        key: "action",
        header: "Action",
        render: (row) => (
          <div className="admin-row-actions">
            <button
              type="button"
              onClick={() => {
                setSelectedPayment(null);
                setPaymentDetailsError("");
                setSelectedPaymentId(row.id);
              }}
              className="admin-row-actions__button"
              aria-label={`View payment for ${row.userName}`}
            >
              <FiEye size={14} />
            </button>
            <button
              type="button"
              className="admin-row-actions__button"
              aria-label={`Refresh payment for ${row.userName}`}
              onClick={handleReloadPayments}
            >
              <FiRefreshCw size={14} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
        <AdminHeader title="Payments" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro">
              <div>
                <h2 className="admin-page-title">Payments</h2>
                <p className="admin-page-subtitle">
                  Review payment activity across cohorts
                </p>
              </div>
            </section>

            <PaymentsFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              selectedStatus={selectedStatus}
              onStatusChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1);
              }}
              selectedCohortId={selectedCohortId}
              onCohortChange={(value) => {
                setSelectedCohortId(value);
                setCurrentPage(1);
              }}
              cohortOptions={cohortOptions}
            />

            <AdminTable
              title="Payments"
              columns={columns}
              rows={payments}
              showToolbar={false}
              pagination={{
                currentPage,
                totalPages: paymentsPagination.totalPages,
                totalRecords: paymentsPagination.totalRecords,
                rowsPerPage: perPage,
                onPageChange: setCurrentPage,
                onRowsPerPageChange: (value) => {
                  setPerPage(value);
                  setCurrentPage(1);
                },
              }}
              footer={
                isPaymentsLoading
                  ? "Reloading payments..."
                  : paymentsError
                    ? paymentsError
                    : cohortsError
                      ? cohortsError
                      : `Showing ${payments.length} of ${paymentsPagination.totalRecords} payments`
              }
            />
          </div >
        </main >
      </div >

      <ViewPaymentModal
        payment={selectedPayment}
        isLoading={isPaymentDetailsLoading}
        error={paymentDetailsError}
        isRefunding={isRefunding}
        onRefund={handleRefund}
        onClose={() => {
          setSelectedPaymentId(null);
          setSelectedPayment(null);
          setPaymentDetailsError("");
          setIsRefunding(false);
        }}
      />
    </div >
  );
}
