"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

interface EmailListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmailListModal({
    isOpen,
    onClose,
}: EmailListModalProps) {
    const [submitted, setSubmitted] = useState(false);
    const [submitSucceeded, setSubmitSucceeded] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        podcast: false,
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        role: "",
        company: "",
    });

    const [error, setError] = useState("");
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Lock scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setTimeout(() => firstInputRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = "";
            setSubmitted(false);
            setSubmitSucceeded(true);
            setLoading(false);
            setForm({ name: "", email: "", podcast: false });
            setError("");
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // ESC close
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
            role: "",
            company: "",
        };

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some((err) => err);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/email-list`, {
                name: form.name.trim(),
                email: form.email.trim(),
                send_new_podcast_episodes: form.podcast,
            });

            setSubmitSucceeded(true);
            setSubmitted(true);
        } catch (submitError) {
            const message =
                axios.isAxiosError(submitError)
                    ? String(submitError.response?.data?.message ?? "")
                    : "";

            setSubmitSucceeded(false);
            setError(message || "We couldn't complete your subscription. Please try again.");
            setSubmitted(true);
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
            <div
                className={`relative bg-white rounded-[20px] shadow-2xl w-[512px] ${inter.className}`}
                style={{ padding: "28px" }}
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

                {submitted ? (
                    // ✅ SUCCESS STATE
                    <>

                        {/* Headline */}
                        <h2
                            className={`font-bold font-chivo text-[var(--color-nearBlack)] text-center text-[24px] mb-4 ${inter.className}`}
                            style={{ lineHeight: 1.25, paddingRight: "24px" }}
                        >
                            {submitSucceeded ? "Confirmation" : "Something went wrong"}
                        </h2>

                        <p className="text-[#737B8C] font-chivo  text-[16px] text-center font-semibold">
                            {submitSucceeded
                                ? "You’re in. Check your inbox for a confirmation."
                                : error || "We couldn't complete your subscription. Please try again."}
                        </p>
                    </>
                ) : (
                    <>
                        {/* Headline */}
                        <h2
                            className={`font-bold font-chivo  text-[var(--color-nearBlack)] text-[24px] ${inter.className}`}
                            style={{ marginBottom: "8px", lineHeight: 1.25, paddingRight: "24px" }}
                        >
                            Get Leadership Insights in Your Inbox
                        </h2>

                        {/* Subheadline */}
                        <p className="text-[#737B8C] font-chivo  text-[14px] mb-6">
                            Weekly episodes, tools, and updates from Continuum Transformation.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="mb-5">
                                <label
                                    htmlFor="wl-name"
                                    className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px]"
                                    style={{ marginBottom: "5px" }}
                                >
                                    Name <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
                                </label>
                                <input
                                    ref={firstInputRef}
                                    value={form.name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!/^[A-Za-z\s]*$/.test(value)) return; 
                                        setForm((p) => ({ ...p, name: value }));
                                        if (error) setError("");
                                        if (errors.name) {
                                            setErrors((prev) => ({ ...prev, name: "" }));
                                        }
                                    }}
                                    placeholder="Enter Name"
                                    className={`w-full border  font-chivo  text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.name
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                                        }`}
                                    style={{ height: "40px", padding: "12px 13px" }}
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-5">
                                <label
                                    htmlFor="wl-name"
                                    className="block font-medium font-chivo  text-[var(--color-nearBlack)] text-[14px]"
                                    style={{ marginBottom: "5px" }}
                                >
                                    Email <span className="text-[var(--color-nearBlack)]" aria-hidden="true">*</span>
                                </label>
                                <input
                                    value={form.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setForm((p) => ({ ...p, email: value }));
                                        if (error) setError("");
                                        if (errors.email) {
                                            setErrors((prev) => ({ ...prev, email: "" }));
                                        }
                                    }}
                                    placeholder='Enter Email'
                                    className={`w-full border font-chivo  text-[14px] rounded-[14px] bg-[#F6F6F9] text-[var(--color-nearBlack)] placeholder-[#737B8C] focus:outline-none focus:ring-1 transition-all ${errors.email
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                                        }`}
                                    style={{ height: "40px", padding: "12px 13px" }}
                                />

                                {errors.email && (
                                    <p className="text-red-500 font-chivo  text-[12px] mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Checkbox */}
                            <div className="mb-4 flex items-center gap-2 cursor-pointer group text-[14px] text-[var(--color-nearBlack)]">
                                <span
                                    className="flex-shrink-0 font-chivo  flex items-center justify-center rounded-[4px] border-2 transition-all cursor-pointer"
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        borderColor: form.podcast ? "var(--color-burgundy)" : "#d1d5db",
                                        background: form.podcast ? "var(--color-burgundy)" : "white",
                                    }}
                                    aria-hidden="true"
                                    onClick={() =>
                                        setForm((p) => ({ ...p, podcast: !p.podcast }))
                                    }
                                >
                                    {form.podcast && (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M20 6L9 17L4 12"
                                                stroke="white"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </span>

                                <input
                                    type="checkbox"
                                    placeholder="Select"
                                    className="sr-only"
                                    checked={form.podcast}
                                    onChange={() =>
                                        setForm((p) => ({ ...p, podcast: !p.podcast }))
                                    }
                                />

                                <label
                                    className="text-[14px] font-chivo  text-[var(--color-nearBlack)] cursor-pointer"
                                    onClick={() =>
                                        setForm((p) => ({ ...p, podcast: !p.podcast }))
                                    }
                                >
                                    Send me new podcast episodes
                                </label>
                            </div>

                            {/* CTA */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-burgundy font-chivo  font-semibold text-white rounded-[14px] py-[12px] mb-3"
                                style={{
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                }}
                            >
                                {loading ? "Submitting..." : "Join the Email List"}
                            </button>

                            {/* Trust */}
                            <p className="text-[14px] font-chivo  text-[#737B8C] font-regular text-center">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
