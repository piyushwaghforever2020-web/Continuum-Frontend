"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import styles1 from "../enterprise/enterprise.module.css";

import Link from "next/link";
import styles from "./sponsorship.module.css";
import Footer from "@/components/Footer";
import { FaChevronDown } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { RxPeople } from "react-icons/rx";
import * as Accordion from "@radix-ui/react-accordion";
import { Playfair_Display } from 'next/font/google';
import { Inter } from 'next/font/google';
import ReserveModal from "@/components/ReserveSeat";
import QueryModal from "@/components/QueryModal";
import PrivateCohortModal from "@/components/PrivateCohortModal";

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
});

type SuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
};


type ErrorModalProps = {
    isOpen: boolean;
    onClose: () => void;

};
const faqData = [
  {
    Q: "Can we sponsor leaders from different business units in one cohort?",
    A: "Yes. Mixed-BU cohorts often produce the richest peer learning. If leaders are in different functions, Path 2 (block seats) works well.",
  },
  {
    Q: "Do participants need prior AI knowledge?",
    A: "For AI Automation, participants should be regular users of ChatGPT, Claude, or similar tools. For all other Labs, no specific tech background is required.",
  },
  {
    Q: "How do we handle confidentiality in mixed-cohort settings?",
    A: "All participants agree to cohort confidentiality norms in Week 1. No proprietary strategy, client data, or personnel information is shared in group sessions.",
  },
  {
    Q: "Can we split the investment across two budget years?",
    A: "For Enterprise Transformation (2027) and multi-module sponsorships, we can structure invoicing across fiscal periods. Contact us to discuss.",
  },
  {
    Q: "What proof of development investment do we receive?",
    A: "You receive a program completion certificate per participant, the post-cohort impact summary, and a letter of program completion for your L&D records.",
  },
];

export default function TransformationStudioPage() {
    const [reserveModal, setReserveModal] = useState(false);

    const [showSuccessReserveModal, setShowSuccessReserveModal] = useState(false);
    const [requestGroupModal, setRequestGroupModal] = useState(false);
    const [showPrivateCohortSuccess, setShowPrivateCohortSuccess] = useState(false);
    const [showSuccessRequestGroup, setShowSuccessRequestGroup] = useState(false);



    const [privateCohortModal, setPrivateCohortModal] = useState(false);

    return (
        <div className={styles.page}>
            <Header />
            <main>
               <section className={`${styles.hero} relative overflow-hidden`}>

  {/* Mobile Background */}
  <div className="absolute inset-0 block md:hidden">
    <Image
      src="/sponsorshipImages/sponsor-mobile.png"
      alt="Sponsor Banner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/sponsorshipImages/sponsor-bg.png"
      alt="Sponsor Banner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 container-width w-full">
                        <div className={styles.heroContent}>
                            <h1 className={`${styles.heroTitle}`}>
                                Invest in the WOC Leaders Who Are Already Doing the Work

                            </h1>
                            <div className="flex flex-col gap-6 max-w-[38rem]">
                                <p className={`${styles.heroText}`}>
                                    Continuum Transformation Labs are built for senior women of color who are leading AI initiatives, managing enterprise change, and driving transformation — without the institutional support they deserve. Your sponsorship changes that.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------- Operating Rhythm Frameworks ----------------- */}
                <section className={`${styles.section}`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-6 items-center ">
                            <div className="flex flex-col justify-center items-center text-center">
                                <p className={`${styles1.sectionsmallheading} `}>
                                    WHY Sponsor
                                </p>
                                <p className={`${styles1.sectionheading} ${styles.bgWhite}`}>
                                    Why Organizations Sponsor Continuum Cohorts
                                </p>
                            </div>
                            <div className={`${styles.mt60} grid grid-cols-4 gap-6 `}>
                                {[
                                    {
                                        image: "/sponsorshipImages/sponsorIcon4.svg",
                                        title: "Retention signal ",
                                        text: "Sponsoring development for WOC leaders at the VP and director level is one of the most direct signals of real equity investment — not performative.",
                                    },
                                    {
                                        image: "/sponsorshipImages/sponsorIcon3.svg",
                                        title: "Immediate ROI",
                                        text: "Participants apply learning to a live project. The automation playbook, change leadership dossier, or transformation framework they produce belongs to your organization.",
                                    },
                                    {
                                        image: "/sponsorshipImages/sponsorIcon1.svg",
                                        title: "No curriculum build required",
                                        text: "You get executive-level cohort learning without the overhead of designing, staffing, or facilitating a custom program.",
                                    },
                                    {
                                        image: "/sponsorshipImages/sponsorIcon2.svg",
                                        title: "L&D budget alignment",
                                        text: "All cohorts are eligible for professional development and L&D budget coding. We provide an organizational invoice and impact summary.",
                                    },
                                ].map((card) => (
                                    <div
                                        className={`${styles.card} flex flex-col gap-3 items-center justify-start `}
                                        key={card.title}
                                    >
                                        <div className=" flex flex-col gap-2 items-center justify-center mb-5">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={56}
                                                height={56}
                                            />
                                        </div>

                                        <div className={styles1.cardheading}>{card.title}</div>
                                        <p className={styles1.carddescription}>{card.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>


                {/* ----------- Programs --------------- */}

                <section className={`${styles.lightorangesection} ${styles.bgF8F6F2} py-[90px]`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-6 items-center text-center">
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1">
                                    <p className={styles1.sectionsmallheading}>Programs</p>
                                    <p className={styles1.sectionheading}>Three Ways to Sponsor</p>
                                </div>

                                <p
                                    className={`${styles1.sectionDescription} max-w-[642px] w-full`}
                                >
                                    Each program is cohort-based, identity-centered, and built for senior leaders who are already doing the work.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 mt-12">
                            <div className={styles.cardwhite}>
                                <div className="flex flex-col gap-6">
                                    <div className={`${styles.carddescriptiongrid}`}>
                                        <div className="flex flex-col gap-5">
                                            <div className='space-y-[1.25rem]'>
                                                <p className={styles.sectionheading_box}>
                                                    Sponsor One Leader
                                                </p>
                                                <p className={styles.sectionDescription}>
                                                    Best when: You have 1–3 senior WOC leaders ready now and want to act quickly.
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-3 mb-5 md:mb-0">
                                                <ul className={styles.sectionList}>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick !w-4 !h-4  min-w-4 min-h-4 !md:w-5 !md:h-5" />
                                                        Best when: You have 1–3 senior WOC leaders ready now and want to act quickly.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Pay standard org-paid tuition per leader.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Receive: intake alignment call with Lisa Bennings, mid-cohort check-in, post-cohort impact summary.{" "}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={`${styles.purplecard}`}>
                                            <p className={`${styles.cardDescription} mb-3`}>
                                                We have 1–3 leaders and a development budget. Let's move
                                            </p>
                                            <button className={`${styles1.buttonPrimary} ${styles1.part} w-full`}>
                                                Reserve a Seat
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 ">
                                        <div className="table-wrapper">
                                            <table className={`${styles.minWidth} lab-plan-table`}>
                                                <thead>
                                                    <tr>
                                                        <th>Program</th>
                                                        <th>Price Per Seat</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <tr>
                                                        <td data-label="Tier">AI Automation (5 wks)</td>
                                                        <td data-label="Price" className={styles.price}>
                                                            $1,800 (fast-track rate)
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td data-label="Tier">Leading in Flat AI-Enabled Orgs (6 wks)</td>
                                                        <td data-label="Price" className={styles.price}>
                                                            $2,100
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td data-label="Tier">Leading Complex Change (12 wks)</td>
                                                        <td data-label="Price" className={styles.price}>
                                                            $3,500–$4,000
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td data-label="Tier">Enterprise Transformation 2027 (12 wks)</td>
                                                        <td data-label="Price" className={styles.price}>
                                                            $6,000–$7,500
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardwhitehighlighted}>
                                <div className="flex flex-col gap-6">
                                    <div className={`${styles.carddescriptiongrid}`}>
                                        <div className="flex flex-col gap-5">
                                            <div className='space-y-[1.25rem]'>
                                                <p className={styles.sectionheading_box}>
                                                    Sponsor a Block in an Open Cohort
                                                </p>
                                                <p className={styles.sectionDescription}>
                                                    You have 4–7 leaders across roles or geographies who can join a mixed cohort.
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-3 mb-5 md:mb-0">
                                                <ul className={styles.sectionList}>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        You have 4–7 leaders across roles or geographies who can join a mixed cohort.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Volume pricing applies modest per-seat discount for 4+ leaders.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Benefits include: custom welcome orientation for your leaders, optional sponsor briefing at cohort start and close.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Your leaders experience the cross-organizational peer dynamic alongside leaders from other orgs.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className={`${styles.purplecard}`}>
                                            <p className={`${styles.cardDescription} mb-5`}>
                                                We have a team that would benefit from both the curriculum and <br /> external peer exposure.
                                            </p>
                                            <button className={`${styles1.buttonPrimary} ${styles1.part} !px-2 w-full`}>
                                                Inquire About Block Seats
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.goldtag}> <CiStar className={styles.goldtagicon} />
                                    Most Selected</p>
                            </div>


                            {/* ============================= */}

                            <div className={styles.cardwhite}>
                                <div className="flex flex-col gap-6">
                                    <div className={`${styles.carddescriptiongrid}`}>
                                        <div className="flex flex-col gap-5">
                                            <div className='space-y-[1.25rem]'>
                                                <p className={styles.sectionheading_box}>
                                                    Bring a Cohort In-House
                                                </p>
                                                <p className={styles.sectionDescription}>
                                                    You have 10–14 leaders, want the content aligned to your current strategy, and prefer a closed experience.
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-3 mb-5 md:mb-0">
                                                <ul className={styles.sectionList}>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Closed cohort of 10–14 leaders from your organization only.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Co-design call with Lisa Bennings to align case studies and examples to your transformation agenda.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        Optional sponsor panel or executive guest in Week 1.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                                        End-of-cohort insights session with your L&D or HR executive.
                                                    </li>
                                                    <li className="flex items-center gap-3">
                                                        {" "}
                                                        <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5"  />
                                                        Priced as a flat fee (effective $1,400–$1,900 per seat depending on program length and customization).
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={`${styles.purplecard}`}>
                                            <p className={`${styles.cardDescription} mb-5`}>
                                                We want this to feel like ours, not <br /> a generic program we <br /> sent people to.
                                            </p>
                                            <button className={`${styles1.buttonPrimary} ${styles1.part} !px-2 w-full`}>
                                                Explore Private Cohort Options
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------- */}

                <section className={`${styles.lightorangesection} py-9 px-3 md:py-[90px] `}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-3 justify-center items-center text-center">
                            <p className={styles1.sectionsmallheading}>
                                Enterprise Decision Flow
                            </p>
                            <p className={styles1.sectionheading}>
                                Use this quick map to find your sponsorship path
                            </p>
                            <p
                                className={`${styles1.sectionDescription} max-w-[35rem] w-full mb-3`}
                            >
                                How many leaders are you sponsoring?
                            </p>
                        </div>
                        {/* Timeline */}
                        <div className="relative flex flex-col items-center mt-4">

                            {/* Vertical Line */}
                            <div className={styles.timelineLine}></div>

                            {/* Item 1 */}
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-10 md:mb-14 w-full max-w-4xl">

                                <div></div>

                                <div className={styles.circle}>
                                    <Image
                                        src="/sponsorshipImages/kingIcon.svg"
                                        alt="kingIcon"
                                        width={45}
                                        height={45}
                                        className="size-[30px] md:size-[45px]"
                                    />
                                </div>

                                <div className="pl-3 md:pl-6">
                                    <span className={styles.orangeBadge}>1-3 LEADERS</span>

                                    <p className={styles.timelineText}>
                                        Are they at VP/C-suite/Director level?
                                        <br />
                                        → Path 1: Sponsor individuals into open cohort
                                    </p>
                                </div>

                            </div>

                            {/* Item 2 */}
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-14 w-full max-w-4xl">

                                <div className="text-right pr-3 md:pr-6">
                                    <span className={styles.orangeBadge}>4-7 LEADERS</span>

                                    <p className={styles.timelineText}>
                                        Are they in different functions or geographies?
                                        <br />
                                        → Path 2: Block seats in open cohort
                                        <br />
                                        Are they all in the same team or initiative?
                                        <br />
                                        → Path 3: Consider private cohort
                                    </p>
                                </div>

                                <div className={styles.circle}>
                                    <Image
                                        src="/sponsorshipImages/kingIcon.svg"
                                        alt="kingIcon"
                                        width={45}
                                        height={45}
                                        className="size-[30px] md:size-[45px]"
                                    />
                                </div>
                                <div></div>
                            </div>

                            {/* Item 3 */}
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-14 w-full max-w-4xl">

                                <div></div>

                                <div className={styles.circle}>
                                    <Image
                                        src="/sponsorshipImages/kingIcon.svg"
                                        alt="kingIcon"
                                        width={45}
                                        height={45}
                                        className="size-[30px] md:size-[45px]"
                                    />
                                </div>

                                <div className="pl-3 md:pl-6">
                                    <span className={styles.orangeBadge}>8-14 LEADERS</span>

                                    <p className={styles.timelineText}>
                                        Do you want content aligned to a live transformation?
                                        <br />
                                        → Path 3: Private cohort
                                        <br />
                                        Do You Want Extended Peer Exposure For Your Team?
                                        <br />
                                        → Path 2: Back Seats + Custom Orientation
                                    </p>
                                </div>

                            </div>

                            {/* Item 4 */}
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full max-w-4xl">

                                <div className="text-right pr-3 md:pr-6">
                                    <span className={styles.orangeBadge}>15+ LEADERS</span>

                                    <p className={styles.timelineText}>
                                        Multi-Cohort Or Deep Sponsorship
                                        <br />
                                        → Contact Us For A Custom Plan
                                    </p>
                                </div>

                                <div className={styles.circle}>
                                    <Image
                                        src="/sponsorshipImages/kingIcon.svg"
                                        alt="kingIcon"
                                        width={45}
                                        height={45}
                                        className="size-[30px] md:size-[45px]"
                                    />
                                </div>

                                <div></div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* --------------------- Organization Receives --------------------- */}
                <section
                    className={`${styles.section} ${styles.darkSection} py-10`}
                    id="cohort-1"
                >
                    <div className="container-width w-full">
                        <div className="  flex flex-col gap-5 items-center ">
                            <div className="flex flex-col gap-3 items-center text-center">
                                <p className={styles1.sectionsmallheading}>What you get</p>
                                <p
                                    className={`${styles1.sectionheading} ${playfair.className}`}
                                    style={{ color: "white" }}
                                >
                                    What Your Organization Receives
                                </p>
                            </div>
                            <p
                                className={`${styles1.sectionDescription} w-full max-w-[765px]  text-center`} style={{ color: "#ffffff" }}
                            >
                                We curate each cohort with intention. Here’s what you can expect with every sponsorship level.

                            </p>

                            <div className="table-wrapper mt-3">
                                <table className={`${styles.tableLayout} lab-plan-table`}>
                                    <thead>
                                        <tr>
                                            <th>Sponsorship Path</th>
                                            <th style={{ textAlign: 'center' }}>Intake Call</th>
                                            <th style={{ textAlign: 'center' }}>Mid-Cohort Check-In</th>
                                            <th style={{ textAlign: 'center' }}>Post-Cohort Impact Summary</th>
                                            <th style={{ textAlign: 'center' }}>End-of-Cohort Sponsor Session</th>
                                            <th style={{ textAlign: 'center' }}>Custom Content Alignment</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td data-label="Tier">Path 1 – Individual</td>
                                            <td className={`bg-dash`}>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    Email
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className='text-center'> - </td>
                                            <td className='text-center'> - </td>
                                        </tr>

                                        <tr>
                                            <td data-label="Tier">Path 2 – Block Seats</td>
                                            <td>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    Call
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className='text-center'>
                                                Optional
                                            </td>
                                            <td className='text-center'>
                                                -
                                            </td>


                                        </tr>

                                        <tr>
                                            <td data-label="Tier">Path 3 – Private Cohort</td>
                                            <td>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    Call
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center justify-center h-full">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span>Included</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Image
                                                        src="/sponsorshipImages/right-y.svg"
                                                        alt="rightIcon"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span>Included</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ----------- FAQS ---------------- */}

                <section className={`${styles.section} ${styles.womenSection}`} style={{ paddingBottom: ' 165px' }}>
                    <div className="container-width w-full">

                        <div className="flex flex-col gap-12  items-center">

                            <div className="flex flex-col gap-2 items-center">
                                <p className={styles1.sectionsmallheading}>FAQs</p>
                                <p className={styles1.sectionheading}>
                                    Frequently Asked Questions from Sponsors
                                </p>
                            </div>

                            <Accordion.Root
                                type="single"
                                collapsible
                                className="grid md:grid-cols-2 gap-5 w-full"
                            >

                               
  {faqData.map((item, index) => (
    <div key={index}>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item
          value={`item-${index}`}
          className="bg-white rounded-3xl shadow-[0_2px_10px_0px_#00000014] overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group w-full flex items-center justify-between px-6 py-5 text-left">
              <span className={styles.faqQuestion}>
                {item.Q}
              </span>

              <FaChevronDown className="w-4 h-4 min-w-4 min-h-4 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="px-6 pb-5 text-sm text-gray-600 leading-relaxed font-chivo data-[state=open]:animate-down data-[state=closed]:animate-up">
            {item.A}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ))}
                            </Accordion.Root>
                        </div>
                    </div>
                </section>


                {/* ------------------------------ new section ------------------------------- */}


                <section
                    className={`${styles.section} ${styles.darkSection}`}
                    id="cohort-1"
                >
                    <div className="container-width w-full">
                        <div className="  flex flex-col gap-8 items-center ">
                            <div className="flex flex-col gap-3 items-center text-center">
                                <p
                                    className={`!text-[#FFFFFF] ${styles1.sectionheading} ${styles.darkSectionsectionheading}`}
                                >
                                    Group & Private Enrollment Options
                                </p>
                                <p className={` !text-[#F1F1F1B2] ${styles.sectionsmallheading}`}>Support your team’s development with reserved seats, group enrollment, or a private cohort experience.</p>
                            </div>

                            <div
                                className={`mt-8  grid grid-cols-3 gap-6 w-full  `}
                            >
                                {[
                                    {
                                        image: "/sponsorshipImages/enrollement1.svg",
                                        title: "Reserve a Seat",
                                        text: "Secure an individual seat in the upcoming cohort. Ideal for leaders joining independently or sponsored by their employer.",
                                        button: "Reserve My Seat ",
                                        type: "reserve"
                                    },
                                    {
                                        image: "/sponsorshipImages/enrollement2.svg",
                                        title: "Block of Seats",
                                        text: "Perfect for ERGs, leadership programs, and teams. Reserve 5–50 seats at a preferred group rate.",
                                        button: "Request Group Pricing",
                                        type: "group"
                                    },
                                    {
                                        image: "/sponsorshipImages/enrollement3.svg",
                                        title: "Private Cohort",
                                        text: "Bring the full Transformation Lab experience to your organization with a dedicated private cohort for up to 50 leaders.",
                                        button: "Explore Private Cohorts",
                                        type: "private"

                                    },
                                ].map((card) => (
                                    <div
                                        className={`${styles.cardwhite} flex flex-col gap-3`}
                                        key={card.title}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={card.image}
                                                    alt="cardheading"
                                                    width={56}
                                                    height={56}
                                                />
                                                <div className={styles.cardheading}>{card.title}</div>
                                            </div>

                                            <p className={`!text-start ${styles.carddescription}`}>
                                                {card.text}
                                            </p>
                                        </div>

                                        {/* ✅ PUSH BUTTON TO BOTTOM */}
                                        <button onClick={() => {

                                            console.log("coming insdie the thinfgs")
                                            if (card.type === "reserve") setReserveModal(true);
                                            if (card.type === "group") setRequestGroupModal(true);
                                            if (card.type === "private") setPrivateCohortModal(true);
                                        }} className="mt-auto bg-burgundy py-3 rounded-[4px] text-white text-sm font-semibold font-chivo">
                                            {card.button}
                                        </button>
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>
                </section>






                {/* ----------------- Ready to invest in your WOC leaders? -------------------- */}
                <section
                    className={styles.ctaBanner}
                    style={{
                        backgroundImage: "url(/sponsorshipImages/investInWOC.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="flex flex-col gap-10 items-center">
                        <div className='flex flex-col items-center justify-center text-center gap-4'>
                            <p
                                className={`${styles.sectionheading_playfair} font-playfair ${playfair.className}`}
                                style={{ color: "white" }}
                            >
                                Ready to invest in your WOC leaders?


                            </p>

                            <p
                                className={`text-[#FFFFFFCC] leading-[28px] font-chivo text-[#65758B] mx-auto w-full text-[18px] text-center font-medium max-w-[670px]`}
                            >
                                Tell us how many leaders you'd like to sponsor and which program interests you. We'll reach out within 48 hours to schedule a 20-minute alignment call.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <a className={`${styles1.buttonPrimary}`} href="/Sponsorship_Request_Template.pdf" download>
                                Sponsor a Leader or Cohort
                            </a>
                            <p
                                className={`text-[#FFFFFFCC] leading-[28px] text-[#65758B] font-chivo mx-auto w-full text-[16px] text-center font-medium`}
                            >
                                For custom enterprise cohorts (15+ leaders) or multi-program packages, email  <a
                                    href="mailto:enterprise@continuumtransformation.com"
                                    className="underline hover:text-white"
                                >
                                    enterprise@continuumtransformation.com
                                </a>{" "} directly.
                            </p>
                        </div>
                    </div>
                </section>

                <Footer />

            </main>

            {reserveModal && <ReserveModal isOpen={reserveModal} setShowSuccessReserveModal={setShowSuccessReserveModal} onClose={() => setReserveModal(false)} />}
            {requestGroupModal && <QueryModal setShowSuccessRequestGroup={setShowSuccessRequestGroup} isOpen={requestGroupModal} onClose={() => setRequestGroupModal(false)} />}

            {privateCohortModal && <PrivateCohortModal isOpen={privateCohortModal} onClose={() => setPrivateCohortModal(false)} setShowPrivateCohortSuccess={setShowPrivateCohortSuccess} />}

            {<SuccessModalRequest
                isOpen={showSuccessRequestGroup}
                onClose={() => setShowSuccessRequestGroup(false)}
            />}
            {<SuccessModal
                isOpen={showSuccessReserveModal}
                onClose={() => setShowSuccessReserveModal(false)}
            />}

            {<PrivateModalSuccess
                isOpen={showPrivateCohortSuccess}
                onClose={() => setShowPrivateCohortSuccess(false)}
            />}
        </div>
    )
}




const SuccessModalRequest = ({ isOpen, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ width: "20px", height: "20px" }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <img src="/images/success.png" alt="" />
                </div>
                <div className="flex flex-col gap-3">

                    {/* Title */}
                    <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
                        Inquiry submitted
                    </h2>

                    {/* Subtitle */}
                    <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
                        Thanks for your interest in group enrollment. Lisa will be in touch shortly with group pricing and a scheduling link.

                    </p>

                    {/* Button */}
                    <button type="submit"
                        onClick={onClose}
                        className="w-full font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
                        style={{
                            marginBottom: "10px",
                            border: "none",
                            cursor: "pointer",
                        }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};


const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ width: "20px", height: "20px" }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <img src="/images/success.png" alt="" />
                </div>
                <div className="flex flex-col gap-3">

                    {/* Title */}
                    <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
                        Application Received
                    </h2>

                    {/* Subtitle */}
                    <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
                        Proceeding to payment — you'll receive a confirmation email with your cohort details and next steps.

                    </p>

                    {/* Button */}
                    <button type="submit"
                        onClick={onClose}
                        className="w-full font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
                        style={{
                            marginBottom: "10px",
                            border: "none",
                            cursor: "pointer",
                        }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

const PrivateModalSuccess = ({ isOpen, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ width: "20px", height: "20px" }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <img src="/images/success.png" alt="" />
                </div>
                <div className="flex flex-col gap-3">

                    {/* Title */}
                    <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
                        Consultation request sent

                    </h2>

                    {/* Subtitle */}
                    <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
                        We'll send over our private cohort deck and reach out to schedule a conversation to explore fit.
                    </p>

                    {/* Button */}
                    <button type="submit"
                        onClick={onClose}
                        className="w-full font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
                        style={{
                            marginBottom: "10px",
                            border: "none",
                            cursor: "pointer",
                        }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};


const ErrorModal = ({ isOpen, onClose }: ErrorModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ width: "20px", height: "20px" }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                </button>


                <div className="flex justify-center mb-4">
                    <img src="/images/failure.png" alt="" />

                </div>

                <div className="flex flex-col gap-3">

                    {/* Title */}
                    <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-[#29303D]">
                        Payment Failed
                    </h2>

                    {/* Subtitle */}
                    <p className="font-chivo font-medium text-sm leading-5 text-center #737B8C">
                        Please try again
                    </p>

                    {/* Button */}
                    <button type="submit"
                        className="w-full font-chivo font-semibold text-[14px] bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99]  py-[12px] px-[13px] capitalize"
                        style={{
                            marginBottom: "10px",
                            border: "none",
                            cursor: "pointer",
                        }}>
                        Back to Pricing
                    </button>

                </div>

            </div>






        </div>
    );
};