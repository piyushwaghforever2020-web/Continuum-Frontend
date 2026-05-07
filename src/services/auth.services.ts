import { api } from "@/lib/axios";

export const loginAdmin = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/admin/auth/login", payload);
  return res.data;
};