"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/hooks/useAdminLogin";

export default function AdminLogin() {
  const { handleLogin, loading, error: apiError } = useAdminLogin();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ✅ Validation
  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ✅ Submit Handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await handleLogin(form.email, form.password);
      router.replace("/admin/dashboard");

    } catch (err) {
      // handled in hook
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Background */}
      <Image
        src="/admin/login.webp"
        alt="background"
        fill
        priority
        className="object-cover"
      />

      {/* RIGHT SIDE CONTENT */}
      <div className="relative z-10 flex items-center justify-center mr30  md:justify-end h-full px-4 md:px-10">

        {/* Column container */}
        <div className="flex flex-col items-center">

          {/* Logo ABOVE card */}
          <img
            src="/admin/admin-login-logo.png"
            alt="logo"
            className="mb-6 w-220px object-contain"
          />

          {/* Card */}
          <div className="w-300px bg-white rounded-xl shadow-xl p-7">

            <h2 className=" font-chivo text-center mb-[35px] font-bold text-[26px] text-[var(--color-nearBlack)] leading-[32px]">
              Admin Login
            </h2>

            {/* Form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-[40px]">

              {/* Email */}
              <div className="flex flex-col gap-[18px]">

                {/* Email */}
                <div>
                  <label className="block mb-1 text-[16px] leading-[20px] font-medium text-[var(--color-nearBlack)]">
                    Email ID
                  </label>

                  <div
                    className={`flex items-center bg-[#F6F6F9] rounded-lg px-3 py-3 border ${errors.email ? "border-red-500" : "border-[#DCDEE5]"
                      } focus-within:border-[var(--color-burgundy)]`}
                  >
                    {/* Icon */}
                    <img
                      src="/admin/Mail.png" // use your icon
                      alt="user"
                      className="opacity-60 mr-2"
                    />

                    <input
                      type="email"
                      placeholder="Enter your email id"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent appearance-none outline-none text-[14px] text-[var(--color-nearBlack)] placeholder:text-[#737B8C]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-1 text-[16px] leading-[20px] font-medium text-[var(--color-nearBlack)]">
                    Password
                  </label>

                  <div
                    className={`flex items-center bg-[#F6F6F9] rounded-lg px-3 py-3 border ${errors.password ? "border-red-500" : "border-[#DCDEE5]"
                      } focus-within:border-[var(--color-burgundy)]`}
                  >
                    {/* Icon */}
                    <img
                      src="/admin/password.png"
                      alt="lock"
                      className=" opacity-60 mr-2"
                    />

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full !bg-white appearance-none outline-none text-[14px] text-[var(--color-nearBlack)] placeholder:text-[#737B8C]"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

              </div>

              {/* API Error */}
              {apiError && (
                <p className="text-red-500 text-sm text-center">
                  {apiError}
                </p>
              )}

              {/* Button */}


              <button
                type="submit"

                disabled={loading}
                className="w-full font-semibold text-[14px] bg-[var(--color-burgundy)] font-chivo text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99] py-[12px] px-[13px] capitalize"
                style={{
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}