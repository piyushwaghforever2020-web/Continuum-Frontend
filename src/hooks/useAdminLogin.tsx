import { useState } from "react";
import { loginAdmin } from "@/services/auth.services";

export const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");

      const res = await loginAdmin({ email, password });

      const token = res?.data?.token;

      if (!token) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("admin_token", token);

      return res;
    } catch (err: any) {
      setError(err?.response?.data?.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};