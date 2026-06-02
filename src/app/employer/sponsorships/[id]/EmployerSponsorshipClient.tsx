"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiX,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import {
  assignEmployerSponsorshipSeat,
  getEmployerSponsorshipById,
  getEmployerSponsorshipSeats,
  getPublicCohorts,
} from "@/services/admin.services";
import styles from "./employerSponsorship.module.css";

type SeatAssignment = {
  name: string;
  email: string;
  status: string;
};

type EmployerView = "overview" | "seats";

type SeatManagementRow = {
  id: string | number;
  cohortName: string;
  seatId: string;
  participant: string;
  participantEmail: string;
  assignedEmail: string;
  status: "Active" | "Assigned" | "Available" | string;
  invited: string;
  cohortId?: string | number | null;
  programId?: string | number | null;
};

type SeatManagementData = {
  totalSeats: number;
  usedSeats: number;
  availableSeats: number;
  assignedSeats: number;
  activeSeats: number;
  readOnly: boolean;
  rows: SeatManagementRow[];
};

type InviteParticipantForm = {
  participantName: string;
  participantEmail: string;
  cohort: string;
  cohortId: number | string | null;
  program: string;
  programId: number | string | null;
};

type ProgramItem = {
  id?: number | string;
  program_id?: number | string;
  programId?: number | string;
  name?: string;
  program_name?: string;
  programName?: string;
  title?: string;
};

type InviteCohort = {
  id: number | string;
  name: string;
  is_active?: boolean;
  sync_status?: string;
  program_id?: number | string | null;
  programId?: number | string | null;
  programs?: ProgramItem[];
};

type SponsorshipDashboard = {
  companyName: string;
  employerName: string;
  cohortName: string;
  programName: string;
  status: string;
  totalSeats: number;
  usedSeats: number;
  availableSeats: number;
  assignedSeats: number;
  activeSeats: number;
  totalPaidUsers: number;
  utilizationPercent: number;
  recentSeats: SeatAssignment[];
  trend: {
    labels: string[];
    assignedSeats: number[];
    activeSeats: number[];
  };
};

const emptyDashboard: SponsorshipDashboard = {
  companyName: "Employer",
  employerName: "Employer",
  cohortName: "-",
  programName: "-",
  status: "-",
  totalSeats: 0,
  usedSeats: 0,
  availableSeats: 0,
  assignedSeats: 0,
  activeSeats: 0,
  totalPaidUsers: 0,
  utilizationPercent: 0,
  recentSeats: [],
  trend: {
    labels: [],
    assignedSeats: [],
    activeSeats: [],
  },
};

const emptySeatManagementData: SeatManagementData = {
  totalSeats: 0,
  usedSeats: 0,
  availableSeats: 0,
  assignedSeats: 0,
  activeSeats: 0,
  readOnly: false,
  rows: [],
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function asNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatStatus(value: unknown) {
  return asText(value)
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeSeatAssignment(value: unknown): SeatAssignment {
  const row = asRecord(value);
  const participant = asRecord(row.participant ?? row.user ?? row.employee);

  return {
    name: asText(row.name ?? participant.name, "Unassigned seat"),
    email: asText(row.email ?? participant.email, "No email assigned"),
    status: formatStatus(row.status ?? row.assignment_status ?? "assigned"),
  };
}

function normalizeSeatStatus(value: unknown) {
  const normalized = asText(value, "available").toLowerCase();

  if (normalized === "used") return "Used";
  if (normalized === "active" || normalized === "activated") return "Active";
  if (normalized === "assigned") return "Assigned";
  return "Available";
}

function formatSeatDate(value: unknown) {
  if (!value) return "-";

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return asText(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function normalizeSeatRow(value: unknown): SeatManagementRow {
  const row = asRecord(value);
  const participant = asRecord(row.participant ?? row.user ?? row.employee);
  const cohort = asRecord(row.cohort);
  const firstName = asText(participant.first_name, "");
  const lastName = asText(participant.last_name, "");
  const fullName = `${firstName} ${lastName}`.trim();
  const participantName =
    participant.name ??
    participant.full_name ??
    (fullName || row.participant_name);
  const participantEmail =
    row.participant_email ??
    row.participantEmail ??
    participant.email ??
    row.email;
  const assignedEmail = row.assigned_email ?? row.assignedEmail;
  const seatId = row.seat_id ?? row.seatId ?? row.id;
  const status = row.seat_status ?? row.seatStatus ?? row.status;
  const cohortName =
    row.cohort_name ??
    row.cohortName ??
    cohort.name ??
    cohort.cohort_name ??
    row.name;
  const cohortId = (row.cohort_id ??
    row.cohortId ??
    cohort.id ??
    cohort.cohort_id ??
    null) as string | number | null;
  const programId = (row.program_id ??
    row.programId ??
    cohort.program_id ??
    cohort.programId ??
    null) as string | number | null;

  return {
    id: asText(row.id ?? seatId),
    cohortName: asText(cohortName),
    seatId: asText(seatId, "0"),
    participant: asText(participantName, "Unassigned"),
    participantEmail: asText(participantEmail),
    assignedEmail: asText(assignedEmail),
    status: normalizeSeatStatus(status),
    invited: formatSeatDate(row.assigned_at ?? row.activated_at),
    cohortId,
    programId,
  };
}

function normalizeSeatsResponse(payload: unknown): SeatManagementData {
  const raw = asRecord(payload);
  const responseData = Array.isArray(payload) ? payload : raw.data ?? raw;
  const data = asRecord(responseData);
  const seatValues = Array.isArray(responseData)
    ? responseData
    : asArray(data.seats ?? data.cohorts ?? data.items);
  const rows = seatValues.flatMap((value) => {
    const row = asRecord(value);
    const nestedSeats = asArray(row.seats);

    if (nestedSeats.length === 0) return [normalizeSeatRow(row)];

    return nestedSeats.map((seat) =>
      normalizeSeatRow({
        ...row,
        ...asRecord(seat),
        cohort_id: row.cohort_id ?? row.cohortId ?? row.id,
        cohort_name: row.cohort_name ?? row.cohortName ?? row.name,
      }),
    );
  });
  const totalSeats = asNumber(data.total_seats ?? data.totalSeats, rows.length);
  const usedSeats = asNumber(
    data.used_seats ?? data.usedSeats,
    rows.filter((row) => row.status !== "Available").length,
  );
  const activeSeats = rows.filter(
    (row) => row.status === "Active" || row.status === "Used",
  ).length;
  const assignedSeats = rows.filter((row) => row.status !== "Available").length;

  return {
    totalSeats,
    usedSeats,
    availableSeats: Math.max(0, totalSeats - usedSeats),
    assignedSeats,
    activeSeats,
    readOnly: Boolean(data.read_only ?? data.readOnly),
    rows,
  };
}

function normalizeSponsorshipResponse(payload: unknown): SponsorshipDashboard {
  const raw = asRecord(payload);
  console.log("rawrawraw", raw);
  const sponsorshipData = asRecord(asArray(raw.data)[0] ?? raw.sponsorship);
  const data = asRecord(sponsorshipData.sponsorship ?? sponsorshipData);
  const employer = asRecord(data.employer ?? data.company_details);
  const cohort = asRecord(data.cohort);
  const program = asRecord(data.program);
  const rawSummary = asRecord(raw.data);

  const totalSeats = asNumber(rawSummary.total_all_seats);
  const usedSeats = asNumber(rawSummary.total_used_seats);
  const assignedSeats = asNumber(rawSummary.total_assigned_seats);
  const activeSeats = asNumber(rawSummary.total_active_seats);
  const availableSeats = Math.max(
    0,
    asNumber(
      data.available_seats ?? data.availableSeats,
      totalSeats - usedSeats,
    ),
  );
  const utilizationTotal = assignedSeats + availableSeats;
  const utilizationPercent =
    utilizationTotal > 0
      ? Math.round((assignedSeats / utilizationTotal) * 100)
      : 0;
  const assignments = asArray(
    data.assignments ?? data.seats ?? data.participants ?? data.members,
  ).map(normalizeSeatAssignment);

  const trendRaw = asRecord(rawSummary.seat_activation_trend ?? raw.seat_activation_trend);
  const trendLabels = asArray(trendRaw.labels).length > 0
    ? asArray(trendRaw.labels).map((v) => String(v ?? ""))
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const trendAssigned = asArray(trendRaw.assigned_seats).length > 0
    ? asArray(trendRaw.assigned_seats).map((v) => asNumber(v))
    : trendLabels.map(() => 0);

  const trendActive = asArray(trendRaw.active_seats).length > 0
    ? asArray(trendRaw.active_seats).map((v) => asNumber(v))
    : trendLabels.map(() => 0);

  return {
    companyName: asText(
      employer.company_name ?? employer.company ?? data.company_name,
      "Employer",
    ),
    employerName: asText(employer.name ?? data.employer_name, "Employer"),
    cohortName: asText(cohort.name ?? data.cohort_name),
    programName: asText(program.name ?? program.program_name ?? data.program_name),
    status: asText(data.status),
    totalSeats,
    usedSeats,
    availableSeats,
    assignedSeats,
    activeSeats,
    totalPaidUsers: asNumber(
      data.total_all_seats ?? data.totalPaidUsers,
      data.status === "paid" ? totalSeats : 0,
    ),
    utilizationPercent,
    recentSeats: assignments.slice(0, 3),
    trend: {
      labels: trendLabels,
      assignedSeats: trendAssigned,
      activeSeats: trendActive,
    },
  };
}

function getProgramId(program: ProgramItem) {
  return program.program_id ?? program.programId ?? program.id ?? null;
}

function getProgramName(program: ProgramItem) {
  return String(
    program.program_name ??
    program.name ??
    program.programName ??
    program.title ??
    "Program",
  );
}

function normalizeCohortsResponse(payload: unknown): InviteCohort[] {
  const raw = asRecord(payload);
  const cohorts = asArray(raw.data ?? payload);

  return cohorts
    .map((value) => asRecord(value) as InviteCohort)
    .filter(
      (cohort) =>
        cohort.id !== undefined &&
        cohort.name &&
        cohort.is_active !== false &&
        cohort.sync_status !== "closed" &&
        cohort.sync_status !== "full" &&
        cohort.sync_status !== "draft",
    );
}

function EmployerSidebar({
  sponsorshipId,
  activeView,
  onViewChange,
}: {
  sponsorshipId: string;
  activeView: EmployerView;
  onViewChange: (view: EmployerView) => void;
}) {
  const { isOpen, isMobile, closeSidebar } = useSidebar();
  const router = useRouter();

  const handleViewChange = (view: EmployerView) => {
    onViewChange(view);
    router.push(
      view === "seats"
        ? `/employer/sponsorships/${sponsorshipId}/seats`
        : `/employer/sponsorships/${sponsorshipId}`,
    );

    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      {isMobile && isOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={`admin-sidebar h-screen text-white flex flex-col justify-between ${styles.sidebar} ${!isOpen ? "is-closed" : ""
          } ${isMobile ? "is-mobile" : ""}`}
      >
        <div className="flex flex-col items-center">
          <div className="px-6 py-6 font-semibold text-lg tracking-wide flex justify-center w-full">
            <img
              src={isOpen ? "/admin/admin-login-logo.svg" : "/admin/short-icon.png"}
              alt="Continuum Transformation"
              className={`transition-all ${!isOpen ? "w-10 h-10 object-contain" : ""}`}
            />
          </div>

          <nav
            className="flex flex-col gap-[14px] px-4 mt-9 w-full"
            aria-label="Employer navigation"
          >
            <button
              type="button"
              className={`group text-left px-4 py-2 flex gap-2 rounded-md text-[14px] leading-[20px] font-medium items-center transition-all admin-nav-item ${styles.sidebarButton} ${activeView === "overview"
                ? styles.sidebarButtonActive
                : styles.sidebarButtonIdle
                }`}
              onClick={() => handleViewChange("overview")}
            >
              <img
                src={activeView === "overview" ? "/admin/dashboardIcon.svg" : "/admin/dash_light_icons.svg"}
                alt=""
                className="w-[20px] h-[20px] group-hover:brightness-0"
              />
              <span className="admin-sidebar-name">Employer</span>
            </button>
            <button
              type="button"
              className={`group text-left px-4 py-2 flex gap-2 rounded-md text-[14px] leading-[20px] font-medium items-center transition-all admin-nav-item ${styles.sidebarButton} ${activeView === "seats"
                ? styles.sidebarButtonActive
                : styles.sidebarButtonIdle
                }`}
              onClick={() => handleViewChange("seats")}
            >
              <img
                src={activeView === "seats" ? "/admin/dash_dark_icon3.svg" : "/admin/dach_light_icons3.svg"}
                alt=""
                className="w-[20px] h-[20px] group-hover:brightness-0"
              />
              <span className="admin-sidebar-name">Seat Management</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}

function EmployerHeader() {
  const { isMobile, isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();

  const handleSidebarToggle = () => {
    if (isMobile) {
      if (isOpen) {
        closeSidebar();
        return;
      }

      openSidebar();
      return;
    }

    toggleSidebar();
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="admin-icon-button"
          aria-label="Toggle sidebar"
        >
          <img src="/admin/header-sidebar.png" alt="" />
        </button>
      </div>
    </header>
  );
}

function InviteParticipantModal({
  sponsorshipId,
  seat,
  onClose,
  onAssigned,
}: {
  sponsorshipId: string;
  seat: SeatManagementRow;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [form, setForm] = useState<InviteParticipantForm>({
    participantName: "",
    participantEmail: "",
    cohort: seat.cohortName || "",
    cohortId: seat.cohortId ?? null,
    program: "",
    programId: seat.programId ?? null,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cohorts, setCohorts] = useState<InviteCohort[]>([]);
  const [isCohortsLoading, setIsCohortsLoading] = useState(true);
  const [cohortOptionBox, setCohortOptionBox] = useState(false);
  const [programOptionBox, setProgramOptionBox] = useState(false);

  const selectedCohort = cohorts.find(
    (cohort) => String(cohort.id) === String(form.cohortId),
  );
  const selectedCohortPrograms = selectedCohort?.programs ?? [];

  useEffect(() => {
    let active = true;

    async function loadCohorts() {
      try {
        setIsCohortsLoading(true);
        const response = await getPublicCohorts();

        if (!active) return;
        setCohorts(normalizeCohortsResponse(response));
      } catch (err) {
        if (!active) return;
        setFormError(
          err instanceof Error ? err.message : "Failed to load cohorts.",
        );
      } finally {
        if (active) {
          setIsCohortsLoading(false);
        }
      }
    }

    loadCohorts();

    return () => {
      active = false;
    };
  }, []);

  const updateForm = (
    field: keyof InviteParticipantForm,
    value: string | number | null,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async () => {
    const participantName = form.participantName.trim();
    const participantEmail = form.participantEmail.trim();

    if (!participantName || !participantEmail) {
      setFormError("Full name and work email are required.");
      return;
    }

    // if (!form.cohortId) {
    //   setFormError("Please select a cohort.");
    //   return;
    // }

    // if (selectedCohortPrograms.length > 0 && !form.programId) {
    //   setFormError("Please select a program.");
    //   return;
    // }

    const programId =
      form.programId ?? selectedCohort?.program_id ?? selectedCohort?.programId;

    try {
      setIsSubmitting(true);
      setFormError("");
      await assignEmployerSponsorshipSeat(sponsorshipId, seat.id, {
        participant_name: participantName,
        participant_email: participantEmail,
        cohort_id: form.cohortId ?? undefined,
        program_id: programId ?? null,
      });
      onAssigned();
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to send invite.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop">
      <div className={styles.inviteModal} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.inviteModalClose}
          aria-label="Close invite modal"
          onClick={onClose}
        >
          <FiX size={18} />
        </button>

        <div className={styles.inviteModalHeader}>
          <h3>Invite a participant</h3>
          <p>We&apos;ll email an invitation link. The seat moves to Assigned until they accept.</p>
        </div>

        <div className={styles.inviteModalFields}>
          <label className={styles.inviteField}>
            <span>Full name</span>
            <input
              type="text"
              placeholder="Jane"
              value={form.participantName}
              onChange={(event) =>
                updateForm("participantName", event.target.value)
              }
            />
          </label>

          <label className={styles.inviteField}>
            <span>Work email</span>
            <input
              type="email"
              placeholder="jane@company.com"
              value={form.participantEmail}
              onChange={(event) =>
                updateForm("participantEmail", event.target.value)
              }
            />
          </label>

          {/* <div className={styles.inviteField}>
            <span>Select a cohort</span>
            <div className={styles.inviteSelectWrap}>
              <button
                type="button"
                className={styles.inviteSelectButton}
                onClick={() => setCohortOptionBox((current) => !current)}
                disabled={isCohortsLoading}
              >
                {form.cohort ||
                  (isCohortsLoading ? "Loading cohorts..." : "Select option")}
                <Image
                  src="/images/arrow-down.svg"
                  alt=""
                  width={14}
                  height={14}
                  className={cohortOptionBox ? styles.inviteSelectArrowOpen : ""}
                />
              </button>

              {cohortOptionBox ? (
                <div className={styles.inviteSelectMenu}>
                  {cohorts.length > 0 ? (
                    cohorts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={styles.inviteSelectOption}
                        onClick={() => {
                          setForm((current) => ({
                            ...current,
                            cohort: item.name,
                            cohortId: item.id,
                            program: "",
                            programId: null,
                          }));
                          setCohortOptionBox(false);
                          setProgramOptionBox(false);
                          if (formError) {
                            setFormError("");
                          }
                        }}
                      >
                        {item.name}
                      </button>
                    ))
                  ) : (
                    <p className={styles.inviteSelectEmpty}>
                      No cohorts available
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {selectedCohortPrograms.length > 0 ? (
            <div className={styles.inviteField}>
              <span>Select a program</span>
              <div className={styles.inviteSelectWrap}>
                <button
                  type="button"
                  className={styles.inviteSelectButton}
                  onClick={() => setProgramOptionBox((current) => !current)}
                >
                  {form.program || "Select program"}
                  <Image
                    src="/images/arrow-down.svg"
                    alt=""
                    width={14}
                    height={14}
                    className={
                      programOptionBox ? styles.inviteSelectArrowOpen : ""
                    }
                  />
                </button>

                {programOptionBox ? (
                  <div className={styles.inviteSelectMenu}>
                    {selectedCohortPrograms.map((program) => {
                      const programId = getProgramId(program);
                      const programName = getProgramName(program);

                      return (
                        <button
                          key={String(programId ?? programName)}
                          type="button"
                          className={styles.inviteSelectOption}
                          onClick={() => {
                            setForm((current) => ({
                              ...current,
                              program: programName,
                              programId,
                            }));
                            setProgramOptionBox(false);
                            if (formError) {
                              setFormError("");
                            }
                          }}
                        >
                          {programName}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null} */}
        </div>

        {formError ? <p className={styles.inviteError}>{formError}</p> : null}

        <div className={styles.inviteModalActions}>
          <button
            type="button"
            className={styles.inviteCancelButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.inviteSubmitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SeatManagementView({
  sponsorshipId,
  seatData,
  isLoading,
  error,
  onAssigned,
  search,
  onSearchChange,
  status,
  onStatusChange,
}: {
  sponsorshipId: string;
  seatData: SeatManagementData;
  isLoading: boolean;
  error: string;
  onAssigned: () => void;
  search: string;
  onSearchChange: (search: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
}) {
  const [activeInviteSeat, setActiveInviteSeat] = useState<SeatManagementRow | null>(null);

  const filteredRows = seatData.rows;

  const columns = useMemo<AdminTableColumn<SeatManagementRow>[]>(
    () => [
      {
        key: "seatId",
        header: "Seat ID",
        render: (row) => row.seatId,
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <AdminStatusBadge
            tone={row.status === "Active" || row.status === "Used" ? "success" : undefined}
            customColor={
              row.status === "Assigned"
                ? "#e68a26"
                : row.status === "Available"
                  ? "#4e1528"
                  : undefined
            }
          >
            {row.status}
          </AdminStatusBadge>
        ),
      },
      {
        key: "participantEmail",
        header: "Participant Email",
        render: (row) => <SeatEmail value={row.participantEmail} />,
      },
      {
        key: "cohortName",
        header: "Cohort Name",
        render: (row) => row.cohortName,
      },
      {
        key: "assignedEmail",
        header: "Assigned Email",
        render: (row) => <SeatEmail value={row.assignedEmail} />,
      },
      {
        key: "action",
        header: "Action",
        render: (row) => {
          if (row.status === "Available") {
            return (
              <button
                type="button"
                className={styles.rowInviteButton}
                onClick={() => setActiveInviteSeat(row)}
              >
                Invite participant
              </button>
            );
          }
          return <span className={styles.emptyAction}>-</span>;
        },
      },
    ],
    [setActiveInviteSeat],
  );

  return (
    <div className="admin-dashboard">
      <div className={styles.seatPageHeader}>
        <h2 className="admin-page-title">Seat Management</h2>
      </div>

      {error ? (
        <div className="admin-panel text-red-600 font-chivo text-sm">
          {error}
        </div>
      ) : null}

      <AdminTable
        title="Seats"
        columns={columns}
        rows={filteredRows}
        searchPlaceholder="Search cohort or email..."
        onSearchChange={onSearchChange}
        filters={[
          {
            label: "All Statuses",
            value: status,
            options: [
              { label: "All Statuses", value: "" },
              { label: "Active", value: "Active" },
              { label: "Assigned", value: "Assigned" },
              { label: "Available", value: "Available" },
              { label: "Used", value: "Used" },
            ],
            onChange: onStatusChange,
          },
        ]}
        showAction={false}
        enablePagination={false}
        footer={isLoading ? "Loading seats..." : undefined}
      />

      {activeInviteSeat ? (
        <InviteParticipantModal
          sponsorshipId={sponsorshipId}
          seat={activeInviteSeat}
          onClose={() => setActiveInviteSeat(null)}
          onAssigned={onAssigned}
        />
      ) : null}
    </div>
  );
}

function SeatEmail({ value }: { value: string }) {
  if (!value || value === "-") return <span className={styles.emptyAction}>-</span>;

  return (
    <a className={styles.seatEmailLink} href={`mailto:${value}`}>
      {value}
    </a>
  );
}

function SeatActivationChart({
  labels = [],
  assignedSeats = [],
  activeSeats = [],
}: {
  labels: string[];
  assignedSeats: number[];
  activeSeats: number[];
}) {
  const maxVal = Math.max(...assignedSeats, ...activeSeats, 1);
  const maxSeats = Math.max(4, Math.ceil(maxVal / 4) * 4);

  const spacing = 740 / Math.max(1, labels.length - 1);

  const assignedPoints = assignedSeats.map((v, i) => {
    const x = 52 + i * spacing;
    const y = 218 - (v / maxSeats) * 176;
    return { x, y };
  });

  const activePoints = activeSeats.map((v, i) => {
    const x = 52 + i * spacing;
    const y = 218 - (v / maxSeats) * 176;
    return { x, y };
  });

  const assignedPolyline = assignedPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const activePolyline = activePoints.map((p) => `${p.x},${p.y}`).join(" ");

  const assignedPathD = assignedPoints.length > 0
    ? `M52 218 L${assignedPoints.map((p) => `${p.x} ${p.y}`).join(" L")} L${assignedPoints[assignedPoints.length - 1].x} 218 Z`
    : "";
  const activePathD = activePoints.length > 0
    ? `M52 218 L${activePoints.map((p) => `${p.x} ${p.y}`).join(" L")} L${activePoints[activePoints.length - 1].x} 218 Z`
    : "";

  return (
    <div className={styles.lineChart} aria-label="Seat activation trend chart">
      <svg viewBox="0 0 820 260" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="activeFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5a1729" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5a1729" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="availableFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c99b5f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c99b5f" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {[32, 82, 132, 182].map((y) => (
          <line
            key={y}
            x1="52"
            x2="792"
            y1={y}
            y2={y}
            stroke="#e8e3df"
            strokeDasharray="4 5"
          />
        ))}
        <line x1="52" x2="792" y1="218" y2="218" stroke="#cfc8c4" />
        <line x1="52" x2="52" y1="28" y2="218" stroke="#cfc8c4" />

        {assignedPathD && (
          <path d={assignedPathD} fill="url(#availableFill)" />
        )}
        {activePathD && (
          <path d={activePathD} fill="url(#activeFill)" />
        )}
        {assignedPolyline && (
          <polyline
            points={assignedPolyline}
            fill="none"
            stroke="#c99b5f"
            strokeWidth="2"
          />
        )}
        {activePolyline && (
          <polyline
            points={activePolyline}
            fill="none"
            stroke="#5a1729"
            strokeWidth="2"
          />
        )}

        {[maxSeats, Math.round(maxSeats * 0.75), Math.round(maxSeats * 0.5), Math.round(maxSeats * 0.25), 0].map((label, index) => (
          <text
            key={`${label}-${index}`}
            x="28"
            y={[33, 83, 133, 183, 222][index]}
            className={styles.axisLabel}
          >
            {label}
          </text>
        ))}
        {labels.map((label, index) => (
          <text
            key={`${label}-${index}`}
            x={52 + index * spacing}
            y="246"
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {label}
          </text>
        ))}
      </svg>
      <div className="flex justify-center gap-6 mt-4">
        <span className="flex items-center gap-2 text-[13px] text-[var(--color-adminMuted)]">
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#c99b5f" }} />
          Assigned Seats
        </span>
        <span className="flex items-center gap-2 text-[13px] text-[var(--color-adminMuted)]">
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#5a1729" }} />
          Active Seats
        </span>
      </div>
    </div>
  );
}

export default function EmployerSponsorshipClient({
  sponsorshipId,
  initialView = "overview",
}: {
  sponsorshipId: string;
  initialView?: EmployerView;
}) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<SponsorshipDashboard>(emptyDashboard);
  const [seatData, setSeatData] = useState<SeatManagementData>(
    emptySeatManagementData,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSeatsLoading, setIsSeatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [seatsError, setSeatsError] = useState("");
  const [activeView, setActiveView] = useState<EmployerView>(initialView);
  const [seatsRefreshKey, setSeatsRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const openSeatManagement = () => {
    setActiveView("seats");
    router.push(`/employer/sponsorships/${sponsorshipId}/seats`);
  };

  useEffect(() => {
    let active = true;

    async function loadSponsorship() {
      try {
        setIsLoading(true);
        setError("");
        const response = await getEmployerSponsorshipById(sponsorshipId);

        if (!active) return;
        setDashboard(normalizeSponsorshipResponse(response));
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load sponsorship dashboard.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSponsorship();

    return () => {
      active = false;
    };
  }, [sponsorshipId, seatsRefreshKey]);

  useEffect(() => {
    let active = true;

    async function loadSeats() {
      try {
        setIsSeatsLoading(true);
        setSeatsError("");
        const response = await getEmployerSponsorshipSeats(
          sponsorshipId,
          search,
          status === "" ? undefined : status.toLowerCase()
        );

        if (!active) return;
        setSeatData(normalizeSeatsResponse(response));
      } catch (err) {
        if (!active) return;
        setSeatsError(
          err instanceof Error
            ? err.message
            : "Failed to load sponsorship seats.",
        );
      } finally {
        if (active) {
          setIsSeatsLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(() => {
      loadSeats();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [sponsorshipId, seatsRefreshKey, search, status]);

  const stats = useMemo(
    () => [
      {
        label: "Total Seats",
        value: String(dashboard.totalSeats),
        icon: '/images/employer-1.svg',
      },
      {
        label: "Available Seats",
        value: String(dashboard.availableSeats),
        icon: '/images/employer-2.svg',
      },
      {
        label: "Assigned Seats",
        value: String(dashboard.assignedSeats),
        icon: '/images/employer-3.svg',
      },
      {
        label: "Active Seats",
        value: String(dashboard.activeSeats),
        icon: '/images/employer-4.svg',
      },
    ],
    [dashboard],
  );

  return (
    <div className={`admin-page ${styles.shell}`}>
      <EmployerSidebar
        sponsorshipId={sponsorshipId}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="admin-main">
        <EmployerHeader />

        <main className="admin-content">
          {activeView === "seats" ? (
            <SeatManagementView
              sponsorshipId={sponsorshipId}
              seatData={seatData}
              isLoading={isSeatsLoading}
              error={seatsError}
              onAssigned={() => setSeatsRefreshKey((current) => current + 1)}
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
            />
          ) : (
            <div className="admin-dashboard">
              <h2 className="admin-page-title">Employer</h2>

              {error ? (
                <div className="admin-panel text-red-600 font-chivo text-sm">
                  {error}
                </div>
              ) : null}

              <section className={styles.hero}>
                <div>
                  <p className={styles.heroEyebrow}>
                    {isLoading ? "Loading sponsorship..." : "Welcome back,"}
                  </p>
                  <h1 className={styles.heroTitle}>{dashboard.companyName}</h1>
                  <p className={styles.heroText}>
                    You have {dashboard.availableSeats} available seats ready to assign.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.heroButton}
                  onClick={openSeatManagement}
                >
                  Seat Management
                  <FiArrowRight size={15} />
                </button>
              </section>

              <section className="admin-grid admin-grid--stats">
                {stats.map((item) => (
                  <article
                    key={item.label}
                    className="admin-card admin-stat-card"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <div className="">
                        <img
                          src={item.icon}
                          alt={item.label}
                          width={38}
                          height={38}
                        />
                      </div>
                      <p className="admin-card-title admin-card-title--dashboard">{item.label}</p>
                    </div>
                    <div className="admin-card-copy ml-[62px]">
                      <p className="admin-card-data">{isLoading ? "-" : item.value}</p>
                    </div>
                  </article>
                ))}
              </section>

              <section className={styles.chartsGrid}>
                <article className="admin-panel">
                  <h3 className={styles.panelTitle}>Seat Activation Trend</h3>
                  <SeatActivationChart
                    labels={dashboard.trend.labels}
                    assignedSeats={dashboard.trend.assignedSeats}
                    activeSeats={dashboard.trend.activeSeats}
                  />
                </article>

                <article className="admin-panel">
                  <h3 className={styles.panelTitle}>Seat Utilization</h3>
                  <div className={styles.donutWrap}>
                    <div
                      className={styles.donut}
                      style={{
                        background: `conic-gradient(#5a1729 0 ${dashboard.utilizationPercent}%, #ece9e7 ${dashboard.utilizationPercent}% 100%)`,
                      }}
                      aria-label={`${dashboard.assignedSeats} assigned seats and ${dashboard.availableSeats} available seats`}
                    >
                      <div className={styles.donutInner}>
                        <strong className={styles.donutValue}>
                          {dashboard.utilizationPercent}%
                        </strong>
                        <p className={styles.donutText}>
                          {dashboard.assignedSeats} / {dashboard.totalSeats}
                        </p>
                      </div>
                    </div>
                    <div className={styles.donutLegend}>
                      <span>
                        <i className={styles.assignedDot} />
                        Assigned Seats
                      </span>
                      <span>
                        <i className={styles.availableDot} />
                        Total Seats
                      </span>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
