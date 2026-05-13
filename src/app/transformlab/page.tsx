"use client";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "../enterprise/enterprise.module.css";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import * as Accordion from "@radix-ui/react-accordion";
import WaitlistModal from "@/components/WaitlistModal";
import JoinWaitlistModal from "./JoinWaitlistModal";
import EnrollmentModal from "@/components/EnrollmentModal";

import Footer from "@/components/Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import CohortCalendarDownloadButton from "@/components/CohortCalendarDownloadButton";

export default function EnterprisePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openWaitlist, setOpenWaitlist] = useState(false);
  const [joinWaitlistModal, setJoinWaitlistModal] = useState(false);
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);

  const handleModal = () => {
    setOpenWaitlist(true);
  };

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is the time commitment?",
      answer:
        "Expect a multi‑month commitment with monthly live sessions (90–120 minutes), plus optional office hours and peer touchpoints. Most participants integrate it into their existing leadership rhythm rather than adding a separate “project.”",
    },
    {
      question: "Will my company know what I share?",
      answer:
        "No. We set clear boundaries between your learning space and your employer. We may share high‑level themes or impact (with your consent), but not your personal stories or confidential details.",
    },
    {
      question: "Are participants from the same company or mixed?",
      answer:
        "Both. We intentionally mix companies and industries so you can see patterns and options beyond your org, while also making space for pairs or small groups from the same company when it serves the work.",
    },
    {
      question: "What if I get promoted or change roles mid-cohort?",
      answer:
        "We design for that. Promotions, restructures, and scope changes are built into the Lab’s content—we’ll use those inflection points as live case studies and support you through them.",
    },
    {
      question: "Is this virtual or in-person?",
      answer:
        "The core experience is delivered virtually to accommodate global and multi‑time‑zone leaders, with optional in‑person touchpoints or retreats when feasible.",
    },
    {
      question: "Do I need my leader’s approval to join?",
      answer:
        "You can apply on your own. For company sponsorship, you’ll typically need leader or HR sign‑off; we provide talking points and templates to make that conversation easier.",
    },
  ];

  return (
    <div className={styles.page}>
      <Header />
      <main>
       <section className={`${styles.hero} relative overflow-hidden`}>

  {/* Mobile Background */}
  <div className="absolute inset-0 block md:hidden">
    <Image
      src="/enterprise/labmobilebg.webp"
      alt="Lab Banner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/enterprise/labbg.webp"
      alt="Lab Banner"
      fill
      // priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 container-width w-full">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                A private accelerator for women of color leading complex change.
              </h1>
              <div className="flex flex-col gap-6">
                <p className={styles.heroText}>
                  For Directors–VPs in technical and transformation roles who
                  want promotion-level visibility without sacrificing identity
                  or sanity.
                </p>
                <div className="flex flex-col md:flex-row items-stretch gap-4">
                  <button
                    className={`${styles.buttonPrimary} flex-1`}
                    onClick={handleModal}
                  >
                    Apply To The Lab
                  </button>
                  <a
                    href="/The_Transformation_Lab.pdf"
                    download
                    className={`${styles.buttonSecondaryOutline} flex-1`}
                  >
                    <MdOutlineFileDownload style={{ fontSize: "1.25rem" }} />
                    Download Lab Overview (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} fadeYellow`}>
          <div className="container-width w-full">
            <div className="grid grid-cols-2 gap-[4.5rem] justify-between ">
              <div className="flex flex-col gap-6  items-start">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4">
                    <p className={styles.sectionsmallheading}>Is This You?</p>
                    <p className={styles.sectionheading}>
                      You're leading the work—but not always getting the mic
                    </p>
                  </div>
                  <ul className={styles.sectionList}>
                    <li className="flex items-center gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people ico"
                        width={32}
                        height={32}
                      />{" "}
                      Senior leaders trust you to clean up complex, messy
                      initiatives, but your title and compensation haven't
                      caught up.
                    </li>
                    <li className="flex items-center gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people ico"
                        width={32}
                        height={32}
                      />{" "}
                      You find yourself code-switching, editing your tone, or
                      softening the truth so you don't get labeled "difficult"
                      or "not a team player."
                    </li>
                    <li className="flex items-center gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people ico"
                        width={32}
                        height={32}
                      />{" "}
                      You're already shaping strategy and influence without the
                      formal power, budget, or microphone that matches your
                      impact.
                    </li>
                    <li className="flex items-center gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/arrowfill.svg"
                        alt="people ico"
                        width={32}
                        height={32}
                      />{" "}
                      You know you're a critical node in the transformation—but
                      you're tired of having tooverperform just to be seen as
                      credible.
                    </li>
                  </ul>
                  <p
                    className={`${styles.sectionDescription} max-w-[624px] font-chivo`}
                  >
                    If this sounds like your lived reality, the Transformation
                    Lab exists so you don't have to navigate it alone. It's a
                    dedicated space for women of color who are already holding
                    the weight of enterprise-level change to get strategy,
                    language, and community that actually reflect the rooms you
                    move in every day.
                  </p>
                </div>
              </div>

              <Image
                className="justify-self-center lg:justify-self-start  "
                src="/enterprise/womenthinking.webp"
                alt="Enterprise leaders in a meeting"
                width={650}
                height={603}
              />
            </div>
          </div>
        </section>

        <section className={`${styles.section}`}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-12 items-center ">
              <div className="flex flex-col gap-5 justify-center items-start text-start">
                <p className={styles.sectionsmallheading}>What the Lab Is</p>
                <p className={styles.sectionheading}>
                  A cohort built for WOC at the top of the house
                </p>
                <p className={`${styles.sectionDescription}  w-full`}>
                  The Transformation Lab is a high-touch cohort for women of
                  color who are already sitting near, at, or just below the
                  C-suite—quietly powering the transformations everyone else
                  puts on slides. It combines executive-level coaching, peer
                  council, and practical playbooks so you can move with clarity,
                  influence, and protection in rooms that weren't built with you
                  in mind.
                </p>
                <p className={`${styles.sectionDescription} w-full`}>
                  It's for senior leaders and senior-track leaders driving
                  complex, cross-functional work— digital transformation,
                  customer experience, growth strategy, operations, data, and
                  change portfolios—across industries. You bring the real cases:
                  high-stakes initiatives, tricky politics, under-the-radar
                  sponsorship, and we work them in real time with people who
                  understand the nuances of race, gender, and power.
                </p>
                <p className={`${styles.sectionDescription} w-full`}>
                  This is not a generic leadership program, a feel-good retreat,
                  or surface-level DEI. It is not about fixing you. It's about
                  giving you the strategy, language, and community to navigate
                  and reshape systems that were not designed for you to thrive.
                </p>
                {/* <a className={`${styles.buttonPrimary} `} href="#eligibility">
                  See if You’re a fit
                </a> */}
                <a
                  className={`${styles.buttonPrimary} font-chivo !text-white bg-burgundy`}
                  href="#eligibility"
                >
                  See if You’re a fit <FaArrowRightLong color="white" />
                </a>
              </div>

              <img
                src="/images/lab-bg.webp"
                alt=""
                className="h-full w-full rounded-[24px]"
              />
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.darkSection}`}
          id="cohort-1"
        >
          <div className="container-width w-full">
            <div className="  flex flex-col gap-8 items-center ">
              <div className="flex flex-col gap-3 items-center text-center">
                <p className={styles.sectionsmallheading}>Program Structure</p>
                <p
                  className={`${styles.sectionheading} ${styles.darkSectionsectionheading}`}
                >
                  Structure that fits the reality of senior leaders
                </p>
              </div>

              <div className={`mt-8  grid grid-cols-3 gap-6 w-full  `}>
                {[
                  {
                    image: "/enterprise/duration.svg",
                    title: "Duration",
                    text: (
                      <>
                        A multi-month container (typically 3–9 months) designed
                        to match the rhythm of real <br />
                        transformation work—not a one-off workshop you forget by
                        Monday.
                      </>
                    ),
                  },
                  {
                    image: "/enterprise/condences.svg",
                    title: "Cadence",
                    text: "Monthly live cohort sessions, focused implementation labs, and optional office hours you can plug into around board meetings, quarterly closes, and launches.",
                  },
                  {
                    image: "/enterprise/components.svg",
                    title: "Components",
                    text: "Peer council for real-time problem-solving, 1:1 executive coaching, sponsor and stakeholder strategy, visibility labs for owning the mic, and practical scripts and playbooks you can use the same week.",
                  },
                ].map((card) => (
                  <div
                    className={`${styles.cardwhite} flex flex-col gap-1 align-start justify-start `}
                    key={card.title}
                  >
                    <div className=" flex flex-col gap-2 align-start justify-start ">
                      <div className="flex items-center gap-3">
                        <Image
                          src={card.image}
                          alt="cardheading"
                          width={48}
                          height={48}
                        />

                        <div className={styles.cardheading}>{card.title}</div>
                      </div>
                      <p className={styles.carddescription}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p
                className={`${styles.sectionheading_sm} mt-5 w-full max-w-[765px]  text-center`}
              >
                Every piece of the structure is built around how senior leaders
                actually work—long arcs, competing demands, and the need to
                apply insight quickly without burning out.
              </p>

              <CohortCalendarDownloadButton className={styles.buttonPrimary}>
                View the upcoming cohort dates
              </CohortCalendarDownloadButton>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} `}
          style={{ paddingBottom: "80px" }}
        >
          <div className="container-width w-full">
            <div className="grid grid-cols-2 gap-6 justify-between ">
              <Image
                className="justify-self-center lg:justify-self-end w-full"
                src="/enterprise/dashboardSummary.webp"
                alt="Enterprise leaders in a meeting"
                width={660}
                height={495}
              />
              <div className="flex flex-col gap-6  items-start">
                <div className="flex flex-col gap-7">
                  <p className={styles.sectionsmallheading}>
                    Outcomes You Can Expect
                  </p>
                  <p className={styles.sectionheading}>
                    By the end of the Lab, you will…
                  </p>
                  <ul className={styles.sectionList}>
                    <li className="flex items-start gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/righttickcirclegold.svg"
                        alt="people ico"
                        width={20}
                        height={20}
                        className="mt-[5px]"
                      />{" "}
                      Have a clear, enterprise-level narrative for your work
                      that ties directly to <br />
                      revenue, risk, and strategic priorities—and positions you
                      for your next role.
                    </li>
                    <li className="flex items-start gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/righttickcirclegold.svg"
                        alt="people ico"
                        width={20}
                        height={20}
                        className="mt-[5px]"
                      />{" "}
                      Be more visible to decision makers, with a concrete
                      sponsor and stakeholder map and scripts for high-stakes
                      conversations about scope, title, and compensation.
                    </li>
                    <li className="flex items-start gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/righttickcirclegold.svg"
                        alt="people ico"
                        width={20}
                        height={20}
                        className="mt-[5px]"
                      />{" "}
                      Navigate politics with more confidence and less
                      self-doubt, with language to name what's happening in the
                      room without gaslighting yourself.
                    </li>
                    <li className="flex items-start gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/righttickcirclegold.svg"
                        alt="people ico"
                        width={24}
                        height={24}
                        className="mt-[5px]"
                      />{" "}
                      Translate complex transformation work into executive-ready
                      messages that land with your CEO, board, and
                      cross-functional partners.
                    </li>
                    <li className="flex items-start gap-3 font-chivo">
                      {" "}
                      <Image
                        src="/enterprise/righttickcirclegold.svg"
                        alt="people ico"
                        width={20}
                        height={20}
                        className="mt-[5px]"
                      />{" "}
                      Leave with a community of peers who can see patterns,
                      validate your experience, and help you move faster on
                      decisions.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-9 mt-12">
              <div className="flex flex-col items-center gap-5 ">
                <p className={styles.listheading}>Mini Stories</p>
                <div className="grid grid-cols-2 gap-14 justify-between max-w-[1130px] w-full">
                  <div className="lightpurplrcard">
                    <p className="font-chivo">
                      {" "}
                      <strong>
                        Director of Customer Experience at a Fortune <br />
                        500 →{" "}
                      </strong>
                      promoted to VP in 9 months while leading a multi- market
                      digital transformation and renegotiating scope and
                      resources.
                    </p>
                  </div>
                  <div className="lightpurplrcard">
                    <p className="font-chivo">
                      <strong>
                        Senior Engineering Manager in a global tech org →
                      </strong>{" "}
                      expanded to Head of Platform Transformation, gained formal
                      P&L ownership, and secured executive sponsorship for her
                      succession plan.
                    </p>
                  </div>
                </div>
              </div>
              <a
                className={`${styles.buttonPrimary} font-chivo !text-white bg-burgundy`}
                href="/registration"
              >
                Apply for the next cohort <FaArrowRightLong color="white" />
              </a>
            </div>
          </div>
        </section>

        <section className={`${styles.section} fadeYellow`}>
          <div className="container-width w-full">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-5 justify-center items-start text-start">
                <p className={styles.sectionsmallheading}>Community & Safety</p>
                <p className={styles.sectionheading}>
                  You don't have to carry this alone
                </p>
                <p className={`${styles.sectionDescription}  w-full`}>
                  Inside the Lab, you don't have to translate your experience.
                  You're in a confidential room where being a woman of color at
                  the center of transformation is assumed, not explained, and
                  where shared language around race, power, and identity is part
                  of the design—not an afterthought.
                </p>
                <p className={`${styles.sectionDescription} w-full`}>
                  We anchor in clear norms around confidentiality, psychological
                  safety, and consent so you can bring the real stories,
                  politics, and stakes you can't unpack anywhere else. Community
                  doesn't end with the last session: you'll have access to an
                  alumni circle and ongoing touchpoints so you can continue to
                  tap the network as you move into bigger roles and bolder
                  moves.
                </p>
              </div>

              <img
                src="/enterprise/Community&Safety.webp"
                alt=""
                className="w-full"
              />

              <div className={`mt-2  grid grid-cols-2 gap-6 w-full  `}>
                {[
                  {
                    image: "/enterprise/5stars.svg",
                    title: "Lab Participant",
                    text: '"The Lab gave me language, strategy, and a squad. I walked back into the same rooms, but I was no longer carrying them by myself."',
                  },
                  {
                    image: "/enterprise/5stars.svg",
                    title: "Lab Participant",
                    text: `"This was the first space where I didn't have to downplay my ambition or my experience as a Black woman leader. I felt seen, safe, and pushed—in the best way."`,
                  },
                ].map((card) => (
                  <div
                    className={`${styles.cardwhite} flex flex-col gap-1 align-start justify-start `}
                    key={card.title}
                  >
                    <div className=" flex flex-col gap-4 align-start justify-start ">
                      <Image
                        src={card.image}
                        alt="cardheading"
                        width={80}
                        height={16}
                      />

                      <p className={styles.testonomialDescription}>
                        {card.text}
                      </p>
                      <p className={styles.carddescription}>{card.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} `}>
          <div className="container-width w-full">
            <div className="grid grid-cols-2 gap-6 justify-between ">
              <Image
                className="justify-self-center lg:justify-self-start  "
                src="/enterprise/investmentmeeting.webp"
                alt="Enterprise leaders in a meeting"
                width={600}
                height={590}
              />

              <div className="flex flex-col gap-5 items-start">
                <p className={styles.sectionsmallheading}>
                  Investment & Sponsorship
                </p>

                <p className={styles.sectionheading}>
                  An investment your company can <br />
                  (and should) sponsor.
                </p>
                <p className={styles.sectionDescription}>
                  The Lab is a premium, executive-level development
                  experience—priced in line with what organizations already
                  invest in leadership programs and coaching for their most
                  critical talent. It's designed to be funded by your company as
                  part of their obligation to support the leaders actually
                  moving transformation forward.
                </p>
                <ul className={styles.sectionList}>
                  <li className="flex items-center gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/righttickcirclegold.svg"
                      alt="people ico"
                      width={20}
                      height={20}
                    />{" "}
                    Leadership development or executive education budgets.
                  </li>
                  <li className="flex items-center gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/righttickcirclegold.svg"
                      alt="people ico"
                      width={20}
                      height={20}
                    />{" "}
                    Talent, or succession-planning funds earmarked for
                    high-potential leaders of color.
                  </li>
                  <li className="flex items-center gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/righttickcirclegold.svg"
                      alt="people ico"
                      width={20}
                      height={20}
                    />{" "}
                    Direct sponsorship from a current leader, executive sponsor,
                    or HR business partner.
                  </li>
                  <li className="flex items-center gap-3 font-chivo">
                    {" "}
                    <Image
                      src="/enterprise/righttickcirclegold.svg"
                      alt="people ico"
                      width={20}
                      height={20}
                    />{" "}
                    Reallocating conference, training, or coaching dollars into
                    one focused, high-impact experience.
                  </li>
                </ul>

                <a
                  className={`${styles.buttonPrimary} !text-white bg-burgundy font-chivo px-4`}
                  href="/Employer_Funding_Guide.pdf"
                  download
                >
                  Get the employer funding guide
                  <img src="/enterprise/rightarrow.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="eligibility"
          className={styles.eligibilitySection}
          style={{
            backgroundImage: "url(/enterprise/eligibility.webp)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="container-width w-full ">
            <div className="flex flex-col gap-7  items-start">
              <div className="flex flex-col gap-4  items-start">
                <p className={styles.sectionsmallheading}>Eligibility</p>
                <p className={styles.sectionheading} style={{ color: "white" }}>
                  Who thrives in the Lab
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p
                  className={` ${styles.cardDarkdescription} flex gap-2 items-start `}
                >
                  <Image
                    src="/enterprise/righttickcirclegold.svg"
                    alt="people Icon"
                    width={20}
                    height={20}
                  />{" "}
                  Senior manager, director, head-of, VP, or equivalent
                </p>

                <p
                  className={` ${styles.cardDarkdescription} flex  gap-2 items-start`}
                >
                  <Image
                    src="/enterprise/righttickcirclegold.svg"
                    alt="people Icon"
                    width={20}
                    height={20}
                  />{" "}
                  Works in transformation-heavy environments
                </p>
                <p
                  className={` ${styles.cardDarkdescription} flex  gap-2 items-start`}
                >
                  <Image
                    src="/enterprise/righttickcirclegold.svg"
                    alt="people Icon"
                    width={20}
                    height={20}
                  />{" "}
                  Owns strategic or technical work
                </p>
                <p
                  className={` ${styles.cardDarkdescription} flex  gap-2 items-start `}
                >
                  <Image
                    src="/enterprise/righttickcirclegold.svg"
                    alt="people Icon"
                    width={20}
                    height={20}
                  />{" "}
                  Identifies as a woman of color
                </p>
                <p
                  className={` ${styles.cardDarkdescription} flex  gap-2 items-start `}
                >
                  <Image
                    src="/enterprise/righttickcirclegold.svg"
                    alt="people Icon"
                    width={20}
                    height={20}
                  />{" "}
                  Growth mindset
                </p>
              </div>
              <p
                className={` ${styles.cardDarkdescription}  max-w-[640px] w-full `}
              >
                <span className={styles.sectionsmallheading}> Note*</span>: The
                Lab is not a fit if you are in your first few years of the
                career, have no exposure to enterprise-level transformation, or
                are looking primarily for introductory leadership skills rather
                than senior-level strategy and navigation.
              </p>
              <button
                className={` px-4 ${styles.buttonPrimary} min-w-[30%]`}
                onClick={handleModal}
              >
                Apply To The Lab
              </button>
            </div>
          </div>
        </section>

        <section
          className={`${styles.section} ${styles.womenSection}`}
          style={{ paddingBottom: "80px" }}
        >
          <div className="container-width w-full">
            <div className="flex flex-col gap-12 items-center">
              <div className="flex flex-col gap-2 items-center">
                <p className={styles.sectionsmallheading}>FAQs</p>
                <p className={styles.sectionheading}>
                  Questions you might be asking
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
                {faq.question}
              </span>

              <FaChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="px-6 pb-5 text-sm text-gray-600 leading-relaxed font-chivo">
            {faq.answer}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ))}
              </Accordion.Root>

              <a
                className={`${styles.buttonPrimary} font-chivo px-4 !text-white bg-burgundy`}
                href="/contact/#form"
              >
                Still got questions? Reach out
              </a>
            </div>
          </div>
        </section>

        <section
          className={styles.ctaBanner}
          style={{ backgroundImage: "url(/enterprise/transformrommbg.webp)" }}
        >
          <div className="flex flex-col gap-5  items-center px-5 lg:px-0">
            <p
              className={` ${styles.sectionheading} max-w-[755px] w-full text-center `}
              style={{ color: "white" }}
            >
              If you're carrying transformation and identity, this room is for
              you
            </p>
            <p
              className={` ${styles.sectionDescription} max-w-[550px] w-full text-center `}
              style={{ color: "white" }}
            >
              You are not "too much" for the rooms you're in—you just haven't
              always been in rooms built with you in mind.
            </p>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 w-full">
              <button
                className={`${styles.buttonPrimary} font-chivo px-4`}
                onClick={handleModal}
              >
                Apply To The Lab
              </button>
              <button
                onClick={() => setJoinWaitlistModal(true)}
                className={`${styles.buttonSecondaryOutline} font-chivo px-4`}
              >
                Join the waitlist
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {openWaitlist && (
        <WaitlistModal
          isOpen={openWaitlist}
          onClose={() => setOpenWaitlist(false)}
          openEnrollment={(data: any) => {
            setEnrollmentData(data);
            setEnrollmentOpen(true);
          }}
        />
      )}
      {joinWaitlistModal && (
        <JoinWaitlistModal
          isOpen={joinWaitlistModal}
          onClose={() => setJoinWaitlistModal(false)}
        />
      )}
      {enrollmentOpen && (
        <EnrollmentModal
          isOpen={enrollmentOpen}
          onClose={() => setEnrollmentOpen(false)}
          prefillData={enrollmentData}
          support="something"
        />
      )}
    </div>
  );
}
