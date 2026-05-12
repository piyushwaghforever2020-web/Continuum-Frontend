"use client";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRef, useState, type ReactNode } from "react";
import axios from "axios";


const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type CohortCalendarDownloadButtonProps = {
  children: ReactNode;
  className?: string;
};

const calendarHref = "/Upcoming_Cohort_Dates_v2.pdf";

type CohortCalendarPasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function DownloadCalenderPage() {

     const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const [loading, setLoading] = useState(false);
      const firstInputRef = useRef<HTMLInputElement>(null);
    
      
    
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
    
    
  return (
    <div className="bg-[#F7F7FB] font-chivo text-[var(--color-nearBlack)]">
      <Header />
      <main>
        <section
  className="relative flex min-h-[440px] items-center justify-center overflow-hidden px-5 py-20 text-center"
  aria-labelledby="download-calendar-heading"
>

  {/* Mobile Background */}
  <div className="absolute inset-0 block md:hidden">
    <Image
      src="/contactImages/contact-bg.png"
      alt="Contact Background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/aboutImages/bg-about.webp"
      alt="About Background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 mx-auto flex max-w-[820px] flex-col items-center gap-5">
            <p
              id="download-calendar-heading"
              className={`${playfair.className} text-[34px] font-bold leading-[1.12] text-white md:text-[52px] lg:text-[60px]`}
            >
              Download Cohort Calendar
            </p>
            <p className="max-w-[680px] text-[18px] font-medium leading-[1.6] text-[#F5F5F5] md:text-[22px]">
              Access the latest Transformation Imperative cohort dates using
              the password from your enrollment confirmation email.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 md:py-20" aria-label="Calendar download form">
          <div className="container-width">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_480px] lg:gap-14">
              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-3 text-[14px] font-semibold uppercase tracking-[0.14em] text-[var(--color-burgundy)]">
                    Cohort Calendar
                  </p>
                  <h1 className="max-w-[720px] text-[32px] font-chivo leading-[1.2] text-[var(--color-nearBlack)] md:text-[42px]">
                    Keep the upcoming cohort dates close while you plan your
                    next step.
                  </h1>
                </div>

                <p className="max-w-[650px] text-[16px] leading-[1.7] text-[#6A7181]">
                  Enter your password below to verify access and download the
                  PDF calendar.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[8px] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                    <Image
                      src="/enterprise/calender.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="mb-4"
                    />
                    <h2 className="mb-2 text-[18px] font-semibold font-chivo">
                      Current cohort dates
                    </h2>
                    <p className="text-[14px] leading-[1.6] font-chivo text-[#6A7181]">
                      Download the PDF used for planning the 2026 cohort
                      schedule.
                    </p>
                  </div>

                  <div className="rounded-[8px] font-chivo bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                    <Image
                      src="/enterprise/protectionphase.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="mb-4"
                    />
                    <h2 className="mb-2 font-chivo text-[18px] font-semibold">
                      Password protected
                    </h2>
                    <p className="text-[14px] leading-[1.6] font-chivo text-[#6A7181]">
                      Use the password included in your enrollment confirmation
                      email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] font-chivo bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.10)] md:p-8">
                <h2 className="mb-2 text-[26px] font-chivo font-bold leading-[1.25]">
                  Download the calendar
                </h2>
                <p className="mb-6 text-[14px] font-chivo leading-[1.6] text-[#737B8C]">
                  Enter the password to download the cohort calendar.
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
          </div>
        </section>

        {/* <section
          className="flex min-h-[360px] items-center justify-center bg-[url('/enterprise/cta-bg.png')] bg-cover bg-center px-5 py-16 text-center"
          aria-labelledby="download-calendar-cta"
        >
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-7">
            <div className="flex flex-col items-center gap-4">
              <p
                id="download-calendar-cta"
                className={`${playfair.className} text-[32px] font-bold leading-[1.15] text-white md:text-[46px]`}
              >
                Need help choosing the right cohort?
              </p>
              <p className="max-w-[650px] text-[17px] font-medium leading-[1.65] text-[#FFFFFFCC]">
                Talk with us about timing, fit, and the path that supports your
                transformation goals.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-[10px] bg-burgundy px-9 py-[13px] text-[16px] font-semibold text-white transition-all hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
              <Link
                href="/registration"
                className="rounded-[10px] border border-white px-9 py-[13px] text-[16px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[var(--color-nearBlack)]"
              >
                View Registration
              </Link>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
