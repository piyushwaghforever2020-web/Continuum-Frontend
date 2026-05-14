export type CohortStatus = "Active" | "Full" | "Closed" | "Inactive";

export type CohortParticipant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  payment: "Paid" | "Failed" | "Refunded";
  registration: "Complete" | "Incomplete";
};

export type CohortItem = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  seatsFilled: number;
  seatLimit: number;
  status: CohortStatus;
  sync_status?: string;
  is_active?: boolean;
  refundPolicy: string;
  revenue: number;
  participants: CohortParticipant[];
};

export const cohorts: CohortItem[] = [
  {
    id: "flat-org-leadership",
    name: "Flat Org Leadership",
    description: "Learn to lead in flat organizational structures",
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    price: 2500,
    seatsFilled: 24,
    seatLimit: 30,
    status: "Active",
    refundPolicy: "Full refund up to 7 days before start date",
    revenue: 7500,
    participants: [
      {
        id: 1,
        name: "John Doe",
        email: "john@company.com",
        phone: "+1 555-0101",
        company: "Acme Corp",
        payment: "Paid",
        registration: "Complete",
      },
      {
        id: 2,
        name: "Alex Johnson",
        email: "alex@bigco.com",
        phone: "+1 555-0103",
        company: "BigCo",
        payment: "Failed",
        registration: "Incomplete",
      },
      {
        id: 3,
        name: "Maria Garcia",
        email: "maria@tech.dev",
        phone: "+1 555-0104",
        company: "TechDev",
        payment: "Paid",
        registration: "Complete",
      },
      {
        id: 4,
        name: "Emma Brown",
        email: "emma@corp.com",
        phone: "+1 555-0106",
        company: "CorpInc",
        payment: "Paid",
        registration: "Complete",
      },
    ],
  },
  {
    id: "ai-fluency-for-leaders",
    name: "AI Fluency for Leaders",
    description: "Build decision confidence with practical AI adoption patterns",
    startDate: "2024-04-01",
    endDate: "2024-05-01",
    price: 3000,
    seatsFilled: 25,
    seatLimit: 25,
    status: "Full",
    refundPolicy: "Refund available within 48 hours of purchase",
    revenue: 12000,
    participants: [],
  },
  {
    id: "leading-complex-change",
    name: "Leading Complex Change",
    description: "Navigate transformation in high-stakes, ambiguous environments",
    startDate: "2024-05-10",
    endDate: "2024-06-10",
    price: 2800,
    seatsFilled: 8,
    seatLimit: 20,
    status: "Active",
    refundPolicy: "Partial refund up to 5 days before start date",
    revenue: 5600,
    participants: [],
  },
  {
    id: "resilient-teams",
    name: "Resilient Teams",
    description: "Strengthen team trust, endurance, and collaboration during change",
    startDate: "2024-06-01",
    endDate: "2024-07-01",
    price: 2200,
    seatsFilled: 0,
    seatLimit: 30,
    status: "Closed",
    refundPolicy: "No refunds once the cohort closes",
    revenue: 0,
    participants: [],
  },
];

export function getCohortById(id: string) {
  return cohorts.find((cohort) => cohort.id === id);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
