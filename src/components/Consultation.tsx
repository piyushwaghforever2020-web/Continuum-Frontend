"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
    supportType: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    supportType: "",
    message: "",
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
      setForm({
        name: "",
        email: "",
        organization: "",
        role: "",
        message: "",
        supportType: "",
      });
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {

      onClose()
      //   setSubmitted(true);
    }
  };

  const handleOptionBoxToggle = () => {
    setOptionBox((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      organization: "",
      role: "",
      supportType: "",
      message: "",
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



    if (!form.organization.trim()) {
      newErrors.organization = "Organization is required";
    }

    if (!form.supportType) {
      newErrors.supportType = "Please select an option";
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
            className={`${inter.className} font-bold text-[#29303D]`}
            style={{ fontSize: "24px", marginBottom: "12px", lineHeight: 1.2 }}
          >
            You're On The List
          </h2>
          <p className="text-[#737B8C]" style={{ fontSize: "14px", lineHeight: '20px', marginBottom: "24px" }}>
            We'll reach out if a seat opens in your preferred cohort and you'll be first to hear about new dates.
          </p>

          <p
            className="font-semibold text-[#65758B]"
            style={{ fontSize: "14px", marginBottom: "14px" }}
          >
            Add The Key Dates To Your Calendar
          </p>

          <div className="flex gap-[10px] justify-center">
            <a
              href="#"
              className="btn google-calendar-btn bg-burgundy text-white w-[180px]"
              style={{ padding: "10px 18px" }}
            >{/* Google Calendar color icon */}
              <Image
                src='/images/googleCalender.png'
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
                onClose();
              }}
              className="flex items-center justify-center gap-[10px] google-calendar-btn border border-burgundy hover:border-[#27133b] transition-colors w-[180px] text-burgundy"
              style={{ padding: "10px 18px" }}
            >
              {/* Outlook icon */}
              <Image
                src='/images/outlookLogo.png'
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
            className={`font-bold text-[#29303D] text-[24px] ${inter.className}`}
            style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}
          >
            Consultation
          </h2>
          <p className="text-[#737B8C] text-[14px]" style={{ lineHeight: 1.4, marginBottom: "24px" }}>
            Share a few details about your team and objectives — we’ll help you
            identify the best path and investment.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-name"
                className="block font-medium text-[#29303D] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Name <span className="text-[#29303D]" aria-hidden="true">*</span>
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
                  setForm((p) => ({ ...p, name: value }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className={`w-full border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[#6d28d9] focus:ring-[rgba(109,40,217,0.12)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.name && (
                <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-email"
                className="block font-medium text-[#29303D] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Email <span className="text-[#29303D]" aria-hidden="true">*</span>
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

                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={`w-full border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[#6d28d9] focus:ring-[rgba(109,40,217,0.12)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.email && (
                <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
              )}
            </div>


            <div style={{ marginBottom: "14px" }}>
              <label
                htmlFor="wl-role"
                className="block font-medium text-[#29303D] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Organization <span className="text-[#29303D]" aria-hidden="true">*</span>
              </label>
              <input
                id="wl-role"
                type="text"
                required
                placeholder="Company or organization name"
                value={form.organization}

                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, organization: value }));

                  if (errors.organization) {
                    setErrors((prev) => ({ ...prev, organization: "" }));
                  }
                }}
                className={`w-full border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.organization
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[#6d28d9] focus:ring-[rgba(109,40,217,0.12)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.organization && (
                <p className="text-red-500 text-[12px] mt-1">{errors.organization}</p>
              )}
            </div>

            {/* Company */}
            <div style={{ marginBottom: "18px" }}>
              <label
                htmlFor="wl-company"
                className="block font-medium text-[#29303D] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Role / Company <span className="text-[#29303D]" aria-hidden="true">*</span>
              </label>
              <input
                id="wl-company"
                type="text"
                required
                placeholder="eg. Head of Product, National Inc"
                value={form.role}

                onChange={(e) => {
                  const value = e.target.value;
                  setForm((p) => ({ ...p, role: value }));

                  if (errors.role) {
                    setErrors((prev) => ({ ...prev, role: "" }));
                  }
                }}
                className={`w-full border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.role
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[#6d28d9] focus:ring-[rgba(109,40,217,0.12)]"
                  }`}
                style={{ height: "40px", padding: "12px 13px" }}
              />
              {errors.role && (
                <p className="text-red-500 text-[12px] mt-1">{errors.role}</p>
              )}
            </div>

            <div style={{ marginBottom: "18px", position: "relative" }}>
              <label
                className="block font-medium text-[#29303D] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                What support are you exploring? <span>*</span>
              </label>

              <button
                type="button"
                onClick={handleOptionBoxToggle}
                className={`w-full border rounded-[14px] text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-2 transition-all
    ${errors.supportType
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#DCDEE5] focus:border-[#6d28d9] focus:ring-[rgba(109,40,217,0.12)]"
                  }`}
              >
                {form.supportType || "Select option"}
                <Image
                  src="/images/arrow-down.svg"
                  alt="arrow"
                  width={14}
                  height={14}
                  className={`${optionBox ? "rotate-180" : ""}`}
                />
              </button>

              {optionBox && (
                <div className="absolute w-full">
                  <div className="relative z-50 mt-2 bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                    {[
                      "Cohort",
                      "Workshops",
                      "Private Cohort",
                      "Full Transformation",
                      "Not Sure Yet"
                    ].map((item, index) => (
                      <div
                        key={item}
                        onClick={() => {
                          setForm((p) => ({ ...p, supportType: item }));
                          setOptionBox(false);

                          if (errors.supportType) {
                            setErrors((prev) => ({ ...prev, supportType: "" }));
                          }
                        }}
                        className={`py-2 text-[14px] text-[#29303D] cursor-pointer hover:bg-[#F6F6F9]
            ${index !== 4 ? "border-b border-[#E5E7EB]" : "pb-4"}
            ${index === 0 ? "pt-4" : ""}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.supportType && (
                <p className="text-red-500 text-[12px] mt-1">
                  {errors.supportType}
                </p>
              )}
            </div>



            {/* Message */}
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="wl-urgent"
                className="block font-medium text-[14px] text-[#29303D]"
                style={{ marginBottom: "5px" }}
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  id="wl-urgent"
                  maxLength={250}
                  rows={4}
                  placeholder="Write here..."
                  value={form.message}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, message: e.target.value }));
                    setCharCount(e.target.value.length);
                  }}
                  className=" w-full resize-none border border-[#DCDEE5] text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:border-[#6d28d9] focus:ring-2 focus:ring-[rgba(109,40,217,0.12)] transition-all h-[139px]"
                  style={{ padding: "12px 13px" }}
                />
                <span
                  className="absolute bottom-2 right-3 text-gray-400"
                  style={{ fontSize: "12px" }}
                  aria-live="polite"
                >
                  {250 - charCount} character limit
                </span>
              </div>
            </div>



            {/* Submit */}
            <button
              type="submit"
              className="w-full font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
              style={{
                marginBottom: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Request Consultation
            </button>


          </form>
        </div>
      )}
    </div>
  );
}