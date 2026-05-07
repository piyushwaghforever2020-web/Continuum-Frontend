"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAdminParticipants } from "@/hooks/useAdminParticipants";
import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, { AdminStatusBadge, AdminTableColumn, AdminToggle } from "@/components/admin/AdminTable";
import { formatCurrency } from "@/components/admin/cohortData";
import {
  createAdminCohort,
  getAdminCohortById,
  getAdminCohorts,
  getAdminParticipants,
  updateAdminCohort,
  updateAdminCohortStatus,
} from "@/services/admin.services";
import { FiArrowLeft, FiDownload, FiEdit2, FiEye, FiPlus, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import Image from "next/image";

type CohortStatus = "Active" | "Full" | "Closed" | "Inactive";

type CohortParticipant = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  company: string;
  payment: string;
  registration: string;
  cohort: string;
};

type ParticipantsPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

type CohortDetail = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  price: number;
  seatsFilled: number;
  seatLimit: number;
  status: CohortStatus;
  is_active?: boolean;
  refundPolicy: string;
  revenue: number;
  participants: CohortParticipant[];
};

type CohortListItem = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  price: number;
  seatsFilled: number;
  seatLimit: number;
  status: CohortStatus;
  is_active?: boolean;
  refundPolicy: string;
  revenue: number;
  participants: CohortParticipant[];
};

type CohortFormData = {
  cohortName: string;
  description: string;
  startDate: string;
  price: string;
  seatLimit: string;
  refundPolicy: string;
};

type CohortFormErrors = Partial<Record<keyof CohortFormData, string>>;

const initialForm: CohortFormData = {
  cohortName: "",
  description: "",
  startDate: "",
  price: "",
  seatLimit: "",
  refundPolicy: "",
};

function getStatusColor(status: string) {
  const s = String(status).toLowerCase();
  if (s === "active") return "#2BAB6F";
  if (s === "full") return "#F48C25";
  return "#DC2828";
}

function normalizeStatus(value: unknown): CohortStatus {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "active") return "Active";
  if (normalized === "full") return "Full";
  return "Closed";
}

function normalizeParticipantStatus(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "paid") return "Paid";
  if (normalized === "refunded") return "Refunded";
  if (normalized === "complete") return "Complete";
  if (normalized === "failed") return "Failed";
  return "Incomplete";
}

function normalizeParticipants(value: unknown): CohortParticipant[] {
  if (!Array.isArray(value)) return [];

  return value.map((participant, index) => {
    const item = (participant ?? {}) as Record<string, unknown>;
    const participantId = item.id ?? index + 1;
    const cohort = (item.cohort ?? {}) as Record<string, unknown>;
    return {
      id: typeof participantId === "string" || typeof participantId === "number" ? participantId : index + 1,
      name: String(item.name ?? item.full_name ?? "Participant"),
      email: String(item.email ?? "-"),
      phone: String(item.phone ?? item.phone_number ?? "-"),
      company: String(item.company ?? item.organization ?? "-"),
      payment: normalizeParticipantStatus(item.payment ?? item.payment_status),
      registration: normalizeParticipantStatus(item.registration ?? item.registration_status),
      cohort: String(cohort.name),
    };
  });
}

function normalizeParticipantsResponse(payload: unknown): CohortParticipant[] {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const source = data.items ?? raw.participants ?? raw.items ?? payload;

  if (!Array.isArray(source)) {
    return [];
  }

  return normalizeParticipants(source);
}

function normalizeParticipantsPagination(payload: unknown): ParticipantsPagination {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const pagination = (data.pagination ?? {}) as Record<string, unknown>;

  return {
    totalRecords: Number(pagination.total_records ?? 0),
    totalPages: Number(pagination.total_pages ?? 1),
    currentPage: Number(pagination.current_page ?? 1),
    perPage: Number(pagination.per_page ?? 10),
  };
}

function normalizeCohort(payload: unknown): CohortDetail | null {
  const response = (payload ?? {}) as Record<string, unknown>;
  const raw = ((response.data ?? response.cohort ?? response) ?? {}) as Record<string, unknown>;
  const id = raw.id ?? raw._id ?? raw.cohort_id;

  if (!id) return null;

  return {
    id: String(id),
    name: String(raw.name ?? raw.title ?? raw.cohortName ?? "Untitled Cohort"),
    description: String(raw.description ?? raw.overview ?? "No description available."),
    startDate: String(raw.startDate ?? raw.start_date ?? "-"),
    price: Number(raw.price ?? raw.amount ?? 0),
    seatsFilled: Number(raw.seatsFilled ?? raw.seats_filled ?? raw.filledSeats ?? 0),
    seatLimit: Number(raw.seatLimit ?? raw.seat_limit ?? raw.totalSeats ?? 0),
    status: normalizeStatus(raw.status),
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
    refundPolicy: String(raw.refundPolicy ?? raw.refund_policy ?? "No refund policy provided."),
    revenue: Number(raw.revenue ?? raw.totalRevenue ?? 0),
    participants: normalizeParticipants(raw.participants ?? raw.enrollments ?? raw.members),
  };
}

function normalizeCohortItem(payload: unknown): CohortListItem | null {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const id = raw.id ?? raw._id ?? raw.cohort_id;

  if (!id) {
    return null;
  }

  return {
    id: String(id),
    name: String(raw.name ?? raw.title ?? "Untitled Cohort"),
    description: String(raw.description ?? ""),
    startDate: String(raw.startDate ?? raw.start_date ?? "-"),
    price: Number(raw.price ?? 0),
    seatsFilled: Number(raw.seatsFilled ?? raw.seats_filled ?? 0),
    seatLimit: Number(raw.seatLimit ?? raw.seat_limit ?? 0),
    status: normalizeStatus(raw.status),
    is_active: raw.is_active !== undefined ? Boolean(raw.is_active) : true,
    refundPolicy: String(raw.refundPolicy ?? raw.refund_policy ?? ""),
    revenue: Number(raw.revenue ?? raw.total_revenue ?? 0),
    participants: normalizeParticipants(raw.participants),
  };
}

function normalizeCohortsResponse(payload: unknown): CohortListItem[] {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw?.data ?? {}) as Record<string, unknown>;
  const source = data?.items;

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item) => normalizeCohortItem(item)).filter((item): item is CohortListItem => Boolean(item));
}

function CohortFormModal({
  isOpen,
  mode,
  form,
  errors,
  submitError,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  mode: "create" | "edit";
  form: CohortFormData;
  errors: CohortFormErrors;
  submitError: string;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (field: keyof CohortFormData, value: string) => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="edit-cohort-title">
      <div className="admin-modal admin-modal--form">
        <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Close modal">
          <FiX size={18} />
        </button>

        <h2 id="edit-cohort-title" className="admin-modal__title admin-modal__title--left">
          {mode === "create" ? "Create Cohort" : "Edit Cohort"}
        </h2>

        <form
          className="admin-form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="admin-form-field">
            <span>Cohort Name</span>
            <input value={form.cohortName} onChange={(event) => onChange("cohortName", event.target.value)} />
            {errors.cohortName ? <p className="admin-form-field__error">{errors.cohortName}</p> : null}
          </label>

          <label className="admin-form-field">
            <span>Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
            />
            {errors.description ? <p className="admin-form-field__error">{errors.description}</p> : null}
          </label>

          <div className="admin-form-row">
            <label className="admin-form-field">
              <span>Start Date</span>
              <input type="date" value={form.startDate} onChange={(event) => onChange("startDate", event.target.value)} />
              {errors.startDate ? <p className="admin-form-field__error">{errors.startDate}</p> : null}
            </label>

            <label className="admin-form-field">
              <span>Price ($)</span>
              <input value={form.price} onChange={(event) => onChange("price", event.target.value)} />
              {errors.price ? <p className="admin-form-field__error">{errors.price}</p> : null}
            </label>
          </div>

          <label className="admin-form-field">
            <span>Seat Limit</span>
            <input value={form.seatLimit} onChange={(event) => onChange("seatLimit", event.target.value)} />
            {errors.seatLimit ? <p className="admin-form-field__error">{errors.seatLimit}</p> : null}
          </label>

          <label className="admin-form-field">
            <span>Refund Policy</span>
            <textarea
              rows={4}
              value={form.refundPolicy}
              onChange={(event) => onChange("refundPolicy", event.target.value)}
            />
            {errors.refundPolicy ? <p className="admin-form-field__error">{errors.refundPolicy}</p> : null}
          </label>

          {submitError ? <p className="admin-form-submit-error">{submitError}</p> : null}

          <div className="admin-modal__actions admin-modal__actions--form">
            <button type="button" className="admin-modal__button admin-modal__button--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Cohort"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CohortDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("id");

  const [cohort, setCohort] = useState<CohortDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [participantRows, setParticipantRows] = useState<CohortParticipant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true);
  const [participantsError, setParticipantsError] = useState("");
  const [participantsPagination, setParticipantsPagination] = useState<ParticipantsPagination>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  });

  const [cohortRows, setCohortRows] = useState<CohortListItem[]>([]);
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(true);
  const [cohortsError, setCohortsError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("edit");
  const [form, setForm] = useState<CohortFormData>(initialForm);
  const [formErrors, setFormErrors] = useState<CohortFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { handleExportParticipants, loading: isExporting } = useAdminParticipants();

  useEffect(() => {
    let active = true;

    async function loadCohort() {
      if (!cohortId) {
        if (!active) return;
        setError("Missing cohort id.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getAdminCohortById(cohortId);
        const normalized = normalizeCohort(response);

        if (!active) return;

        if (!normalized) {
          setError("Unable to load cohort details.");
          setCohort(null);
          return;
        }

        setCohort(normalized);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load cohort details.");
        setCohort(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCohort();

    return () => {
      active = false;
    };
  }, [cohortId]);

  useEffect(() => {
    let active = true;

    async function loadParticipants() {
      try {
        setIsLoadingParticipants(true);
        setParticipantsError("");

        const response = await getAdminParticipants({
          page: 1,
          limit: 10,
          search: "",
          cohort_ids: cohortId ?? "",
          payment_status: "",
          registration_status: "",
        });

        const normalizedRows = normalizeParticipantsResponse(response);
        const normalizedPagination = normalizeParticipantsPagination(response);

        if (!active) return;
        setParticipantRows(normalizedRows);
        setParticipantsPagination(normalizedPagination);
      } catch (err) {
        if (!active) return;
        setParticipantsError(err instanceof Error ? err.message : "Failed to load participants");
      } finally {
        if (active) {
          setIsLoadingParticipants(false);
        }
      }
    }

    loadParticipants();

    return () => {
      active = false;
    };
  }, [cohortId]);

  const loadCohorts = async () => {
    try {
      setIsLoadingCohorts(true);
      setCohortsError("");

      const response = await getAdminCohorts();
      console.log("response", response);
      const normalizedRows = normalizeCohortsResponse(response);

      setCohortRows(normalizedRows);
    } catch (err) {
      setCohortsError(err instanceof Error ? err.message : "Failed to load cohorts");
    } finally {
      setIsLoadingCohorts(false);
    }
  };

  const handleToggleCohortStatus = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      await updateAdminCohortStatus(id, newStatus);
      await loadCohorts();
    } catch (error) {
      console.error("Failed to update cohort status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    loadCohorts();
  }, []);

  const resetModalState = () => {
    setForm(initialForm);
    setFormErrors({});
    setSubmitError("");
    setIsSubmitting(false);
    setSelectedCohortId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModalState();
  };

  const openCreateModal = () => {
    setMode("create");
    setSelectedCohortId(null);
    setForm(initialForm);
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const validateForm = (values: CohortFormData) => {
    const nextErrors: CohortFormErrors = {};

    if (!values.cohortName.trim()) nextErrors.cohortName = "This field is required";
    if (!values.description.trim()) nextErrors.description = "This field is required";
    if (!values.startDate.trim()) nextErrors.startDate = "This field is required";
    if (!values.price.trim()) nextErrors.price = "This field is required";
    if (!values.seatLimit.trim()) nextErrors.seatLimit = "This field is required";
    if (!values.refundPolicy.trim()) nextErrors.refundPolicy = "This field is required";

    return nextErrors;
  };

  const handleFormChange = (field: keyof CohortFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

  const handleExport = async () => {
    try {
      const blob = await handleExportParticipants({
        cohort_ids: cohortId ?? "",
      });

      const csvBlob = blob instanceof Blob ? blob : new Blob([blob], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `participants-${cohort?.name || "cohort"}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleViewPayments = () => {
    if (cohortId) {
      router.push(`/admin/payments?cohort=${cohortId}`);
    }
  };

  const hasNoParticipants = participantRows.length === 0;

  const handleSaveCohort = async () => {
    const nextErrors = validateForm(form);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const payload = {
        name: form.cohortName.trim(),
        description: form.description.trim(),
        start_date: form.startDate,
        price: Number(form.price),
        seat_limit: Number(form.seatLimit),
        refund_policy: form.refundPolicy.trim(),
        status: "active",
      };

      if (mode === "create") {
        const response = await createAdminCohort(payload);
        await loadCohorts();
      } else {
        if (!selectedCohortId) {
          setSubmitError("Missing cohort id for update");
          return;
        }

        const response = await updateAdminCohort(selectedCohortId, payload);
        await loadCohorts();
      }

      closeModal();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Failed to create cohort"
            : "Failed to update cohort"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const participantColumns = useMemo<AdminTableColumn<CohortParticipant>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        className: "admin-table-col-name",
        render: (row) => {
          const fullName = row?.name?.trim() || "";

          // Split name safely
          const nameParts = fullName.split(" ").filter(Boolean);

          // Generate initials (max 2 letters)
          let initials = "NA";
          if (nameParts.length === 1) {
            initials = nameParts[0][0]?.toUpperCase() || "N";
          } else if (nameParts.length >= 2) {
            initials =
              (nameParts[0][0] + nameParts[1][0]).toUpperCase();
          }

          return (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-warmCreamy)] text-[var(--color-deepGold)]  text-[12px] font-medium">
                {initials}
              </div>

              {/* Name */}
              <span className="admin-table-primary">
                {fullName || "Unknown"}
              </span>
            </div>
          );
        },
      },
      { key: "email", header: "Email", className: "admin-table-col-name", render: (row) => <span className="admin-muted">{row.email}</span> },
      { key: "phone", header: "Phone", render: (row) => <span className="admin-muted">{row.phone}</span> },
      {
        key: "cohort",
        header: "Cohort",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-linkish">{row?.cohort ?? "-"}</span>,
      },
      {
        key: "payment",
        header: "Payment Status",
        render: (row) => (
          <AdminStatusBadge
            customColor={
              row.payment.toLowerCase() === "paid"
                ? "#2BAB6F"
                : row.payment.toLowerCase() === "refunded"
                  ? "#D9AC26"
                  : row.payment.toLowerCase() === "failed"
                    ? "#DC2828"
                    : "#F48C25"
            }
          >
            {row.payment}
          </AdminStatusBadge>
        ),
      },
      {
        key: "registration",
        header: "Registration Status",
        render: (row) => (
          <AdminStatusBadge customColor={row.registration.toLowerCase() === "complete" ? "#2BAB6F" : "#F48C25"}>{row.registration}</AdminStatusBadge>
        ),
      },
    ],
    []
  );

  const cohortColumns = useMemo<AdminTableColumn<CohortListItem>[]>(
    () => [
      { key: "name", header: "Cohort Name", className: "admin-table-col-name", render: (row) => <span className="admin-table-primary">{row.name}</span> },
      { key: "startDate", header: "Start Date", className: "admin-table-col-name", render: (row) => <span className="admin-muted">{row.startDate}</span> },
      { key: "price", header: "Price", className: "admin-table-col-name", render: (row) => formatCurrency(row.price) },
      { key: "seats", header: "Seats", className: "admin-table-col-name", render: (row) => `${row.seatsFilled} / ${row.seatLimit}` },
      {
        key: "status",
        header: "Status",
        render: (row) => <AdminStatusBadge customColor={getStatusColor(row.status)}>{row.status}</AdminStatusBadge>,
      },
      {
        key: "action",
        header: "Action",
        className: "w-[300px]",
        render: (row) => (
          <div className="admin-row-actions">
            <Link
              href={`/admin/cohorts/view?id=${encodeURIComponent(row.id)}`}
              className="admin-row-actions__button"
              aria-label={`View ${row.name}`}
            >
              <FiEye size={14} />
            </Link>
            <Link
              href={`/admin/cohorts/edit?id=${encodeURIComponent(row.id)}`}
              className="admin-row-actions__button"
              aria-label={`Edit ${row.name}`}
            >
              <FiEdit2 size={14} />
            </Link>
            <Link className="admin-row-actions__button"
              href={`/admin/participants?cohort_id=${encodeURIComponent(row.id)}`}
              aria-label={`Participants in ${row.name}`}>
              <FiUsers size={14} />
            </Link>
            <AdminToggle
              checked={row.is_active ?? true}
              disabled={togglingId === row.id}
              onChange={() => handleToggleCohortStatus(row.id, row.is_active ?? true)}
              ariaLabel={`Toggle active status for ${row.name}`}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Cohort Details" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-detail-hero">
              <div className="admin-detail-hero__title-wrap">
                <Link href="/admin/cohorts" className="admin-back-link">
                  <FiArrowLeft size={25} />
                </Link>
                <div className="admin-detail-hero__copy">
                  <div className="admin-detail-hero__heading">
                    <h2 className="admin-page-title">{loading ? "Loading cohort..." : cohort?.name ?? "Cohort Details"}</h2>
                    {!loading && cohort ? <AdminStatusBadge customColor={getStatusColor(cohort.status)}>{cohort.status}</AdminStatusBadge> : null}
                  </div>
                </div>
              </div>
            </section>

            {error ? (
              <section className="admin-card admin-info-card">
                <h3 className="admin-section-title">Unable to load cohort</h3>
                <p className="admin-info-card__text">{error}</p>
              </section>
            ) : null}

            <section className="admin-grid admin-grid--participants-stats">



              <article
                className="admin-card admin-stat-card"
              >
                <div className="flex justify-start items-center gap-4">
                  <div className="admin-card-icon-par">
                    <Image src="/admin/cohortTopIcon.svg" alt="icon" width={30} height={30} /></div>
                  <p className="admin-card-title">{"Total Seats"}</p>

                </div>
                <div className="admin-card-copy ml-[62px]">
                  <p className="admin-card-data ">{cohort?.seatLimit ?? 0}</p>
                </div>
              </article>

              <article
                className="admin-card admin-stat-card"
              >
                <div className="flex justify-start items-center gap-4">
                  <div className="admin-card-icon-par">
                    <Image src="/admin/participantsTopIcon2.svg" alt="icon" width={28} height={28} /></div>
                  <p className="admin-card-title">{"Filled Seats"}</p>

                </div>
                <div className="admin-card-copy ml-[62px]">
                  <p className="admin-card-data ">{cohort?.seatsFilled ?? 0}</p>
                </div>
              </article>


              <article
                className="admin-card admin-stat-card"
              >
                <div className="flex justify-start items-center gap-4">
                  <div className="admin-card-icon-par">
                    <Image src="/admin/participantsTopIcon1.svg" alt="icon" width={28} height={28} /></div>
                  <p className="admin-card-title">{"Revenue"}</p>

                </div>
                <div className="admin-card-copy ml-[62px]">
                  <p className="admin-card-data ">{formatCurrency(cohort?.revenue ?? 0)}</p>
                </div>
              </article>


            </section>

            <section className="admin-grid admin-grid--detail-cards">
              <article className="admin-card admin-info-card">
                <h3 className="admin-section-title">Program Overview</h3>
                <p className="admin-info-card__text">{cohort?.description ?? (loading ? "Loading details..." : "No description available.")}</p>
                <p className="admin-info-card__text">
                  Start Date: <span className="admin-info-card__meta">{cohort?.startDate ?? "-"}</span>
                </p>
              </article>

              <article className="admin-card admin-info-card">
                <h3 className="admin-section-title">Pricing</h3>
                <p className="admin-info-card__price !mb-3 !mt-3">{formatCurrency(cohort?.price ?? 0)}</p>
                <p className="admin-info-card__text">per participant</p>
              </article>

              <article className="admin-card admin-info-card">
                <h3 className="admin-section-title">Refund Terms</h3>
                <p className="admin-info-card__text">{cohort?.refundPolicy ? cohort?.refundPolicy : "Full refund up to 7 days before start date"}</p>
              </article>
            </section>

            <section className="admin-detail-actions">
              <Link
                href={cohort ? `/admin/cohorts/edit?id=${encodeURIComponent(cohort.id)}` : "#"}
                className="admin-table-button admin-table-button--primary"
              >
                <FiEdit2 size={14} />
                <span>Edit Cohort</span>
              </Link>
              <button
                type="button"
                className="admin-table-button cursor-pointer"
                onClick={handleViewPayments}
              // disabled={hasNoParticipants}
              >
                <img src="/admin/view-payment.png" alt="" />
                <span
                  className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]"
                >View Payments</span>
              </button>
              <button
                type="button"
                className={`admin-table-button ${hasNoParticipants ? " cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleExport}
                disabled={hasNoParticipants || isExporting}
              >
                <FiDownload size={14} />
                <span
                  className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]"
                >{isExporting ? "Exporting..." : "Export CSV"}</span>
              </button>
            </section>

            <AdminTable
              title={`Participants (${participantsPagination.totalRecords})`}
              columns={participantColumns}
              rows={participantRows}
              showToolbar={false}
              showTitleInside
              footer={
                isLoadingParticipants
                  ? "Loading participants..."
                  : participantsError
                    ? participantsError
                    : `Showing ${participantRows.length} of ${participantsPagination.totalRecords} participants`
              }
            />

            {/* <section className="admin-page-intro mt-5">
              <div>
                <h2 className="admin-page-title">Cohorts</h2>
              </div>

              <button type="button" className="admin-table-button admin-table-button--primary" onClick={openCreateModal}>
                <FiPlus size={14} />
                <span>Create Cohort</span>
              </button>
            </section>

            <AdminTable
              title="Cohorts"
              columns={cohortColumns}
              rows={cohortRows}
              showToolbar={false}
              footer={
                isLoadingCohorts ? "Loading cohorts..." : cohortsError ? cohortsError : `Showing ${cohortRows.length} cohorts`
              }
            /> */}
          </div>
        </main>
      </div>

      <CohortFormModal
        isOpen={isModalOpen}
        mode={mode}
        form={form}
        errors={formErrors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onChange={handleFormChange}
        onSubmit={handleSaveCohort}
      />
    </div>
  );
}
