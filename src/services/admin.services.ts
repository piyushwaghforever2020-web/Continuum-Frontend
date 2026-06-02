import { api } from "@/lib/axios";

export type ParticipantsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  cohort_ids?: string;
  payment_status?: string;
  registration_status?: string;
};

export type PaymentsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  cohort?: string;
};

export type EnquiriesQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type SponsorshipQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CohortsQueryParams = {
  page?: number;
  limit?: number;
};

export type DashboardGraphFilter = "weekly" | "monthly" | "yearly";

export type DashboardGraphItem = {
  key: string;
  label: string;
  value: number;
  percentage: number;
};

export type DashboardGraphResponse = {
  filter: DashboardGraphFilter;
  available_filters: DashboardGraphFilter[];
  items: DashboardGraphItem[];
  total: number;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAdminRegistrationCompletionGraph = async (
  filter: DashboardGraphFilter = "monthly"
) => {
  const res = await api.get(
    `/admin/dashboard/graphs/registration-completion${buildQuery({ filter })}`
  );
  return res.data;
};

export const getAdminContactEnquiries = async (params: EnquiriesQueryParams) => {
  const response = await api.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-us`,
    { params }
  );
  return response.data;
};

export const getAdminPaymentStatusGraph = async (
  filter: DashboardGraphFilter = "monthly"
) => {
  const res = await api.get(
    `/admin/dashboard/graphs/payment-status${buildQuery({ filter })}`
  );
  return res.data;
};

export type CohortFillProgressPoint = {
  label: string;
  value: number;
};

export type CohortFillProgressResponse = {
  cohort_id: number;
  cohort_name: string;
  labels: string[];
  series: number[];
  seat_limit: number;
  seats_filled: number;
  fill_rate: number;
  points: CohortFillProgressPoint[];
};

export const getAdminCohortFillProgress = async (cohortId?: string | number) => {
  const res = await api.get(
    `/admin/dashboard/graphs/cohort-fill-progress${buildQuery({ cohort_id: cohortId })}`
  );
  return res.data;
};

export const getAdminParticipants = async (params: ParticipantsQueryParams = {}) => {
  console.log("params", params)
  const res = await api.get(`/admin/participants${buildQuery(params)}`);

  return res.data;
};

export const getAdminParticipantById = async (participantId: string | number) => {
  const res = await api.get(`/admin/participants/${participantId}`);
  return res.data;
};

export const exportAdminParticipants = async (params: Omit<ParticipantsQueryParams, "page" | "limit"> = {}) => {
  const res = await api.get(`/admin/participants/export${buildQuery(params)}`, {
    responseType: "blob",
  });

  return res.data;
};

export const getAdminCohorts = async (params: CohortsQueryParams = {}) => {
  const res = await api.get(`/admin/cohorts${buildQuery(params)}`);
  return res.data;
};

export const getPublicCohorts = async () => {
  const res = await api.get("/cohorts");
  return res.data;
};

export const createAdminCohort = async (payload: Record<string, unknown>) => {
  const res = await api.post("/admin/cohorts", payload);
  return res.data;
};

export const getAdminCohortById = async (cohortId: string | number) => {
  const res = await api.get(`/admin/cohorts/${cohortId}`);
  return res.data;
};

export const getCohortById = async (cohortId: string | number) => {
  const res = await api.get(`/admin/cohorts/${cohortId}`);
  return res.data;
};

export const updateAdminCohort = async (
  cohortId: string | number,
  payload: Record<string, unknown>
) => {
  const res = await api.put(`/admin/cohorts/${cohortId}`, payload);
  return res.data;
};

export const updateCohortById = async (
  cohortId: string | number,
  payload: Record<string, unknown>
) => {
  const res = await api.put(`/admin/cohorts/${cohortId}`, payload);
  return res.data;
};

export const deleteAdminCohort = async (cohortId: string | number) => {
  const res = await api.delete(`/admin/cohorts/${cohortId}`);
  return res.data;
};

export const getAdminPayments = async (params: PaymentsQueryParams = {}) => {
  const res = await api.get(`/admin/payments${buildQuery(params)}`);
  return res.data;
};

export const getAdminLabEnquiries = async (params: EnquiriesQueryParams = {}) => {
  const res = await api.get(`/enquiries/lab${buildQuery(params)}`);
  return res.data;
};

export const getAdminSpeakerEnquiries = async (
  params: EnquiriesQueryParams = {}
) => {
  const res = await api.get(`/enquiries/speaker${buildQuery(params)}`);
  return res.data;
};

export const getAdminWaitlistEnquiries = async (
  params: EnquiriesQueryParams = {}
) => {
  const res = await api.get(`/enquiries/waitlist${buildQuery(params)}`);
  return res.data;
};

export const getAdminEmailListEnquiries = async (
  params: EnquiriesQueryParams = {}
) => {
  const res = await api.get(`/enquiries/email-list${buildQuery(params)}`);
  return res.data;
};

export const getAdminSponsorships = async (
  params: SponsorshipQueryParams = {}
) => {
  const res = await api.get(`/admin/sponsorships${buildQuery(params)}`);
  return res.data;
};

export const markAdminSponsorshipAsPaid = async (
  sponsorshipId: string | number
) => {
  const res = await api.post(`/admin/sponsorships/${sponsorshipId}/mark-paid`);
  return res.data;
};

export const markAdminSponsorshipAsUnpaid = async (
  sponsorshipId: string | number
) => {
  const res = await api.post(`/admin/sponsorships/${sponsorshipId}/mark-unpaid`);
  return res.data;
};

export const getEmployerSponsorshipById = async (
  sponsorshipId: string | number
) => {
  const sessionToken =
    typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;

  const res = await api.get(`/employer/sponsorships/${sponsorshipId}`, {
    headers: sessionToken
      ? {
          Authorization: `Bearer ${sessionToken}`,
        }
      : undefined,
  });
  return res.data;
};

export const getEmployerSponsorshipSeats = async (
  sponsorshipId: string | number,
  search?: string,
  status?: string
) => {
  const sessionToken =
    typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;

  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (status) params.status = status;

  const res = await api.get(`/employer/sponsorships/${sponsorshipId}/seats`, {
    params,
    headers: sessionToken
      ? {
          Authorization: `Bearer ${sessionToken}`,
        }
      : undefined,
  });
  return res.data;
};

export type AssignEmployerSponsorshipSeatPayload = {
  participant_name: string;
  participant_email: string;
  cohort_id?: string | number;
  program_id?: string | number | null;
};

export const assignEmployerSponsorshipSeat = async (
  sponsorshipId: string | number,
  seatId: string | number,
  payload: AssignEmployerSponsorshipSeatPayload
) => {
  const sessionToken =
    typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;

  const res = await api.post(
    `/employer/sponsorships/${sponsorshipId}/seats/${seatId}/assign`,
    payload,
    {
      headers: sessionToken
        ? {
            Authorization: `Bearer ${sessionToken}`,
          }
        : undefined,
    }
  );
  return res.data;
};

export const getAdminPaymentById = async (paymentId: string | number) => {
  const res = await api.get(`/admin/payments/${paymentId}`);
  return res.data;
};

export const updateAdminParticipantStatus = async (
  participantId: string | number,
  isActive: boolean
) => {
  const res = await api.patch(`/admin/participants/${participantId}/active-status`, {
    is_active: isActive,
  });
  return res.data;
};

export const updateAdminCohortStatus = async (
  cohortId: string | number,
  isActive: boolean
) => {
  const res = await api.patch(`/admin/cohorts/${cohortId}/active-status`, {
    is_active: isActive,
  });
  return res.data;
};

export const refundAdminPayment = async (paymentId: string | number) => {
  const res = await api.post(`/admin/payments/${paymentId}/refund`);
  return res.data;
};
