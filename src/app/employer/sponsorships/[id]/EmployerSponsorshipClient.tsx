"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBell,
  FiBriefcase,
  FiChevronDown,
  FiGrid,
  FiMenu,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { getEmployerSponsorshipById } from "@/services/admin.services";
import styles from "./employerSponsorship.module.css";

type SeatAssignment = {
  name: string;
  email: string;
  status: string;
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

function normalizeSponsorshipResponse(payload: unknown): SponsorshipDashboard {
  const raw = asRecord(payload);
  const data = asRecord(raw.data ?? raw.sponsorship ?? raw);
  const employer = asRecord(data.employer ?? data.company_details);
  const cohort = asRecord(data.cohort);
  const program = asRecord(data.program);

  const totalSeats = asNumber(data.total_seats ?? data.totalSeats);
  const usedSeats = asNumber(data.used_seats ?? data.usedSeats);
  const assignedSeats = asNumber(
    data.assigned_seats ?? data.assignedSeats,
    usedSeats,
  );
  const activeSeats = asNumber(
    data.active_seats ?? data.activeSeats,
    usedSeats,
  );
  const availableSeats = Math.max(
    0,
    asNumber(
      data.available_seats ?? data.availableSeats,
      totalSeats - usedSeats,
    ),
  );
  const utilizationPercent =
    totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;
  const assignments = asArray(
    data.assignments ?? data.seats ?? data.participants ?? data.members,
  ).map(normalizeSeatAssignment);

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
      data.total_paid_users ?? data.totalPaidUsers,
      data.status === "paid" ? totalSeats : 0,
    ),
    utilizationPercent,
    recentSeats: assignments.slice(0, 3),
  };
}

function EmployerSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        continuum
        <span>transformation</span>
      </div>

      <nav className={styles.nav} aria-label="Employer navigation">
        <a className={`${styles.navItem} ${styles.navItemActive}`} href="#">
          <FiGrid size={15} />
          Employer
        </a>
        <a className={styles.navItem} href="#">
          <FiUsers size={15} />
          Seat Management
        </a>
      </nav>
    </aside>
  );
}

function EmployerHeader() {
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button type="button" className="admin-icon-button" aria-label="Toggle menu">
          <FiMenu size={16} />
        </button>
      </div>

      <div className="admin-header__right">
        <button
          type="button"
          className="admin-icon-button admin-icon-button--plain"
          aria-label="Notifications"
        >
          <FiBell size={16} />
          <span className="admin-notification-dot" />
        </button>
        <button type="button" className="admin-profile">
          <span className="admin-profile__avatar">A</span>
          <span className="admin-profile__name">Admin</span>
          <FiChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}

function SeatActivationChart({
  totalSeats,
  usedSeats,
}: {
  totalSeats: number;
  usedSeats: number;
}) {
  const maxSeats = Math.max(totalSeats, usedSeats, 24);
  const activeEnd = Math.min(204, 218 - (usedSeats / maxSeats) * 176);
  const totalEnd = Math.min(204, 218 - (totalSeats / maxSeats) * 176);

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

        <path
          d={`M52 186 L198 160 L348 132 L496 104 L644 76 L792 ${totalEnd} L792 218 L52 218 Z`}
          fill="url(#availableFill)"
        />
        <path
          d={`M52 204 L198 188 L348 172 L496 154 L644 122 L792 ${activeEnd} L792 218 L52 218 Z`}
          fill="url(#activeFill)"
        />
        <polyline
          points={`52,186 198,160 348,132 496,104 644,76 792,${totalEnd}`}
          fill="none"
          stroke="#c99b5f"
          strokeWidth="2"
        />
        <polyline
          points={`52,204 198,188 348,172 496,154 644,122 792,${activeEnd}`}
          fill="none"
          stroke="#5a1729"
          strokeWidth="2"
        />

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
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, index) => (
          <text
            key={label}
            x={52 + index * 148}
            y="246"
            textAnchor="middle"
            className={styles.axisLabel}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function EmployerSponsorshipClient({
  sponsorshipId,
}: {
  sponsorshipId: string;
}) {
  const [dashboard, setDashboard] = useState<SponsorshipDashboard>(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [sponsorshipId]);

  const stats = useMemo(
    () => [
      {
        label: "Total Paid Users",
        value: String(dashboard.totalPaidUsers),
        icon: <FiBriefcase size={24} />,
      },
      {
        label: "Available Seats",
        value: String(dashboard.availableSeats),
        icon: <FiUserPlus size={24} />,
      },
      {
        label: "Assigned Seats",
        value: String(dashboard.assignedSeats),
        icon: <FiUserCheck size={24} />,
      },
      {
        label: "Active Seats",
        value: String(dashboard.activeSeats),
        icon: <FiUsers size={24} />,
      },
    ],
    [dashboard],
  );

  const recentSeats =
    dashboard.recentSeats.length > 0
      ? dashboard.recentSeats
      : [
          {
            name: "No seats assigned yet",
            email: "Invite participants from seat management",
            status: "Available",
          },
        ];

  return (
    <div className={`admin-page ${styles.shell}`}>
      <EmployerSidebar />

      <div className="admin-main">
        <EmployerHeader />

        <main className="admin-content">
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
              <button type="button" className={styles.heroButton}>
                Seat Management
                <FiArrowRight size={15} />
              </button>
            </section>

            <section className={styles.statsGrid}>
              {stats.map((item) => (
                <article key={item.label} className={`admin-card ${styles.statCard}`}>
                  <div className={styles.statTop}>
                    <span className={styles.statIcon}>{item.icon}</span>
                    <p className={styles.statLabel}>{item.label}</p>
                  </div>
                  <p className={styles.statValue}>{isLoading ? "-" : item.value}</p>
                </article>
              ))}
            </section>

            <section className={styles.chartsGrid}>
              <article className="admin-panel">
                <h3 className={styles.panelTitle}>Seat Activation Trend</h3>
                <SeatActivationChart
                  totalSeats={dashboard.totalSeats}
                  usedSeats={dashboard.usedSeats}
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
                  >
                    <div className={styles.donutInner}>
                      <strong className={styles.donutValue}>
                        {dashboard.utilizationPercent}%
                      </strong>
                      <p className={styles.donutText}>
                        {dashboard.usedSeats} of {dashboard.totalSeats} seats
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className={styles.lowerGrid}>
              <article className="admin-panel">
                <h3 className={styles.panelTitle}>Recent Seat Assignments</h3>
                <div className={styles.seatList}>
                  {recentSeats.map((seat) => (
                    <div className={styles.seatRow} key={`${seat.email}-${seat.status}`}>
                      <div>
                        <p className={styles.seatName}>{seat.name}</p>
                        <p className={styles.seatMeta}>{seat.email}</p>
                      </div>
                      <span className={styles.pill}>{seat.status}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <h3 className={styles.panelTitle}>Sponsorship Summary</h3>
                <div className={styles.seatList}>
                  <div className={styles.seatRow}>
                    <div>
                      <p className={styles.seatName}>Cohort</p>
                      <p className={styles.seatMeta}>{dashboard.cohortName}</p>
                    </div>
                  </div>
                  <div className={styles.seatRow}>
                    <div>
                      <p className={styles.seatName}>Program</p>
                      <p className={styles.seatMeta}>{dashboard.programName}</p>
                    </div>
                  </div>
                  <div className={styles.seatRow}>
                    <div>
                      <p className={styles.seatName}>Invoice Status</p>
                      <p className={styles.seatMeta}>
                        {formatStatus(dashboard.status)}
                      </p>
                    </div>
                    <span className={styles.pill}>{formatStatus(dashboard.status)}</span>
                  </div>
                  <div className={styles.seatRow}>
                    <div>
                      <p className={styles.seatName}>Seat Pool</p>
                      <p className={styles.seatMeta}>
                        {dashboard.totalSeats} total seats purchased
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
