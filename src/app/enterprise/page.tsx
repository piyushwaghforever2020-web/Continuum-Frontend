"use client"

import Image from "next/image";
import Header from "@/components/Header";
import styles from "./enterprise.module.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState } from "react";
import EnrollmentModal from "@/components/EnrollmentModal";
import CohortCalendarDownloadButton from "@/components/CohortCalendarDownloadButton";

export default function EnterprisePage() {
  const [enrollmentModal, setEnrollmentModal] = useState(false);
  const [support, setSupport] = useState("")
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section
          className={`${styles.hero}  relative overflow-hidden`}
        >

            <div className="absolute inset-0 block md:hidden">
    <Image
      src="/images/heroSectionmobile.webp"
      alt="Hero Banner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/images/heroSection.webp"
      alt="Hero Banner"
      fill
      // priority
      className="object-cover object-center"
    />
  </div>

          <div className="relative z-10  container-width w-full">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                De-risk the transformations your career depends on.
              </h1>
              <div className="flex flex-col gap-6">
                <p className={styles.heroText}>
                  <strong> Continuum Transformation </strong> partners with
                  CMOs, CDOs, and enterprise leaders to turn messy, high-stakes
                  change into measurable results--without Big 4 bloat.
                </p>
                <div className="flex flex-col sm:flex-row align-center gap-2">
                  <Link className={styles.buttonPrimary} href="/contact">
                    Schedule a transformation consult
                  </Link>
                  <a href="/Continuum_Transformation_One-Pager.pdf"
                    download
                    className={styles.buttonSecondaryOutline}>
                    <MdOutlineFileDownload style={{ fontSize: "1.25rem" }} />{" "}
                    Download overview (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container-width w-full">
            <div className="grid grid-cols-2 gap-6 justify-between ">
              <div className="flex flex-col gap-6  items-start">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <p className={styles.sectionsmallheading}>
                      Who the transformation imperative serves
                    </p>
                    <p className={styles.sectionheading}>
                      Built For Enterprise Marketing, Digital, And
                      Transformation Leaders
                    </p>
                  </div>
                  <p className={styles.sectionDescription}>
                    You are responsible for making big bets land: Martech
                    overhauls, AI-enabled operating models, new customer
                    journeys, and cross-functional change that touches every
                    line of business. You need a partner who understands
                    enterprise complexity, executive politics, and the pressure
                    of having your reputation tied to every milestone.
                  </p>
                </div>

                <p className={styles.listheading}>We work with… </p>
                <ul className={styles.sectionList}>
                  <li className="flex items-start gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/people_light.svg"
                      alt="people ico"
                      width={32}
                      height={32}
                    />{" "}
                    CMOs, CDOs, and VPs of Growth leading enterprise‑wide
                    initiatives.
                  </li>
                  <li className="flex items-start gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/workingWay.svg"
                      alt="people ico"
                      width={32}
                      height={32}
                    />{" "}
                    Heads of Transformation, Strategy, Operations, and Data/AI
                    navigating multi‑stakeholder change.
                  </li>
                  <li className="flex items-start gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/idea.svg"
                      alt="people ico"
                      width={32}
                      height={32}
                    />{" "}
                    Senior leaders in flat or flattening orgs who must create
                    power without layers.
                  </li>
                </ul>

                <Link className={styles.btnblackOutline} href="/contact">
                  Talk to us about your initiative{" "}
                  <FaArrowRightLong style={{ fontSize: "1rem" }} />
                </Link>
              </div>

              <Image
                className=" justify-self-center lg:justify-self-end "
                src="/enterprise/enterprise-group.webp"
                alt="Enterprise leaders in a meeting"
                width={644}
                height={518}
              />
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.frameWorkSection}`}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-5 justify-center items-center text-center">
                <p className={styles.sectionsmallheading}>
                  The transformation imperative framework
                </p>
                <p className={styles.sectionheading}>
                  A Practical Framework For Messy, Multi-Stakeholder Change
                </p>
                <p
                  className={`${styles.sectionDescription} max-w-[1100px] w-full`}
                >
                  The Transformation Imperative is our structured way of taking
                  complex change from vague mandate to durable business value.
                  It integrates your strategy, governance, operating rhythm, and
                  leadership bench into one coherent arc.
                </p>
              </div>
              <div className={`${styles.mt60}  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 `}>
                {[
                  {
                    image: "/enterprise/phase1.svg",
                    phase: "Phase 1",
                    title: "Clarify the Bet",
                    text: "Diagnose the real problem, define the transformation thesis, and align on value at stake.",
                  },
                  {
                    image: "/enterprise/phase2.svg",
                    phase: "Phase 2",
                    title: "Architect the Work",
                    text: "Design operating models, roles, AI and tech stack, and decision rights that can actually scale.",
                  },
                  {
                    image: "/enterprise/phase3.svg",
                    phase: "Phase 3",
                    title: "Lead Through Complexity",
                    text: "Govern across functions, manage risk and politics, and keep people aligned through uncertainty.",
                  },
                  {
                    image: "/enterprise/phase4.svg",
                    phase: "Phase 4",
                    title: "Prove & Extend Value",
                    text: "Turn outcomes into hard metrics, narrative proof points, and playbooks you can reuse.",
                  },
                ].map((card) => (
                  <div
                    className={`${styles.card} flex flex-col gap-1 align-start justify-start `}
                    key={card.title}
                  >
                    <div className=" flex flex-col gap-3 align-start justify-start ">
                      <Image
                        src={card.image}
                        alt="cardheading"
                        width={48}
                        height={48}
                      />
                      <div className={styles.cardtitle}>{card.phase}</div>
                    </div>

                    <div className={styles.cardheading}>{card.title}</div>
                    <p className={styles.carddescription}>{card.text}</p>
                  </div>
                ))}
              </div>
              <Link
                className={`${styles.buttonPrimary} ${styles.mt60} !text-white bg-burgundy`}
                href="/contact"
              >
                Schedule a 30-minute framework walkthrough
              </Link>
            </div>
          </div>
        </section>

        {/* <section className={styles.section}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-3 justify-center items-center text-center">
              <p className={styles.sectionsmallheading}>
                2026 cohort portfolio
              </p>
              <p className={styles.sectionheading}>
                2026 Transformation Imperative Cohorts
              </p>
              <div className="flex flex-col gap-4 items-center justify-center text-center">
                <p
                  className={`${styles.sectionDescription} max-w-[1270px] w-full text-center`}
                >
                  Each cohort is a 5 or 12-week, high-touch program for senior
                  leaders, aligned around a real enterprise challenge you are
                  carrying right now. Cohorts are designed so that your work
                  products feed directly back into your company&apos;s
                  transformation roadmap.
                </p>
                <p
                  className={`${styles.sectionDescription} max-w-[950px] w-full text-center`}
                >
                  The current cycle begins the week of{" "}
                  <strong className="text-[var(--color-nearBlack)]"> May 11, 2026 - June 12, 2026.</strong> Subsequent
                  cohorts run in 12-week intervals, allowing you to stagger
                  enrollment across your leadership bench.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        <section
          className={`${styles.section} ${styles.darkSection}`}
          id="cohort-1"
        >
          <div className="container-width w-full">
            <div className={styles.enterpriseGrid}>
              <div className="  flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <p className={styles.sectionsmallheading}>
                    Cohort 1 - 5-week fast-track
                  </p>
                  <p
                    className={`${styles.sectionheading} ${styles.darkSectionsectionheading}`}
                  >
                    AI Automation For Enterprise Transformation Leaders (2026
                    Fast-Track Introduction)
                  </p>
                  <p
                    className={`${styles.sectionDescription} ${styles.darkSectionsectiondescription}`}
                  >
                    Your executives expect you to have a credible AI point of
                    view--set the AI agenda, not just react to it. This 5-week
                    fast-track Lab is designed for women of color in senior
                    transformation roles who are ready to move beyond &quot;cute
                    prompts&quot; and into a production-ready workflow that
                    reclaims roughly a workday per week.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5 justify-between ">
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/peopleTick.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Who it's for
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      WOC C‑suite executives, VPs, and senior directors
                      responsible for AI, digital, or transformation portfolios.
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/calender.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Cohort Timing
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Q2 2026: 5‑week AI Automation Lab running from Aug 17 –
                      Sept 21, 2026.
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/clockOverlay.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Program Structure
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Duration: 5 Weeks
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Format: Weekly 60‑minute Labs + optional office hours
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Cohort Size: 8–12 leaders
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/people.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      What leaders build
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      AI‑enabled automation tied to an enterprise priority
                      (e.g., reporting, escalations, cross‑functional updates).
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      An Automation Playbook with workflow maps, guardrails, and
                      metrics.
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      A sponsor brief and promotion narrative positioning
                      automation as strategic leadership, not just tool
                      tinkering
                    </p>
                  </div>
                </div>

                <div className=" flex flex-col md:flex-row gap-4  justify-start items-start ">
                  <a className={`${styles.buttonPrimary} ${styles.text14}`} onClick={() => {
                    setSupport("AI Fluency for Leaders")
                    setEnrollmentModal(true);
                  }}>
                    Apply To The AI Automation Lab
                  </a>
                  <a
                    className={`${styles.buttonSecondaryOutline} ${styles.text14}`}
                    href="/AI_Automation_Enterprise_Transformation.pdf"
                    download
                  >
                    <MdOutlineFileDownload style={{ fontSize: "1.25rem" }} />{" "}
                    Download AI Automation Lab overview
                  </a>
                </div>
              </div>

              {/* Desktop (≥1024px) */}
              <img
                src="/enterprise/lab-leaders.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} hidden lg:block`}
              />

              {/* Mobile / Tablet (<1024px) */}
              <img
                src="/enterprise/lab-leaders-mobile.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} block lg:hidden`}
              />
            </div>
          </div>
        </section>

        <section className={`${styles.section}`} id="cohort-1">
          <div className="container-width w-full">
            <div className={styles.enterpriseGridreverse}>
              <img
                src="/enterprise/aiMetting.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} hidden lg:block`}

              />
              {/* Mobile / Tablet (<1024px) */}
              <img
                src="/enterprise/aiMettingmobile.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} block lg:hidden`}
              />
              <div className=" flex flex-col gap-9">
                <div className="flex flex-col gap-3">
                  <p className={styles.sectionsmallheading}>
                    Cohort 2 · Flagship 8‑Week Program
                  </p>
                  <p className={`${styles.sectionheading} `}>
                    Leading in Flat, AI‑Enabled Organizations (Flagship 2026
                    Cohort)
                  </p>
                  <p className={`${styles.sectionDescription}`}>
                    Flattening org charts and AI are compressing layers and
                    concentrating power. For women of color in VP, AVP, and
                    Director roles, this shift can mean disappearing paths to
                    promotion—or a chance to redesign the map entirely. This
                    cohort helps leaders read the new power structure, build
                    visible AI fluency, and craft a promotion‑ready mandate.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5 justify-between ">
                  <div
                    className={` ${styles.cardfill} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardfillheading} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/peopleTick.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Who it's for
                    </h4>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      VP, AVP, and Director‑level women of color leading through
                      organizational flattening; C‑suite women of color
                      architecting AI‑flat org design
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardfill} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardfillheading} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/calender.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Cohort Timing
                    </h4>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      <p className={` ${styles.cardfilldescription}`} > Q2 2026: Leading in Flat, AI‑Enabled Organizations.
                      </p>

                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      <p className={` ${styles.cardfilldescription}`} > Program A – Fall 2026:
                        <strong> Sep 9 – Nov 24, 2026</strong> (applications due August 25)</p>

                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      <p className={` ${styles.cardfilldescription}`} > Program B – Fall 2026:
                        <strong> Oct 7 – Dec 16, 2026</strong> (applications due September 23)</p>

                    </p>
                  </div>
                  <div
                    className={` ${styles.cardfill} flex flex-col gap-4 justify-start `}
                  >
                    <h4
                      className={` ${styles.cardfillheading} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/clockOverlay.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Program Structure
                    </h4>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Duration: 6 sessions / 8 weeks{" "}
                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Format: Hybrid cohort + 1:1 coaching{" "}
                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Cohort Size: 8–12 per track{" "}
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardfill} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardfillheading} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/people.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      What leaders build
                    </h4>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      A documented power mandate tied to 2–3 enterprise‑level
                      outcomes
                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      An AI experimentation portfolio with at least one live
                      pilot in progress
                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      A sponsor map and outreach plan targeting 5–7 key sponsors
                    </p>
                    <p
                      className={` ${styles.cardfilldescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      A 6–12 month growth case positioning leaders for
                      next‑level roles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-12">
              <p className={styles.sectiontitle_sm}>Case Study</p>
              <p
                className={`text-nearBlack ${styles.sectionheading} ${styles.sectionheading_smlight}`}
              >
                From scattered initiatives to a clear power mandate.
              </p>
              <p
                className={`${styles.sectionDescription} ${styles.sectiondescription_smlight} mt-1`}
              >
                In a national bank undergoing restructuring, a VP‑level WOC
                leader used this program's power‑mapping and AI experimentation
                tools to consolidate fragmented responsibilities into a single,
                promotion‑level mandate tied to measurable outcomes.
              </p>
              <div className=" flex flex-col md:flex-row gap-4 justify-start items-start ">
                <a className={`${styles.buttonPrimary} ${styles.text14} text-warmCreamy bg-burgundy`} onClick={() => {
                  setSupport("Flat Org Leadership")
                  setEnrollmentModal(true);
                }}>
                  Apply for the Flat Org Leadership Cohort
                </a>
                <a className={`${styles.btnblackOutline} ${styles.text14}`} href="/Flat_Org_Leadership_Programs.pdf" download>
                  <MdOutlineFileDownload style={{ fontSize: "1.25rem" }} />
                  Download Flat Org Leadership overview
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.darkSection}`}
          id="cohort-1"
        >
          <div className="container-width w-full">
            <div className={styles.enterpriseGrid}>
              <div className=" flex flex-col gap-9">
                <div className="flex flex-col gap-3">
                  <p className={styles.sectionsmallheading}>
                    Cohort 3 · 12‑Week Transformation Lab
                  </p>
                  <p
                    className={`${styles.sectionheading} ${styles.darkSectionsectionheading}`}
                  >
                    Leading Complex Projects
                  </p>
                  <p
                    className={`${styles.sectionDescription} ${styles.darkSectionsectiondescription}`}
                  >
                    You've been handed a complex, high‑stakes project: a
                    platform launch, enterprise transformation, major client
                    program, or multi‑business‑unit initiative. This 12‑week
                    Transformation Lab helps women of color leaders map power,
                    design the operating model, and turn one complex project
                    into a promotion‑ready proof point.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5 justify-between ">
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/peopleTick.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Who it's for                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      WOC C‑suite, VPs, senior managers, program leaders, and
                      founders leading cross‑functional or enterprise‑wide
                      initiatives
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/calender.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Cohort Timing
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Q2 2026: August 24 – November 13, 2026
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/clockOverlay.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      Program Structure
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Duration: 12 weeks
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Format: Weekly 90‑min live labs + office hours
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Cohort Size: 6–12 leaders
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      7 modules, templates, peer circles
                    </p>
                  </div>
                  <div
                    className={` ${styles.cardDark} flex flex-col gap-4  justify-start `}
                  >
                    <h4
                      className={` ${styles.cardDarktitle} flex  gap-2 items-center `}
                    >
                      <Image
                        src="/enterprise/people.svg"
                        alt="people Icon"
                        width={36}
                        height={36}
                      />{" "}
                      What leaders build
                    </h4>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Power‑mapping skills to identify real decision‑makers,
                      sponsors, and blockers
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Operating models designed for AI‑enabled, flat, or
                      matrixed organizations
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      Executive communications and escalation strategies that
                      protect credibility
                    </p>
                    <p
                      className={` ${styles.cardDarkdescription} flex  gap-2 items-start ms-2`}
                    >
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people Icon"
                        width={18}
                        height={18}
                      />{" "}
                      A Project Leadership Dossier that translates project
                      outcomes into a compelling promotion narrative
                    </p>
                  </div>
                </div>
              </div>
              <img
                src="/enterprise/complex-projects.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} hidden lg:block`}
              />
              {/* Mobile / Tablet (<1024px) */}
              <img
                src="/enterprise/complex-projectsMobile.webp"
                alt="Leader in an AI automation lab"
                className={`${styles.enterpriseimage} block lg:hidden`}
              />

            </div>

            <div className="flex flex-col gap-3 mt-12">
              <p className={styles.sectiontitle_sm}>Case Study</p>
              <p className={`${styles.sectionheading_sm} `}>
                From 13 days to 48 hours: Commercial lending at scale.
              </p>
              <p className={`${styles.sectiondescription_sm}  mt-1`} style={{ fontSize: '14px' }}>
                For JPMorgan Chase's commercial lending business, we led
                redesign of a digital loan application journey, reducing
                time‑to‑close from 13 days to 48 hours and generating an
                estimated $2M in value.
              </p>
              <div className=" flex flex-col md:flex-row gap-4  justify-start items-start ">
                <a className={styles.buttonPrimary} onClick={() => {
                  setSupport("Leading Complex Change")
                  setEnrollmentModal(true);
                }}>
                  Apply to Leading Complex Projects
                </a>
                <a
                  className={styles.buttonSecondaryOutline}
                  href="/Leading_Complex_Change_Program.pdf"
                  download
                >
                  <MdOutlineFileDownload style={{ fontSize: "1.25rem" }} />
                  Download Leading Complex Projects overview
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`${styles.sectionsmall}`}
        >
          <div className="container-width w-full">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-5 justify-center items-center text-center">
                <p className={styles.sectionsmallheading}>Decision guide</p>
                <p className={styles.sectionheading}>
                  Which Cohort Is Right For Your Leaders?
                </p>
                <p
                  className={`${styles.sectionDescription} max-w-[720px] w-full`}
                >
                  Use this guide to match your leaders to the right
                  Transformation Imperative cohort based on their current role,
                  context, and the bets you need them to land.
                </p>
              </div>
              <div className='w-full'>
                <div
                  className={`${styles.mt60}  flex justify-between items-center py-4 `}
                >
                  <p className={`${styles.blueHeading}  `}>
                    Is this your leader?
                  </p>
                  <p className={`${styles.blueHeading} justify-self-end  `}>
                    Then, the best fit is...
                  </p>
                </div>

                <div className={` ${styles.decision_row} items-center`}>
                  <p className={styles.listheading}>
                    Org flattening, AI shifting roles and power
                  </p>
                  {/* Desktop */}
                  <Image
                    src="/enterprise/Arrow.svg"
                    alt="Org flattening"
                    width={90}
                    height={10}
                    className="justify-self-center hidden md:block"
                  />

                  {/* Mobile */}
                  <Image
                    src="/enterprise/Arrowmobile.svg"
                    alt="Org flattening"
                    width={20}
                    height={10}
                    className="justify-self-center block md:hidden"
                  />
                  <div className={styles.lightprimaryCardEnterprise}>
                    Leading in Flat, AI‑Enabled Organizations
                  </div>
                </div>
                <div className={` ${styles.decision_row}    items-center`}>
                  <p className={styles.listheading}>
                    Needs one visible AI win to prove AI leadership
                  </p>
                  {/* Desktop */}
                  <Image
                    src="/enterprise/Arrow.svg"
                    alt="Org flattening"
                    width={90}
                    height={10}
                    className="justify-self-center hidden md:block"
                  />

                  {/* Mobile */}
                  <Image
                    src="/enterprise/Arrowmobile.svg"
                    alt="Org flattening"
                    width={20}
                    height={10}
                    className="justify-self-center block md:hidden"
                  />
                  <div className={styles.lightprimaryCardEnterprise}>
                    AI Automation for Enterprise Transformation Leaders
                  </div>
                </div>
                <div
                  className={`  ${styles.decision_row}    items-center w-100`}
                >
                  <p className={styles.listheading}>
                    Carrying a high‑stakes, cross‑functional project
                  </p>
                  {/* Desktop */}
                  <Image
                    src="/enterprise/Arrow.svg"
                    alt="Org flattening"
                    width={90}
                    height={10}
                    className="justify-self-center hidden md:block"
                  />

                  {/* Mobile */}
                  <Image
                    src="/enterprise/Arrowmobile.svg"
                    alt="Org flattening"
                    width={20}
                    height={10}
                    className="justify-self-center block md:hidden"
                  />
                  <div className={styles.lightprimaryCardEnterprise}>
                    Leading Complex Projects
                  </div>
                </div>
                <div className={` ${styles.decision_row}     items-center`}>
                  <p className={styles.listheading}>
                    Running broad, enterprise‑wide transformation remit
                  </p>
                  {/* Desktop */}
                  <Image
                    src="/enterprise/Arrow.svg"
                    alt="Org flattening"
                    width={90}
                    height={10}
                    className="justify-self-center hidden md:block"
                  />

                  {/* Mobile */}
                  <Image
                    src="/enterprise/Arrowmobile.svg"
                    alt="Org flattening"
                    width={20}
                    height={10}
                    className="justify-self-center block md:hidden"
                  />
                  <div className={styles.lightprimaryCardEnterprise}>
                    Enterprise Transformation Lab / Leading Enterprise Change
                  </div>
                </div>
              </div>

              <Link
                className={`${styles.buttonPrimary} ${styles.mt60} !text-white bg-burgundy`}
                href="/contact"
              >
                Talk to us about cohort fit{" "}
                <Image
                  src="/enterprise/rightarrow.svg"
                  alt="arrow right icon"
                  width={16}
                  height={16}
                />{" "}
              </Link>
            </div>
          </div>
        </section>

        <section className={`${styles.sectionsmall} `}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-2 justify-center items-center text-center">
                <p className={styles.sectionsmallheading}>Engagement Models</p>
                <p className={`${styles.sectionheading} mt-4`}>
                  How We Partner with Enterprises
                </p>
                <p
                  className={`${styles.sectionDescription} max-w-[540px] w-full`}
                >
                  “How we partner with enterprises" -- consistent with what has
                  been done in every other section like this one.
                </p>
              </div>
              <div
                className={`${styles.mt60}  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1100px] `}
              >
                {[
                  {
                    image: "/enterprise/peopletickphase.svg",
                    phase: "Phase 1",
                    title: "Join Open Cohorts",
                    text: "Individual seats in open cohorts(org‑funded or self‑funded)",
                  },
                  {
                    image: "/enterprise/peoplesphase.svg",
                    phase: "Phase 2",
                    title: "Build Team Pods",
                    text: "Enterprise pods (3–20 leaders per company) with light customization.",
                  },
                  {
                    image: "/enterprise/protectionphase.svg",
                    phase: "Phase 3",
                    title: "Customize Enterprise Cohorts",
                    text: "Fully customized enterprise cohorts aligned to a specific transformation (for 10–20 leaders).",
                  },
                ].map((card) => (
                  <div
                    className={`${styles.card} flex flex-col gap-1 align-start justify-start `}
                    key={card.title}
                  >
                    <div className=" flex flex-col gap-3 align-start justify-start ">
                      <Image
                        src={card.image}
                        alt="cardheading"
                        width={48}
                        height={48}
                      />
                      <div className={styles.cardtitle}>{card.phase}</div>
                    </div>

                    <div className={styles.cardheading}>{card.title}</div>
                    <p className={styles.carddescription}>{card.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-[8px] md:gap-[22px] mt-[20px]">
                <Link
                  className={`${styles.buttonPrimary} !text-white bg-burgundy `}
                  href="/registration"
                >
                  View Pricing & Enrollment{" "}
                  <Image
                    src="/enterprise/rightarrow.svg"
                    alt="arrow right icon"
                    width={16}
                    height={16}
                  />
                </Link>
                <CohortCalendarDownloadButton
                  className={`${styles.buttonPrimary} !text-white bg-burgundy `}
                >
                  Download the 2026 Transformation Imperative cohort calendar{" "}
                  <Image
                    src="/enterprise/rightarrow.svg"
                    alt="arrow right icon"
                    width={16}
                    height={16}
                  />
                </CohortCalendarDownloadButton>
                <Link
                  className={`${styles.buttonPrimary} !text-white bg-burgundy `}
                  href="/contact"
                >
                  Schedule a transformation consult{" "}
                  <Image
                    src="/enterprise/rightarrow.svg"
                    alt="arrow right icon"
                    width={16}
                    height={16}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          className={styles.ctaBanner}
          style={{
            backgroundImage: "url(/enterprise/cta-bg.webp)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col gap-10  items-center px-4 px-lg-0 text-center">
            <p className={styles.sectionheading} style={{ color: "white" }}>
              Bring Your Most Complex Initiative To The Table
            </p>
            <div className="flex flex-col md:flex-row items-center gap-3">
              <Link className={styles.buttonPrimary} href="/registration">
                View Pricing & Enrollment{" "}
                <Image
                  src="/enterprise/right-arrow-svg.svg"
                  alt="arrow right icon"
                  width={16}
                  height={16}
                />
              </Link>
              <Link className={styles.buttonPrimary} href="/sponsorship">
                Explore Enterprise Sponsorship options{" "}
                <Image
                  src="/enterprise/right-arrow-svg.svg"
                  alt="arrow right icon"
                  width={16}
                  height={16}
                />
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>


      {enrollmentModal && <EnrollmentModal support={support} isOpen={enrollmentModal} onClose={() => setEnrollmentModal(false)} />}

    </div>
  );
}
