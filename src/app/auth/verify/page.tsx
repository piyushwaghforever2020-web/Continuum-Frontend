"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type VerifyStatus = "verifying" | "success" | "error";

const getResponseValue = (data: any, key: string) =>
  data?.[key] ?? data?.data?.[key] ?? data?.payload?.[key] ?? null;

const MagicLinkVerifyContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [message, setMessage] = useState("Verifying your secure link...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    const verifyMagicLink = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/magic-link/verify`,
          { token },
        );

        const sessionToken = getResponseValue(response.data, "session_token");
        const redirectUrl = getResponseValue(response.data, "redirect_url");

        if (sessionToken) {
          localStorage.setItem("session_token", String(sessionToken));
        }

        setStatus("success");
        setMessage("You're verified. Redirecting...");

        setTimeout(() => {
          if (redirectUrl) {
            window.location.assign(String(redirectUrl));
            return;
          }

          router.replace("/cohort");
        }, 700);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error?.response?.data?.message ||
            "We couldn't verify this link. Please request a fresh magic link.",
        );
      }
    };

    void verifyMagicLink();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <section className="w-full max-w-[420px] rounded-[12px] bg-white p-6 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <img
            src={status === "error" ? "/images/failure.png" : "/images/success.png"}
            alt=""
            className="h-16 w-16 object-contain"
          />
        </div>

        <h1 className="font-chivo text-[24px] font-bold leading-8 text-[#29303D]">
          {status === "error" ? "Link verification failed" : "Signing you in"}
        </h1>

        <p className="mt-3 font-chivo text-[14px] font-medium leading-6 text-[#737B8C]">
          {message}
        </p>

        {status === "error" ? (
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-5 w-full rounded-[14px] bg-burgundy px-[13px] py-[12px] font-chivo text-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.99]"
          >
            Back to home
          </button>
        ) : null}
      </section>
    </main>
  );
};

const MagicLinkVerifyPage = () => (
  <Suspense fallback={null}>
    <MagicLinkVerifyContent />
  </Suspense>
);

export default MagicLinkVerifyPage;
