"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

type CohortCalendarDownloadButtonProps = {
  children: ReactNode;
  className?: string;
};

const calendarHref = "/Upcoming_Cohort_Dates_v2.pdf";

export default function CohortCalendarDownloadButton({
  children,
  className = "",
}: CohortCalendarDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {children}
      </button>
      <CohortCalendarPasswordModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

type CohortCalendarPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CohortCalendarPasswordModal({
  isOpen,
  onClose,
}: CohortCalendarPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setPassword("");
      setError("");
      setLoading(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const downloadCalendar = () => {
    const link = document.createElement("a");
    link.href = calendarHref;
    link.download = "Upcoming_Cohort_Dates_v2.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/upcoming-cohort-file/download`,
        { password: password.trim() }
      );

      if (response.data?.success === true) {
        downloadCalendar();
        onClose();
        return;
      }

      setError(response.data?.message || "Invalid password.");
    } catch (submitError) {
      const message = axios.isAxiosError(submitError)
        ? String(submitError.response?.data?.message ?? "")
        : "";

      setError(message || "We couldn't verify the password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cohort-calendar-password-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[512px] rounded-[20px] bg-white p-7 shadow-2xl font-chivo">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        <h2
          id="cohort-calendar-password-title"
          className="mb-2 pr-6 font-chivo text-[24px] font-bold text-[var(--color-nearBlack)]"
          style={{ lineHeight: 1.25 }}
        >
          Download Cohort Calendar
        </h2>
        <p className="mb-6 font-chivo text-[14px] text-[#737B8C]">
          Enter the password to download the cohort calendar. You can find the password in your enrollment confirmation email.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="cohort-calendar-password"
              className="mb-[5px] block font-chivo text-[14px] font-medium text-[var(--color-nearBlack)]"
            >
              Password <span aria-hidden="true">*</span>
            </label>
            <input
              id="cohort-calendar-password"
              ref={firstInputRef}
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              placeholder="Enter Password"
              className={`h-10 w-full rounded-[14px] border bg-[#F6F6F9] px-[13px] py-3 font-chivo text-[14px] text-[var(--color-nearBlack)] placeholder-[#737B8C] transition-all focus:outline-none focus:ring-1 ${error
                ? "border-red-500 focus:ring-red-200"
                : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                }`}
            />
            {error && <p className="mt-1 font-chivo text-[12px] text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[14px] bg-burgundy py-3 font-chivo text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Verifying..." : "Download"}
          </button>
        </form>
      </div>
    </div>
  );
}
