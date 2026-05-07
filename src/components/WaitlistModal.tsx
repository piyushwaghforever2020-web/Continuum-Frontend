"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { Inter } from "next/font/google";
import EnrollmentModal from "./EnrollmentModal";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  openEnrollment: (data?: any) => void;
}
type Cohort = {
  id: number;
  name: string;
  seats_remaining: number;
  price: number;
  description: string;
  duration_weeks: string;
  start_date: string;
  end_date: string;
  duration_format: string;
  is_active: boolean;
};
const cohorts = [
  "Leading in Flat, AI-Enabled Organizations",
  "AI Automation for Enterprise Transformation Leaders",
  "Leading Complex Projects",
  "Enterprise Transformation Lab",
];

export default function WaitlistModal({
  isOpen,
  onClose,
  openEnrollment,
}: WaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    // cohorts: [] as number[],
    cohorts: null as number | null,
    urgent: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    cohorts: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  // Lock body scroll & trap focus

  useEffect(() => {
    const getCohorts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`,
        );

        setCohorts(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching cohorts", error);
      }
    };
    getCohorts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setSubmitted(false);
      setLoading(false);
      setSubmitError("");
      setForm({
        name: "",
        email: "",
        role: "",
        company: "",
        cohorts: null,
        urgent: "",
      });
      setCharCount(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // const handleCohortToggle = (cohortId: number) => {
  //   if (submitError) setSubmitError("");

  //   setForm((prev) => ({
  //     ...prev,
  //     cohorts: prev.cohorts.includes(cohortId)
  //       ? prev.cohorts.filter((id) => id !== cohortId)
  //       : [...prev.cohorts, cohortId],
  //   }));
  // };

  //api call to check the availability of seats acc to cohort selection
  const [isSeatAvailable, setisSeatAvailable] = useState(false);
  const [support, setSupport] = useState("");

  const handleCohortToggle = async (cohortId: number) => {
    if (submitError) setSubmitError("");

    setForm((prev) => ({
      ...prev,
      cohorts: cohortId,
    }));

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts/${cohortId}/seat-availability`,
      );

      const isAvailable = data?.success && data?.data?.seats_remaining > 0;
      setisSeatAvailable(isAvailable);
    } catch (err) {
      console.log(err);
      setisSeatAvailable(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitError("");

    if (!validate()) {
      return;
    }

    if (isSeatAvailable) {
      openEnrollment({
        name: form.name,
        email: form.email,
        company: form.company,
        role: form.role,
        cohortId: form.cohorts,
      });
      onClose();
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/lab`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          role_title: form.role.trim(),
          company: form.company.trim(),
          urgency_notes: form.urgent.trim(),
          // cohort_interests: cohorts
          //   .filter((c) => form.cohorts.includes(c.id))
          //   .map((c) => c.name)
          cohort_interests: cohorts
            .filter((c) => c?.id === form.cohorts)
            .map((c) => c.name),
        },
      );

      setSubmitted(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? "")
        : "";

      setSubmitError(
        message || "We couldn't submit your enquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      role: "",
      company: "",
      cohorts: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.role.trim()) {
      newErrors.role = "Role/title is required";
    }

    if (!form.company.trim()) {
      newErrors.company = "Company is required";
    }

    if(!form.cohorts){
      newErrors.cohorts = "Please select a cohort";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((err) => err);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={submitted ? "You're on the list" : "Join the waitlist"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Success State ── */}
      {submitted ? (
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl w-[512px]"
          style={{
            // width: "min(360px, calc(100vw - 40px))",
            padding: "32px 36px",
            textAlign: "center",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            style={{ width: "20px", height: "20px" }}
            aria-label="Close"
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

          <h2
            className={`${inter.className} font-bold font-chivo text-[var(--color-nearBlack)]`}
            style={{ fontSize: "24px", marginBottom: "12px", lineHeight: 1.2 }}
          >
            You're On The List
          </h2>
          <p
            className="text-[#737B8C] font-chivo"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              marginBottom: "24px",
            }}
          >
            We'll reach out if a seat opens in your preferred cohort and you'll
            be first to hear about new dates.
          </p>

          <p
            className="font-semibold font-chivo text-[#65758B]"
            style={{ fontSize: "14px", marginBottom: "14px" }}
          >
            Add The Key Dates To Your Calendar
          </p>

          <div className="flex gap-[10px] justify-center">
            <a
              href="https://calendar.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-chivo btn google-calendar-btn bg-burgundy text-white w-[180px]"
              style={{ padding: "10px 18px" }}
            >
              {/* Google Calendar color icon */}
              <Image
                src="/images/googleCalender.png"
                alt="google calender icon"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
              Google Calendar
            </a>
            <button
              onClick={() => {
                window.open("https://outlook.live.com/calendar/", "_blank");

                onClose();
              }}
              className="flex items-center justify-center gap-[10px] google-calendar-btn border border-burgundy hover:border-[var(--color-burgundy)] transition-colors w-[180px] text-burgundy"
              style={{ padding: "10px 18px" }}
            >
              {/* Outlook icon */}
              <Image
                src="/images/outlookLogo.png"
                alt="Outlook Logo"
                width={24}
                height={24}
                className="object-contain"
                priority
              />
              Outlook
            </button>
          </div>
        </div>
      ) : (
        /* ── Form State ── */
        <div
          ref={modalRef}
          className={`relative bg-white rounded-[20px] shadow-2xl overflow-y-auto w-[512px] ${inter.className}`}
          style={{
            // width: "min(380px, calc(100vw - 32px))",
            maxHeight: "calc(100vh - 80px)",
            padding: "32px",
          }}
        >
          {/* Close */}
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
            Spots Are Limited
          </h2>
          <p
            className="text-[#737B8C] font-chivo text-[14px]"
            style={{ lineHeight: 1.4, marginBottom: "24px" }}
          >
            Join the priority list to hear when a seat opens or the next cohort is announced
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-name"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Name{" "}
                <span
                  className="text-[var(--color-nearBlack)]"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>
              <input
                ref={firstInputRef}
                id="wl-name"
                type="text"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^[A-Za-z\s]*$/.test(value)) return; 
                  setForm((p) => ({ ...p, name: value }));
                  if (submitError) setSubmitError("");
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className={`w-full border text-[14px] rounded-[14px] font-chivo bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
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

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-email"
                className="block font-medium  font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Email{" "}
                <span
                  className="text-[var(--color-nearBlack)] "
                  aria-hidden="true"
                >
                  *
                </span>
              </label>
              <input
                id="wl-email"
                type="email"
                required
                placeholder="you@company.com"
                value={form.email}
                // onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, email: value }));
                  if (submitError) setSubmitError("");

                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.email && (
                <p className="text-red-500  font-chivo text-[12px] mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role / title */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-role"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Role/title{" "}
                <span
                  className="text-[var(--color-nearBlack)]"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>
              <input
                id="wl-role"
                type="text"
                required
                placeholder="Enter Your Role/title"
                value={form.role}
                // onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, role: value }));
                  if (submitError) setSubmitError("");

                  if (errors.role) {
                    setErrors((prev) => ({ ...prev, role: "" }));
                  }
                }}
                className={`w-full font-chivo border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
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

            {/* Company */}
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="wl-company"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Company{" "}
                <span
                  className="text-[var(--color-nearBlack)]"
                  aria-hidden="true"
                >
                  *
                </span>
              </label>
              <input
                id="wl-company"
                type="text"
                required
                placeholder="Enter Your Company Name"
                value={form.company}
                // onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, company: value }));
                  if (submitError) setSubmitError("");

                  if (errors.company) {
                    setErrors((prev) => ({ ...prev, company: "" }));
                  }
                }}
                className={`w-full font-chivo border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
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

            {/* Cohort checkboxes */}
            <div style={{ marginBottom: "18px" }}>
              <p
                className="block font-medium font-chivo text-[14px] text-[var(--color-nearBlack)]"
                style={{ marginBottom: "6px" }}
              >
                Which cohort you're interested in <span
                  className="text-[var(--color-nearBlack)]"
                  aria-hidden="true"
                >
                  *
                </span>
              </p>
              <div
                className="flex flex-col gap-2"
                role="group"
                aria-label="Cohort selection"
              >
                {cohorts?.map((cohort) => {
                  // const checked = form.cohorts.includes(cohort.id);
                  const checked = form.cohorts === cohort.id;

                  return (
                    <label
                      key={cohort.id}
                      className="flex items-center gap-2 cursor-pointer group text-[14px] font-chivo text-[var(--color-nearBlack)]"
                    >
                      <span
                        className="flex-shrink-0 flex items-center justify-center border-2 transition-all"
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          borderColor: checked
                            ? "var(--color-burgundy)"
                            : "#d1d5db",
                          background: checked
                            ? "var(--color-burgundy)"
                            : "white",
                        }}
                      >
                        {checked && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <input
                        type="radio"
                        name="cohort"
                        className="sr-only"
                        checked={checked}
                        onChange={() => handleCohortToggle(cohort.id)}
                        aria-label={cohort.name}
                      />
                      {cohort.name} {/* ✅ correct */}
                    </label>
                  );
                })}
              </div>
              {errors.cohorts && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.cohorts}
                </p>
              )}
            </div>

            {/* What's most urgent */}
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="wl-urgent"
                className="block font-medium text-[14px] font-chivo text-[var(--color-nearBlack)]"
                style={{ marginBottom: "5px" }}
              >
                What's most urgent for you right now?
              </label>
              <div className="relative">
                <textarea
                  id="wl-urgent"
                  maxLength={250}
                  rows={4}
                  placeholder="Write here..."
                  value={form.urgent}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((p) => ({ ...p, urgent: value }));
                    setCharCount(value.length);
                    if (submitError) setSubmitError("");
                  }}
                  className=" w-full resize-none font-chivo border border-[#DCDEE5] text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)] transition-all h-[139px]"
                  style={{ padding: "12px 13px" }}
                />
                <span
                  className="absolute bottom-2 right-3 font-chivo text-gray-400"
                  style={{ fontSize: "12px" }}
                  aria-live="polite"
                >
                  {250 - charCount} character limit
                </span>
              </div>
            </div>

            {/* Privacy note */}
            <p
              className="text-[var(--color-nearBlack)] text-[14px] font-chivo mb-[12px]"
              style={{ lineHeight: 1.55, marginBottom: "16px" }}
            >
              We'll only email you about upcoming cohorts and related resources.
              You can unsubscribe anytime.
            </p>

            {/* Submit */}
            {submitError ? (
              <p className="mb-3 text-[12px] text-red-500">{submitError}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-chivo font-semibold text-[13px] md:text-[14px]  bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
              style={{
                marginBottom: "10px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "Submitting..."
                : isSeatAvailable
                  ? "Enroll Now"
                  : "Join the waitlist"}
            </button>

            {/* Secondary CTA */}
            <a
              href="/Employer_Funding_Guide.pdf"
              download
              className="btn w-full font-chivo font-semibold text-[13px] md:text-[14px] text-burgundy bg-white border border-burgundy rounded-[14px] transition-all hover:bg-gray-50 active:scale-[0.99] py-[12px] px-[13px] capitalize"
            >
              Not ready yet? Get the employer funding guide.
            </a>
          </form>
        </div>
      )}
    </div>
  );
}
