"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import "../app/globals.css";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { isPossiblePhoneNumber } from "libphonenumber-js";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  support: String;
  prefillData?: any;
}

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
type Cohort = {
  id: number;
  name: string;
  is_active: boolean;
  programs?: ProgramItem[];
};

type ProgramItem = {
  id?: number | string;
  program_id?: number | string;
  programId?: number | string;
  name?: string;
  program_name?: string;
  programName?: string;
  title?: string;
};
export default function EnrollmentModal({
  isOpen,
  onClose,
  support,
  prefillData,
}: EnrollmentModalProps) {
  // states for the success and failure modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showErrorEnrollment, setShowErrorEnrollment] = useState(false);
  const [phone, setPhone] = useState<string | undefined>();
  // states for the success and failure modal

  const [paymentMethod, setPaymentMethod] = useState("payFull");

  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollment, setLoadingEnrollment] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [programOptionBox, setProgramOptionBox] = useState(false);

  const [apiError, setApiError] = useState("");
  const [apiErrorEnrollment, setapiErrorEnrollment] = useState("");

  const [form, setForm] = useState({
    cohort: "",
    cohortId: null as number | null,
    program: "",
    programId: null as number | string | null,
    name: "",
    email: "",
    company: "",
    role: "",
    motivation: "",
    challenge: "",
    agreeEmail: false,
    agreeSMS: false,
    employerFunded: false,
  });

  const [errors, setErrors] = useState({
    cohort: "",
    program: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    motivation: "",
    challenge: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const getProgramId = (program: ProgramItem) =>
    program.program_id ?? program.programId ?? program.id ?? null;

  const getProgramName = (program: ProgramItem) =>
    String(
      program.program_name ??
        program.name ??
        program.programName ??
        program.title ??
        "Program",
    );

  const selectedCohort = cohorts.find(
    (cohort) => String(cohort.id) === String(form.cohortId),
  );
  const selectedCohortPrograms = selectedCohort?.programs ?? [];

  //data prefill from labs model
  useEffect(() => {
    if (prefillData && cohorts.length > 0) {
      const selectedCohort = cohorts?.find(
        (c) => String(c?.id) === String(prefillData?.cohortId),
      );

      setForm((prev) => ({
        ...prev,
        name: prefillData.name || "",
        email: prefillData.email || "",
        company: prefillData.company || "",
        role: prefillData.role || "",
        cohortId: prefillData.cohortId || null,
        cohort: selectedCohort ? selectedCohort.name : "",
        programId: prefillData.programId || null,
        program: prefillData.program || "",
      }));
    }
  }, [prefillData, cohorts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setStep(1);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOptionBoxToggle = () => {
    setOptionBox((prev) => !prev);
  };

  const handleCompleteEnrollment = async () => {
    try {
      setLoadingEnrollment(true);
      setapiErrorEnrollment("");
      const payload = {
        email: form?.email,
        cohort_id: form?.cohortId,
        program_id: form?.programId,
        success_url: "http://coutinuum.codingserver.com/success-payment/",
        cancel_url: "http://coutinuum.codingserver.com/registration/",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/create-checkout-session`,
        payload,
      );
      const navigate_URL = response?.data?.data?.checkout_url;
      if (navigate_URL) {
        window.location.href = navigate_URL;
      }
    } catch (error: any) {
      console.error(error);
      setapiErrorEnrollment(error?.response?.data?.message || "Something went wrong");
      // setShowErrorEnrollment(true);
    } finally {
      setLoadingEnrollment(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setApiError("");
    try {
      setLoading(true);
      let parsed = null;
      try {
        parsed = phone ? parsePhoneNumber(phone) : null;
      } catch (e) {
        parsed = null;
      }

      const payload = {
        name: form?.name,
        email: form?.email,
        phone: parsed?.nationalNumber,
        country_code: `+${parsed?.countryCallingCode}`,

        company: form?.company || "N/A",
        role: form?.role,
        cohort_id: form?.cohortId,
        program_id: form?.programId,
        agree_email: form?.agreeEmail,
        agree_sms: form?.agreeSMS,
        employer_funded: form?.employerFunded,
        answers: {
          motivation: form.motivation,
          experience_level: form?.challenge, // static for now
        },
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/application`,
        payload,
      );

      // ✅ success
      // setShowSuccess(true);
      setStep(2);
    } catch (error: any) {
      const message =
        error?.response?.data?.data?.details?.[0] || "Something went wrong";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCohorts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`,
        );

        const activeCohort = response?.data?.data?.filter(
          (cohort: Cohort) => cohort?.is_active === true,
        );
        setCohorts(activeCohort || []);
      } catch (error) {
        console.error("Error fetching cohorts", error);
      }
    };
    getCohorts();
  }, []);

  const validate = () => {
    const newErrors = {
      cohort: "",
      program: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      motivation: "",
      challenge: "",
    };

    if (!form.cohort) newErrors.cohort = "Select a cohort";
    if (selectedCohortPrograms.length > 0 && !form.programId) {
      newErrors.program = "Select a program";
    }
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isPossiblePhoneNumber(phone)) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!form.company.trim()) newErrors.company = "Company required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.motivation.trim()) newErrors.motivation = "This is required";
    if (!form.challenge.trim()) newErrors.challenge = "This is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-[20px] shadow-2xl overflow-y-auto w-[512px] ${inter.className}`}
        style={{
          // width: "min(380px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 128px)",
          padding: "32px",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          style={{ width: "20px", height: "20px" }}
          aria-label="Close modal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M1 13L13 1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Heading */}
        <h2
          className={`font-bold font-chivo text-[var(--color-nearBlack)] text-[24px] ${inter.className}`}
          style={{
            marginBottom: "8px",
            lineHeight: 1.25,
            paddingRight: "24px",
          }}
        >
          Enrollment
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            // onClick={() => setStep(1)}
            className={`flex-1  py-3 rounded-md font-chivo font-semibold text-[14px] leading-[100%] tracking-[0] text-white ${
              step === 1 ? "bg-burgundy text-white" : "bg-[#007736] text-white"
            }`}
          >
            Step 1 - Application
          </button>

          <button
            // onClick={() => setStep(2)}
            className={`flex-1 py-3 rounded-md font-chivo font-semibold text-[14px] leading-[100%] tracking-[0] text-white ${
              step === 2
                ? "bg-burgundy text-white"
                : "bg-burgundy-50 text-white"
            }`}
          >
            Step 2 - Payment
          </button>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validate()) handleSubmit();
            }}
          >
            {/* Cohort */}
            <div style={{ marginBottom: "18px", position: "relative" }}>
              <label
                className="block font-medium text-[var(--color-nearBlack)] font-chivo text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Which cohort are you applying for?<span>*</span>
              </label>

              <button
                type="button"
                onClick={handleOptionBoxToggle}
                className={`w-full border rounded-[14px] text-[14px] font-chivo bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[var(--color-nearBlack)] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${
      errors.cohort
        ? "border-red-500 focus:ring-red-200"
        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
    }`}
              >
                {form.cohort || "Select option"}

                <Image
                  src="/images/arrow-down.svg"
                  alt="arrow"
                  width={14}
                  height={14}
                  className={`transition-transform ${
                    optionBox ? "rotate-180" : ""
                  }`}
                />
              </button>
              {optionBox && (
                <div className="absolute w-full z-50 mt-2">
                  <div className="bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                    {cohorts?.map((item, index) => (
                      <div
                        key={item?.id}
                        onClick={() => {
                          setForm((p) => ({
                            ...p,
                            cohort: item?.name,
                            cohortId: item?.id,
                            program: "",
                            programId: null,
                          }));
                          setOptionBox(false);
                          setProgramOptionBox(false);

                          if (errors.cohort) {
                            setErrors((prev) => ({
                              ...prev,
                              cohort: "",
                              program: "",
                            }));
                          }
                        }}
                        className={`py-2 text-[14px] text-[#737B8C] font-chivo cursor-pointer hover:bg-[#F6F6F9]
            ${index !== 4 ? "border-b border-[#E5E7EB]" : "pb-4"}
            ${index === 0 ? "pt-4" : ""}`}
                      >
                        {item?.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.cohort && (
                <p className="text-red-500 text-[12px] font-chivo mt-1">
                  {errors.cohort}
                </p>
              )}
            </div>

            {selectedCohortPrograms.length > 0 && (
              <div style={{ marginBottom: "18px", position: "relative" }}>
                <label
                  className="block font-medium text-[var(--color-nearBlack)] font-chivo text-[14px]"
                  style={{ marginBottom: "5px" }}
                >
                  Which program are you applying for?<span>*</span>
                </label>

                <button
                  type="button"
                  onClick={() => setProgramOptionBox((prev) => !prev)}
                  className={`w-full border rounded-[14px] text-[14px] font-chivo bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[var(--color-nearBlack)] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${
      errors.program
        ? "border-red-500 focus:ring-red-200"
        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
    }`}
                >
                  {form.program || "Select program"}

                  <Image
                    src="/images/arrow-down.svg"
                    alt="arrow"
                    width={14}
                    height={14}
                    className={`transition-transform ${
                      programOptionBox ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {programOptionBox && (
                  <div className="absolute w-full z-40 mt-2">
                    <div className="bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                      {selectedCohortPrograms.map((program, index) => {
                        const programId = getProgramId(program);
                        const programName = getProgramName(program);

                        return (
                          <div
                            key={String(programId ?? programName)}
                            onClick={() => {
                              setForm((p) => ({
                                ...p,
                                program: programName,
                                programId,
                              }));
                              setProgramOptionBox(false);

                              if (errors.program) {
                                setErrors((prev) => ({
                                  ...prev,
                                  program: "",
                                }));
                              }
                            }}
                            className={`py-2 text-[14px] text-[#737B8C] font-chivo cursor-pointer hover:bg-[#F6F6F9]
            ${index !== selectedCohortPrograms.length - 1 ? "border-b border-[#E5E7EB]" : "pb-4"}
            ${index === 0 ? "pt-4" : ""}`}
                          >
                            {programName}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {errors.program && (
                  <p className="text-red-500 text-[12px] font-chivo mt-1">
                    {errors.program}
                  </p>
                )}
              </div>
            )}
            <div className="mb-[14px]">
              <label className="block font-medium text-[var(--color-nearBlack)] font-chivo text-[14px] mb-[5px]">
                Name <span>*</span>
              </label>

              <input
                placeholder="Your full name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className={`w-full border border-[1px] text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
    ${
      errors.name
        ? "border-red-500 focus:ring-red-200"
        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
    }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />

              {errors.name && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-[14px]">
              <label className="block font-medium text-[var(--color-nearBlack)] font-chivo text-[14px] mb-[5px]">
                Email <span>*</span>
              </label>

              <input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className={`w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
    ${
      errors.email
        ? "border-red-500 focus:ring-red-200"
        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
    }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />

              {errors.email && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-[14px]">
              <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                Phone Number<span>*</span>
              </label>

              {/* <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={(value) => {
                  setPhone(value);

                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                className={errors.phone ? "phone-input error" : "phone-input"}
              /> */}
              <PhoneInput
                international
                defaultCountry="US"
                countryCallingCodeEditable={false}
                value={phone}
                onChange={(value) => {
                  setPhone(value);

                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
              />
              {errors.phone && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="mb-[14px]">
              <label className="block  font-chivo font-medium text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                Company <span>*</span>
              </label>

              <input
                placeholder="Company"
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${
          errors.company
            ? "border-red-500 focus:ring-red-200"
            : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
        }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.company && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.company}
                </p>
              )}
            </div>

            <div className="mb-[14px]">
              <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                Role / Title <span>*</span>
              </label>

              <input
                placeholder="Role / title"
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value }))
                }
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${
          errors.role
            ? "border-red-500 focus:ring-red-200"
            : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
        }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.role && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.role}
                </p>
              )}
            </div>

            <div className="mb-[16px]">
              <label className="block font-chivo font-medium text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
                Why are you joining this cohort? <span>*</span>
              </label>

              <textarea
                placeholder="Share your motivation..."
                value={form.motivation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, motivation: e.target.value }))
                }
                className={`w-full font-chivo border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${
          errors.motivation
            ? "border-red-500 focus:ring-red-200"
            : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
        }`}
                style={{ padding: "12px 13px" }}
              />
              {errors.motivation && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.motivation}
                </p>
              )}
            </div>

            <div className="mb-[16px]">
              <label className="block font-chivo font-medium text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
                What challenge are you trying to solve? <span>*</span>
              </label>

              <textarea
                placeholder="Describe the problem you're working on..."
                value={form.challenge}
                onChange={(e) =>
                  setForm((p) => ({ ...p, challenge: e.target.value }))
                }
                className={`w-full font-chivo border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${
          errors.challenge
            ? "border-red-500 focus:ring-red-200"
            : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
        }`}
                style={{ padding: "12px 13px" }}
              />
              {errors.challenge && (
                <p className="text-red-500 font-chivo  text-[12px] mt-1">
                  {errors.challenge}
                </p>
              )}
            </div>
            <div className="mb-[12px] flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.agreeEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, agreeEmail: e.target.checked }))
                }
                aria-label="Receive SMS"
                className="mt-[2px] h-[16px] w-[16px] rounded-[8px] border-[#D1D5DB] bg-[#E5E7EB] accent-[var(--color-burgundy)]"
              />
              <p className="text-[14px] font-chivo text-[var(--color-nearBlack)] leading-[20px]">
                I agree to receive emails regarding updates & program
                information.
              </p>
            </div>

            <div className="mb-[12px] flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.agreeSMS}
                onChange={(e) =>
                  setForm((p) => ({ ...p, agreeSMS: e.target.checked }))
                }
                aria-label="Receive SMS"
                className="mt-[2px] h-[16px] w-[16px] rounded-[8px] border-[#D1D5DB] bg-[#E5E7EB] accent-[var(--color-burgundy)]"
              />
              <p className="text-[14px] font-chivo text-[var(--color-nearBlack)] leading-[20px]">
                I agree to receive SMS reminder & notifications.
              </p>
            </div>
            <div className="mb-[12px] flex items-start gap-2">
              <input
                type="checkbox"
                checked={form.employerFunded}
                onChange={(e) =>
                  setForm((p) => ({ ...p, employerFunded: e.target.checked }))
                }
                aria-label="Receive Emails"
                className="mt-[2px] h-[16px] w-[16px] rounded-[8px] border-[#D1D5DB] bg-[#E5E7EB] accent-[var(--color-burgundy)]"
              />
              <p className="text-[14px] font-chivo text-[var(--color-nearBlack)] leading-[20px]">
                My employer will be funding this.
              </p>
            </div>

            {apiError && (
              <p className="text-red-500 text-sm mb-2 text-center">
                {apiError
                  ?.replace(/"/g, "")
                  ?.replace(/^./, (c) => c.toUpperCase())}
              </p>
            )}

            {/* Continue */}
            <button
              type="submit"
              className="w-full font-semibold mt-2 text-[14px] bg-burgundy font-chivo text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
              style={{
                marginBottom: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Continue to Payment
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <p className="font-chivo font-medium text-sm leading-5 text-[var(--color-nearBlack)] mb-2">
              Enrolling in
            </p>
            <h3 className="font-chivo font-bold text-2xl leading-8 text-[var(--color-nearBlack)] mb-4">
              {form.cohort}
            </h3>

            <div className="flex gap-3 mb-6">
              <div
                onClick={() => setPaymentMethod("payFull")}
                className={`flex-1 cursor-pointer border rounded-lg p-3 ${paymentMethod === "payFull" ? "bg-burgundy" : ""} text-center`}
              >
                <span
                  className={`font-chivo font-medium text-sm leading-5 text-center ${paymentMethod === "payFull" ? " text-[#F1F1F1]" : "text-[var(--color-nearBlack)]"}`}
                >
                  Pay in full
                </span>
                <div
                  className={`font-chivo font-bold  leading-8 text-center text-md md:text-xl ${paymentMethod === "payFull" ? " text-[#F1F1F1]" : "text-[var(--color-nearBlack)]"}`}
                >
                  $1300 USD
                </div>
              </div>

              {!form?.employerFunded && (
                <div
                  //  onClick={()=>setPaymentMethod("")}
                  className={`flex-1  cursor-not-allowed border rounded-lg p-3 text-center ${paymentMethod !== "payFull" ? "bg-burgundy" : ""}`}
                >
                  <span
                    className={`font-chivo font-medium text-sm leading-5  text-center ${paymentMethod !== "payFull" ? " text-[#F1F1F1]" : "text-[var(--color-nearBlack)]"}`}
                  >
                    Payment Plan
                  </span>
                  <div
                    className={`font-chivo font-bold text-md md:text-xl leading-8 text-center ${paymentMethod !== "payFull" ? " text-[#F1F1F1]" : "text-[var(--color-nearBlack)]"}`}
                  >
                    $420/Month x3
                  </div>
                </div>
              )}
            </div>
            {paymentMethod !== "payFull" && (
              <p className="font-chivo font-medium text-sm leading-5 text-[var(--color-nearBlack)] mb-2">
                Remaining payments will be automatically deducted until paid in
                full.
              </p>
            )}

            {apiErrorEnrollment && (
              <p className="text-red-500 text-sm mb-2 text-center">
                {apiErrorEnrollment
                  ?.replace(/^./, (c) => c.toUpperCase())}
              </p>
            )}

            <button
              disabled={loadingEnrollment}
              type="submit"
              onClick={handleCompleteEnrollment}
              className="w-full font-semibold mt-4 text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  font-chivo py-[12px] px-[13px] capitalize"
              style={{
                marginBottom: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingEnrollment ? "Loading..." : " Complete Enrollment"}
            </button>

            <p className="font-chivo font-medium text-sm leading-5 text-[var(--color-nearBlack)] mb-2 text-center">
              Payments are processed securely via Stripe.
            </p>
          </div>
        )}
      </div>
      {/* rendering of the success and error modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal isOpen={showError} onClose={() => setShowError(false)} />
    </div>
  );
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          style={{ width: "20px", height: "20px" }}
          aria-label="Close modal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M1 13L13 1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src="/images/success.png" alt="" />
        </div>
        <div className="flex flex-col gap-3">
          {/* Title */}
          <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[var(--color-nearBlack)]">
            You’re Enrolled In
          </h2>

          {/* Subtitle */}
          <p className="font-chivo font-medium text-sm leading-5 text-center text-[var(--color-nearBlack)]">
            We’ve emailed your confirmation and next steps.
          </p>

          {/* Button */}
          <button
            type="submit"
            className="w-full font-chivo font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            View Cohort Details
          </button>
        </div>
      </div>
    </div>
  );
};

const ErrorModal = ({ isOpen, onClose }: ErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          style={{ width: "20px", height: "20px" }}
          aria-label="Close modal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M1 13L13 1"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-4">
          <img src="/images/failure.png" alt="" />
        </div>

        <div className="flex flex-col gap-3">
          {/* Title */}
          <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[var(--color-nearBlack)]">
            Payment Failed
          </h2>

          {/* Subtitle */}
          <p className="font-chivo font-medium text-sm leading-5 text-center text-[var(--color-nearBlack)]">
            Please try again
          </p>

          {/* Button */}
          <button
            type="submit"
            className="w-full font-chivo font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};
