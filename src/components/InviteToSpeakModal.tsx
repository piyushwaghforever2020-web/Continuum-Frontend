"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPE_OPTIONS = [
  { label: "Keynote", value: "keynote" },
  { label: "Panel", value: "panel" },
  { label: "Fireside chat", value: "fireside_chat" },
  { label: "Executive session", value: "executive_session" },
  { label: "Other", value: "other" },
] as const;

const getEventTypeValue = (label: string) =>
  EVENT_TYPE_OPTIONS.find((option) => option.label === label)?.value ?? "";

export default function InviteToSpeakModal({ isOpen, onClose }: WaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    eventDateTimeframe: "",
    eventType: "",
    audienceSize: "",
    winDesc: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    organization: "",
    eventDateTimeframe: "",
    eventType: "",
    audienceSize: "",
    winDesc: "",
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll & trap focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setSubmitted(false);
      setSubmitError("");
      setLoading(false);
      setOptionBox(false);
      setForm({ name: "", email: "", organization: "", eventDateTimeframe: "", eventType: "", audienceSize: "", winDesc: "" });
      setCharCount(0);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOptionBoxToggle = () => {
    setOptionBox((prev) => !prev);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/speaker`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          organization: form.organization.trim(),
          event_date_or_timeframe: form.eventDateTimeframe.trim(),
          event_type: getEventTypeValue(form.eventType),
          audience_size: form.audienceSize.trim(),
          win_description: form.winDesc.trim(),
        }
      );

      setSubmitted(true);
    } catch (error) {
      const message =
        axios.isAxiosError(error)
          ? String(error.response?.data?.message ?? "")
          : "";

      setSubmitError(message || "We couldn't submit your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      organization: "",
      eventDateTimeframe: "",
      eventType: "",
      audienceSize: "",
      winDesc: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!form.eventDateTimeframe.trim()) {
      newErrors.eventDateTimeframe = "Event date or timeframe is required";
    }

    if (!form.eventType.trim()) {
      newErrors.eventType = "Event type is required";
    }

    if (!form.audienceSize.trim()) {
      newErrors.audienceSize = "Audience size is required";
    }

    if (!form.winDesc.trim()) {
      newErrors.winDesc = "This field is required";
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
              <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>


          <h2
            className={`${inter.className} font-bold font-chivo text-[var(--color-nearBlack)] capitalize`}
            style={{ fontSize: "24px", marginBottom: "12px", lineHeight: 1.2 }}
          >
            Thank you for your invitation
          </h2>
          <p className="text-[#737B8C] font-chivo" style={{ fontSize: "14px", lineHeight: '20px', marginBottom: "24px" }}>
            Our team will review your inquiry and respond within
            2–3 business days with next steps.
          </p>
        </div>
      ) : (
        /* ── Form State ── */
        <div
          ref={modalRef}
          className={`relative bg-white rounded-[20px] shadow-2xl overflow-y-auto w-[512px] ${inter.className}`}
          style={{
            // width: "min(380px, calc(100vw - 32px))",
            maxHeight: "calc(100vh - 48px)",
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
              <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>

          {/* Heading */}
          <h2
            className={`font-bold font-chivo text-[var(--color-nearBlack)] text-[24px] capitalize ${inter.className}`}
            style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}
          >
            Invite Lisa Bennings to speak
          </h2>
          <p className="text-[#737B8C] text-[14px] font-chivo" style={{ lineHeight: 1.4, marginBottom: "24px" }}>
            Share a few details about your event so we can confirm fit,
            availability, and next steps.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-name"
                className="block font-chivo font-medium text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Name <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="wl-name"
                type="text"
                required
                placeholder="Your full name"
                value={form.name}
                // onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^[A-Za-z\s]*$/.test(value)) return; 
                  setForm((p) => ({ ...p, name: value }));
                  if (submitError) setSubmitError("");
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.name && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-email"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Email <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
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

                  // clear error immediately when user types
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.email && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.email}</p>
              )}
            </div>

            {/* Organization */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-organization"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Organization <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>
              <input
                id="wl-organization"
                type="text"
                required
                placeholder="Company or organization name"
                value={form.organization}
                // onChange={(e) => setForm((p) => ({ ...p, organization: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, organization: value }));
                  if (submitError) setSubmitError("");
                  if (errors.organization) setErrors((prev) => ({ ...prev, organization: "" }));
                }}
                className={`w-full border  font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.organization
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.organization && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.organization}</p>
              )}
            </div>

            {/* Event date or timeframe  */}
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="wl-event-date-timeframe"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Event date or timeframe <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>
              <input
                id="wl-event-date-timeframe"
                type="text"
                required
                placeholder="e.g., Q3 2026 or specific date"
                value={form.eventDateTimeframe}
                // onChange={(e) => setForm((p) => ({ ...p, eventDateTimeframe: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, eventDateTimeframe: value }));
                  if (submitError) setSubmitError("");
                  if (errors.eventDateTimeframe) setErrors((prev) => ({ ...prev, eventDateTimeframe: "" }));
                }}
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.eventDateTimeframe
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.eventDateTimeframe && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.eventDateTimeframe}</p>
              )}
            </div>

            {/* Event type */}
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="wl-event-type"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Event type <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>

              <button
                type="button"
                onClick={handleOptionBoxToggle}
                className={`w-full border   rounded-[14px] font-chivo text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center py-2 focus:outline-none focus:ring-1 transition-all
                 ${errors.eventType
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
              >
                {/*  className={`w-full border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#737B8C] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.organization
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`} */}
                {form.eventType || "Select event type"}
                <Image
                  src='/images/arrow-down.svg'
                  alt="Continuum Transformation Logo"
                  width={14}
                  height={14}
                  className={`object-contain text-[#65758B] ${optionBox ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {optionBox && (
                <div className="absolute w-[88%] ">
                  <div className="relative z-50 mt-2 bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                    {EVENT_TYPE_OPTIONS.map((option, index) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setForm((p) => ({ ...p, eventType: option.label }));
                          setOptionBox(false);
                          if (submitError) setSubmitError("");

                          if (errors.eventType) {
                            setErrors((prev) => ({ ...prev, eventType: "" }));
                          }
                        }}
                        className={`py-2 text-[14px] font-chivo text-[#737B8C] cursor-pointer hover:bg-[#F6F6F9] ${index !== 4 ? "border-b border-[#E5E7EB] " : "pb-4 "
                          } ${index === 0 ? "pt-4" : " "
                          }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.eventType && (
                <p className="text-red-500 text-[12px] font-chivo mt-1">{errors.eventType}</p>
              )}
              {/* </select> */}
            </div>

            {/* Audience + approximate size */}
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="wl-audience-size"
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Audience + approximate size <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>
              <input
                id="wl-audience-size"
                type="text"
                required
                placeholder="e.g., 200 senior executives"
                value={form.audienceSize}
                // onChange={(e) => setForm((p) => ({ ...p, audienceSize: e.target.value }))}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, audienceSize: value }));
                  if (submitError) setSubmitError("");
                  if (errors.audienceSize) setErrors((prev) => ({ ...prev, audienceSize: "" }));
                }}
                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.audienceSize
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.audienceSize && (
                <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.audienceSize}</p>
              )}
            </div>

            {/* What would make this a win for you?* */}
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="wl-win-desc"
                className="block font-medium  font-chivo text-[14px] text-[var(--color-nearBlack)]"
                style={{ marginBottom: "5px" }}
              >
                What would make this a win for you? <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
              </label>
              {/* <div className=""> */}
              <textarea
                id="wl-win-desc"
                maxLength={250}
                rows={3}
                placeholder="Tell us about your goals for this session"
                value={form.winDesc}
                // onChange={(e) => {
                //   setForm((p) => ({ ...p, winDesc: e.target.value }));
                //   setCharCount(e.target.value.length);
                // }}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, winDesc: value }));
                  if (submitError) setSubmitError("");
                  setCharCount(value.length);
                  if (errors.winDesc) setErrors((prev) => ({ ...prev, winDesc: "" }));
                }}
                className={`w-full border  font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.winDesc
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                style={{ padding: "12px 13px" }}
              />
              {errors.winDesc && (
                <p className="text-red-500 text-[12px] mt-1">{errors.winDesc}</p>
              )}
              <p className="mt-1 text-right font-chivo text-[12px] text-[#737B8C]">{charCount}/250</p>
            </div>

            {/* Submit */}
            {submitError ? (
              <p className="mb-3 text-[12px] font-chivo text-red-500">{submitError}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold text-[14px] font-chivo bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
              style={{
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Submitting..." : "Submit speaking inquiry"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
