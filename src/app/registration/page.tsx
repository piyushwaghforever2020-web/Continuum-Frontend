"use client";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "../enterprise/enterprise.module.css";
import registrationstyles from "./registration.module.css";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import * as Accordion from "@radix-ui/react-accordion";
import { RxPeople } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import Footer from "@/components/Footer";
import EnrollmentModal from "@/components/EnrollmentModal";
import axios from "axios";

type Cohort = {
  id: number;
  name: string;
  seat_limit?: number | string;
  seats_remaining: number;
  price: number | string;
  display_price?: string;
  description: string;
  duration_weeks: string | number;
  start_date: string;
  end_date: string;
  duration_format: string;
  duration?: string;
  is_active: boolean;
  status?: string;
  has_multi_program?: boolean | number | string;
  hasMultiProgram?: boolean | number | string;
  live_sessions_text?: string;
  workshops_text?: string;
  cohort_size_text?: string;
  scarcity_text?: string;
  investment_tiers?: InvestmentTier[];
  investments?: InvestmentTier[];
  leave_with?: TextListItem[];
  what_you_leave_with?: TextListItem[];
  programs?: ProgramItem[];
  mostSelected?: boolean;
  is_enrollment_open?: boolean;
};

type ProgramItem = {
  id?: number | string;
  program_id?: number | string;
  programId?: number | string;
  name?: string;
  program_name?: string;
  programName?: string;
  title?: string;
  description?: string;
  program_description?: string;
  programDescription?: string;
  seat_limit?: number | string;
  seatLimit?: number | string;
  allocated_seats?: number | string;
  seats_filled?: number | string;
  is_full?: boolean;
};

type InvestmentTier = {
  tier?: string;
  title_name?: string;
  titleName?: string;
  title?: string;
  name?: string;
  price?: string | number;
  best_for?: string;
  what_you_get?: string;
  whatYouGet?: string;
  description?: string;
};

type TextListItem =
  | string
  | {
    value?: string;
    text?: string;
    title?: string;
    description?: string;
  };

const LeardsWordsCards = [
  {
    image: "/enterprise/quotes.svg",
    title: "— Director → VP, Fortune 100 Financial Services",
    text: '"I walked in as a Director carrying three transformation portfolios and zero executive airtime. I left with a VP offer and a board-ready narrative I wrote myself in the Lab."',
  },
  {
    image: "/enterprise/quotes.svg",
    title: "— Head of Digital Transformation,Global Healthcare",
    text: `"The AI automation lab didn't just save me 10 hours a week—it completely changed how my leadership team sees my role. I'm now the person they come to for enterprise AI strategy."`,
  },
  {
    image: "/enterprise/quotes.svg",
    title: "— Senior Director, Enterprise Technology",
    text: `"For the first time, I didn't have to explain what it feels like to be the only one in the room. The Lab gave me strategy AND community. That combination is rare."`,
  },
]

export default function RegistrationPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [support, setSupport] = useState("")
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<number | string | null>(null);
  const [selectedProgramName, setSelectedProgramName] = useState("");
  const [enrollmentModal, setEnrollmentModal] = useState(false);
  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatDateRange = (start?: string, end?: string) => {
    if (!start || !end) return "--";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameYear = startDate.getFullYear() === endDate.getFullYear();

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(sameYear ? {} : { year: "numeric" }),
    });

    const endFormatted = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startFormatted} – ${endFormatted}`;
  };
  useEffect(() => {

    const getCohorts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`);


        setCohorts(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching cohorts", error);
      }
    };
    getCohorts()
  }, [])

  const normalizeBoolean = (value: unknown, fallback = false) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes"].includes(normalized)) return true;
      if (["false", "0", "no"].includes(normalized)) return false;
    }

    return fallback;
  };

  const getTextValue = (item: TextListItem) => {
    if (typeof item === "string") return item;
    return item.value ?? item.text ?? item.description ?? item.title ?? "";
  };

  const getProgramName = (program: ProgramItem) =>
    String(
      program.program_name ??
      program.name ??
      program.programName ??
      program.title ??
      "Program"
    );

  const getInvestmentTitle = (tier: InvestmentTier) =>
    tier.tier ?? tier.title_name ?? tier.titleName ?? tier.title ?? tier.name ?? "-";

  const getInvestmentBestFor = (tier: InvestmentTier) =>
    tier.best_for ??
    tier.what_you_get ??
    tier.whatYouGet ??
    tier.description ??
    "";

  const hasInvestmentBestFor = (tiers: InvestmentTier[]) =>
    tiers.some((tier) =>
      Boolean(
        tier.best_for ??
        tier.what_you_get ??
        tier.whatYouGet ??
        tier.description
      )
    );

  const getCohortPrice = (cohort: Cohort) => {
    const value = cohort.display_price ?? cohort.price;
    if (value === undefined || value === null || value === "") return "$ 0 USD";
    const text = String(value).trim();
    if (text.includes("$") || text.toUpperCase().includes("USD")) return text;
    return `$ ${text} USD`;
  };

  const getDurationText = (cohort: Cohort) => {
    if (cohort.duration) return cohort.duration;

    if (cohort.duration_weeks && cohort.duration_format) {
      return `${cohort.duration_weeks} weeks | ${cohort.duration_format}`;
    }

    return cohort.duration_format || "--";
  };

  const getLeaveWith = (cohort: Cohort) =>
    (cohort.what_you_leave_with ?? cohort.leave_with ?? [])
      .map(getTextValue)
      .filter(Boolean);

  const getInvestmentTiers = (cohort: Cohort) =>
    cohort.investment_tiers ?? cohort.investments ?? [];

  const getPrograms = (cohort: Cohort) => cohort.programs ?? [];

  const hasMultiProgram = (cohort: Cohort) =>
    normalizeBoolean(cohort.has_multi_program ?? cohort.hasMultiProgram, false);

  const formatLeaderCount = (value: unknown) => {
    if (value === undefined || value === null || value === "") return "";
    const text = String(value).trim();
    if (!text) return "";
    if (/leader/i.test(text)) return text;

    return `${text} ${text === "1" ? "leader" : "leaders"}`;
  };

  const getProgramSeatLimit = (program: ProgramItem) =>
    program.seat_limit ?? program.seatLimit ?? program.allocated_seats;

  const getSeatLimitText = (cohort: Cohort, programs: ProgramItem[]) => {
    if (programs.length > 0) {
      const programSeatLimits = programs
        .map(getProgramSeatLimit)
        .filter((value) => value !== undefined && value !== null && value !== "");
      const uniqueProgramSeatLimits = Array.from(
        new Set(programSeatLimits.map((value) => String(value).trim()))
      )
        .filter(Boolean);

      if (uniqueProgramSeatLimits.length === 1) {
        return `${formatLeaderCount(uniqueProgramSeatLimits[0])} per program`;
      }

      if (uniqueProgramSeatLimits.length > 1) {
        const numericLimits = uniqueProgramSeatLimits
          .map((value) => Number(value))
          .filter((value) => Number.isFinite(value));

        if (numericLimits.length === uniqueProgramSeatLimits.length) {
          return `${Math.min(...numericLimits)}-${Math.max(...numericLimits)} leaders per program`;
        }

        return `${uniqueProgramSeatLimits.map(formatLeaderCount).join(" / ")} per program`;
      }
    }

    return formatLeaderCount(cohort.seat_limit) || cohort.cohort_size_text || "";
  };

  const isEnrollmentOpen = (cohort: Cohort) =>
    normalizeBoolean(cohort.is_enrollment_open, cohort.status === "active");

  const getProgramDescription = (program: ProgramItem) => program.program_description 

  
  const getProgramButtonLabel = (program: ProgramItem) => {
    const programName = getProgramName(program);
    const match = programName.match(/program\s*([A-Za-z0-9]+)/i);

    return match ? `Apply for program - ${match[1].toUpperCase()}` : "Apply";
  };

  const activeCohorts = cohorts.filter(
    (cohort) => cohort?.is_active
  );

  const openEnrollmentModal = (cohort: Cohort, label: string, program?: ProgramItem) => {
    setSupport(label);
    setSelectedCohortId(cohort.id);
    setSelectedProgramId(
      program?.program_id ?? program?.programId ?? program?.id ?? null
    );
    setSelectedProgramName(program ? getProgramName(program) : "");
    setEnrollmentModal(true);
  };

 const faqData = [
  {
    Q: "I use AI daily. Is AI Automation too basic for me?",
    A: "This Lab is designed for leaders who are already prompting confidently and ready to move into workflow design, automation architecture, and enterprise governance — not beginner AI orientation.",
  },
  {
    Q: "How much time will this actually take each week?",
    A: "Plan for 90 minutes of live Lab, 60 minutes of optional office hours, and 60–90 minutes of independent assignment work. Total: roughly 3–4 hours per week.",
  },
  {
    Q: "Can my organization send multiple leaders at different price points?",
    A: "Yes — and if you're sending 4 or more leaders, ask about our block-seat or private cohort options on the For Organizations page.",
  },
  {
    Q: "Is there a payment plan?",
    A: "Org-sponsored seats can be invoiced. Self-pay participants may request a 2-installment plan at enrollment.",
  },
  {
    Q: "What if I miss a live Lab session?",
    A: "All Labs are recorded. You must complete all recordings and submit all assignments to earn your certificate of completion.",
  },
];
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section
          className={styles.hero}
          style={{ backgroundImage: "url(/enterprise/pricingherobg.png)" }}
        >
          <div className="container-width w-full">
            <div className={`${registrationstyles.heroContent} max-w-[470px] `}>
              <h1 className={styles.heroTitle}>
                Pick Your Cohort. Show Up Ready to Lead.
              </h1>
              <div className="flex flex-col gap-6">
                <p className={styles.heroText}>
                  Five weeks to twelve weeks of live, identity-centered labs for
                  WOC leaders who are done waiting for permission to set the AI
                  and transformation agenda. All Labs: 90-minute live sessions.
                  Office Hours: 60 minutes. Cohorts capped at 8–14 leaders.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={`${registrationstyles.lightGreySection} p-9 `}>
          <div className="container-width w-full">
            <div className="grid grid-cols-2 gap-12 md:gap-[17rem] justify-between  w-full">
              <div>
                <h2 className={`${registrationstyles.heading_sm} !font-normal
`}>
                  7–10+ hours per week reclaimed from one well-designed AI
                  automation workflow.
                </h2>
                <p className={`${registrationstyles.description_sm} mt-1`}>
                  Based on findings from LSE, Forbes, and Adecco Group research
                  on AI productivity
                </p>
              </div>

              <p className={registrationstyles.description_sm}>
                Cohort-based programs command a 30–40% price premium over
                self- paced equivalents — because live interaction and
                accountability produce outcomes that video content cannot
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.lightorangesection} ${styles.sectionsmall}`}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-6  items-center text-center">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className={styles.sectionsmallheading}>Programs</p>
                  <p className={styles.sectionheading}>Choose Your Lab</p>
                </div>

                <p
                  className={`${styles.sectionDescription} max-w-[500px] w-full`}
                >
                  Each program is cohort-based, identity-centered, and built for
                  senior leaders who are already doing the work.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-10 mt-12">
              {activeCohorts.map((cohort) => {
                const isMultiProgram = hasMultiProgram(cohort);
                const programs = getPrograms(cohort);
                const leaveWith = getLeaveWith(cohort);
                const investmentTiers = getInvestmentTiers(cohort);
                const showInvestmentBestFor = hasInvestmentBestFor(investmentTiers);
                const canEnroll = isEnrollmentOpen(cohort);
                const seatLimitText = getSeatLimitText(cohort, programs);

                return (
                  <div
                    className={
                      cohort.mostSelected
                        ? registrationstyles.cardwhitehighlighted
                        : registrationstyles.cardwhite
                    }
                    key={cohort.id}
                  >
                    <div className="flex flex-col gap-6">
                      <div className={`${registrationstyles.carddescriptiongrid}`}>
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-5">
                            <p className={` mt-2 md:mt-0 ${registrationstyles.heading_sm}`}>
                              {cohort.name}
                            </p>
                            <p className={styles.sectionDescriptionPricing}>
                              {cohort.description}
                            </p>
                          </div>

                          {isMultiProgram ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex gap-2 items-center">
                                <Image
                                  src="/enterprise/durationpurple.svg"
                                  alt="clock"
                                  width={28}
                                  height={28}
                                />
                                <div className="flex flex-col">
                                  <p className={registrationstyles.carddetaikHeading}>
                                    Duration
                                  </p>
                                  <p className={registrationstyles.carddetaiksubHeading}>
                                    {getDurationText(cohort)}
                                  </p>
                                </div>
                              </div>

                            

                              {seatLimitText ? (
                                <div className="flex gap-2 items-center">
                                  <Image
                                    src="/enterprise/peoplespurple.svg"
                                    alt="clock"
                                    width={28}
                                    height={28}
                                  />
                                  <div className="flex flex-col">
                                    <p className={registrationstyles.carddetaikHeading}>
                                      Cohort Size
                                    </p>
                                    <p className={registrationstyles.carddetaiksubHeading}>
                                      {seatLimitText}
                                    </p>
                                  </div>
                                </div>
                              ) : null}

                                {programs.map((program) => (
                                <div
                                  className="flex gap-2 items-center"
                                  key={String(program.program_id ?? program.id ?? getProgramName(program))}
                                >
                                  
                                  <Image
                                    src="/enterprise/sessionpurple.svg"
                                    alt="clock"
                                    width={28}
                                    height={28}
                                  />
                                  <div className="flex flex-col">
                                    <p className={registrationstyles.carddetaikHeading}>
                                      {getProgramName(program)}
                                    </p>
                                      <p className={registrationstyles.carddetaiksubHeading}>
                                        
                                          {program?.program_description}                                        
                                      </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={`flex items-center  ${registrationstyles.detailRow}`}>
                              <div className="flex gap-2 items-center">
                                <Image
                                  src="/enterprise/durationpurple.svg"
                                  alt="clock"
                                  width={28}
                                  height={28}
                                />
                                <div className="flex flex-col">
                                  <p className={registrationstyles.carddetaikHeading}>
                                    Duration
                                  </p>
                                  <p className={registrationstyles.carddetaiksubHeading}>
                                    {getDurationText(cohort)}
                                  </p>
                                </div>
                              </div>

                              {cohort.live_sessions_text ? (
                                <div className="flex gap-2 items-center">
                                  <Image
                                    src="/enterprise/sessionpurple.svg"
                                    alt="clock"
                                    width={28}
                                    height={28}
                                  />
                                  <div className="flex flex-col">
                                    <p className={registrationstyles.carddetaikHeading}>
                                      Live Sessions
                                    </p>
                                    <p className={registrationstyles.carddetaiksubHeading}>
                                      {cohort.live_sessions_text}
                                    </p>
                                  </div>
                                </div>
                              ) : null}

                              {cohort.workshops_text ? (
                                <div className="flex gap-2 items-center">
                                  <Image
                                    src="/enterprise/workshoppurple.svg"
                                    alt="clock"
                                    width={28}
                                    height={28}
                                  />
                                  <div className="flex flex-col">
                                    <p className={registrationstyles.carddetaikHeading}>
                                      Workshops
                                    </p>
                                    <p className={registrationstyles.carddetaiksubHeading}>
                                      {cohort.workshops_text}
                                    </p>
                                  </div>
                                </div>
                              ) : null}

                              {seatLimitText ? (
                                <div className="flex gap-2 items-center">
                                  <Image
                                    src="/enterprise/peoplespurple.svg"
                                    alt="clock"
                                    width={28}
                                    height={28}
                                  />
                                  <div className="flex flex-col">
                                    <p className={registrationstyles.carddetaikHeading}>
                                      Cohort Size
                                    </p>
                                    <p className={registrationstyles.carddetaiksubHeading}>
                                      {seatLimitText}
                                    </p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}

                          {leaveWith.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              <p className={registrationstyles.listheading}>
                                What you leave with:
                              </p>
                              <ul className={registrationstyles.sectionList}>
                                {leaveWith.map((item) => (
                                  <li
                                    className="flex items-center leading-[15px] gap-3 text-[13px] md:text-[15px] text-nearBlack font-chivo"
                                    key={item}
                                  >
                                    <IoMdCheckmark className="purpleTick min-w-4 min-h-4 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-[2px]" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>

                        <div className={`${registrationstyles.purplecard}`}>
                          {cohort.scarcity_text ? (
                            <p className={registrationstyles.cardDescription}>
                              {cohort.scarcity_text}
                            </p>
                          ) : null}
                          <p className="text-white font-bold font-chivo">
                            {getCohortPrice(cohort)}
                          </p>
                          <p className={registrationstyles.remaingtext}>
                            <RxPeople className={registrationstyles.remaingtexticon} />
                            {cohort.seats_remaining ?? 0} seats remaining
                          </p>

                          {isMultiProgram && programs.length > 0 ? (
                            programs.map((program) => {
                              const programName = getProgramName(program);
                              const disabled = !canEnroll || Boolean(program.is_full);

                              return (
                                <button
                                  className={`${styles.buttonPrimary} ${styles.part} w-full`}
                                  disabled={disabled}
                                  key={String(program.program_id ?? program.id ?? programName)}
                                  onClick={() => openEnrollmentModal(cohort, programName, program)}
                                >
                                  {getProgramButtonLabel(program)}
                                </button>
                              );
                            })
                          ) : (
                            <button
                              className={`${styles.buttonPrimary} ${styles.part} !px-2 w-full`}
                              disabled={!canEnroll}
                              onClick={() => openEnrollmentModal(cohort, cohort.name)}
                            >
                              Apply
                            </button>
                          )}
                        </div>
                      </div>

                      {investmentTiers.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          <p className="table-heading">Investment:</p>
                          <div className="table-wrapper">
                            <table
                              className={`lab-plan-table lab-plan-table--two-column`}
                            >
                              <thead>
                                <tr>
                                  <th>Tier</th>
                                  <th>Price</th>
                                   <th> { showInvestmentBestFor ? "  Best For": ""}</th> 
                                </tr>
                              </thead>
                              <tbody>
                                {investmentTiers.map((tier, index) => (
                                  <tr key={`${getInvestmentTitle(tier)}-${index}`}>
                                    <td data-label="Tier">{getInvestmentTitle(tier)}</td>
                                    <td data-label="Price" className="price">
                                      {tier.price ?? "-"}
                                    </td>
                                   
                                      <td data-label="Best For">
                                        {getInvestmentBestFor(tier)}
                                      </td>
                                    
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {cohort.mostSelected ? (
                      <p className={registrationstyles.goldtag}>
                        <CiStar className={registrationstyles.goldtagicon} />
                        Most Selected
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className={`${styles.sectionsmall} ${styles.darkSection}`}
          id="cohort-1"
        >
          <div className="container-width w-full">
            <div className="  flex flex-col gap-8 items-center ">
              <div className="flex flex-col gap-3 items-center text-center">
                <p className={styles.sectionsmallheading}>Policy</p>
                <p
                  className={`${styles.sectionheading} ${styles.darkSectionsectionheading}`}
                >
                  Refund & Deferral Policy
                </p>
              </div>

              <p
                className={`${styles.sectiondescription_sm} w-full text-center`} style={{ color: "#ffffff" }}
              >
                We curate every cohort carefully — which is why we ask the same of you. Here is how enrollment works if plans change.
              </p>

              <div className="table-wrapper">
                <table className="lab-plan-table refundtable">
                  <thead>
                    <tr>
                      <th>Situation</th>
                      <th>Policy</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td data-label="Tier">Cancel 21+ days before start</td>
                      <td>
                        Full refund
                      </td>
                    </tr>

                    <tr>
                      <td data-label="Tier">Cancel 7–20 days before start</td>
                      <td >
                        50% refund
                      </td>
                    </tr>

                    <tr>
                      <td data-label="Tier">Cancel within 7 days of start</td>
                      <td >
                        No refund; one-time deferral to future cohort
                      </td>

                    </tr>
                    <tr>
                      <td data-label="Tier">Defer (Week 1 or earlier)</td>
                      <td >
                        One-time transfer to future cohort of same program
                      </td>

                    </tr>

                    <tr>
                      <td data-label="Tier">Org-sponsored seat transfer</td>
                      <td >
                        Transfer to another leader at same org, up to end of Week 1
                      </td>

                    </tr>
                    <tr>
                      <td data-label="Tier">Continuum cancels cohort</td>
                      <td >
                        Full refund or free transfer to next cohort date
                      </td>

                    </tr>


                  </tbody>
                </table>
              </div>



              <p
                className={`${styles.sectiondescription_sm}  mt-5 w-full max-w-[765px]  text-center`} style={{ color: "#ffffff" }}
              >
                Self-pay participants on scholarship: please contact us directly for flexibility options
              </p>


            </div>
          </div>
        </section>








        <section className={`${styles.sectionsmall} ${styles.womenSection}`}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-12  items-center">
              <div className="flex flex-col gap-2 items-center">
                <p className={styles.sectionsmallheading}>FAQs</p>
                <p className={styles.sectionheading}>
                  Enrollment FAQ
                </p>
              </div>

              <Accordion.Root
                type="single"
                collapsible
                className="grid md:grid-cols-2 gap-5 w-full"
              >
               {faqData.map((faq, index) => (
    <div key={index}>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item
          value={`item-${index}`}
          className="bg-white rounded-3xl shadow-[0_2px_10px_0px_#00000014] overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center justify-between px-6 py-5 text-left">
              <span className={styles.faqQuestion}>
                {faq.Q}
              </span>

              <FaChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="px-6 pb-5 text-sm text-gray-600 leading-relaxed font-chivo">
            {faq.A}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ))}
              </Accordion.Root>
            </div>
          </div>
        </section>



        <section className={`${styles.sectionsmall} `}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-5 justify-center items-center text-center">

                <p className={styles.sectionheading}>
                  What Leaders Are Saying
                </p>
                <p
                  className={`${styles.sectionDescription} max-w-[600px] w-full`}
                >
                  Real outcomes from leaders who showed up ready to do the work.
                </p>
              </div>
              <div className={`${styles.mt60} block space-y-6 md:space-y-0 md:flex justify-center items-center gap-6 w-full`}>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                  {LeardsWordsCards.map((card) => (
                    <div
                      className={`${styles.card} flex flex-col gap-7 align-start justify-between max-w-full md:max-w-[320px] `}
                      key={card.title}
                    >
                      <div className="flex flex-col gap-5">
                        <Image
                          src={card.image}
                          alt="cardheading"
                          width={32}
                          height={32}
                        />

                        <p className={registrationstyles.testonomaildescription_sm}>{card.text}</p>
                      </div>
                      <div className={`${registrationstyles.description_sm} mb-2`}>{card.title}</div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        <section
          className={styles.ctaBanner}
          style={{
            backgroundImage: "url(/enterprise/pricinfCTAbanner.png)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex flex-col gap-11  items-center max-w-[100%] px-5">
            <div className="flex flex-col gap-4 items-center max-w-[100%]">
              <h2
                className={` ${styles.sectionheading} font-chivo max-w-[755px] w-full text-center !font-normal font-Playfair`}
                style={{ color: "white" }}
              >
                Ready to invest in your WOC leaders?

              </h2>
              <p
                className={` ${styles.sectionDescription} font-normal max-w-[710px] w-full text-center `}
                style={{ color: "#FFFFFFB2" }}
              >
                Tell us how many leaders you'd like to sponsor and which program interests you. We'll reach out within 48 hours to schedule a 20-minute alignment call.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 max-w-[100%]">
              <a className={styles.buttonPrimary} href="/Sponsorship_Request_Template.pdf" download>
                Sponsor a Leader or Cohort
              </a>
              <p
                className={`max-w-[100%] ${styles.sectionDescription} !font-normal !text-[13px] !sm:text-[18px]  w-full text-center `}
                style={{ color: "#FFFFFFB2" }}
              >
                For custom enterprise cohorts (15+ leaders) or multi-program packages, email <br /> <a
                  href="mailto:enterprise@continuumtransformation.com"
                  className="underline hover:text-white "
                >
                  enterprise@continuumtransformation.com
                </a>{" "} directly.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {enrollmentModal && (
        <EnrollmentModal
          support={support}
          isOpen={enrollmentModal}
          onClose={() => setEnrollmentModal(false)}
          prefillData={{
            cohortId: selectedCohortId,
            programId: selectedProgramId,
            program: selectedProgramName,
          }}
        />
      )}


    </div>
  );
}
