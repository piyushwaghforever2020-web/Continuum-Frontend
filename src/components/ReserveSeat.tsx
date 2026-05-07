"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  setShowSuccessReserveModal: (value: boolean) => void;
}

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
type Cohort = {
  id: number;
  name: string;
  is_active: boolean;
};

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;

};

export default function ReserveModal({
  isOpen,
  onClose,
  setShowSuccessReserveModal

}: ReserveModalProps) {

  // states for the success and failure modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  // states for the success and failure modal

  const [loading, setLoading] = useState(false);


  const [step, setStep] = useState<1 | 2>(1);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([])

  const [form, setForm] = useState({
    cohort: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    motivation: "",
    challenge: "",
    agreeEmail: false,
    agreeSMS: false,
  });

  const [errors, setErrors] = useState({
    cohort: "",
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

  useEffect(() => {

    const getCohorts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`);

        const activeCohort = response?.data?.data?.filter((cohort: Cohort) => cohort?.is_active === true);
        setCohorts(activeCohort || []);
      } catch (error) {
        console.error("Error fetching cohorts", error);
      }
    };
    getCohorts()
  }, [])

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
      cohort: "",
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      motivation: "",
      challenge: "",
    };

    if (!form.cohort) newErrors.cohort = "Select a cohort";
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.motivation.trim()) newErrors.motivation = "This is required";
    if (!form.challenge.trim()) newErrors.challenge = "This is required";

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
        <h2 className={`font-bold  font-chivo text-[var(--color-nearBlack)] text-[24px] ${inter.className}`}
          style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}>
          Reserve your seat
        </h2>
        <p className="text-[#737B8C] font-chivo  mb-5  text-sm font-medium">Secure an individual seat in the upcoming cohort. Ideal for leaders
          joining independently or sponsored by their employer.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validate()) {
              setShowSuccessReserveModal(true);
              onClose()
            }
          }}
        >
          {/* Cohort */}
          <div style={{ marginBottom: "18px", position: "relative" }}>
            <label
              className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px]"
              style={{ marginBottom: "5px" }}
            >
              Which cohort are you applying for?<span>*</span>
            </label>


            <button
              type="button"
              onClick={handleOptionBoxToggle}
              className={`w-full border rounded-[14px] font-chivo text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${errors.cohort
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
                className={`transition-transform ${optionBox ? "rotate-180" : ""
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
                        setForm((p) => ({ ...p, cohort: item?.name, cohortId: item?.id }));
                        setOptionBox(false);

                        if (errors.cohort) {
                          setErrors((prev) => ({
                            ...prev,
                            cohort: "",
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
              <p className="text-red-500 text-[12px] mt-1">
                {errors.cohort}
              </p>
            )}


          </div>
          <div className="mb-[14px]">
            <label className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Name <span>*</span>
            </label>

            <input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className={`w-full border text-[14px] font-chivo  rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
    ${errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />

            {errors.name && (
              <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>
            )}
          </div>


          <div className="mb-[14px]">
            <label className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Email <span>*</span>
            </label>

            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className={`w-full border text-[14px] font-chivo  rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
    ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />

            {errors.email && (
              <p className="text-red-500 font-chivo  text-[12px] mt-1">{errors.email}</p>
            )}
          </div>







          <div className="mb-[14px]">
            <label className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Role / Company <span>*</span>
            </label>

            <input
              placeholder="Role / Company"
              value={form.role}
              onChange={(e) =>
                setForm((p) => ({ ...p, role: e.target.value }))
              }
              className={`w-full border font-chivo  text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${errors.role
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ height: "40px", padding: "12px 13px" }}
            />
            {errors.role && (
              <p className="text-red-500 font-chivo  text-[12px] mt-1">
                {errors.role}
              </p>
            )}
          </div>


          <div className="mb-[16px]">
            <label className="block font-medium font-chivo  text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
              Why are you joining this cohort?  <span>*</span>
            </label>

            <textarea
              placeholder="Share your motivation..."
              value={form.motivation}
              onChange={(e) =>
                setForm((p) => ({ ...p, motivation: e.target.value }))
              }
              className={`w-full border font-chivo  text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${errors.motivation
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ padding: "12px 13px" }}
            />
            {errors.motivation && (
              <p className="text-red-500 font-chivo  text-[12px] mt-1">{errors.motivation}</p>
            )}
          </div>


          <div className="mb-[16px]">
            <label className="block font-medium font-chivo  text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
              What challenge are you trying to solve? <span>*</span>
            </label>

            <textarea
              placeholder="Describe the problem you're working on..."
              value={form.challenge}
              onChange={(e) =>
                setForm((p) => ({ ...p, challenge: e.target.value }))
              }
              className={`w-full border font-chivo  text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
        ${errors.challenge
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
              style={{ padding: "12px 13px" }}
            />
            {errors.challenge && (
              <p className="text-red-500 font-chivo  text-[12px] mt-1">{errors.challenge}</p>
            )}
          </div>






          {/* Continue */}
          <button
            type="submit"
            className="w-full font-semibold font-chivo  text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>



      </div>
      {/* rendering of the success and error modal */}

    </div>
  );
}





