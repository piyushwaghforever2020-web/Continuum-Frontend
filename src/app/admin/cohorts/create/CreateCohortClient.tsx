"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { AdminToggle } from "@/components/admin/AdminTable";
import { createAdminCohort } from "@/services/admin.services";
import { programRowDefaultName } from "@/app/admin/cohorts/programRowLabels";

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
  format: string;
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

type CreateCohortFormErrors = Record<string, string>;

const requiredCreateCohortFields = new Set<keyof EditCohortForm>([
  "cohortTitle",
  "cohortSize",
  "startDate",
  "endDate",
  "price",
]);

const requiredCreateCohortSubmitFields = new Set<keyof EditCohortForm>([
  "cohortTitle",
  "cohortDescription",
  "programOverview",
  "startDate",
  "endDate",
  "liveSessions",
  "format",
  "timeCommitment",
  "workshop",
  "cohortSize",
  "ctaDescription",
  "price",
]);

const requiredMessage = "This field is required";

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
  hasMultiProgram: false,
  startDate: "",
  endDate: "",
  timeCommitment: "",
  format: "",
  liveSessions: "",
  workshop: "",
  cohortSize: "",
  refundDeferralPolicy: [{ ...emptyRefundDeferralPolicyRow }],
  investments: [{ ...emptyInvestmentRow }],
  leaveWith: [{ ...emptyTextRow }],
  ctaDescription: "",
  price: "",
  programs: [{ ...emptyProgramRow, programName: programRowDefaultName(0) }],
};

function parseNumberOrText(value: string) {
  const trimmed = value.trim();
  const numeric = Number(trimmed.replace(/[$,\sA-Za-z]/g, ""));

  return trimmed && Number.isFinite(numeric) ? numeric : trimmed;
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export default function CreateCohortClient() {
  const router = useRouter();
  const [form, setForm] = useState<EditCohortForm>(initialForm);
  const [formErrors, setFormErrors] = useState<CreateCohortFormErrors>({});
  const [isLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftRequest, setIsDraftRequest] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const updateField = (field: keyof EditCohortForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (requiredCreateCohortFields.has(field) || requiredCreateCohortSubmitFields.has(field)) {
      setFormErrors((current) => ({ ...current, [field]: "" }));
    }
    setSubmitMessage("");
  };

  const updateHasMultiProgram = (value: boolean) => {
    setForm((current) => ({ ...current, hasMultiProgram: value }));
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
    setFormErrors((current) => ({
      ...current,
      [`investments.${index}.${field}`]: "",
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
    setFormErrors((current) => ({ ...current, [`leaveWith.${index}.value`]: "" }));
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
    setFormErrors((current) => ({
      ...current,
      [`programs.${index}.${field}`]: "",
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
    setFormErrors((current) => ({
      ...current,
      [`refundDeferralPolicy.${index}.${field}`]: "",
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
      programs: [
        ...current.programs,
        {
          ...emptyProgramRow,
          programName: programRowDefaultName(current.programs.length),
        },
      ],
    }));
  };

  const removeProgram = (index: number) => {
    setForm((current) => ({
      ...current,
      programs:
        current.programs.length === 1
          ? [{ ...emptyProgramRow, programName: programRowDefaultName(0) }]
          : current.programs.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const buildCreatePayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {
      name: form.cohortTitle.trim(),
      description: form.cohortDescription.trim(),
      program_overview: form.programOverview.trim(),
      time_commitment: form.timeCommitment.trim(),
      format: form.format.trim(),
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
      has_multi_program: form.hasMultiProgram,
    };

    if (form.hasMultiProgram) {
      payload.programs = form.programs
        .map((row) => ({
          ...(row.programId ? { program_id: parseNumberOrText(row.programId) } : {}),
          program_name: row.programName.trim(),
          program_description: row.programDescription.trim(),
        }))
        .filter((row) => row.program_id || row.program_name || row.program_description);
    }

    return payload;
  };

  const validateForm = (mode: "draft" | "submit") => {
    const nextErrors: CreateCohortFormErrors = {};

    const fieldsToValidate =
      mode === "draft" ? requiredCreateCohortFields : requiredCreateCohortSubmitFields;

    fieldsToValidate.forEach((field) => {
      const value = form[field];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[field] = requiredMessage;
      }
    });

    if (mode === "submit") {
      form.refundDeferralPolicy.forEach((row, index) => {
        if (!row.program.trim()) {
          nextErrors[`refundDeferralPolicy.${index}.program`] = requiredMessage;
        }
        if (!row.pricePerSeat.trim()) {
          nextErrors[`refundDeferralPolicy.${index}.pricePerSeat`] = requiredMessage;
        }
      });

      form.investments.forEach((row, index) => {
        if (!row.titleName.trim()) {
          nextErrors[`investments.${index}.titleName`] = requiredMessage;
        }
        if (!row.price.trim()) {
          nextErrors[`investments.${index}.price`] = requiredMessage;
        }
        if (!row.whatYouGet.trim()) {
          nextErrors[`investments.${index}.whatYouGet`] = requiredMessage;
        }
      });

      form.leaveWith.forEach((row, index) => {
        if (!row.value.trim()) {
          nextErrors[`leaveWith.${index}.value`] = requiredMessage;
        }
      });

      if (form.hasMultiProgram) {
        form.programs.forEach((row, index) => {
          if (!row.programName.trim()) {
            nextErrors[`programs.${index}.programName`] = requiredMessage;
          }
          if (!row.programDescription.trim()) {
            nextErrors[`programs.${index}.programDescription`] = requiredMessage;
          }
        });
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitCohort = async (isDraft: boolean) => {
    if (!validateForm(isDraft ? "draft" : "submit")) {
      setError("");
      setSubmitMessage("");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsDraftRequest(isDraft);
      setError("");
      setSubmitMessage("");

      const payload = buildCreatePayload();
      payload.is_draft = isDraft;

      await createAdminCohort(payload);
      router.replace("/admin/cohorts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create cohort.");
    } finally {
      setIsSubmitting(false);
      setIsDraftRequest(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submitCohort(false);
  };

  const handleSaveDraft = () => {
    void submitCohort(true);
  };

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Create Cohort" eyebrow="Admin Panel" />

        <main className="admin-content">
          <form className="admin-edit-cohort" onSubmit={handleSubmit}>
            <div className="admin-edit-cohort__topbar">
              <Link href="/admin/cohorts" className="admin-back-link">
                <FiArrowLeft size={22} />
              </Link>
              <h2 className="admin-page-title">Create Cohort</h2>
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
                {formErrors.cohortTitle ? (
                  <p className="admin-form-field__error">{formErrors.cohortTitle}</p>
                ) : null}
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
                {formErrors.cohortDescription ? (
                  <p className="admin-form-field__error">{formErrors.cohortDescription}</p>
                ) : null}
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
                {formErrors.programOverview ? (
                  <p className="admin-form-field__error">{formErrors.programOverview}</p>
                ) : null}
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
                  {formErrors.startDate ? (
                    <p className="admin-form-field__error">{formErrors.startDate}</p>
                  ) : null}
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
                  {formErrors.endDate ? (
                    <p className="admin-form-field__error">{formErrors.endDate}</p>
                  ) : null}
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
                  {formErrors.liveSessions ? (
                    <p className="admin-form-field__error">{formErrors.liveSessions}</p>
                  ) : null}
                </label>
                <label className="admin-form-field">
                  <span>Format</span>
                  <input
                    value={form.format}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("format", event.target.value)
                    }
                  />
                  {formErrors.format ? (
                    <p className="admin-form-field__error">{formErrors.format}</p>
                  ) : null}
                </label>
                <label className="admin-form-field">
                  <span>Time Commitment</span>
                  <input
                    value={form.timeCommitment}
                    disabled={isLoading}
                    onChange={(event) =>
                      updateField("timeCommitment", event.target.value)
                    }
                  />
                  {formErrors.timeCommitment ? (
                    <p className="admin-form-field__error">{formErrors.timeCommitment}</p>
                  ) : null}
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
                  {formErrors.workshop ? (
                    <p className="admin-form-field__error">{formErrors.workshop}</p>
                  ) : null}
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
                {formErrors.cohortSize ? (
                  <p className="admin-form-field__error">{formErrors.cohortSize}</p>
                ) : null}
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
                    <div className="admin-edit-field-cell">
                      <input
                        value={row.program}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateRefundDeferralPolicy(index, "program", event.target.value)
                        }
                      />
                      {formErrors[`refundDeferralPolicy.${index}.program`] ? (
                        <p className="admin-form-field__error">{formErrors[`refundDeferralPolicy.${index}.program`]}</p>
                      ) : null}
                    </div>
                    <div className="admin-edit-field-cell">
                      <input
                        value={row.pricePerSeat}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateRefundDeferralPolicy(index, "pricePerSeat", event.target.value)
                        }
                      />
                      {formErrors[`refundDeferralPolicy.${index}.pricePerSeat`] ? (
                        <p className="admin-form-field__error">{formErrors[`refundDeferralPolicy.${index}.pricePerSeat`]}</p>
                      ) : null}
                    </div>
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
                    <div className="admin-edit-field-cell">
                      <input
                        value={row.titleName}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateInvestment(index, "titleName", event.target.value)
                        }
                      />
                      {formErrors[`investments.${index}.titleName`] ? (
                        <p className="admin-form-field__error">{formErrors[`investments.${index}.titleName`]}</p>
                      ) : null}
                    </div>
                    <div className="admin-edit-field-cell">
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
                      {formErrors[`investments.${index}.price`] ? (
                        <p className="admin-form-field__error">{formErrors[`investments.${index}.price`]}</p>
                      ) : null}
                    </div>
                    <div className="admin-edit-field-cell">
                      <input
                        value={row.whatYouGet}
                        disabled={isLoading}
                        onChange={(event) =>
                          updateInvestment(index, "whatYouGet", event.target.value)
                        }
                      />
                      {formErrors[`investments.${index}.whatYouGet`] ? (
                        <p className="admin-form-field__error">{formErrors[`investments.${index}.whatYouGet`]}</p>
                      ) : null}
                    </div>
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
                    <div className="admin-edit-field-cell">
                      <input
                        value={row.value}
                        disabled={isLoading}
                        onChange={(event) => updateLeaveWith(index, event.target.value)}
                      />
                      {formErrors[`leaveWith.${index}.value`] ? (
                        <p className="admin-form-field__error">{formErrors[`leaveWith.${index}.value`]}</p>
                      ) : null}
                    </div>
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
                {formErrors.ctaDescription ? (
                  <p className="admin-form-field__error">{formErrors.ctaDescription}</p>
                ) : null}
              </label>
              <div className="admin-edit-grid admin-edit-grid--compact">
                <label className="admin-form-field">
                  <span>Price </span>
                  <div className="admin-money-input" style={{ display: "flex" }}>
                    <input
                      inputMode="numeric"
                      value={form.price}
                      disabled={isLoading}
                      aria-label="Price"
                      onChange={(event) => {
                        const value = event.target.value.replace(/\D/g, "");
                        updateField("price", value);
                      }}
                    />
                  </div>
                  {formErrors.price ? (
                    <p className="admin-form-field__error">{formErrors.price}</p>
                  ) : null}
                </label>
              </div>
              </div>

            </section>

            <section className="admin-edit-section">
              <div className={`${form.hasMultiProgram ? "" : "!mb-0 "} admin-edit-section__heading-row`}>
                <h3 className={` ${form.hasMultiProgram ? "" : "!mb-0 "} admin-edit-section__title`}>Add Programs</h3>
                <AdminToggle
                  checked={form.hasMultiProgram}
                  disabled={isSubmitting}
                  onChange={updateHasMultiProgram}
                  ariaLabel="Toggle programs for this cohort"
                />
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
                      <div className="admin-edit-field-cell">
                        <input
                          value={row.programName}
                          disabled={isLoading}
                          onChange={(event) =>
                            updateProgram(index, "programName", event.target.value)
                          }
                        />
                        {formErrors[`programs.${index}.programName`] ? (
                          <p className="admin-form-field__error">{formErrors[`programs.${index}.programName`]}</p>
                        ) : null}
                      </div>
                      <div className="admin-edit-field-cell">
                        <input
                          value={row.programDescription}
                          disabled={isLoading}
                          onChange={(event) =>
                            updateProgram(index, "programDescription", event.target.value)
                          }
                        />
                        {formErrors[`programs.${index}.programDescription`] ? (
                          <p className="admin-form-field__error">{formErrors[`programs.${index}.programDescription`]}</p>
                        ) : null}
                      </div>
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

            <div className="admin-edit-cohort__actions gap-3 flex-wrap">
              <button
                type="button"
                className="admin-modal__button admin-modal__button--secondary"
                disabled={isLoading || isSubmitting}
                onClick={handleSaveDraft}
              >
                {isSubmitting && isDraftRequest ? "Saving draft..." : "Save as draft"}
              </button>
              <button
                type="submit"
                className="admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]"
                disabled={isLoading || isSubmitting}
              >
                {isSubmitting && !isDraftRequest ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
