'use client'
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { Chivo } from 'next/font/google';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import axios from "axios";
import CohortCalendarDownloadButton from "@/components/CohortCalendarDownloadButton";

const chivo = Chivo({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const companyLinks = [
  { label: "About + Lisa Bennings", href: "/about" },
  { label: "Enterprise Transformation", href: "/enterprise" },
  { label: "Transformation Lab", href: "/transformlab" },
  { label: "Transformation Studio", href: "/transformation-studio" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

const resourceLinks = [
  { label: "Transformation Cohorts", href: "/cohort" },
  { label: "Framework Overview", href: "#" },
  { label: "Case Studies", href: "/casestudies" },
  { label: "Pricing, Registration & Enrollment", href: "/registration" },
  { label: "Cohort Calendar (PDF)", href: "/Upcoming_Cohort_Dates_v2.pdf" },
];

const connectLinks = [
  {
    label: "Executive Transformation with Lisa Bennings",
    href: "#",
    icon: "/images/mic.svg",
  },
  {
    label: "Executive Transformation Newsletter",
    href: "#",
    icon: "/images/newsletter.svg",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: "/images/contact.svg",
  },
];

export default function Footer() {

  const [open, setOpen] = useState<string | null>(null);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const toggle = (section: string) => {
    setOpen(open === section ? null : section);
  };

  const renderConnectLink = (link: typeof connectLinks[number], isMobile = false) => {
    const isNewsletter = link.label === "Executive Transformation Newsletter";
    const commonClassName = isMobile
      ? "footer-link flex items-center gap-2 font-chivo"
      : "flex items-center gap-2 hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium";
    const content = (
      <>
        <Image
          src={link.icon}
          alt=""
          width={18}
          height={18}
          className="mt-[1px] h-[18px] w-[18px] flex-shrink-0"
        />
        <span className={!isMobile && link.label === "Contact" ? "mt-[4px]" : !isMobile ? "leading-[18px]" : ""}>
          {link.label}
        </span>
      </>
    );

    if (isNewsletter) {
      return (
        <button
          type="button"
          onClick={() => setIsNewsletterModalOpen(true)}
          className={`${commonClassName} text-left`}
        >
          {content}
        </button>
      );
    }

    return (
      <Link href={link.href} className={commonClassName}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <footer className={`bg-nearBlack text-[#FAF7F2] font-chivo ${chivo.className}`}
        aria-label="Site footer"
      >
        {/* Main footer */}
        <div
          className="container-width pt-[93px] pb-[32px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="footer-section space-y-4 md:space-y-7 lg:space-y-8 mb-5 md:mb-0">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center"
              aria-label="Continuum Transformation Home"
            >
              <Image
                src="/images/image.png"
                alt="Continuum Transformation Logo"
                width='259'
                height={48}
                className="object-contain w-[200px] lg:w-[259px]"
                priority
              />
            </Link>

            <p className="text-[#F1F1F1] font-chivo hover:text-white hover:underline transition-colors text-[14px] font-medium max-w-[90%] md:max-w-[32rem] lg:max-w-[22rem] text-center"
              style={{
                lineHeight: 1.7,
              }}
            >
              Your transformation is too important to leave to chance. Let's build a plan that is realistic, grounded in enterprise experience, and designed to last.
            </p>
          </div>

          <div className="col-span-2 mt-50">

            {/* ✅ DESKTOP (unchanged) */}
            <div className="hidden md:grid grid-cols-3 gap-10">

              {/* Company */}
              <nav className={chivo.className}>
                <h6 className="text-[#EDEDED] font-chivo uppercase tracking-widest text-[14px] font-semibold mb-[17px]">
                  Company
                </h6>
                <ul className="space-y-[15px]">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Resources */}
              <nav className={chivo.className}>
                <h6 className="text-[#EDEDED] uppercase font-chivo tracking-widest text-[14px] font-semibold mb-[17px]">
                  Resources
                </h6>
                <ul className="space-y-[15px]">

                  {/* {resourceLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))} */}

                  {resourceLinks.map((link) => {
                    const isPdf = link.href.endsWith(".pdf");

                    return (
                      <li key={link.label}>
                        {isPdf ? (
                          <CohortCalendarDownloadButton
                            className="text-left hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium"
                          >
                            {link.label}
                          </CohortCalendarDownloadButton>
                        ) : (
                          <Link
                            href={link.href}
                            className="hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Connect */}
              <nav className={chivo.className}>
                <h6 className="text-[#EDEDED] uppercase font-chivo tracking-widest text-[14px] font-semibold mb-[17px]">
                  Connect
                </h6>

                <ul className="space-y-[15px]">
                  {connectLinks.map((link) => (
                    <li key={link.label}>
                      {renderConnectLink(link)}
                    </li>
                  ))}
                </ul>
                {/* Social icons */}
                <div className="flex items-center gap-[14px] font-chivo mt-[6rem] md:mt-[3.5rem] mb-[1rem] md:mb-0" aria-label="Social media links">


                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/ContinuumTransformation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center font-chivo justify-center rounded-md transition-colors  hover:bg-white/10 w-[53px] h-[53px]"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                    aria-label="Facebook"
                  >
                    <Image
                      src="/images/footer-media-icon3.svg"
                      alt="Continuum Transformation Logo"
                      width='53'
                      height='53'
                      className="object-contain w-full"
                      priority
                    />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/continuumtransformation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center font-chivo justify-center rounded-md transition-colors  hover:bg-white/10 w-[53px] h-[53px]"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                    aria-label="Instagram"
                  >
                    <Image
                      src="/images/footer-media-icon2.svg"
                      alt="Continuum Transformation Logo"
                      width='53'
                      height='53'
                      className="object-contain w-full"
                      priority
                    />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/lisarussell01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center  font-chivo rounded-md transition-colors  hover:bg-white/10 w-[53px] h-[53px]"
                    style={{
                      // color: "var(--color-gold)",
                    }}
                    aria-label="LinkedIn"
                  >
                    <Image
                      src="/images/footer-media-icon1.svg"
                      alt="Continuum Transformation Logo"
                      width='53'
                      height='53'
                      className="object-contain w-full"
                      priority
                    />
                  </a>
                </div>
              </nav>
            </div>

            {/* --------------------- MOBILE ACCORDION -------------------------- */}

            <div className="md:hidden">

              {/* Company */}
              <div className="border-b border-[#EDEDED1A] pxy-4">
                <button
                  onClick={() => toggle("company")}
                  className="w-full flex justify-between items-center font-chivo text-white uppercase text-[14px] tracking-widest"
                >
                  Company
                  <span>
                    {open === "company" ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    )}
                  </span>
                </button>

                {open === "company" && (
                  <ul className="mt-4 space-y-3">
                    {companyLinks.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="hover:text-white font-chivo hover:underline transition-colors text-[14px] font-medium">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Resources */}
              <div className="border-b border-[#EDEDED1A] pxy-4">
                <button
                  onClick={() => toggle("resources")}
                  className="w-full flex justify-between items-center font-chivo text-white uppercase text-[14px] tracking-widest"
                >
                  Resources
                  <span>
                    {open === "resources" ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    )}
                  </span>
                </button>

                {open === "resources" && (
                  <ul className="mt-4 space-y-3">
                    {resourceLinks.map((link) => {
                      const isPdf = link.href.endsWith(".pdf");

                      return (
                        <li key={link.label}>
                          {isPdf ? (
                            <CohortCalendarDownloadButton className="footer-link font-chivo text-left">
                              {link.label}
                            </CohortCalendarDownloadButton>
                          ) : (
                            <Link href={link.href} className="footer-link font-chivo">
                              {link.label}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Connect */}
              <div className="border-b border-[#EDEDED1A] pxy-4">
                <button
                  onClick={() => toggle("connect")}
                  className="w-full flex justify-between font-chivo items-center text-white uppercase text-[14px] tracking-widest"
                >
                  Connect
                  <span>
                    {open === "connect" ? (
                      <FaChevronUp className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-gray-500  transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    )}
                  </span>
                </button>

                {open === "connect" && (
                  <ul className="mt-4 space-y-3">
                    {connectLinks.map((link) => (
                      <li key={link.label}>
                        {renderConnectLink(link, true)}
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </div>
          </div>


          {/* Social icons */}
          <div className="md:hidden flex items-center justify-center gap-[14px] mt-[6rem] md:mt-[3.5rem] mb-[1rem] md:mb-0" aria-label="Social media links">


            {/* Facebook */}
            <a
              href="https://www.facebook.com/ContinuumTransformation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center font-chivo rounded-md transition-colors bg-[#DD962C0A] hover:bg-white/10 w-[53px] h-[53px]"
              style={{
                color: "rgba(255,255,255,0.7)",
              }}
              aria-label="Facebook"
            >
              <Image
                src="/images/footer-media-icon03.svg"
                alt="Continuum Transformation Logo"
                width='53'
                height='53'
                className="object-contain w-full"
                priority
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/continuumtransformation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center font-chivo rounded-md transition-colors bg-[#DD962C0A] hover:bg-white/10 w-[53px] h-[53px]"
              style={{
                color: "rgba(255,255,255,0.7)",
              }}
              aria-label="Instagram"
            >
              <Image
                src="/images/footer-media-icon02.png"
                alt="Continuum Transformation Logo"
                width='53'
                height='53'
                className="object-contain w-full"
                priority
              />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/lisarussell01"
              className="flex items-center justify-center rounded-md font-chivo transition-colors bg-[#DD962C0A] hover:bg-white/10 w-[53px] h-[53px]"
              style={{
                // color: "var(--color-gold)",
              }}
              aria-label="LinkedIn"
            >
              <Image
                src="/images/footer-media-icon01.png"
                alt="Continuum Transformation Logo"
                width='53'
                height='53'
                className="object-contain w-full"
                priority
              />
            </a>
          </div>
        </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{ borderTop: "1px solid #FDFCFC1A" }}
        >
          <div
            className="container-width flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-6)" }}
          >
            <p className='text-[14px] text-[#F1F1F1] font-chivo'>
              © 2026 Continuum Transformation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <NewsletterModal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
      />
    </>
  );
}

type NewsletterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      setSubmitted(false);
      setLoading(false);
      setSubmitError("");
      setForm({ name: "", email: "" });
      setErrors({ name: "", email: "" });
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

  const validate = () => {
    const nextErrors = { name: "", email: "" };

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/enquiries/email-list`, {
        name: form.name.trim(),
        email: form.email.trim(),
        send_new_podcast_episodes: false,
      });
      setSubmitted(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? "")
        : "";

      setSubmitError(message || "We couldn't complete your subscription. Please try again.");
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
      aria-labelledby="newsletter-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`relative w-full max-w-[512px] rounded-[20px] bg-white p-7 shadow-2xl font-chivo ${chivo.className}`}>
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

        {submitted ? (
          <>
            <h2
              id="newsletter-modal-title"
              className="mb-4 pr-6 text-center font-chivo text-[24px] font-bold text-[var(--color-nearBlack)]"
              style={{ lineHeight: 1.25 }}
            >
              You&apos;re Subscribed
            </h2>
            <p className="text-center font-chivo text-[16px] font-semibold text-[#737B8C]">
              Thanks for joining the Executive Transformation Newsletter.
            </p>
          </>
        ) : (
          <>
            <h2
              id="newsletter-modal-title"
              className="mb-2 pr-6 font-chivo text-[24px] font-bold text-[var(--color-nearBlack)]"
              style={{ lineHeight: 1.25 }}
            >
              Executive Transformation Newsletter
            </h2>
            <p className="mb-6 font-chivo text-[14px] text-[#737B8C]">
              Get transformation insights, tools, and updates from Continuum.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="newsletter-name"
                  className="mb-[5px] block font-chivo text-[14px] font-medium text-[var(--color-nearBlack)]"
                >
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="newsletter-name"
                  ref={firstInputRef}
                  value={form.name}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, name: event.target.value }));
                    setSubmitError("");
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Enter Name"
                  className={`h-10 w-full rounded-[14px] border bg-[#F6F6F9] px-[13px] py-3 font-chivo text-[14px] text-[var(--color-nearBlack)] placeholder-[#737B8C] transition-all focus:outline-none focus:ring-1 ${errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                    }`}
                />
                {errors.name && <p className="mt-1 font-chivo text-[12px] text-red-500">{errors.name}</p>}
              </div>

              <div className="mb-5">
                <label
                  htmlFor="newsletter-email"
                  className="mb-[5px] block font-chivo text-[14px] font-medium text-[var(--color-nearBlack)]"
                >
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm((prev) => ({ ...prev, email: event.target.value }));
                    setSubmitError("");
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="Enter Email"
                  className={`h-10 w-full rounded-[14px] border bg-[#F6F6F9] px-[13px] py-3 font-chivo text-[14px] text-[var(--color-nearBlack)] placeholder-[#737B8C] transition-all focus:outline-none focus:ring-1 ${errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-[#DCDEE5] focus:border-[var(--color-burgundy)] focus:ring-[var(--color-burgundy)]"
                    }`}
                />
                {errors.email && <p className="mt-1 font-chivo text-[12px] text-red-500">{errors.email}</p>}
              </div>

              {submitError && (
                <p className="mb-4 rounded-[10px] bg-red-50 px-3 py-2 font-chivo text-[13px] text-red-600">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-[14px] bg-burgundy py-3 font-chivo text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing Up" : "Sign Up"}
              </button>

              {/* <p className="text-center font-chivo text-[14px] text-[#737B8C]">
                No spam. Unsubscribe anytime.
              </p> */}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
