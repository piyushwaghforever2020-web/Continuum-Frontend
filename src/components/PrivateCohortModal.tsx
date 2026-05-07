"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface PrivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setShowPrivateCohortSuccess: (value: boolean) => void;
}

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};


type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;

};

export default function PrivateCohortModal({
  isOpen,
  onClose,
  setShowPrivateCohortSuccess,
}: PrivateModalProps) {

  // states for the success and failure modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  // states for the success and failure modal

  const [loading, setLoading] = useState(false);


  const [step, setStep] = useState<1 | 2>(1);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    teamSize: "",
    timeline: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    organization: "",
    teamSize: "",
    timeline: "",
    message: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

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

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      organization: "",
      teamSize: "",
      timeline: "",
      message: "",
    };

    if (!form.timeline) newErrors.timeline = "Select a timeline";
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!form.organization.trim()) newErrors.organization = "organization is required";
    if (!form.teamSize.trim()) newErrors.teamSize = "Team size is required";
    if (!form.message.trim()) newErrors.message = "This is required";
    if (!form.timeline.trim()) newErrors.timeline = "This is required";

    setErrors(newErrors);
    console.log("newErrors", newErrors)
    return !Object.values(newErrors).some((e) => e);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-[20px] shadow-2xl overflow-y-auto w-[512px] ${inter.className}`}
        style={{
          // width: "min(380px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 48px)",
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
            <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>


        {/* Heading */}
        <h2 className={`font-bold text-[var(--color-nearBlack)] font-chivo text-[24px] ${inter.className}`}
          style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}>
          Explore a private cohort

        </h2>
        <p className="text-[#737B8C] mb-5 font-chivo text-sm font-medium">
          Bring the full Transformation Lab experience to your organization with a dedicated private cohort for up to 50 leaders.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validate()) {
              onClose();
              setShowPrivateCohortSuccess(true)

            };
          }}
        >
          {/* seat */}

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
              className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
              ${errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />

            {errors.name && (
              <p className="text-red-500  font-chivo text-[12px] mt-1">{errors.name}</p>
            )}
          </div>


          <div className="mb-[14px]">
            <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Email <span>*</span>
            </label>

            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
              ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />

            {errors.email && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-[14px]">
            <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Organization <span>*</span>
            </label>

            <input
              placeholder="Company or organization name"
              value={form.organization}
              onChange={(e) =>
                setForm((p) => ({ ...p, organization: e.target.value }))
              }
              className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
              ${errors.organization
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />
            {errors.organization && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">
                {errors.organization}
              </p>
            )}
          </div>

          <div className="mb-[14px]">
            <label className="block font-chivo font-medium text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Team Size <span>*</span>
            </label>

            <input
              placeholder="eg. 10"
              value={form.teamSize}
              onChange={(e) =>
                setForm((p) => ({ ...p, teamSize: e.target.value }))
              }
              className={`w-full font-chivo border text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
              ${errors.teamSize
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />
            {errors.teamSize && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">
                {errors.teamSize}
              </p>
            )}
          </div>


          <div style={{ marginBottom: "18px", position: "relative" }}>
            <label
              className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
              style={{ marginBottom: "5px" }}
            >
              Desired timeline<span>*</span>
            </label>
            <button
              type="button"
              onClick={handleOptionBoxToggle}
              className={`w-full border font-chivo rounded-[14px] text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
              ${errors.timeline
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
            >
              {form.timeline || "Select Timeline"}

              <Image
                src="/images/arrow-down.svg"
                alt="arrow"
                width={14}
                height={14}
                className={`transition-transform ${optionBox ? "rotate-180" : ""
                  }`}
              />
            </button>

            {optionBox && (
              <div className="absolute w-full z-50 mt-2">
                <div className="bg-white font-chivo rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                  {[
                    "5",
                    "10",
                    "15",
                    "20",
                    "25",

                  ].map((item, index) => (
                    <div
                      key={item}
                      onClick={() => {
                        setForm((p) => ({ ...p, timeline: item }));
                        setOptionBox(false);

                        if (errors.timeline) {
                          setErrors((prev) => ({
                            ...prev,
                            timeline: "",
                          }));
                        }
                      }}
                      className={`py-2 text-[14px] text-[var(--color-nearBlack)] cursor-pointer hover:bg-[#F6F6F9]
                      ${index !== 4 ? "border-b border-[#E5E7EB]" : "pb-4"}
                      ${index === 0 ? "pt-4" : ""}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.timeline && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">
                {errors.timeline}
              </p>
            )}
          </div>


          <div className="mb-[16px]">
            <label className="block font-chivo font-medium text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
              Message  <span>*</span>
            </label>

            <textarea
              placeholder="Write here..."
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
              ${errors.message
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ padding: "12px 13px" }}
            />
            {errors.message && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.message}</p>
            )}
          </div>


          {/* Continue */}
          <button
            type="submit"
            className="w-full font-semibold font-chivo text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
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
      {/* rendering of the success and error modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <ErrorModal
        isOpen={showError}
        onClose={() => setShowError(false)}
      />
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
            <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src="/images/success.png" alt="" />
        </div>
        <div className="flex flex-col gap-3">

          {/* Title */}
          <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[var(--color-nearBlack)]">
            Application Received
          </h2>

          {/* Subtitle */}
          <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
            Proceeding to payment — you'll receive a confirmation email with your seat details and next steps.

          </p>

          {/* Button */}
          <button type="submit"
            onClick={onClose}
            className="w-full font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}>
            Done
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
            <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
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
          <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
            Please try again
          </p>

          {/* Button */}
          <button type="submit"
            className="w-full font-semibold text-[14px] font-chivo bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}>
            Back to Pricing
          </button>

        </div>

      </div>






    </div>
  );
};