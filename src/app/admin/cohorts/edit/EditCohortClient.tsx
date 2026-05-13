"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { getCohortById, updateAdminCohort } from "@/services/admin.services";

type InvestmentRow = {
  titleName: string;
  price: string;
  whatYouGet: string;
};

type TextRow = {
  value: string;
};

type ProgramRow = {
  programId: string;
  programName: string;
  programDescription: string;
};

type RefundDeferralPolicyRow = {
  program: string;
  pricePerSeat: string;
};

type EditCohortForm = {
  cohortTitle: string;
  cohortDescription: string;
  programOverview: string;
  hasMultiProgram: boolean;
  startDate: string;
  endDate: string;
  timeCommitment: string;
  liveSessions: string;
  workshop: string;
  cohortSize: string;
  refundDeferralPolicy: RefundDeferralPolicyRow[];
  investments: InvestmentRow[];
  leaveWith: TextRow[];
  ctaDescription: string;
  price: string;
  programs: ProgramRow[];
};

const emptyInvestmentRow: InvestmentRow = {
  titleName: "",
  price: "",
  whatYouGet: "",
};

const emptyTextRow: TextRow = {
  value: "",
};

const emptyProgramRow: ProgramRow = {
  programId: "",
  programName: "",
  programDescription: "",
};

const emptyRefundDeferralPolicyRow: RefundDeferralPolicyRow = {
  program: "",
  pricePerSeat: "",
};

const initialForm: EditCohortForm = {
  cohortTitle: "",
  cohortDescription: "",
  programOverview: "",
  hasMultiProgram: true,
  startDate: "",
  endDate: "",
  timeCommitment: "",
  liveSessions: "",
  workshop: "",
  cohortSize: "",
  refundDeferralPolicy: [{ ...emptyRefundDeferralPolicyRow }],
  investments: [{ ...emptyInvestmentRow }],
  leaveWith: [{ ...emptyTextRow }],
  ctaDescription: "",
  price: "",
  programs: [{ ...emptyProgramRow }],
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value);
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
  }

  return fallback;
}

function normalizeDate(value: unknown) {
  const raw = asString(value);
  if (!raw || raw === "-") return "";
  return raw.slice(0, 10);
}

function normalizeArray<T>(
  value: unknown,
  mapper: (item: unknown) => T,
  fallback: T
) {
  if (!Array.isArray(value) || value.length === 0) {
    return [fallback];
  }

  return value.map(mapper);
}

function normalizeInvestment(item: unknown): InvestmentRow {
  const row = asRecord(item);

  return {
    titleName: asString(row.tier ?? row.title_name ?? row.titleName ?? row.title ?? row.name),
    price: 
    asString(row.price ?? row.amount),
    whatYouGet: asString(
      row.best_for ?? row.what_you_get ?? row.whatYouGet ?? row.description ?? row.value
    ),
  };
}

function normalizeTextRow(item: unknown): TextRow {
  if (typeof item === "string") {
    return { value: item };
  }

  const row = asRecord(item);
  return {
    value: asString(row.value ?? row.text ?? row.description ?? row.title),
  };
}

function normalizeProgram(item: unknown): ProgramRow {
  const row = asRecord(item);

  return {
    programId: asString(row.program_id ?? row.id ?? row.programId),
    programName: asString(
      row.program_name ?? row.name ?? row.programName ?? row.title
    ),
    programDescription: asString(
      row.program_description ??
        row.description ??
        row.programDescription ??
        row.program_desc
    ),
  };
}

function normalizeRefundDeferralPolicy(
  item: unknown
): RefundDeferralPolicyRow {
  if (typeof item === "string") {
    return { program: "", pricePerSeat: item };
  }

  const row = asRecord(item);
  return {
    program: asString(row.program ?? row.name ?? row.title),
    pricePerSeat: asString(
      row.price_per_seat ?? row.pricePerSeat ?? row.policy ?? row.value
    ),
  };
}

function normalizeRefundDeferralPolicyRows(
  value: unknown
): RefundDeferralPolicyRow[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.map(normalizeRefundDeferralPolicy);
  }

  if (typeof value === "string" && value.trim()) {
    return [{ program: "", pricePerSeat: value }];
  }

  return [{ ...emptyRefundDeferralPolicyRow }];
}

function parseNumberOrText(value: string) {
  const trimmed = value.trim();
  const numeric = Number(trimmed.replace(/[$,\sA-Za-z]/g, ""));

  return trimmed && Number.isFinite(numeric) ? numeric : trimmed;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function normalizePriceInput(value: string) {
  return value
    .replace(/[—−]/g, "–")
    .replace(/[^0-9$.,\s-–]/g, "")
    .replace(/\s+/g, " ");
}

function formatPriceForPayload(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/([–-])/)
    .map((part) => {
      const segment = part.trim();
      if (!segment) return "";
      if (segment === "–" || segment === "-") return "–";
      return segment.startsWith("$") ? segment : `$${segment}`;
    })
    .join("");
}

function normalizeCohort(payload: unknown): EditCohortForm {
  const response = asRecord(payload);
  const data = asRecord(response.data ?? response.cohort ?? response);
  const program = asRecord(data.program ?? data.program_details);
  const pricing = asRecord(data.pricing ?? data.cta ?? data.pricing_cta);

  return {
    cohortTitle: asString(data.name ?? data.title ?? data.cohort_title),
    cohortDescription: asString(
      data.description ?? data.cohort_description ?? data.overview
    ),
    programOverview: asString(data.program_overview ?? data.programOverview),
    hasMultiProgram: asBoolean(
      data.has_multi_program ?? data.hasMultiProgram,
      true
    ),
    startDate: normalizeDate(data.start_date ?? data.startDate),
    endDate: normalizeDate(data.end_date ?? data.endDate),
    timeCommitment: asString(data.time_commitment ?? data.timeCommitment),
    liveSessions: asString(
      data.live_sessions_text     ),
    workshop: asString(data.workshops_text ?? data.workshop ?? data.workshops),
    cohortSize: digitsOnly(
      asString(data.seat_limit)
    ),
    refundDeferralPolicy: normalizeRefundDeferralPolicyRows(
      data.refund_deferral_policy ??
        data.refundDeferralPolicy ??
        data.refund_policy ??
        data.refundPolicy
    ),
    investments: normalizeArray(
      data.investment_tiers ?? data.investments ?? data.investment_table ?? data.investmentTable,
      normalizeInvestment,
      { ...emptyInvestmentRow }
    ),
    leaveWith: normalizeArray(
      data.what_you_leave_with ?? data.whatYouLeaveWith ?? data.leave_with,
      normalizeTextRow,
      { ...emptyTextRow }
    ),
    ctaDescription: asString(
      data.scarcity_text ?? pricing.description ?? data.cta_description ?? data.pricing_description
    ),
    price: asString(data.display_price ?? pricing.display_price ?? pricing.price ?? data.price),
    programs: normalizeArray(
      data.programs,
      normalizeProgram,
      {
        programId: asString(program.id ?? data.program_id ?? data.programId),
        programName: asString(
          program.name ?? data.program_name ?? data.programName
        ),
        programDescription: asString(
          program.description ??
            data.program_description ??
            data.programDescription
        ),
      }
    ),
  };
}

export default function EditCohortClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("id");
  const [form, setForm] = useState<EditCohortForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const pageTitle = useMemo(() => {
    if (isLoading) return "Edit Cohort";
    return form.cohortTitle || "Edit Cohort";
  }, [form.cohortTitle, isLoading]);

  useEffect(() => {
    let active = true;

    async function loadCohort() {
      if (!cohortId) {
        setError("Missing cohort id.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const response = await getCohortById(cohortId);
        if (!active) return;
        setForm(normalizeCohort(response));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load cohort.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCohort();

    return () => {
      active = false;
    };
  }, [cohortId]);

  const updateField = (field: keyof EditCohortForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitMessage("");
  };

  const updateInvestment = (
    index: number,
    field: keyof InvestmentRow,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      investments: current.investments.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
    setSubmitMessage("");
  };

  const updateLeaveWith = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      leaveWith: current.leaveWith.map((row, rowIndex) =>
        rowIndex === index ? { value } : row
      ),
    }));
    setSubmitMessage("");
  };

  const updateProgram = (
    index: number,
    field: keyof ProgramRow,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      programs: current.programs.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
    setSubmitMessage("");
  };

  const updateRefundDeferralPolicy = (
    index: number,
    field: keyof RefundDeferralPolicyRow,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      refundDeferralPolicy: current.refundDeferralPolicy.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
    setSubmitMessage("");
  };

  const addInvestment = () => {
    setForm((current) => ({
      ...current,
      investments: [...current.investments, { ...emptyInvestmentRow }],
    }));
  };

  const removeInvestment = (index: number) => {
    setForm((current) => ({
      ...current,
      investments:
        current.investments.length === 1
          ? [{ ...emptyInvestmentRow }]
          : current.investments.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const addLeaveWith = () => {
    setForm((current) => ({
      ...current,
      leaveWith: [...current.leaveWith, { ...emptyTextRow }],
    }));
  };

  const removeLeaveWith = (index: number) => {
    setForm((current) => ({
      ...current,
      leaveWith:
        current.leaveWith.length === 1
          ? [{ ...emptyTextRow }]
          : current.leaveWith.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const addRefundDeferralPolicy = () => {
    setForm((current) => ({
      ...current,
      refundDeferralPolicy: [
        ...current.refundDeferralPolicy,
        { ...emptyRefundDeferralPolicyRow },
      ],
    }));
  };

  const removeRefundDeferralPolicy = (index: number) => {
    setForm((current) => ({
      ...current,
      refundDeferralPolicy:
        current.refundDeferralPolicy.length === 1
          ? [{ ...emptyRefundDeferralPolicyRow }]
          : current.refundDeferralPolicy.filter(
              (_, rowIndex) => rowIndex !== index
            ),
    }));
  };

  const addProgram = () => {
    setForm((current) => ({
      ...current,
      programs: [...current.programs, { ...emptyProgramRow }],
    }));
  };

  const removeProgram = (index: number) => {
    setForm((current) => ({
      ...current,
      programs:
        current.programs.length === 1
          ? [{ ...emptyProgramRow }]
          : current.programs.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cohortId) {
      setError("Missing cohort id.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSubmitMessage("");

      const payload: Record<string, unknown> = {
        name: form.cohortTitle.trim(),
        description: form.cohortDescription.trim(),
        program_overview: form.programOverview.trim(),
        time_commitment: form.timeCommitment.trim(),
        start_date: form.startDate,
        end_date: form.endDate,
        price: form.price,
        seat_limit: parseNumberOrText(form.cohortSize),
        refund_deferral_policy: form.refundDeferralPolicy
          .map((row) => ({
            program: row.program.trim(),
            price_per_seat: row.pricePerSeat.trim(),
          }))
          .filter((row) => row.program || row.price_per_seat),
        leave_with: form.leaveWith
          .map((row) => row.value.trim())
          .filter(Boolean),
        live_sessions_text: form.liveSessions.trim(),
        workshops_text: form.workshop.trim(),
        cohort_size_text: form.cohortSize.trim(),
        investment_tiers: form.investments.map((row) => ({
          tier: row.titleName.trim(),
          price: row.price,
          best_for: row.whatYouGet.trim(),
        })),
        scarcity_text: form.ctaDescription.trim(),
        display_price: form.price,
      };

      if (form.hasMultiProgram) {
        payload.programs = form.programs
          .map((row) => ({
             ...(
    row.programId
      ? { program_id: parseNumberOrText(row.programId) }
      : {}
  ),
            program_name: row.programName.trim(),
            program_description: row.programDescription.trim(),
          }))
          .filter((row) => row.program_id || row.program_name || row.program_description);
      }

      await updateAdminCohort(cohortId, payload);
      router.replace("/admin/cohorts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cohort.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Edit Cohort" eyebrow="Admin Panel" />

        <main className="admin-content">
          <form className="admin-edit-cohort" onSubmit={handleSubmit}>
            <div className="admin-edit-cohort__topbar">
              <Link href="/admin/cohorts" className="admin-back-link">
                <FiArrowLeft size={22} />
              </Link>
              <h2 className="admin-page-title">Edit Cohort</h2>
            </div>

            {error ? <p className="admin-form-submit-error">{error}</p> : null}
            {submitMessage ? (
              <p className="admin-form-submit-success">{submitMessage}</p>
            ) : null}

            <section className="admin-edit-section">
              <h3 className="admin-edit-section__title">Cohort Details</h3>
              <hr />
              <div className="flex flex-col mt-3 gap-[20px]">

              <label className="admin-form-field">
                <span>Cohort Title </span>
                <input
                  value={form.cohortTitle}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateField("cohortTitle", event.target.value)
                  }
                  />
              </label>
              <label className="admin-form-field">
                <span>Cohort Description</span>
                <textarea
                  rows={3}
                  value={form.cohortDescription}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateField("cohortDescription", event.target.value)
                  }
                  />
              </label>
              <label className="admin-form-field">
                <span>Program Overview</span>
                <textarea
                  rows={3}
                  value={form.programOverview}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateField("programOverview", event.target.value)
                  }
                  />
              </label>
                  </div>
            </section>

            <section className="admin-edit-section">
              <h3 className="admin-edit-section__title">Schedule</h3>
              <hr />
              <div className="admin-edit-grid admin-edit-grid--two mt-3">
                <label className="admin-form-field">
                  <span>Start date </span>
                  <input
                    type="date"
                    value={form.startDate}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("startDate", event.target.value)
                    }
                  />
                </label>
                <label className="admin-form-field">
                  <span>End date </span>
                  <input
                    type="date"
                    value={form.endDate}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("endDate", event.target.value)
                    }
                  />
                </label>
                <label className="admin-form-field">
                  <span>Live sessions</span>
                  <input
                    value={form.liveSessions}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("liveSessions", event.target.value)
                    }
                  />
                </label>
                <label className="admin-form-field">
                  <span>Time Commitment</span>
                  <input
                    value={form.timeCommitment}
                    disabled={isLoading}
                    placeholder="4-6 hours/week"
                    onChange={(event) =>
                      updateField("timeCommitment", event.target.value)
                    }
                  />
                </label>
                <label className="admin-form-field">
                  <span>Workshop</span>
                  <input
                    value={form.workshop}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("workshop", event.target.value)
                    }
                  />
                </label>
                 <label className="admin-form-field ">
                <span>Seat limit</span>
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.cohortSize}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateField("cohortSize", digitsOnly(event.target.value))
                  }
                />
              </label>
              </div>
             
            </section>

            <section className="admin-edit-section">
              <div className="admin-edit-section__heading-row">
                <h3 className="admin-edit-section__title">Refund & Deferral Policy</h3>
                <button type="button" className="admin-mini-button" onClick={addRefundDeferralPolicy}>
                  <FiPlus size={12} />
                  <span>Add row</span>
                </button>
              </div>
              <hr />
              <div className="admin-edit-table admin-edit-table--refund-policy">
                <div className="admin-edit-table__head">
                  <span>#</span>
                  <span>Program</span>
                  <span>Price Per Seat</span>
                  <span />
                </div>
                {form.refundDeferralPolicy.map((row, index) => (
                  <div className="admin-edit-table__row" key={`refund-policy-${index}`}>
                    <span className="admin-edit-table__index">{index + 1}</span>
                    <input
                      value={row.program}
                      disabled={isLoading}
                      onChange={(event) =>
                        updateRefundDeferralPolicy(index, "program", event.target.value)
                      }
                    />
                    <input
                      value={row.pricePerSeat}
                      disabled={isLoading}
                      onChange={(event) =>
                        updateRefundDeferralPolicy(index, "pricePerSeat", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="admin-icon-button admin-edit-table__delete"
                      aria-label="Delete refund policy row"
                      onClick={() => removeRefundDeferralPolicy(index)}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-edit-section">
              <div className="admin-edit-section__heading-row">
                <h3 className="admin-edit-section__title">Investment Table</h3>
                <button type="button" className="admin-mini-button" onClick={addInvestment}>
                  <FiPlus size={12} />
                  <span>Add row</span>
                </button>
              </div>
              <hr />
              <div className="admin-edit-table admin-edit-table--investment">
                <div className="admin-edit-table__head">
                  <span>#</span>
                  <span>Tier Name</span>
                  <span>Price</span>
                  <span>Best For Description</span>
                  <span />
                </div>
                {form.investments.map((row, index) => (
                  <div className="admin-edit-table__row" key={`investment-${index}`}>
                    <span className="admin-edit-table__index">{index + 1}</span>
                    <input
                      value={row.titleName}
                      disabled={isLoading}
                      onChange={(event) =>
                        updateInvestment(index, "titleName", event.target.value)
                      }
                    />
                    <div className="admin-money-input admin-money-input--table" style={{ display: "flex" }}>
                      <input
                        inputMode="text"
                        value={row.price}
                        disabled={isLoading}
                        aria-label="Investment price"
                        placeholder="$1,400–$1,500"
                        onChange={(event) =>
                          updateInvestment(index, "price", event.target.value)
                        }
                      />
                    </div>
                    <input
                      value={row.whatYouGet}
                      disabled={isLoading}
                      onChange={(event) =>
                        updateInvestment(index, "whatYouGet", event.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="admin-icon-button admin-edit-table__delete"
                      aria-label="Delete investment row"
                      onClick={() => removeInvestment(index)}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-edit-section">
              <div className="admin-edit-section__heading-row">
                <h3 className="admin-edit-section__title">What You Leave With</h3>
                <button type="button" className="admin-mini-button" onClick={addLeaveWith}>
                  <FiPlus size={12} />
                  <span>Add row</span>
                </button>
              </div>
              <hr />
              <div className="admin-edit-repeat-list mt-4">
                {form.leaveWith.map((row, index) => (
                  <div className="admin-edit-repeat-list__row" key={`leave-with-${index}`}>
                    <span>{index + 1}</span>
                    <input
                      value={row.value}
                      disabled={isLoading}
                      onChange={(event) => updateLeaveWith(index, event.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-icon-button admin-edit-table__delete"
                      aria-label="Delete leave-with row"
                      onClick={() => removeLeaveWith(index)}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-edit-section">
              <h3 className="admin-edit-section__title">Pricing/CTA Panel</h3>
              <hr />
              <div className="mt-3 flex flex-col gap-[20px]">

              <label className="admin-form-field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={form.ctaDescription}
                  disabled={isLoading}
                  onChange={(event) =>
                    updateField("ctaDescription", event.target.value)
                  }
                />
              </label>
              <div className="admin-edit-grid admin-edit-grid--compact">
                <label className="admin-form-field">
                  <span>Price </span>
                  <div className="admin-money-input" style={{ display: "flex" }}>
                    <input
                      inputMode="text"
                      value={form.price}
                      disabled={isLoading}
                      aria-label="Price"
                      placeholder="$1,400–$1,500"
                      onChange={(event) => updateField("price", event.target.value
                      )}
                    />
                  </div>
                </label>
              </div>
              </div>

            </section>

            {form.hasMultiProgram ? (
              <section className="admin-edit-section">
                <div className="admin-edit-section__heading-row">
                  <h3 className="admin-edit-section__title">Programs</h3>
                  <button type="button" className="admin-mini-button" onClick={addProgram}>
                    <FiPlus size={12} />
                    <span>Add row</span>
                  </button>
                </div>
                <hr />
                <div className="admin-edit-table admin-edit-table--program">
                  <div className="admin-edit-table__head">
                    <span>#</span>
                    <span>Program Name</span>
                    <span>Program Description</span>
                    <span />
                  </div>
                  {form.programs.map((row, index) => (
                    <div className="admin-edit-table__row" key={`program-${index}`}>
                      <span className="admin-edit-table__index">{index + 1}</span>
                      <input
                        value={row.programName}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateProgram(index, "programName", event.target.value)
                        }
                      />
                      <input
                        value={row.programDescription}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateProgram(index, "programDescription", event.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="admin-icon-button admin-edit-table__delete"
                        aria-label="Delete program row"
                        onClick={() => removeProgram(index)}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="admin-edit-cohort__actions">
              <button
                type="submit"
                className="admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]"
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
