"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
  program_id?: number | string | null;
  programId?: number | string | null;
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
  const [employerFundedSuccess, setEmployerFundedSuccess] = useState(false);
  // states for the success and failure modal

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");


  const [step, setStep] = useState<1 | 2>(1);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const [form, setForm] = useState({
    cohort: "",
    cohortId: null as number | null,
    programId: null as number | string | null,
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    motivation: "",
    challenge: "",
    agreeEmail: false,
    agreeSMS: false,
    employerFunded: false,
    managerName: "",
    managerEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingZipCode: "",
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
    managerName: "",
    managerEmail: "",
    billingPhone: "",
    billingAddress: "",
    billingCity: "",
    billingZipCode: "",
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
      setEmployerFundedSuccess(false);
      setApiError("");
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
      managerName: "",
      managerEmail: "",
      billingPhone: "",
      billingAddress: "",
      billingCity: "",
      billingZipCode: "",
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
    if (form.employerFunded) {
      if (!form.managerName.trim()) {
        newErrors.managerName = "Manager name is required";
      }
      if (!form.managerEmail.trim()) {
        newErrors.managerEmail = "Manager email is required";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.managerEmail)) {
        newErrors.managerEmail = "Enter valid manager email";
      }
    }

    setErrors(newErrors);
    console.log("newErrors", newErrors)
    return !Object.values(newErrors).some((e) => e);
  };

  const submitEmployerFundedRegistration = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      const payload = {
        cohort_id: form.cohortId,
        program_id: form.programId ?? undefined,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        payment_type: "employer_funded",
        manager_name: form.managerName.trim(),
        manager_email: form.managerEmail.trim(),
        billing_phone: form.billingPhone.trim(),
        billing_address: form.billingAddress.trim(),
        billing_city: form.billingCity.trim(),
        billing_zip_code: form.billingZipCode.trim(),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/cohort/register`,
        payload,
      );

      setToast({
        message: response?.data?.message || "Registration submitted successfully.",
        tone: "success",
      });

      setTimeout(() => {
        setEmployerFundedSuccess(true);
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.data?.details?.[0] ||
        "We couldn't submit your employer-funded registration. Please try again.";
      setApiError(message);
      setToast({
        message,
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
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
      {toast ? (
        <div
          className={`admin-toast admin-toast--${toast.tone}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
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


        
      

        {employerFundedSuccess ? (
          <div className="flex flex-col gap-4">
           
              <h2 className={`font-bold  font-chivo text-[var(--color-nearBlack)] text-[24px] ${inter.className}`}
          style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}>
           Your registration is pending!
        </h2>
            <p className="font-chivo text-[14px] leading-6 text-[#737B8C]">
              An invoice has been emailed to your employer. Your seat will be
              confirmed once payment is received.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full font-semibold font-chivo text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99] py-[12px] px-[13px]"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (form.employerFunded) {
                void submitEmployerFundedRegistration();
                return;
              }

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
                        setForm((p) => ({
                          ...p,
                          cohort: item?.name,
                          cohortId: item?.id,
                          programId: item?.program_id ?? item?.programId ?? null,
                        }));
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
              onChange={(e) => {
                setForm((p) => ({ ...p, name: e.target.value }));
                setApiError("");
              }}
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
              onChange={(e) => {
                setForm((p) => ({ ...p, email: e.target.value }));
                setApiError("");
              }}
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
              Phone number
            </label>

            <PhoneInput
              international
              defaultCountry="US"
              countryCallingCodeEditable={false}
              placeholder=""
              value={form.phone || undefined}
              onChange={(value) => {
                setForm((p) => ({ ...p, phone: value ?? "" }));
                setApiError("");
              }}
            />
          </div>

          <div className="mb-[14px]">
            <label className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Company
            </label>

            <input
              placeholder="your company "
              value={form.company}
              onChange={(e) => {
                setForm((p) => ({ ...p, company: e.target.value }));
                setApiError("");
              }}
              className="w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] border-[#DCDEE5] focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)] transition-all"
              style={{ height: "40px", padding: "12px 13px" }}
            />
          </div>

          <div className="mb-[14px]">
            <label className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
              Role <span>*</span>
            </label>

            <input
              placeholder="Role / Company"
              value={form.role}
              onChange={(e) => {
                setForm((p) => ({ ...p, role: e.target.value }));
                setApiError("");
              }}
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

          <label className="mb-[16px] flex items-start gap-2 rounded-[14px] p-3 font-chivo text-[14px] text-[var(--color-nearBlack)]">
            <input
              type="checkbox"
              checked={form.employerFunded}
              onChange={(e) => {
                setForm((p) => ({ ...p, employerFunded: e.target.checked }));
                setApiError("");
              }}
              className="mt-[2px] h-[16px] w-[16px] shrink-0 rounded-[8px] border-[#D1D5DB] bg-[#E5E7EB] accent-[var(--color-burgundy)]"
            />
            <span className="leading-[20px]">My employer will be funding this</span>
          </label>

          {form.employerFunded ? (
            <div className="mb-[16px] rounded-[16px] border border-[#E5E7EB] p-4">
              <p className="mb-3 font-chivo text-[15px] font-semibold text-[var(--color-nearBlack)]">
                Employer billing details
              </p>

              <div className="mb-[14px]">
                <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                  Manager name <span>*</span>
                </label>
                <input
                  placeholder="Enter Manager name"
                  value={form.managerName}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, managerName: e.target.value }));
                    setApiError("");
                  }}
                  className={`w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
                    errors.managerName
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                  style={{ height: "40px", padding: "12px 13px" }}
                />
                {errors.managerName ? (
                  <p className="text-red-500 font-chivo text-[12px] mt-1">
                    {errors.managerName}
                  </p>
                ) : null}
              </div>

              <div className="mb-[14px]">
                <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                  Manager email <span>*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.managerEmail}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, managerEmail: e.target.value }));
                    setApiError("");
                  }}
                  className={`w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${
                    errors.managerEmail
                      ? "border-red-500 focus:ring-red-200"
                      : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                  }`}
                  style={{ height: "40px", padding: "12px 13px" }}
                />
                {errors.managerEmail ? (
                  <p className="text-red-500 font-chivo text-[12px] mt-1">
                    {errors.managerEmail}
                  </p>
                ) : null}
              </div>

              <div className="mb-[14px]">
                <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                  Business address
                </label>
                <input
                  placeholder=""
                  value={form.billingAddress}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, billingAddress: e.target.value }))
                  }
                  className="w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] border-[#DCDEE5] focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)] transition-all"
                  style={{ height: "40px", padding: "12px 13px" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[14px]">
                <div>
                  <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                    City
                  </label>
                  <input
                    placeholder=""
                    value={form.billingCity}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, billingCity: e.target.value }))
                    }
                    className="w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] border-[#DCDEE5] focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)] transition-all"
                    style={{ height: "40px", padding: "12px 13px" }}
                  />
                </div>
                <div>
                  <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                    Zip code
                  </label>
                  <input
                    placeholder=""
                    value={form.billingZipCode}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, billingZipCode: e.target.value }))
                    }
                    className="w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] border-[#DCDEE5] focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)] transition-all"
                    style={{ height: "40px", padding: "12px 13px" }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
                  Phone number
                </label>

                <PhoneInput
                  international
                  defaultCountry="US"
                  countryCallingCodeEditable={false}
                  placeholder=""
                  value={form.billingPhone || undefined}
                  onChange={(value) => {
                    setForm((p) => ({ ...p, billingPhone: value ?? "" }));
                    setApiError("");
                  }}
                />
              </div>
            </div>
          ) : null}


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

          {apiError ? (
            <p className="mb-3 text-[12px] text-red-500 font-chivo">
              {apiError}
            </p>
          ) : null}

          {/* Continue */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold font-chivo  text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        )}



      </div>
      {/* rendering of the success and error modal */}

    </div>
  );
}
