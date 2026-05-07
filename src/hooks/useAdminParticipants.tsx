import { useState } from "react";
import {
  exportAdminParticipants,
  getAdminParticipantById,
  getAdminParticipants,
  ParticipantsQueryParams,
} from "@/services/admin.services";

export const useAdminParticipants = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [participantsResponse, setParticipantsResponse] = useState<any>(null);

  const fetchParticipants = async (params: ParticipantsQueryParams = {}) => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminParticipants(params);
      setParticipantsResponse(res);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantById = async (participantId: string | number) => {
    try {
      setLoading(true);
      setError("");

      return await getAdminParticipantById(participantId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleExportParticipants = async (
    params: Omit<ParticipantsQueryParams, "page" | "limit"> = {}
  ) => {
    try {
      setLoading(true);
      setError("");

      return await exportAdminParticipants(params);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchParticipants,
    fetchParticipantById,
    handleExportParticipants,
    participantsResponse,
    loading,
    error,
  };
};
