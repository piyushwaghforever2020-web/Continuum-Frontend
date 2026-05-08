"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
  AdminToggle,
} from "@/components/admin/AdminTable";
import {
  AdminLineChart,
  AdminPaymentDonutChart,
  AdminRegistrationDonutChart,
} from "@/components/admin/AdminCharts";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useAdminParticipants } from "@/hooks/useAdminParticipants";
import {
  DashboardGraphFilter,
  DashboardGraphItem,
  getAdminCohorts,
  getAdminCohortFillProgress,
  getAdminPaymentStatusGraph,
  getAdminParticipants,
  getAdminRegistrationCompletionGraph,
} from "@/services/admin.services";
import Image from "next/image";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
} from "react-icons/fi";

type ParticipantRow = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  company: string;
  cohort: string;
  payment: "Paid" | "Failed" | "Refunded" | "Incomplete" | "Pending";
  registration: "Complete" | "Incomplete";
  active: boolean;
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
function normalizeParticipantStatusRegister(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "complete") return "Complete";
  if (normalized === "incomplete") return "Incomplete";
  return normalized === "failed" ? "Failed" : "Incomplete";
}

function normalizeParticipantStatus(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "paid") return "Paid";
  if (normalized === "refunded") return "Refunded";
  if (normalized === "pending") return "Pending";
  return normalized === "failed" ? "Failed" : "Incomplete";
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
        cohort: String(cohort.name ?? "-"),
        payment: normalizeParticipantStatus(
          item.payment_status
        ) as ParticipantRow["payment"],
        registration: normalizeParticipantStatusRegister(
          item.registration_status
        ) as ParticipantRow["registration"],
        active:
          String(item.registration_status ?? "").toLowerCase() === "complete",
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

function DashboardPanelHeader({
  title,
  meta,
  value,
  options,
  onChange,
}: {
  title: string;
  meta?: string;
  value?: DashboardGraphFilter;
  options?: DashboardGraphFilter[];
  onChange?: (value: DashboardGraphFilter) => void;
}) {
  return (
    <div className="admin-panel-header">
      <h3 className="admin-section-title">{title}</h3>
      {value && options && onChange ? (
        <label className="admin-panel-meta">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value as DashboardGraphFilter)}
            className="bg-transparent border-none outline-none cursor-pointer"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span className="admin-panel-meta">{meta ?? ""}</span>
      )}
    </div>
  );
}

type GraphSectionState = {
  filter: DashboardGraphFilter;
  availableFilters: DashboardGraphFilter[];
  items: DashboardGraphItem[];
};

const defaultGraphState: GraphSectionState = {
  filter: "monthly",
  availableFilters: ["weekly", "monthly", "yearly"],
  items: [],
};

export default function DashboardPage() {
  const { dashboard } = useAdminDashboard();
  const { handleExportParticipants, loading: isExporting } = useAdminParticipants();
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [search]);
  const [participantsPagination, setParticipantsPagination] =
    useState<ParticipantsPagination>({
      totalRecords: 0,
      totalPages: 1,
      currentPage: 1,
      perPage: 10,
    });
  const [participantsError, setParticipantsError] = useState("");
  const [cohortOptions, setCohortOptions] = useState<CohortOption[]>([]);
  const [cohortsError, setCohortsError] = useState("");
  const [selectedCohortId, setSelectedCohortId] = useState("");
  const [registrationGraph, setRegistrationGraph] = useState<GraphSectionState>(defaultGraphState);
  const [paymentGraph, setPaymentGraph] = useState<GraphSectionState>(defaultGraphState);

  // Cohort Fill Progress line chart
  const [fillProgressCohortId, setFillProgressCohortId] = useState("");
  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    series: number[];
    cohortName: string;
    seatLimit: number;
  }>({
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    series: [],
    cohortName: "",
    seatLimit: 10,
  });

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
                name: String(
                  cohort.name ?? cohort.title ?? "Untitled Cohort"
                ),
              };
            })
            .filter((item): item is CohortOption => Boolean(item))
          : [];

        if (!active) return;
        setFillProgressCohortId(normalizedOptions?.[0]?.id || "")
        setCohortOptions(normalizedOptions);
      } catch (error) {
        if (!active) return;
        setCohortsError(
          error instanceof Error ? error.message : "Failed to load cohorts"
        );
      }
    }

    loadCohorts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadParticipants() {
      try {
        setParticipantsError("");

        const response = await getAdminParticipants({
          page: currentPage,
          limit: perPage,

          search: debouncedSearch,
          cohort_ids: selectedCohortId,
          payment_status: "",
          registration_status: "",
        });

        const normalized = normalizeParticipantsResponse(response);

        if (!active) return;
        setParticipants(normalized.items);
        setParticipantsPagination(normalized.pagination);
      } catch (error) {
        if (!active) return;
        setParticipantsError(
          error instanceof Error ? error.message : "Failed to load participants"
        );
      }
    }

    loadParticipants();

    return () => {
      active = false;
    };
  }, [selectedCohortId, currentPage, perPage, debouncedSearch]);

  useEffect(() => {
    let active = true;

    async function loadRegistrationGraph() {
      try {
        const response = await getAdminRegistrationCompletionGraph(registrationGraph.filter);
        const data = (response?.data ?? {}) as Record<string, unknown>;
        const items = Array.isArray(data.items) ? (data.items as DashboardGraphItem[]) : [];
        const availableFilters = Array.isArray(data.available_filters)
          ? (data.available_filters as DashboardGraphFilter[])
          : defaultGraphState.availableFilters;

        if (!active) return;
        setRegistrationGraph((current) => ({
          ...current,
          items,
          availableFilters,
        }));
      } catch (_error) {
        // keep existing chart data when request fails
      }
    }

    loadRegistrationGraph();
    return () => {
      active = false;
    };
  }, [registrationGraph.filter]);

  useEffect(() => {
    let active = true;

    async function loadPaymentGraph() {
      try {
        const response = await getAdminPaymentStatusGraph(paymentGraph.filter);
        const data = (response?.data ?? {}) as Record<string, unknown>;
        const items = Array.isArray(data.items) ? (data.items as DashboardGraphItem[]) : [];
        const availableFilters = Array.isArray(data.available_filters)
          ? (data.available_filters as DashboardGraphFilter[])
          : defaultGraphState.availableFilters;

        if (!active) return;
        setPaymentGraph((current) => ({
          ...current,
          items,
          availableFilters,
        }));
      } catch (_error) {
        // keep existing chart data when request fails
      }
    }

    loadPaymentGraph();
    return () => {
      active = false;
    };
  }, [paymentGraph.filter]);



  useEffect(() => {
    let active = true;

    async function loadFillProgress() {
      try {
        const response = await getAdminCohortFillProgress(
          fillProgressCohortId || undefined
        );
        const data = (response?.data ?? {}) as Record<string, unknown>;
        const labels = Array.isArray(data.labels)
          ? (data.labels as string[])
          : ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
        const series = Array.isArray(data.series)
          ? (data.series as number[])
          : [];
        const cohortName = String(data.cohort_name ?? "");
        const seatLimit = Number(data.seat_limit ?? 10);

        if (!active) return;
        setLineChartData({ labels, series, cohortName, seatLimit });
      } catch (_error) {
        // keep existing data on failure
      }
    }

    loadFillProgress();
    return () => {
      active = false;
    };
  }, [fillProgressCohortId]);

  const participantColumns = useMemo<AdminTableColumn<ParticipantRow>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        className: "admin-table-col-name",
        render: (row) => {
          const fullName = row?.name?.trim() || "";

          // Split name safely
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
        className: "admin-table-col-name",
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
      // {
      //   key: "action",
      //   header: "Action",
      //   render: (row) => (
      //     <AdminToggle
      //       checked={row.active}
      //       ariaLabel={`Toggle ${row.name} active state`}
      //     />
      //   ),
      // },
    ],
    []
  );

  const stats = [
    {
      title: "Total Paid Users",
      value: String(dashboard.total_paid_users),
      icon: <Image src="/admin/dashboardTopIcon4.svg" alt="icon" width={30} height={30} />,
    },
    {
      title: "Registration Completed",
      value: String(dashboard.registration_completed),
      icon: <Image src="/admin/dashboardTopIcon3.svg" alt="icon" width={30} height={30} />,
    },
    {
      title: "Registration Incomplete",
      value: String(dashboard.registration_incomplete),
      icon: <Image src="/admin/dashboardTopIcon2.svg" alt="icon" width={30} height={30} />,
    },
    {
      title: "Cohort Fill Rate",
      value: `${dashboard.cohort_fill_rate}%`,
      icon: <Image src="/admin/dashboardTopIcon1.svg" alt="icon" width={30} height={30} />,
    },
  ];

  const handleExport = async () => {
    try {
      const blob = await handleExportParticipants({
        cohort_ids: selectedCohortId,

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

  const registrationComplete = registrationGraph.items.find((item) => item.key === "complete");
  const registrationNotComplete = registrationGraph.items.find((item) => item.key === "not_complete");
  const paymentPaid = paymentGraph.items.find((item) => item.key === "paid");
  const paymentFailed = paymentGraph.items.find((item) => item.key === "failed");
  const paymentRefund = paymentGraph.items.find((item) => item.key === "refund");

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-dashboard">

            <h2 className="admin-page-title">Dashboard</h2>

            <section className="admin-grid admin-grid--stats">
              {stats.map((item) => (
                <article
                  key={item.title}
                  className="admin-card admin-stat-card"
                >
                  <div className="flex justify-start items-center gap-4">
                    <div className="admin-card-icon">{item.icon}</div>
                    <p className="admin-card-title admin-card-title--dashboard">{item.title}</p>

                  </div>
                  <div className="admin-card-copy ml-[62px]">
                    <p className="admin-card-data ">{item.value}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className="admin-grid admin-grid--charts">
              <article className="admin-panel">
                <div className="admin-panel-header">
                  <h3 className="admin-section-title">Cohort Fill Progress</h3>
                  <label className="admin-panel-meta">
                    <select
                      value={fillProgressCohortId}
                      onChange={(e) => setFillProgressCohortId(e.target.value)}
                      className="bg-transparent border-none outline-none cursor-pointer"
                    >
                      <option value="">
                        {lineChartData.cohortName || "All Cohorts"}
                      </option>
                      {cohortOptions?.map((cohort) => (
                        <option key={cohort.id} value={cohort.id}>
                          {cohort.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <AdminLineChart
                  labels={lineChartData.labels}
                  series={lineChartData.series}
                  maxY={lineChartData.seatLimit}
                />
              </article>

              <article className="admin-panel flex flex-col h-full">
                <DashboardPanelHeader
                  title="Registration Completion"
                  value={registrationGraph.filter}
                  options={registrationGraph.availableFilters}
                  onChange={(value) =>
                    setRegistrationGraph((current) => ({ ...current, filter: value }))
                  }
                />
                <AdminRegistrationDonutChart
                  series={[
                    registrationComplete?.percentage ?? 0,
                    registrationNotComplete?.percentage ?? 0,
                    0,
                  ]}
                />
                <div className="admin-legend mt-auto pt-5 pb-5">
                  <div className="admin-legend-item">
                    <div className="admin-legend-item__left">
                      <span
                        className="admin-legend-dot bg-[var(--color-burgundy)]"
                      />
                      <p className="admin-legend-label">Complete</p>
                    </div>
                    <p className="admin-legend-value">{registrationComplete?.percentage ?? 0}%</p>
                  </div>
                  <div className="admin-legend-item">
                    <div className="admin-legend-item__left">
                      <span
                        className="admin-legend-dot bg-[var(--color-deepGold)]"
                      />
                      <p className="admin-legend-label">Not Complete</p>
                    </div>
                    <p className="admin-legend-value">{registrationNotComplete?.percentage ?? 0}%</p>
                  </div>
                </div>
              </article>

              <article className="admin-panel flex flex-col h-full">
                <DashboardPanelHeader
                  title="Payment Status"
                  value={paymentGraph.filter}
                  options={paymentGraph.availableFilters}
                  onChange={(value) =>
                    setPaymentGraph((current) => ({ ...current, filter: value }))
                  }
                />
                <AdminPaymentDonutChart
                  series={[
                    paymentPaid?.percentage ?? 0,
                    paymentFailed?.percentage ?? 0,
                    paymentRefund?.percentage ?? 0,
                  ]}
                />
                <div className="admin-legend admin-legend--triple mt-auto pt-5 pb-5">
                  <div className="admin-legend-item">
                    <div className="admin-legend-item__left">
                      <span
                        className="admin-legend-dot bg-[var(--color-burgundy)]"
                      />
                      <p className="admin-legend-label">Paid</p>
                    </div>
                    <p className="admin-legend-value">{paymentPaid?.percentage ?? 0}%</p>
                  </div>
                  <div className="admin-legend-item">
                    <div className="admin-legend-item__left">
                      <span
                        className="admin-legend-dot bg-[var(--color-deepGold)]"
                      />
                      <p className="admin-legend-label">Failed</p>
                    </div>
                    <p className="admin-legend-value">{paymentFailed?.percentage ?? 0}%</p>
                  </div>
                  <div className="admin-legend-item">
                    <div className="admin-legend-item__left">
                      <span
                        className="admin-legend-dot bg-[var(--color-warmCreamy)]"
                      />
                      <p className="admin-legend-label">Refund</p>
                    </div>
                    <p className="admin-legend-value">{paymentRefund?.percentage ?? 0}%</p>
                  </div>
                </div>
              </article>
            </section>

            <AdminTable
              title="Recent Participants"
              columns={participantColumns}
              rows={participants}
              searchPlaceholder="Search participants by name or email"
              onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1); // reset page on search
              }}
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
              filters={[
                {
                  label: "All Cohorts",
                  value: selectedCohortId,
                  options: [
                    { label: "All Cohorts", value: "" },
                    ...cohortOptions.map((cohort) => ({
                      label: cohort.name,
                      value: cohort.id,
                    })),
                  ],
                  onChange: (value) => {
                    setSelectedCohortId(value);
                    setCurrentPage(1);
                  },
                },
              ]}
              actionLabel="Export CSV"
              onActionClick={handleExport}
              isActionLoading={isExporting}
            // footer={
            //   participantsError
            //     ? participantsError
            //     : cohortsError
            //       ? cohortsError
            //       : `Showing ${participants.length} of ${participantsPagination.totalRecords} participants`
            // }
            />
          </div>
        </main>
      </div>
    </div>
  );
}
