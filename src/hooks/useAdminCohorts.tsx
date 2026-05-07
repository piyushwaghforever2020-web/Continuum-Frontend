import { useState } from "react";
import {
  createAdminCohort,
  deleteAdminCohort,
  getAdminCohortById,
  getAdminCohorts,
  updateAdminCohort,
} from "@/services/admin.services";

export const useAdminCohorts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cohortsResponse, setCohortsResponse] = useState<any>(null);

  const fetchCohorts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminCohorts();
      setCohortsResponse(res);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCohortById = async (cohortId: string | number) => {
    try {
      setLoading(true);
      setError("");

      return await getAdminCohortById(cohortId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCohort = async (payload: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError("");

      return await createAdminCohort(payload);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCohort = async (
    cohortId: string | number,
    payload: Record<string, unknown>
  ) => {
    try {
      setLoading(true);
      setError("");

      return await updateAdminCohort(cohortId, payload);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCohort = async (cohortId: string | number) => {
    try {
      setLoading(true);
      setError("");

      return await deleteAdminCohort(cohortId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchCohorts,
    fetchCohortById,
    handleCreateCohort,
    handleUpdateCohort,
    handleDeleteCohort,
    cohortsResponse,
    loading,
    error,
  };
};
