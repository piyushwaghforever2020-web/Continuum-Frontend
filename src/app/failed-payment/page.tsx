"use client";

import { useRouter } from "next/navigation";

const ErrorModal = () => {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <img src="/images/failure.png" alt="" />
        </div>

        <div className="flex flex-col gap-3">
          {/* Title */}
          <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
            Payment Failed
          </h2>

          {/* Subtitle */}
          <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
            Please try again
          </p>

          {/* Button */}
          <button
            type="button"
            onClick={() => {
              router.push("/registration");
            }}
            className="w-full font-semibold font-chivo bg-burgundy text-[14px] text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
            style={{
              marginBottom: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
