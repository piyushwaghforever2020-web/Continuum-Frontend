import { useState } from "react";
import {
  getAdminPaymentById,
  getAdminPayments,
  PaymentsQueryParams,
} from "@/services/admin.services";

export const useAdminPayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentsResponse, setPaymentsResponse] = useState<any>(null);

  const fetchPayments = async (params: PaymentsQueryParams = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminPayments(params);
      setPaymentsResponse(res);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentById = async (paymentId: string | number) => {
    try {
      setLoading(true);
      setError("");

      return await getAdminPaymentById(paymentId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPayments,
    fetchPaymentById,
    paymentsResponse,
    loading,
    error,
  };
};
