"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import {
  createAdminCohort,
  getAdminCohorts,
  updateAdminCohort,
  updateAdminCohortStatus,
} from "@/services/admin.services";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
  AdminToggle,
} from "@/components/admin/AdminTable";
import { CohortItem, formatCurrency } from "@/components/admin/cohortData";
import { FiEdit2, FiEye, FiPlus, FiTrash2, FiUsers, FiX } from "react-icons/fi";

type CohortFormData = {
  cohortName: string;
  description: string;
  startDate: string;
  endDate: string;
  price: string;
  seatLimit: string;
  refundPolicy: string;
};

type CohortFormErrors = Partial<Record<keyof CohortFormData, string>>;

const initialForm: CohortFormData = {
  cohortName: "",
  description: "",
  startDate: "",
  endDate: "",
  price: "",
  seatLimit: "",
  refundPolicy: "",
};

function normalizeStatus(value: unknown): CohortItem["status"] {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "active") return "Active";
  if (normalized === "full") return "Full";
  return "Closed";
}

function normalizeCohortItem(payload: unknown): CohortItem | null {
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
    endDate: String(raw.endDate ?? raw.end_date ?? "-"),
    price: Number(raw.price ?? 0),
    seatsFilled: Number(raw.seatsFilled ?? raw.seats_filled ?? 0),
    seatLimit: Number(raw.seatLimit ?? raw.seat_limit ?? 0),
    status: normalizeStatus(raw.status),
    refundPolicy: String(raw.refundPolicy ?? raw.refund_policy ?? ""),
    revenue: Number(raw.revenue ?? raw.total_revenue ?? 0),
    participants: Array.isArray(raw.participants) ? raw.participants : [],
  };
}

function normalizeCohortsResponse(response: any): CohortItem[] {
  const items = response?.data?.items ?? [];

  return items.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    description: item.description,
    startDate: item.start_date,
    endDate: item.end_date,
    price: item.price,
    seatLimit: item.seat_limit ?? 0,
    seatsFilled: item.seats_filled ?? 0,
    refundPolicy: item.refund_policy ?? "",
    status: normalizeStatus(item.status),
    sync_status: item.sync_status,
    is_active: item.is_active ?? true,
  }));
}

function getStatusColor(status: CohortItem["status"]) {
  const s = String(status).toLowerCase();
  if (s === "active") return "#2BAB6F";
  if (s === "full") return "#F48C25";
  return "#DC2828";
}

function CreateCohortModal({
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
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-cohort-title"
    >
      <div className="admin-modal admin-modal--form">
        <button
          type="button"
          className="admin-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        <h2
          id="create-cohort-title"
          className="admin-modal__title admin-modal__title--left"
        >
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
            <input
              value={form.cohortName}
              onChange={(event) => onChange("cohortName", event.target.value)}
            />
            {errors.cohortName ? (
              <p className="admin-form-field__error">{errors.cohortName}</p>
            ) : null}
          </label>

          <label className="admin-form-field">
            <span>Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => onChange("description", event.target.value)}
            />
            {errors.description ? (
              <p className="admin-form-field__error">{errors.description}</p>
            ) : null}
          </label>

          <div className="admin-form-row">
            <label className="admin-form-field">
              <span>Start Date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => onChange("startDate", event.target.value)}
              />
              {errors.startDate ? (
                <p className="admin-form-field__error">{errors.startDate}</p>
              ) : null}
            </label>
            <label className="admin-form-field">
              <span>End Date</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => onChange("endDate", event.target.value)}
              />
              {errors.endDate ? (
                <p className="admin-form-field__error">{errors.endDate}</p>
              ) : null}
            </label>
          </div>
          <div className="admin-form-row">
            <label className="admin-form-field">
              <span>Price ($)</span>
              <input
                value={form.price}
                onChange={(event) => onChange("price", event.target.value)}
              />
              {errors.price ? (
                <p className="admin-form-field__error">{errors.price}</p>
              ) : null}
            </label>
            <label className="admin-form-field">
              <span>Seat Limit</span>
              <input
                value={form.seatLimit}
                onChange={(event) => onChange("seatLimit", event.target.value)}
              />
              {errors.seatLimit ? (
                <p className="admin-form-field__error">{errors.seatLimit}</p>
              ) : null}
            </label>
          </div>
          <label className="admin-form-field">
            <span>Refund Policy</span>
            <textarea
              rows={4}
              value={form.refundPolicy}
              onChange={(event) => onChange("refundPolicy", event.target.value)}
            />
            {errors.refundPolicy ? (
              <p className="admin-form-field__error">{errors.refundPolicy}</p>
            ) : null}
          </label>

          {submitError ? (
            <p className="admin-form-submit-error">{submitError}</p>
          ) : null}

          <div className="admin-modal__actions admin-modal__actions--form">
            <button
              type="button"
              className="admin-modal__button admin-modal__button--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Cohort"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CohortsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState<CohortFormData>(initialForm);
  const [formErrors, setFormErrors] = useState<CohortFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cohortRows, setCohortRows] = useState<CohortItem[]>([]);
  const [isLoadingCohorts, setIsLoadingCohorts] = useState(false);
  const [cohortsError, setCohortsError] = useState("");
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleCohortStatus = async (
    id: string,
    currentStatus: boolean,
  ) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      await updateAdminCohortStatus(id, newStatus);

      // Re-fetch data to show updated status from server
      await loadCohorts();
    } catch (error) {
      console.error("Failed to update cohort status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const loadCohorts = async () => {
    try {
      setIsLoadingCohorts(true);
      setCohortsError("");

      const response = await getAdminCohorts();
      const normalizedRows = normalizeCohortsResponse(response);

      setCohortRows(normalizedRows);
    } catch (error) {
      setCohortsError(
        error instanceof Error ? error.message : "Failed to load cohorts",
      );
    } finally {
      setIsLoadingCohorts(false);
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

  const validateForm = (values: CohortFormData) => {
    const nextErrors: CohortFormErrors = {};

    if (!values.cohortName.trim())
      nextErrors.cohortName = "This field is required";
    if (!values.description.trim())
      nextErrors.description = "This field is required";
    if (!values.startDate.trim())
      nextErrors.startDate = "This field is required";
    if (!values.endDate.trim()) nextErrors.endDate = "This field is required";
    if (!values.price.trim()) nextErrors.price = "This field is required";
    if (!values.seatLimit.trim())
      nextErrors.seatLimit = "This field is required";
    if (!values.refundPolicy.trim())
      nextErrors.refundPolicy = "This field is required";

    return nextErrors;
  };

  const openCreateModal = () => {
    window.location.assign("/admin/cohorts/create");
  };

  const handleFormChange = (field: keyof CohortFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  };

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
        end_date: form.endDate,
        price: Number(form.price),
        seat_limit: Number(form.seatLimit),
        refund_policy: form.refundPolicy.trim(),
        // status: "Active",
      };

      if (mode === "edit") {
        if (!selectedCohortId) {
          setSubmitError("Missing cohort id for update");
          return;
        }

        const response = await updateAdminCohort(selectedCohortId, payload);
        await loadCohorts();
      } else {
        const response = await createAdminCohort(payload);
        await loadCohorts();
      }

      closeModal();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : mode === "edit"
            ? "Failed to update cohort"
            : "Failed to create cohort",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<AdminTableColumn<CohortItem>[]>(
    () => [
      {
        key: "name",
        header: "Cohort Name",
        className: "admin-table-col-name",
        render: (row) => (
          <span className="admin-table-primary">{row.name}</span>
        ),
      },
      {
        key: "startDate",
        header: "Start Date",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-muted">{row.startDate}</span>,
      },
      {
        key: "endDate",
        header: "End Date",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-muted">{row.endDate}</span>,
      },
      {
        key: "price",
        header: "Price",
        render: (row) => `$${row.price} USD`,
      },
      {
        key: "seats",
        header: "Enrolled / Total",
        render: (row) => `${row.seatsFilled} / ${row.seatLimit}`,
      },
      {
        key: "status",
        header: "Status",
        render: (row: CohortItem) => {
          const status = row.sync_status?.toLowerCase();

          const statusColors: Record<string, string> = {
            active: "#2BAB6F",
            full: "#D9AC26",
            closed: "#DC2828",
            open: "#2563EB",
            draft: "#9333EA",
            archived: "#6B7280",
            inactive: "#0041B1",
          };

          const formattedStatus = status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Inactive";

          return (
            <AdminStatusBadge
              customColor={statusColors[status || "inactive"] || "#9CA3AF"}
            >
              {formattedStatus}
            </AdminStatusBadge>
          );
        },
      },
      // {
      //   key: "status",
      //   header: "Status",
      //   render: (row) => (
      //     <AdminStatusBadge customColor={getStatusColor(row.status)}>
      //       {row.status}
      //     </AdminStatusBadge>
      //   ),
      // },
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
            <Link
              href={`/admin/participants?cohort_id=${encodeURIComponent(row.id)}`}
              className="admin-row-actions__button"
              aria-label={`Participants in ${row.name}`}
            >
              <FiUsers size={14} />
            </Link>
            <AdminToggle
              checked={row.is_active ?? true}
              disabled={togglingId === row.id}
              onChange={() =>
                handleToggleCohortStatus(row.id, row.is_active ?? true)
              }
              ariaLabel={`Toggle active status for ${row.name}`}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Cohorts" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro">
              <div>
                <h2 className="admin-page-title">Cohorts</h2>
              </div>

              <button
                type="button"
                className="admin-table-button admin-table-button--primary"
                // onClick={openCreateModal}
              >
                <Link href="/admin/cohorts/create" className="flex gap-2">
                  <FiPlus size={14} />
                  <span>Create Cohort</span>
                </Link>
              </button>
            </section>

            <AdminTable
              title="Cohorts"
              columns={columns}
              rows={cohortRows}
              showToolbar={false}
              footer={
                isLoadingCohorts
                  ? "Loading cohorts..."
                  : cohortsError
                    ? cohortsError
                    : `Showing ${cohortRows.length} cohorts`
              }
            />
          </div>
        </main>
      </div>

      <CreateCohortModal
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
