"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import styles from "../enterprise/enterprise.module.css";
import Link from "next/link";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const options = [
    "Social Media",
    "Friend/Referral",
    "Website",
    "Other",
];

export default function JoinWaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        selections: [] as string[],
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
    });

    const firstInputRef = useRef<HTMLInputElement>(null);

    // Lock scroll + reset
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
                selections: [],
            });
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Escape close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const handleToggle = (value: string) => {
        if (submitError) setSubmitError("");
        setForm((prev) => ({
            ...prev,
            selections: prev.selections.includes(value)
                ? prev.selections.filter((v) => v !== value)
                : [...prev.selections, value],
        }));
    };

    const validate = () => {
        const newErrors = { name: "", email: "" };

        if (!form.name.trim()) newErrors.name = "Name is required";

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
            newErrors.email = "Enter a valid email";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setSubmitError("");

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/waitlist`, {
                name: form.name.trim(),
                email: form.email.trim(),
                referral_sources: form.selections,
            });

            setSubmitted(true);
        } catch (error) {
            const message =
                axios.isAxiosError(error)
                    ? String(error.response?.data?.message ?? "")
                    : "";

            setSubmitError(message || "We couldn't submit your enquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {submitted ? (
                // ✅ SUCCESS STATE
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-[530px]"
                    style={{ padding: "32px 36px" }}
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

                    {/* Headline */}
                    <h2
                        className={`font-bold text-[var(--color-nearBlack)] font-chivo text-center text-[24px] ${inter.className}`}
                        style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}
                    >
                        You're on the list.
                    </h2>

                    <p className="text-[#737B8C] text-[14px] font-chivo text-center mb-5">
                        You now have priority access to upcoming enrollment, early pricing, and exclusive content tailored to your leadership journey.
                    </p>

                    <div className="mb-5">
                        <p className="font-semibold font-chivo mb-2">What happens next:</p>
                        <ul className="text-[14px] text-[#65758B] flex flex-col gap-[10px] font-chivo leading-[1.55]">
                            <li>• You’ll receive a confirmation email shortly</li>
                            <li>• We’ll send early access details before public enrollment</li>
                            <li>• You’ll get curated insights and previews based on your selections</li>
                        </ul>
                    </div>

                    <Link
                        href='/'
                        className={`font-chivo btn ${styles.modalButton}`}
                    >
                        Homepage
                    </Link>
                </div>
            ) : (
                // ✅ FORM STATE
                <div
                    className={`relative bg-white rounded-[20px] shadow-2xl w-[512px] ${inter.className}`}
                    style={{ padding: "32px" }}
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

                    <h2
                        className={`font-bold text-[var(--color-nearBlack)] font-chivo text-[24px] ${inter.className}`}
                        style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}
                    >
                        Join the Waitlist
                    </h2>
                    <p className="text-[#737B8C] font-chivo" style={{ fontSize: "14px", lineHeight: '20px', marginBottom: "24px" }}>
                        Get priority access to upcoming enrollment, early pricing, and exclusive leadership content designed to help you grow.
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-4">
                            <label
                                htmlFor="wl-name"
                                className="block font-chivo font-medium text-[var(--color-nearBlack)] text-[14px]"
                                style={{ marginBottom: "5px" }}
                            >
                                Name <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
                            </label>
                            <input
                                ref={firstInputRef}
                                value={form.name}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm((p) => ({ ...p, name: value }));
                                    if (submitError) setSubmitError("");

                                    if (errors.name) {
                                        setErrors((prev) => ({ ...prev, name: "" }));
                                    }
                                }}
                                placeholder="Enter Name"
                                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.name
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                                    }`}
                                style={{ height: "40px", padding: "12px 13px" }}
                            />
                            {errors.name && (
                                <p className="text-red-500 font-chivo text-[12px]">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="wl-name"
                                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px]"
                                style={{ marginBottom: "5px" }}
                            >
                                Email <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
                            </label>
                            <input
                                value={form.email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setForm((p) => ({ ...p, email: value }));
                                    if (submitError) setSubmitError("");

                                    if (errors.email) {
                                        setErrors((prev) => ({ ...prev, email: "" }));
                                    }
                                }}
                                placeholder="Enter Email"
                                className={`w-full border font-chivo text-[14px] rounded-[14px] bg-[#F6F6F9] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.email
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                                    }`}
                                style={{ height: "40px", padding: "12px 13px" }}
                            />
                            {errors.email && (
                                <p className="text-red-500 font-chivo text-[12px]">{errors.email}</p>
                            )}
                        </div>

                        {/* Checkbox group */}
                        <div className="mb-4">
                            <label
                                htmlFor="wl-name"
                                className="block font-medium font-chivo text-[var(--color-nearBlack)] text-[14px] mb-3"
                            >
                                How did you hear about us?
                            </label>

                            <div className="flex flex-col gap-2">
                                {options.map((opt) => {
                                    const checked = form.selections.includes(opt);

                                    return (
                                        <label
                                            key={opt}
                                            className="flex font-chivo items-center gap-2 cursor-pointer group text-[14px] text-[#737B8C]"
                                        >
                                            {/* Custom circle */}
                                            <span
                                                className="flex-shrink-0 font-chivo flex items-center justify-center rounded-[4px] border-2 transition-all cursor-pointer"
                                                style={{
                                                    width: "18px",
                                                    height: "18px",
                                                    borderColor: checked ? "var(--color-burgundy)" : "#d1d5db",
                                                    background: checked ? "var(--color-burgundy)" : "white",
                                                }}
                                                aria-hidden="true"
                                            // onClick={() =>
                                            //     setForm((p) => ({ ...p, checked }))
                                            // }
                                            >
                                                {checked && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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

                                            {/* Hidden native checkbox */}
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={checked}
                                                onChange={() => handleToggle(opt)}
                                            />
                                            {opt}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>


                        {submitError ? (
                            <p className="mb-3 text-[12px] font-chivo text-red-500">{submitError}</p>
                        ) : null}
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.modalButton}
                            style={{
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "Submitting..." : "Join the Waitlist"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
