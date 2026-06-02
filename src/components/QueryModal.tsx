"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  setShowSuccessRequestGroup: (value: boolean) => void;

}

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};


type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;

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

type Cohort = {
  id: number;
  sync_status :string;
  name: string;
  is_active?: boolean;
  seats_remaining?: number;
  program_id?: number | string | null;
  programId?: number | string | null;
  programs?: ProgramItem[];
};

export default function QueryModal({
  isOpen,
  onClose,
  setShowSuccessRequestGroup
}: QueryModalProps) {

  // states for the success and failure modal
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  // states for the success and failure modal

  const [loading, setLoading] = useState(false);


  const [step, setStep] = useState<1 | 2>(1);
  const [charCount, setCharCount] = useState(0);
  const [optionBox, setOptionBox] = useState(false);
  const [cohortOptionBox, setCohortOptionBox] = useState(false);
  const [programOptionBox, setProgramOptionBox] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [remainingSeats, setRemainingSeats] = useState<number | null>(null);
  const [seatAvailabilityLoading, setSeatAvailabilityLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    seat: "",
    cohort: "",
    cohortId: null as number | null,
    program: "",
    programId: null as number | string | null,
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    organization: "",
    seat: "",
    cohort: "",
    program: "",
    message: "",
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
  const seatOptions =
    remainingSeats && remainingSeats > 0
      ? Array.from({ length: remainingSeats }, (_, index) => String(index + 1))
      : [];

  const normalizeRemainingSeats = (data: any, fallback?: number) => {
   console.log("datadata",data)
    const value = data?.data?.seats_remaining ;

    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
  };

  const fetchSeatAvailability = async (cohortId: number, fallback?: number) => {
    setSeatAvailabilityLoading(true);
    setRemainingSeats(null);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts/${cohortId}/seat-availability`,
      );

      setRemainingSeats(normalizeRemainingSeats(data, fallback));
    } catch (error) {
      console.error("Error fetching seat availability", error);
      setRemainingSeats(normalizeRemainingSeats(null, fallback));
    } finally {
      setSeatAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    const getCohorts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`,
        );
        const activeCohorts = (response?.data?.data || []).filter(
(cohort: Cohort) =>
  cohort?.is_active !== false &&
  cohort?.sync_status !== "closed" &&
  cohort?.sync_status !== "full" &&
  cohort?.sync_status !==  "draft"      );
        setCohorts(activeCohorts);
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
      setStep(1);
      setForm({
        name: "",
        email: "",
        organization: "",
        seat: "",
        cohort: "",
        cohortId: null,
        program: "",
        programId: null,
        message: "",
      });
      setRemainingSeats(null);
      setSubmitError("");
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

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      organization: "",
      seat: "",
      cohort: "",
      program: "",
      message: "",
    };

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }

    if (!form.organization.trim()) newErrors.organization = "organization is required";
    if (!form.message.trim()) newErrors.message = "This is required";
    if (!form.cohortId) newErrors.cohort = "Select a cohort";
    if (selectedCohortPrograms.length > 0 && !form.programId) {
      newErrors.program = "Select a program";
    }
    if (!form.seat.trim()) newErrors.seat = "Select seats";
    if (remainingSeats !== null && Number(form.seat) > remainingSeats) {
      newErrors.seat = `Only ${remainingSeats} seats remaining`;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    const programId =
      form.programId ?? selectedCohort?.program_id ?? selectedCohort?.programId;

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/sponsorships/block/register`,
        {
          employer_name: form.name.trim(),
          employer_email: form.email.trim(),
          company_name: form.organization.trim(),
          cohort_id: form.cohortId,
          program_id: programId,
          total_seats: Number(form.seat),
          message: form.message.trim(),
        },
      );

      onClose();
      setShowSuccessRequestGroup(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? "")
        : "";
      setSubmitError(
        message || "We couldn't submit your request. Please try again.",
      );
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
        <h2 className={`font-bold font-chivo text-[var(--color-nearBlack)] text-[24px] ${inter.className}`}
          style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}>
          Request group pricing
        </h2>
        <p className="text-[#737B8C] mb-5 font-chivo  text-sm font-medium">Perfect for ERGs, leadership programs, and teams. Reserve 5–50 seats at a preferred group rate.</p>

        <form onSubmit={handleSubmit}>
          {/* seat */}

          <div className="mb-[14px]">
            <label className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-[5px]">
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
              <p className="text-red-500 font-chivo text-[12px] mt-1">{errors.name}</p>
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
              className={`w-full border text-[14px] font-chivo rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all
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


          <div style={{ marginBottom: "18px", position: "relative" }}>
            <label
              className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
              style={{ marginBottom: "5px" }}
            >
              Select cohort<span>*</span>
            </label>


            <button
              type="button"
              onClick={() => setCohortOptionBox((prev) => !prev)}
              className={`w-full border rounded-[14px] font-chivo text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${errors.cohort
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
            >
              {form.cohort || "Select cohort"}

              <Image
                src="/images/arrow-down.svg"
                alt="arrow"
                width={14}
                height={14}
                className={`transition-transform ${cohortOptionBox ? "rotate-180" : ""
                  }`}
              />
            </button>

            {cohortOptionBox && (
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
                          seat: "",
                        }));
                        setCohortOptionBox(false);
                        setProgramOptionBox(false);
                        setOptionBox(false);
                        fetchSeatAvailability(item.id, item.seats_remaining);

                        setErrors((prev) => ({
                          ...prev,
                          cohort: "",
                          program: "",
                          seat: "",
                        }));
                      }}
                      className={`py-2 text-[14px] font-chivo text-[var(--color-nearBlack)] cursor-pointer hover:bg-[#F6F6F9]
            ${index !== cohorts.length - 1 ? "border-b border-[#E5E7EB]" : "pb-4"}
            ${index === 0 ? "pt-4" : ""}`}
                    >
                      {item?.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.cohort && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">
                {errors.cohort}
              </p>
            )}
          </div>


          {selectedCohortPrograms.length > 0 && (
            <div style={{ marginBottom: "18px", position: "relative" }}>
              <label
                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                style={{ marginBottom: "5px" }}
              >
                Select program<span>*</span>
              </label>


              <button
                type="button"
                onClick={() => setProgramOptionBox((prev) => !prev)}
                className={`w-full border rounded-[14px] font-chivo text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${errors.program
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
                  className={`transition-transform ${programOptionBox ? "rotate-180" : ""
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
                            setErrors((prev) => ({
                              ...prev,
                              program: "",
                            }));
                          }}
                          className={`py-2 text-[14px] font-chivo text-[var(--color-nearBlack)] cursor-pointer hover:bg-[#F6F6F9]
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
                <p className="text-red-500 font-chivo text-[12px] mt-1">
                  {errors.program}
                </p>
              )}
            </div>
          )}


          <div style={{ marginBottom: "18px", position: "relative" }}>
            <label
              className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
              style={{ marginBottom: "5px" }}
            >
              Number of seats<span>*</span>
            </label>


            <button
              type="button"
              onClick={() => {
                if (seatOptions.length > 0) {
                  setOptionBox((prev) => !prev);
                }
              }}
              disabled={!form.cohortId || seatAvailabilityLoading || seatOptions.length === 0}
              className={`w-full border rounded-[14px] font-chivo text-[14px] bg-[#F6F6F9] text-left px-[13px] h-[40px] text-[#3d4046] flex justify-between items-center focus:outline-none focus:ring-1 transition-all
    ${errors.seat
                  ? "border-red-500 focus:ring-red-200"
                  : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
            >
              {form.seat || (seatAvailabilityLoading ? "Checking seats..." : "Select seats")}

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
                <div className="bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5 max-h-[220px] overflow-y-auto">
                  {seatOptions.map((item, index) => (
                    <div
                      key={item}
                      onClick={() => {
                        setForm((p) => ({ ...p, seat: item }));
                        setOptionBox(false);

                        if (errors.seat) {
                          setErrors((prev) => ({
                            ...prev,
                            seat: "",
                          }));
                        }
                      }}
                      className={`py-2 text-[14px] font-chivo text-[var(--color-nearBlack)] cursor-pointer hover:bg-[#F6F6F9]
            ${index !== seatOptions.length - 1 ? "border-b border-[#E5E7EB]" : "pb-4"}
            ${index === 0 ? "pt-4" : ""}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.seat && (
              <p className="text-red-500 font-chivo text-[12px] mt-1">
                {errors.seat}
              </p>
            )}
            {form.cohortId && remainingSeats !== null && !errors.seat && (
              <p className="text-[#737B8C] font-chivo text-[12px] mt-1">
                {remainingSeats} seats remaining
              </p>
            )}


          </div>


          <div className="mb-[16px]">
            <label className="block font-medium font-chivo text-[14px] text-[var(--color-nearBlack)] mb-[5px]">
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
          {submitError && (
            <p className="text-red-500 font-chivo text-[12px] mb-3">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold font-chivo text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Inquiry"}
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
            className="w-full font-semibold text-[14px] bg-burgundy font-chivo text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
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
