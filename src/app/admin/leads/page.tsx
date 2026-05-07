"use client";

import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiEye, FiSearch, FiX } from "react-icons/fi";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import {
  getAdminContactEnquiries,
  getAdminEmailListEnquiries,
  getAdminLabEnquiries,
  getAdminSpeakerEnquiries,
  getAdminWaitlistEnquiries,
  type EnquiriesQueryParams,
} from "@/services/admin.services";

type LeadsTabKey = "lab" | "speaker" | "waitlist" | "email-list" | "contact-list";

type LeadsPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

type LeadTableRow = {
  id: number;
  name: string;
  email: string;
  organization: string;
  eventDate: string[] | string;
  status: string;
  submitted: string;
  role: string;
  source: string;
  podcastUpdates: string;
};

type LeadDetailField = {
  label: string;
  value: string | string[];
};

type LeadsTabConfig = {
  key: LeadsTabKey;
  label: string;
  emptySearchPlaceholder: string;
};

const TAB_CONFIG: LeadsTabConfig[] = [
  {
    key: "lab",
    label: "Lab Enquiries",
    emptySearchPlaceholder: "Search lab enquiries by name",
  },
  {
    key: "waitlist",
    label: "Waitlist",
    emptySearchPlaceholder: "Search waitlist submissions by name",
  },
  {
    key: "email-list",
    label: "Email List",
    emptySearchPlaceholder: "Search email list by name",
  },
  {
    key: "speaker",
    label: "Lisa Invite",
    emptySearchPlaceholder: "Search invited list by name",
  },
  {
    key: "contact-list",
    label: "Contact List",
    emptySearchPlaceholder: "Search contact submissions by name",
  },
];

const DEFAULT_PAGINATION: LeadsPagination = {
  totalRecords: 0,
  totalPages: 1,
  currentPage: 1,
  perPage: 10,
};

function formatDate(value: unknown) {
  const raw = String(value ?? "");

  if (!raw) return "-";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  return parsed.toLocaleDateString("en-CA");
}

function formatList(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    return "-";
  }

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

function getBadgeColor(status: string) {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("subscribed") ||
    normalized.includes("application") ||
    normalized.includes("active")
  ) {
    return "#2BAB6F";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("waitlist") ||
    normalized.includes("podcast")
  ) {
    return "#F48C25";
  }

  return "#4D2E6B";
}

function normalizeLeadsResponse(tab: LeadsTabKey, payload: unknown) {
  const raw = (payload ?? {}) as Record<string, unknown>;
  const data = (raw.data ?? {}) as Record<string, unknown>;
  const source = Array.isArray(data.items) ? data.items : [];
  const pagination = (data.pagination ?? {}) as Record<string, unknown>;

  const rows: LeadTableRow[] = source.map((item) => {
    const current = item as Record<string, unknown>;

    if (tab === "lab") {
      return {
        id: Number(current.id ?? 0),
        name: String(current.name ?? "-"),
        email: String(current.email ?? "-"),
        organization: String(current.company ?? "-"),
        eventDate: Array.isArray(current.cohort_interests)
          ? current.cohort_interests.map((i) => String(i))
          : [],
        status: "Application",
        submitted: formatDate(current.created_at),
        role: String(current.role_title ?? "-"),
        source: "-",
        podcastUpdates: "-",
      };
    }

    if (tab === "speaker") {
      return {
        id: Number(current.id ?? 0),
        name: String(current.name ?? "-"),
        email: String(current.email ?? "-"),
        organization: String(current.organization ?? "-"),
        eventDate: String(current.event_date_or_timeframe ?? "-"),
        status: "Pending",
        submitted: formatDate(current.created_at),
        role: String(current.event_type ?? "-"),
        source: String(current.audience_size ?? "-"),
        podcastUpdates: "-",
      };
    }

    if (tab === "waitlist") {
      return {
        id: Number(current.id ?? 0),
        name: String(current.name ?? "-"),
        email: String(current.email ?? "-"),
        organization: "-",
        eventDate: "-",
        status: "Waitlisted",
        submitted: formatDate(current.created_at),
        role: "-",
        source: formatList(current.referral_sources),
        podcastUpdates: "-",
      };
    }

    if (tab === "contact-list") {
      return {
        id: Math.random(), // or index if no id
        name: `${current.first_name ?? ""} ${current.last_name ?? ""}`.trim(),
        email: String(current.email ?? "-"),
        organization: "-",
        eventDate: "-",
        status: "New",
        submitted: "-", // API doesn't give date
        role: "-",
        source: String(current.selected_topic ?? "-"),
        podcastUpdates: String(current.message ?? "-"),
      };
    }

    return {
      id: Number(current.id ?? 0),
      name: String(current.name ?? "-"),
      email: String(current.email ?? "-"),
      organization: "-",
      eventDate: "-",
      status: "Subscribed",
      submitted: formatDate(current.created_at),
      role: "-",
      source: "-",
      podcastUpdates: current.send_new_podcast_episodes ? "Enabled" : "Disabled",
    };
  });

  return {
    rows,
    pagination: {
      totalRecords: Number(pagination.total_records ?? rows.length),
      totalPages: Number(pagination.total_pages ?? 1),
      currentPage: Number(pagination.current_page ?? 1),
      perPage: Number(pagination.per_page ?? 10),
    } satisfies LeadsPagination,
  };
}

function downloadCsv(filename: string, columns: string[], rows: string[][]) {
  const escapeValue = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const csv = [columns, ...rows]
    .map((row) => row.map((value) => escapeValue(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function LeadDetailsModal({
  row,
  activeTab,
  onClose,
}: {
  row: LeadTableRow | null;
  activeTab: LeadsTabKey;
  onClose: () => void;
}) {
  if (!row) {
    return null;
  }

  const details: LeadDetailField[] =
    activeTab === "contact-list"
      ? [
        { label: "Name", value: row.name },
        { label: "Email", value: row.email },
        { label: "Topic", value: row.source },
        { label: "Message", value: row.podcastUpdates },
      ]
      : activeTab === "speaker"
        ? [
          { label: "Name", value: row.name },
          { label: "Email", value: row.email },
          { label: "Organization", value: row.organization },
          { label: "Event Date", value: row.eventDate },
          { label: "Audience Size", value: row.source },
          { label: "Submitted", value: row.submitted },
        ]
        : activeTab === "lab"
          ? [
            { label: "Name", value: row.name },
            { label: "Email", value: row.email },
            { label: "Role", value: row.role },
            { label: "Company", value: row.organization },
            { label: "Submitted", value: row.submitted },
            { label: "Cohort Interests", value: row.eventDate },
          ]
          : activeTab === "waitlist"
            ? [
              { label: "Name", value: row.name },
              { label: "Email", value: row.email },
              { label: "Source", value: row.source },
              { label: "Submitted", value: row.submitted },
            ]
            : [
              { label: "Name", value: row.name },
              { label: "Email", value: row.email },
              { label: "Podcast Updates", value: row.podcastUpdates },
              { label: "Submitted", value: row.submitted },
            ];

  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div className="admin-modal leads-modal max-30">
        <button
          type="button"
          className="admin-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        <div className="admin-modal__header leads-modal__header">
          <h2 id="lead-modal-title" className="admin-modal__title font-chivo">
            Lead Details
          </h2>
          <p>{row.name}</p>
        </div>

        <div className="admin-modal__details">
          {details.map((detail) => (
            <div key={detail?.label} className={`admin-modal__row ${Array.isArray(detail?.value) ? "!flex-col !items-start" : ""}`}>
              <span className="lefttext">{detail.label}</span>
              {detail?.label === "Status" ? (
                <AdminStatusBadge customColor={getBadgeColor(Array.isArray(detail?.value) ? detail?.value[0] : detail?.value)}>
                  {detail.value}
                </AdminStatusBadge>
              ) : (
                Array.isArray(detail?.value) ? (
                  <ul className="text  list-disc pl-5">
                    {detail?.value.map((item, index) => (
                      <li className="text" key={index}> <span className="text">{item}</span> </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text text-right w-72">{detail.value}</span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<LeadsTabKey>("lab");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [rows, setRows] = useState<LeadTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<LeadsPagination>(DEFAULT_PAGINATION);
  const [tabCounts, setTabCounts] = useState<Partial<Record<LeadsTabKey, number>>>({});
  const [selectedRow, setSelectedRow] = useState<LeadTableRow | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    let isCancelled = false;

    const fetchLeads = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params: EnquiriesQueryParams = {
          search: debouncedSearch,
          page: currentPage,
          limit: perPage,
        };

        const response =
          activeTab === "lab"
            ? await getAdminLabEnquiries(params)
            : activeTab === "speaker"
              ? await getAdminSpeakerEnquiries(params)
              : activeTab === "waitlist"
                ? await getAdminWaitlistEnquiries(params)
                : activeTab === "email-list"
                  ? await getAdminEmailListEnquiries(params)
                  : await getAdminContactEnquiries(params);

        if (isCancelled) {
          return;
        }

        const normalized = normalizeLeadsResponse(activeTab, response);
        setRows(normalized.rows);
        setPagination(normalized.pagination);
        setTabCounts((current) => ({
          ...current,
          [activeTab]: normalized.pagination.totalRecords,
        }));
      } catch (fetchError) {
        if (isCancelled) {
          return;
        }

        console.error(`Failed to fetch ${activeTab} enquiries:`, fetchError);
        setRows([]);
        setPagination(DEFAULT_PAGINATION);
        setError("Failed to load leads.");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchLeads();

    return () => {
      isCancelled = true;
    };
  }, [activeTab, currentPage, perPage, debouncedSearch]);

  useEffect(() => {
    setSelectedRow(null);
  }, [activeTab]);

  const columns = useMemo<AdminTableColumn<LeadTableRow>[]>(() => {
    if (activeTab === "contact-list") {
      return [
        {
          key: "name",
          header: "Name",
          render: (row) => <span className="admin-table-primary">{row.name}</span>,
        },
        {
          key: "email",
          header: "Email",
          render: (row) => <span className="admin-muted">{row.email}</span>,
        },
        {
          key: "topic",
          header: "Topic",
          render: (row) => <span className="admin-muted">{row.source}</span>,
        },
        {
          key: "message",
          header: "Message",
          render: (row) => (
            <span className="admin-muted line-clamp-1">{row.podcastUpdates}</span>
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
                onClick={() => setSelectedRow(row)}
              >
                <FiEye size={14} />
              </button>
            </div>
          ),
        },
      ];
    }
    if (activeTab === "speaker") {
      return [
        {
          key: "name",
          header: "Name",
          render: (row) => <span className="admin-table-primary">{row.name}</span>,
        },
        {
          key: "organization",
          header: "Organization",
          render: (row) => <span className="admin-muted">{row.organization}</span>,
        },
        {
          key: "eventDate",
          header: "Event Date",
          render: (row) => <span className="admin-muted">{row.eventDate}</span>,
        },
        {
          key: "audienceSize",
          header: "Audience Size",
          render: (row) => <span className="admin-muted">{row.source}</span>,
        },
        {
          key: "submitted",
          header: "Submitted",
          render: (row) => <span className="admin-muted">{row.submitted}</span>,
        },
        {
          key: "action",
          header: "Action",
          render: (row) => (
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-row-actions__button"
                aria-label={`View details for ${row.name}`}
                onClick={() => setSelectedRow(row)}
              >
                <FiEye size={14} />
              </button>
            </div>
          ),
        },
      ];
    }

    if (activeTab === "lab") {
      return [
        {
          key: "name",
          header: "Name",
          render: (row) => <span className="admin-table-primary">{row.name}</span>,
        },
        {
          key: "email",
          header: "Email",
          render: (row) => <span className="admin-muted">{row.email}</span>,
        },
        {
          key: "role",
          header: "Role",
          render: (row) => <span className="admin-muted">{row.role}</span>,
        },
        {
          key: "organization",
          header: "Company",
          render: (row) => <span className="admin-muted">{row.organization}</span>,
        },
        {
          key: "submitted",
          header: "Submitted",
          render: (row) => <span className="admin-muted">{row.submitted}</span>,
        },
        {
          key: "action",
          header: "Action",
          render: (row) => (
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-row-actions__button"
                aria-label={`View details for ${row.name}`}
                onClick={() => setSelectedRow(row)}
              >
                <FiEye size={14} />
              </button>
            </div>
          ),
        },
      ];
    }

    if (activeTab === "waitlist") {
      return [
        {
          key: "name",
          header: "Name",
          render: (row) => <span className="admin-table-primary">{row.name}</span>,
        },
        {
          key: "email",
          header: "Email",
          render: (row) => <span className="admin-muted">{row.email}</span>,
        },
        {
          key: "source",
          header: "Source",
          render: (row) => <span className="admin-muted">{row.source}</span>,
        },
        {
          key: "submitted",
          header: "Submitted",
          render: (row) => <span className="admin-muted">{row.submitted}</span>,
        },
        {
          key: "action",
          header: "Action",
          render: (row) => (
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-row-actions__button"
                aria-label={`View details for ${row.name}`}
                onClick={() => setSelectedRow(row)}
              >
                <FiEye size={14} />
              </button>
            </div>
          ),
        },
      ];
    }

    return [
      {
        key: "name",
        header: "Name",
        render: (row) => <span className="admin-table-primary">{row.name}</span>,
      },
      {
        key: "email",
        header: "Email",
        render: (row) => <span className="admin-muted">{row.email}</span>,
      },
      {
        key: "podcastUpdates",
        header: "Podcast Updates",
        render: (row) => <span className="admin-muted">{row.podcastUpdates}</span>,
      },
      {
        key: "submitted",
        header: "Submitted",
        render: (row) => <span className="admin-muted">{row.submitted}</span>,
      },
      {
        key: "action",
        header: "Action",
        render: (row) => (
          <div className="admin-row-actions">
            <button
              type="button"
              className="admin-row-actions__button"
              aria-label={`View details for ${row.name}`}
              onClick={() => setSelectedRow(row)}
            >
              <FiEye size={14} />
            </button>
          </div>
        ),
      },
    ];
  }, [activeTab]);

  const searchPlaceholder =
    TAB_CONFIG.find((tab) => tab.key === activeTab)?.emptySearchPlaceholder ??
    "Search by name or email...";

  const footerText = error
    ? error
    : isLoading
      ? "Loading leads..."
      : rows.length === 0
        ? "No leads found for the selected tab."
        : `Showing ${rows.length} of ${pagination.totalRecords} leads`;

  // const exportCurrentTab = () => {
  //   if (rows.length === 0) {
  //     return;
  //   }

  //   const exportedColumns = columns.map((column) => column.header);
  //   const exportedRows = rows.map((row) => {
  //     if (activeTab === "speaker") {
  //       return [
  //         row.name,
  //         row.organization,
  //         row.eventDate,
  //         row.source,
  //         row.submitted,
  //       ];
  //     }

  //     if (activeTab === "lab") {
  //       return [row.name, row.email, row.role, row.organization, row.submitted];
  //     }

  //     if (activeTab === "waitlist") {
  //       return [row.name, row.email, row.source, row.status, row.submitted];
  //     }

  //     return [
  //       row.name,
  //       row.email,
  //       row.podcastUpdates,
  //       row.status,
  //       row.submitted,
  //     ];
  //   });

  //   downloadCsv(`leads-${activeTab}.csv`, exportedColumns, exportedRows);
  // };

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro admin-page-intro--leads">
              <div>
                <h2 className="admin-page-title">Leads</h2>
                <p className="admin-page-subtitle">
                  Unified inbox for lab enquiries, waitlist, email list, and lisa invite.
                </p>
              </div>
            </section>

            <section className="admin-panel leads-panel">
              <div className="leads-tabs" role="tablist" aria-label="Lead categories">
                {TAB_CONFIG.map((tab) => {
                  const isActive = tab.key === activeTab;
                  const count = tabCounts[tab.key];

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`leads-tab ${isActive ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setCurrentPage(1);
                      }}
                    >
                      <span>{tab.label}</span>
                      {/* {typeof count === "number" ? (
                        <span className="leads-tab__count">{count}</span>
                      ) : null} */}
                    </button>
                  );
                })}
              </div>
              <div className="admin-table-tools !justify-start">
                <label className=" admin-search admin-search--wide">
                  <FiSearch size={16} />
                  <input
                    // className="ml-2 w-full h-full bg-transparent outline-none text-sm"
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </label>
              </div>
            </section>

            <AdminTable
              title="Leads"
              columns={columns}
              rows={rows}
              showToolbar={false}
              pagination={{
                currentPage,
                totalPages: pagination.totalPages,
                totalRecords: pagination.totalRecords,
                rowsPerPage: perPage,
                onPageChange: setCurrentPage,
                onRowsPerPageChange: (value) => {
                  setPerPage(value);
                  setCurrentPage(1);
                },
              }}
              footer={footerText}
            />
          </div>
        </main>
      </div>

      <LeadDetailsModal
        row={selectedRow}
        activeTab={activeTab}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}
