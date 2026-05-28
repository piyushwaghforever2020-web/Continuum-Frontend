"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, { AdminTableColumn } from "@/components/admin/AdminTable";
import { getAdminSponsorships } from "@/services/admin.services";
import { FiSearch } from "react-icons/fi";

type SponsorshipRow = {
  id: string | number;
  employerName: string;
  employerEmail: string;
  employerPhone: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  cohortOrProgram: string;
};

type SponsorshipPagination = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

const DEFAULT_PAGINATION: SponsorshipPagination = {
  totalRecords: 0,
  totalPages: 1,
  currentPage: 1,
  perPage: 10,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function firstText(...values: unknown[]) {
  const match = values.find(
    (value) => value !== undefined && value !== null && String(value).trim() !== ""
  );

  return asText(match);
}

function normalizeSponsorshipsResponse(payload: unknown) {
  const raw = asRecord(payload);
  const data = asRecord(raw.data ?? raw);
  const source = Array.isArray(data.items)
    ? data.items
    : Array.isArray(raw.data)
      ? raw.data
      : [];
  const pagination = asRecord(data.pagination);

  const rows: SponsorshipRow[] = source.map((item, index) => {
    const row = asRecord(item);
    const participant = asRecord(row.participant ?? row.user ?? row.applicant);
    const employer = asRecord(row.employer ?? row.company_details);
    const cohort = asRecord(row.cohort);
    const program = asRecord(row.program);

    return {
      id: firstText(row.id, participant.id, index + 1),
      employerName: firstText(
        row.manager_name,
        row.employer_name,
        row.company,
        employer.name,
        employer.company
      ),
      employerEmail: firstText(row.manager_email, row.employer_email, employer.email),
      employerPhone: firstText(
        row.billing_phone,
        row.employer_phone,
        employer.phone,
        employer.billing_phone
      ),
      participantName: firstText(row.name, participant.name),
      participantEmail: firstText(row.email, participant.email),
      participantPhone: firstText(row.phone, participant.phone),
      cohortOrProgram: firstText(
        row.cohort_name,
        cohort.name,
        row.program_name,
        program.name
      ),
    };
  });

  return {
    rows,
    pagination: {
      totalRecords: Number(pagination.total_records ?? rows.length),
      totalPages: Number(pagination.total_pages ?? 1),
      currentPage: Number(pagination.current_page ?? 1),
      perPage: Number(pagination.per_page ?? 10),
    } satisfies SponsorshipPagination,
  };
}

export default function SponsorshipPage() {
  const [rows, setRows] = useState<SponsorshipRow[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] =
    useState<SponsorshipPagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;

    async function fetchSponsorships() {
      try {
        setIsLoading(true);
        setError("");

        const response = await getAdminSponsorships({
          page: currentPage,
          limit: perPage,
          search: debouncedSearch,
        });

        if (!active) return;

        const normalized = normalizeSponsorshipsResponse(response);
        setRows(normalized.rows);
        setPagination(normalized.pagination);
      } catch (err) {
        if (!active) return;
        setRows([]);
        setPagination(DEFAULT_PAGINATION);
        setError(
          err instanceof Error ? err.message : "Failed to load sponsorships."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    fetchSponsorships();

    return () => {
      active = false;
    };
  }, [currentPage, perPage, debouncedSearch]);

  const columns = useMemo<AdminTableColumn<SponsorshipRow>[]>(
    () => [
      {
        key: "employerName",
        header: "Employer Name",
        render: (row) => (
          <span className="admin-table-primary">{row.employerName}</span>
        ),
      },
      {
        key: "employerEmail",
        header: "Employer Email",
        render: (row) => <span className="admin-muted">{row.employerEmail}</span>,
      },
      {
        key: "employerPhone",
        header: "Employer Phone",
        render: (row) => <span className="admin-muted">{row.employerPhone}</span>,
      },
      {
        key: "participantName",
        header: "Participant Name",
        render: (row) => (
          <span className="admin-table-primary">{row.participantName}</span>
        ),
      },
      {
        key: "participantEmail",
        header: "Participant Email",
        render: (row) => (
          <span className="admin-muted">{row.participantEmail}</span>
        ),
      },
      {
        key: "participantPhone",
        header: "Participant Phone",
        render: (row) => (
          <span className="admin-muted">{row.participantPhone}</span>
        ),
      },
      {
        key: "cohortOrProgram",
        header: "Cohort / Program",
        render: (row) => (
          <span className="admin-linkish">{row.cohortOrProgram}</span>
        ),
      },
    ],
    []
  );

  const footerText = error
    ? error
    : isLoading
      ? "Loading sponsorships..."
      : rows.length === 0
        ? "No sponsorship records found."
        : `Showing ${rows.length} of ${pagination.totalRecords} sponsorship records`;

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Sponsorship" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro admin-page-intro--leads">
              <div>
                <h2 className="admin-page-title">Sponsorship</h2>
                <p className="admin-page-subtitle">
                  Employer-funded registrations and participant details.
                </p>
              </div>
            </section>

            <section className="admin-panel leads-panel">
              <div className="admin-table-tools !justify-start">
                <label className="admin-search admin-search--wide">
                  <FiSearch size={16} />
                  <input
                    type="text"
                    placeholder="Search by employer, participant, email, or cohort..."
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
              title="Sponsorship"
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
    </div>
  );
}
