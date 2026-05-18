"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessModalContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("id");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">



        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src="/images/success.png" alt="" />
        </div>
        <div className="flex flex-col gap-3">

          {/* Title */}
          <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
            You’re enrolled in
          </h2>

          {/* Subtitle */}
          <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
            We’ve emailed your confirmation and next steps.


          </p>

          {/* Button */}
          <button
            type="button"
            onClick={() => {
              router.push(cohortId ? `/cohort?id=${encodeURIComponent(cohortId)}` : "/cohort");
            }}

            className="w-full font-chivo font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}>
            View cohort details
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = () => (
  <Suspense fallback={null}>
    <SuccessModalContent />
  </Suspense>
);

export default SuccessModal;
