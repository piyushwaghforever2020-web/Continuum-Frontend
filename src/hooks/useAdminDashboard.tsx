import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/admin.services";

const initialDashboard = {
  total_paid_users: 0,
  registration_completed: 0,
  registration_incomplete: 0,
  cohort_fill_rate: 0,
};

export const useAdminDashboard = () => {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminDashboard();
      setDashboard(res?.data ?? initialDashboard);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);

  return { dashboard, loading, error, fetchDashboard };
};
