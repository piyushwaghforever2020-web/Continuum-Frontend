"use client";

import { useMemo } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import AdminTable, {
  AdminStatusBadge,
  AdminTableColumn,
} from "@/components/admin/AdminTable";
import { formatCurrency } from "@/components/admin/cohortData";
import {
  FiBriefcase,
  FiCheckCircle,
  FiEye,
  FiMail,
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

type SponsorRow = {
  id: number;
  company: string;
  contact: string;
  email: string;
  cohort: string;
  seats: number;
  contribution: number;
  status: "Active" | "Pending" | "Closed";
};

const sponsors: SponsorRow[] = [
  {
    id: 1,
    company: "Acme Corp",
    contact: "Olivia Martin",
    email: "olivia@acme.com",
    cohort: "Flat Org Leadership",
    seats: 6,
    contribution: 15000,
    status: "Active",
  },
  {
    id: 2,
    company: "StartupIO",
    contact: "Jane Smith",
    email: "jane@startup.io",
    cohort: "AI Fluency for Leaders",
    seats: 4,
    contribution: 12000,
    status: "Active",
  },
  {
    id: 3,
    company: "BigCo",
    contact: "Alex Johnson",
    email: "alex@bigco.com",
    cohort: "Flat Org Leadership",
    seats: 3,
    contribution: 7500,
    status: "Pending",
  },
  {
    id: 4,
    company: "Enterprise",
    contact: "Li Wei",
    email: "li@enterprise.cn",
    cohort: "Leading Complex Change",
    seats: 5,
    contribution: 14000,
    status: "Active",
  },
  {
    id: 5,
    company: "GlobalIO",
    contact: "Carlos Ruiz",
    email: "carlos@global.io",
    cohort: "Leading Complex Change",
    seats: 2,
    contribution: 5600,
    status: "Closed",
  },
];

function getSponsorTone(status: SponsorRow["status"]) {
  if (status === "Active") return "success";
  if (status === "Pending") return "warning";
  return "danger";
}

function SponsorshipFilters() {
  return (
    <section className="admin-panel admin-filter-bar">
      <label className="admin-search admin-search--wide">
        <FiSearch size={16} />
        <input type="text" placeholder="Search by company or contact..." />
      </label>

      <div className="admin-filter-bar__actions">
        <button type="button" className="admin-table-button admin-table-button--ghost">
          <span>All Status</span>
        </button>
        <button type="button" className="admin-table-button admin-table-button--ghost">
          <span>All Cohorts</span>
        </button>
      </div>
    </section>
  );
}

export default function SponsorshipPage() {
  const stats = [
    {
      title: "Active Partners",
      value: "3",
      icon: <FiBriefcase size={20} />,
    },
    {
      title: "Sponsored Seats",
      value: "20",
      icon: <FiUsers size={20} />,
    },
    {
      title: "Committed Revenue",
      value: formatCurrency(54100),
      icon: <FiTrendingUp size={20} />,
    },
    {
      title: "Pending Approvals",
      value: "1",
      icon: <FiCheckCircle size={20} />,
    },
  ];

  const columns = useMemo<AdminTableColumn<SponsorRow>[]>(
    () => [
      {
        key: "company",
        header: "Company",
        render: (row) => <span className="admin-table-primary">{row.company}</span>,
      },
      {
        key: "contact",
        header: "Contact",
        render: (row) => row.contact,
      },
      {
        key: "email",
        header: "Email",
        render: (row) => <span className="admin-muted">{row.email}</span>,
      },
      {
        key: "cohort",
        header: "Cohort",
        render: (row) => <span className="admin-linkish">{row.cohort}</span>,
      },
      {
        key: "seats",
        header: "Seats",
        render: (row) => row.seats,
      },
      {
        key: "contribution",
        header: "Contribution",
        render: (row) => formatCurrency(row.contribution),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <AdminStatusBadge tone={getSponsorTone(row.status)}>
            {row.status}
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
              aria-label={`View ${row.company}`}
            >
              <FiEye size={14} />
            </button>
            <button
              type="button"
              className="admin-row-actions__button"
              aria-label={`Email ${row.company}`}
            >
              <FiMail size={14} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="admin-page">
      <Sidebar />

      <div className="admin-main">
        <AdminHeader title="Sponsorship / Employer" eyebrow="Admin Panel" />

        <main className="admin-content">
          <div className="admin-dashboard">
            <section className="admin-page-intro">
              <div>
                <h2 className="admin-page-title">Sponsorship / Employer</h2>
                <p className="admin-page-subtitle">
                  Track partner commitments, sponsored seats, and employer-backed cohorts
                </p>
              </div>

              <button type="button" className="admin-table-button admin-table-button--primary">
                <FiPlus size={14} />
                <span>Add Partner</span>
              </button>
            </section>

            <section className="admin-grid admin-grid--stats">
              {stats.map((item) => (
                <article key={item.title} className="admin-card admin-stat-card">
                  <div className="admin-card-icon">{item.icon}</div>
                  <div className="admin-card-copy">
                    <p className="admin-card-title">{item.title}</p>
                    <p className="admin-card-data">{item.value}</p>
                  </div>
                </article>
              ))}
            </section>

            <SponsorshipFilters />

            <AdminTable
              title="Employer Sponsors"
              columns={columns}
              rows={sponsors}
              showToolbar={false}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
