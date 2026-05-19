"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { getAdminCohorts, getAdminParticipants, updateAdminParticipantStatus } from "@/services/admin.services";
import type { ParticipantsQueryParams } from "@/services/admin.services";
import { useAdminParticipants } from "@/hooks/useAdminParticipants";
import Image from "next/image";

import AdminTable, { AdminStatusBadge, AdminTableColumn, AdminToggle } from "@/components/admin/AdminTable";
import {
  FiChevronDown,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiSearch,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";

type ParticipantRow = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  program:string;
  cohort: string;
  payment: "Paid" | "Failed" | "Refunded" | "Pending";
  registration: "Complete" | "Incomplete";
  active: boolean;
  initials?: string;
  title?: string;
  reason?: string;
  answers: {
    motivation?: string;
    experience_level?: string;
    [key: string]: string | undefined;
  };
};

type ParticipantsPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

type CohortOption = {
  id: string;
  name: string;
};
type Participant_r = {
  registration: string;
};

type ParticipantStatsProps = {
  participants: Participant_r[];
};

type Participant = {
  initials: string;
  name: string;
  title?: string;
  company?: string;
  email: string;
  phone: string;
  cohort: string;
  payment: "Paid" | "Refunded" | "Pending";
  registration: string;
  reason: string;
};



type ViewParticipantModalProps = {
  participant: ParticipantRow | null;
  onClose: () => void;
};

type ParticipantsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  selectedCohortId: string;
  onCohortChange: (value: string) => void;
  cohortOptions: CohortOption[];
  selectedRegistrationStatus: string;
  onRegistrationStatusChange: (value: string) => void;
  handleExport: () => void;
  isExporting: boolean;
};

function normalizeParticipantStatusRegister(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "complete") return "Complete";
  if (normalized === "incomplete") return "Incomplete";
  if (normalized === "pending") return "Pending";
  return normalized === "failed" ? "Failed" : "Incomplete";
}


function normalizeParticipantStatus(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "paid") return "Paid";
  if (normalized === "refunded") return "Refunded";
  if (normalized === "pending") return "Pending";
  return normalized === "failed" ? "Failed" : "Incomplete";
}

function normalizeParticipantAnswers(value: unknown): ParticipantRow["answers"] {
  if (!value) return {};

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).map(([key, answerValue]) => [
            key,
            answerValue == null ? undefined : String(answerValue),
          ])
        );
      }
    } catch {
      return {};
    }
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, answerValue]) => [
        key,
        answerValue == null ? undefined : String(answerValue),
      ])
    );
  }

  return {};
}

function normalizeParticipantsResponse(payload: unknown) {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const source = data.items;
  const pagination = (data.pagination ?? {}) as Record<string, unknown>;

  const items: ParticipantRow[] = Array.isArray(source)
    ? source.map((participant) => {
      const item = (participant ?? {}) as Record<string, unknown>;
      const cohort = (item.cohort ?? {}) as Record<string, unknown>;

      return {
        id: String(item.id ?? ""),
        name: String(item.name ?? "Participant"),
        email: String(item.email ?? "-"),
        phone: String(item.phone ?? "-"),
        company: String(item.company ?? "-"),
        role: String(item.role ?? "-"),
        program: String((item.program as Record<string, unknown>)?.name ?? "-"),
        cohort: String(cohort.name ?? "-"),
        payment: normalizeParticipantStatus(item.payment_status) as ParticipantRow["payment"],
        registration: normalizeParticipantStatusRegister(item.registration_status) as ParticipantRow["registration"],
        active: item.is_active !== undefined ? Boolean(item.is_active) : String(item.registration_status ?? "").toLowerCase() === "complete",
        title: String(item.role ?? ""),
        answers: normalizeParticipantAnswers(item.answers),
      };
    })
    : [];

  return {
    items,
    pagination: {
      totalRecords: Number(pagination.total_records ?? items.length),
      totalPages: Number(pagination.total_pages ?? 1),
      currentPage: Number(pagination.current_page ?? 1),
      perPage: Number(pagination.per_page ?? 10),
    } satisfies ParticipantsPagination,
  };
}

function ParticipantStats({ participants }: ParticipantStatsProps) {
  const total = participants?.length;
  const completed = participants?.filter((person) => person?.registration === "Complete")?.length;
  const incomplete = total - completed;



  const cards = [
    {
      label: "Total Participants",
      value: total,
      icon: <Image src="/admin/participantsTopIcon3.svg" alt="icon" width={25} height={25} />,
      toneClass: "admin-summary-card--violet",
    },
    {
      label: "Completed",
      value: completed,
      icon: <Image src="/admin/participantsTopIcon2.svg" alt="icon" width={25} height={25} />,
      toneClass: "admin-summary-card--green",
    },
    {
      label: "Incomplete",
      value: incomplete,
      icon: <Image src="/admin/participantsTopIcon1.svg" alt="icon" width={25} height={25} />,
      toneClass: "admin-summary-card--orange",
    },
  ];

  return (
    <section className="admin-grid admin-grid--participants-stats">
      {/* {cards.map((card) => (
        <article key={card.label} className={`admin-card admin-summary-card ${card.toneClass}`}>
          <div className="admin-summary-card__content">
            {card.icon}
            <div>
              <p className="admin-summary-card__value">{card.value}</p>
              <p className="admin-summary-card__label">{card.label}</p>
            </div>
          </div>
        </article>
      ))} */}
      {cards?.map((item) => (
        <article
          key={item.label}
          className="admin-card admin-stat-card"
        >
          <div className="flex justify-start items-center gap-4">
            <div className="admin-card-icon-par">{item.icon}</div>
            <p className="admin-card-title">{item.label}</p>

          </div>
          <div className="admin-card-copy ml-[62px]">
            <p className="admin-card-data ">{item.value}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function ParticipantsFilters({
  search,
  onSearchChange,
  selectedCohortId,
  onCohortChange,
  cohortOptions,
  selectedRegistrationStatus,
  onRegistrationStatusChange,
  handleExport,
  isExporting
}: ParticipantsFiltersProps) {
  const [openMenu, setOpenMenu] = useState<"cohort" | "status" | null>(null);

  const selectedCohortLabel =
    cohortOptions.find((option) => option.id === selectedCohortId)?.name ?? "All Cohorts";

  const selectedStatusLabel =
    selectedRegistrationStatus === "complete"
      ? "Complete"
      : selectedRegistrationStatus === "incomplete"
        ? "Incomplete"
        : "All Status";

  useEffect(() => {
    if (!openMenu) return;

    const handleOutsideClick = () => setOpenMenu(null);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openMenu]);

  return (
    <section className="admin-panel admin-filter-bar">
      <label className="admin-search admin-search--wide">
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search participants by name or email"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="admin-filter-bar__actions">
        <div style={{ position: "relative" }}>
          {/* <button
            type="button"
            className="admin-table-button !max-w-[130px] flex items-center"
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu((current) => (current === "cohort" ? null : "cohort"));
            }}
          >
            <span className="font-chivo text-sm font-normal text-[#261736] truncate block">{selectedCohortLabel}</span>
            <FiChevronDown size={14} />
          </button>
           */}

          <button
            type="button"
            className="admin-table-button !max-w-[135px] flex items-center justify-between"
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu((current) => (current === "cohort" ? null : "cohort"));
            }}
          >
            {/* <span className="font-chivo text-sm font-normal text-[#261736] truncate flex-1 min-w-0">
    {selectedCohortLabel}
  </span> */}

            <span
              className={`font-chivo text-sm font-normal text-[var(--color-nearBlack)] ${selectedCohortId === ""
                ? ""
                : "truncate flex-1 min-w-0"
                }`}
            >
              {selectedCohortLabel}
            </span>

            <FiChevronDown size={14} className="flex-shrink-0 ml-1" />
          </button>


          {openMenu === "cohort" ? (
            <div className="absolute left-0 top-[calc(100%+8px)] min-w-[220px] max-h-[240px] overflow-y-auto rounded-xl border border-gray-200 bg-white z-30 shadow-lg p-1.5">
              <button
                type="button"
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedCohortId === "" ? "bg-purple-50" : ""
                  }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onCohortChange("");
                  setOpenMenu(null);
                }}
              >
                All Cohorts
              </button>
              {cohortOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedCohortId === option.id ? "bg-purple-50" : ""
                    }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onCohortChange(option.id);
                    setOpenMenu(null);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="admin-table-button "
            onClick={(event) => {
              event.stopPropagation();
              setOpenMenu((current) => (current === "status" ? null : "status"));
            }}
          >
            <span className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]">{selectedStatusLabel}</span>
            <FiChevronDown size={14} />
          </button >

          {openMenu === "status" ? (
            <div className="absolute left-0 top-[calc(100%+8px)] min-w-[180px] overflow-y-auto rounded-xl border border-gray-200 bg-white z-30 shadow-lg p-1.5">
              <button
                type="button"
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedRegistrationStatus === "" ? "bg-purple-50" : ""
                  }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRegistrationStatusChange("");
                  setOpenMenu(null);
                }}
              >
                All Status
              </button>
              <button
                type="button"
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedRegistrationStatus === "complete" ? "bg-purple-50" : ""
                  }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRegistrationStatusChange("complete");
                  setOpenMenu(null);
                }}
              >
                Complete
              </button>
              <button
                type="button"
                className={`w-full text-left px-2.5 py-2 rounded-lg text-sm text-gray-800 hover:bg-gray-100 transition ${selectedRegistrationStatus === "incomplete" ? "bg-purple-50" : ""
                  }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRegistrationStatusChange("incomplete");
                  setOpenMenu(null);
                }}
              >
                Incomplete
              </button>
            </div>
          ) : null
          }
        </div >

        <button type="button" className="admin-table-button" onClick={handleExport} disabled={isExporting}>
          <FiDownload size={14} />
          <span className="font-chivo text-sm font-normal text-[var(--color-nearBlack)]">{isExporting ? "Exporting..." : "Export CSV"}</span>
        </button >

      </div >
    </section >
  );
}

function ViewParticipantModal({
  participant,
  onClose,
}: ViewParticipantModalProps) {
  const router = useRouter();
  if (!participant) return null;
  console.log("participant", participant)
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="participant-modal-title">
      <div className="admin-modal max-30">
        <button type="button" className="admin-modal__close" onClick={onClose} aria-label="Close modal">
          <FiX size={18} />
        </button>

        <h2 id="participant-modal-title" className="admin-modal__title font-chivo">
          Participant Details
        </h2>

        <div className="admin-modal__avatar">{participant.initials}</div>

        <div className="admin-modal__header capitalize">
          <h3 className="font-chivo text-[var(--color-nearBlack)]">{participant.name}</h3>
          <p>
            {participant.title ? participant.title : 'Paticipant'} <span>|</span> {participant.company ? participant.company : 'Company'}
          </p>
        </div >

        <div className="admin-modal__details">
          <div className="admin-modal__row">
            <span>Email</span>
            <span className="text">{participant.email}</span>
          </div>
          <div className="admin-modal__row">
            <span>Phone</span>
            <span className="text">{participant.phone}</span>
          </div>
          <div className="admin-modal__row">
            <span>Company</span>
            <span className="text">{participant.company}</span>
          </div>
          <div className="admin-modal__row">
            <span>Role</span>
            <span className="text">{participant.role}</span>
          </div>
          <div className="admin-modal__row">
            <span>Cohort</span>
            <span className="text text-right w-72">{participant.cohort}</span>
          </div>
          {participant?.program && <div className="admin-modal__row">
            <span>Program</span>
            <span className="text text-right w-72">{participant.program}</span>
          </div>}
          
          <div className="admin-modal__row">
            <span>Payment</span>
            <AdminStatusBadge
              customColor={
                participant?.payment === "Paid"
                  ? "#2BAB6F"
                  : participant?.payment === "Refunded"
                    ? "#D9AC26"
                    : participant?.payment === "Pending"
                      ? "#F48C25"
                      : "#DC2828"
              }
            >
              {participant.payment}
            </AdminStatusBadge>
          </div>
          <div className="admin-modal__row">
            <span>Registration</span>
            <AdminStatusBadge
              customColor={participant.registration === "Complete" ? "#2BAB6F" : "#F48C25"}
            >
              {participant.registration}
            </AdminStatusBadge>
          </div>
        </div>

        <div className="admin-modal__reason admin-modal_column">
          <span>Why are you joining this cohort?</span>
          <p>{participant.answers.motivation || 'I’m joining this cohort to gain practical skills, learn from experts, and connect with like-minded people so I can build and grow my e-commerce projects more effectively.'}</p>
        </div>

        <div className="admin-modal__reason admin-modal_column">
          <span>What challenge are you trying to solve?</span>
          <p>{participant.answers.experience_level || 'I’m joining this cohort to gain practical skills, learn from experts, and connect with like-minded people so I can build and grow my e-commerce projects more effectively.'}

          </p>
        </div>

        <div className="admin-modal__actions">
          <button
            type="button"
            className="admin-modal__button admin-modal__button--secondary"
            onClick={() => {
              router.push(`/admin/payments?search=${encodeURIComponent(participant.name)}`);
            }}
          >
            View Payment
          </button>
          <button type="button" className="admin-modal__button text-[var(--color-warmCreamy)] bg-[var(--color-burgundy)]">
            Change Status
          </button>
        </div>
      </div >
    </div >
  );
}

export default function ParticipantsPage() {
  const searchParams = useSearchParams();
  const cohortIdFromQuery = searchParams.get("cohort_id") ?? "";
  const { handleExportParticipants, loading: isExporting } = useAdminParticipants();
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantRow | null>(null);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [togglingId, setTogglingId] = useState<string | number | null>(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const [participantsPagination, setParticipantsPagination] = useState<ParticipantsPagination>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    perPage: 10,
  });
  const [participantsError, setParticipantsError] = useState("");
  const [cohortOptions, setCohortOptions] = useState<CohortOption[]>([]);
  const [cohortsError, setCohortsError] = useState("");
  const [selectedCohortId, setSelectedCohortId] = useState("");
  const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState("");
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (!cohortIdFromQuery) {
      setIsReady(true);
      return;
    }
    setSelectedCohortId(cohortIdFromQuery);
    setCurrentPage(1);
    setIsReady(true);
  }, [cohortIdFromQuery]);

  useEffect(() => {
    let active = true;

    async function loadCohorts() {
      try {
        setCohortsError("");
        const response = await getAdminCohorts();
        const raw = (response ?? {}) as Record<string, unknown>;
        const data = (raw.data ?? {}) as Record<string, unknown>;
        const source = data.items;

        const normalizedOptions: CohortOption[] = Array.isArray(source)
          ? source
            .map((item) => {
              const cohort = (item ?? {}) as Record<string, unknown>;
              const id = cohort.id ?? cohort._id ?? cohort.cohort_id;
              if (!id) return null;

              return {
                id: String(id),
                name: String(cohort.name ?? cohort.title ?? "Untitled Cohort"),
              };
            })
            .filter((item): item is CohortOption => Boolean(item))
          : [];

        if (!active) return;
        setCohortOptions(normalizedOptions);
      } catch (error) {
        if (!active) return;
        setCohortsError(error instanceof Error ? error.message : "Failed to load cohorts");
      }
    }

    loadCohorts();

    return () => {
      active = false;
    };
  }, []);

  const loadParticipants = useCallback(async () => {
    try {
      setParticipantsError("");

      const params = {
        page: currentPage,
        limit: perPage,
        search: debouncedSearch,
        cohort_ids: selectedCohortId,
        payment_status: "",
        registration_status: selectedRegistrationStatus,
      } satisfies ParticipantsQueryParams;

      const response = await getAdminParticipants(params);

      const normalized = normalizeParticipantsResponse(response);
      setParticipants(normalized.items);
      setParticipantsPagination(normalized.pagination);
    } catch (error) {
      setParticipantsError(error instanceof Error ? error.message : "Failed to load participants");
    }
  }, [currentPage, perPage, debouncedSearch, selectedCohortId, selectedRegistrationStatus]);

  const handleToggleActive = useCallback(async (id: string | number, currentStatus: boolean) => {
    try {
      setTogglingId(id);
      const newStatus = !currentStatus;
      await updateAdminParticipantStatus(id, newStatus);

      // Re-fetch data to show updated status from server
      await loadParticipants();
    } catch (error) {
      console.error("Failed to update participant status:", error);
    } finally {
      setTogglingId(null);
    }
  }, [loadParticipants]);

  useEffect(() => {
    if (!isReady) return;
    loadParticipants();
  }, [currentPage, perPage, debouncedSearch, selectedCohortId, selectedRegistrationStatus, isReady]);

  const participantColumns = useMemo<AdminTableColumn<ParticipantRow>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        className: "admin-table-col-name",
        render: (row) => {
          const fullName = row?.name?.trim() || "";
 
          // Split name  safely
          const nameParts = fullName.split(" ").filter(Boolean);

          // Generate initials (max 2 letters)
          let initials = "NA";
          if (nameParts.length === 1) {
            initials = nameParts[0][0]?.toUpperCase() || "N";
          } else if (nameParts.length >= 2) {
            initials =
              (nameParts[0][0] + nameParts[1][0]).toUpperCase();
          }

          return (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-warmCreamy)] text-[var(--color-deepGold)] text-[12px] font-medium">
                {initials}
              </div>

              {/* Name */}
              <span className="admin-table-primary">
                {fullName || "Unknown"}
              </span>
            </div>
          );
        },
      },
      {
        key: "email",
        header: "Email",
        render: (row) => <span className="admin-muted">{row.email}</span>,
      },
      {
        key: "phone",
        header: "Phone",
        render: (row) => <span className="admin-muted">{row.phone}</span>,
      },
      // {
      //   key: "company",
      //   header: "Company",
      //   render: (row) => row.company,
      // },
      {
        key: "cohort",
        header: "Cohort",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-linkish">{row?.cohort ?? "-"}</span>,
      },
      {
        key: "program",
        header: "Program",
        className: "admin-table-col-name",
        render: (row) => <span className="admin-linkish">{row?.program ?? "-"}</span>,
      },
      {
        key: "payment",
        header: "Payment Status",
        render: (row) => (
          <AdminStatusBadge
            customColor={
              row.payment === "Paid"
                ? "#2BAB6F"
                : row.payment === "Refunded"
                  ? "#D9AC26"
                  : row.payment === "Pending"
                    ? "#F48C25"
                    : "#DC2828"
            }
          >
            {row.payment}
          </AdminStatusBadge>
        ),
      },
      {
        key: "registration",
        header: "Registration Status",
        render: (row) => (
          <AdminStatusBadge
            customColor={row.registration === "Complete" ? "#2BAB6F" : "#F48C25"}
          >
            {row.registration}
          </AdminStatusBadge>
        ),
      },

      {
        key: "action",
        header: "Action",
        render: (row) => (
          <div className="admin-row-actions">
            <button
              type="button"
              className="admin-row-actions__button"
              aria-label="View participant"
              // onClick={() => setSelectedParticipant(row)}
              onClick={() =>
                setSelectedParticipant({
                  ...row, // ✅ keeps ALL original fields (id, active, etc.)

                  initials: row.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase(),

                  title: "Participant",

                  payment: row.payment === "Failed" ? "Failed" : row.payment,

                  reason: "",
                })
              }      >
              <FiEye size={14} />
            </button>
            {/* <AdminToggle
              checked={row.active}
              disabled={togglingId === row.id}
              onChange={() => handleToggleActive(row.id, row.active)}
              ariaLabel={`Toggle active status for ${row.name}`}
            /> */}
          </div>
        ),
      },
    ],
    [handleToggleActive, togglingId]
  );

  const handleExport = async () => {
    try {
      const blob = await handleExportParticipants({
        search: debouncedSearch,
        cohort_ids: selectedCohortId,
        payment_status: "",
        registration_status: selectedRegistrationStatus,
      });

      const csvBlob = blob instanceof Blob ? blob : new Blob([blob], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "participants.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      setParticipantsError("Failed to export participants");
    }
  };

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Participants" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro">
              <div>
                <h2 className="admin-page-title">Participants</h2>
                <p className="admin-page-subtitle">
                  Manage all user registrations across cohorts
                </p>
              </div>


            </section>

            <ParticipantStats participants={participants} />
            <ParticipantsFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
              selectedCohortId={selectedCohortId}
              onCohortChange={(value) => {
                setSelectedCohortId(value);
                setCurrentPage(1);
              }}
              cohortOptions={cohortOptions}
              selectedRegistrationStatus={selectedRegistrationStatus}
              onRegistrationStatusChange={(value) => {
                setSelectedRegistrationStatus(value);
                setCurrentPage(1);
              }}
              handleExport={handleExport}
              isExporting={isExporting}
            />

            <AdminTable
              title="Participants"
              columns={participantColumns}
              rows={participants}
              showToolbar={false}
              pagination={{
                currentPage,
                totalPages: participantsPagination.totalPages,
                totalRecords: participantsPagination.totalRecords,
                rowsPerPage: perPage,
                onPageChange: setCurrentPage,
                onRowsPerPageChange: (value) => {
                  setPerPage(value);
                  setCurrentPage(1);
                },
              }}
              footer={
                participantsError
                  ? participantsError
                  : cohortsError
                    ? cohortsError
                    : `Showing ${participants.length} of ${participantsPagination.totalRecords} participants`
              }
            />
          </div>
        </main>
      </div>

      <ViewParticipantModal
        participant={selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
      />
    </div>
  );
}
