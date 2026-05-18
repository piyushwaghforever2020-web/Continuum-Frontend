"use client";

import Header from "@/components/Header";
import styles from "./cohort.module.css";
import Footer from "@/components/Footer";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import CohortCalendarDownloadButton from "@/components/CohortCalendarDownloadButton";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
const calendarHref = "/Upcoming_Cohort_Dates_v2.pdf";

type InvestmentTier = {
  tier?: string;
  price?: string;
  best_for?: string;
};

type RefundDeferralPolicy = {
  program?: string;
  price_per_seat?: string;
};

type CohortDetails = {
  id?: string;
  name?: string;
  description?: string;
  duration_weeks?: number;
  duration_format?: string;
  duration?: string;
  seat_limit?: number;
  format?: string;
  time_commitment?: string;
  program_overview?: string;
  leave_with?: string[];
  live_sessions_text?: string;
  workshops_text?: string;
  investment_tiers?: InvestmentTier[];
  refund_deferral_policy?: RefundDeferralPolicy[];
};



const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

//Download Calender
  const downloadCalendar = () => {
    const link = document.createElement("a");
    link.href = calendarHref;
    link.download = "Upcoming_Cohort_Dates_v2.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

function CohortContent() {
  const searchParams = useSearchParams();
  const cohortId = searchParams.get("id");
  const [cohortDetails, setCohortDetails] = useState<CohortDetails | null>(null);

  const leaveWith = cohortDetails?.leave_with?.length
    ? cohortDetails.leave_with
    : [
        "At least one production-ready AI automation tied to a live transformation, reporting, or data task",
        "Automation Playbook you can use internally or present to a sponsor.",
        "7-10+ hours per week reclaimed - based on targeting one high-leverage workflow.",
        'A leadership narrative: "Here is how I lead AI-enabled transformation".',
      ];

  const programCards = [
    {
      image: "/cohort/program5.png",
      phase: "Dates",
      title: cohortDetails?.duration_format || "May 11 - June 12, 2026",
      learnMore: true,
    },
    {
      image: "/cohort/program4.png",
      phase: "Duration",
      title: cohortDetails?.duration_weeks
        ? `${cohortDetails.duration_weeks} weeks`
        : cohortDetails?.duration || "5 weeks",
    },
    {
      image: "/cohort/program3.png",
      phase: "Format",
      title: cohortDetails?.format || cohortDetails?.live_sessions_text || cohortDetails?.workshops_text || "Live sessions + hands-on workshops",
    },
    {
      image: "/cohort/program2.png",
      phase: "Time Commitment",
      title: cohortDetails?.time_commitment || "3-4 hours per week",
    },
    {
      image: "/cohort/program1.png",
      phase: "Cohort Size",
      title: cohortDetails?.seat_limit ? `${cohortDetails.seat_limit} leaders` : "8-14 leaders",
    },
  ];

  const investmentTiers = cohortDetails?.investment_tiers?.length
    ? cohortDetails.investment_tiers
    : [
        {
          tier: "Fast-Track Cohort (Pilot)",
          price: "$1,300",
          best_for: "Limited pilot pricing",
        },
        {
          tier: "Standard Org-Paid Seat",
          price: "$1,800",
          best_for: "Invoiced to your organization",
        },
        {
          tier: "Standard Self-Pay",
          price: "$1,300 - $1,500",
          best_for: "Flexible payment options",
        },
        {
          tier: "Internal Org Cohort (10-12)",
          price: "$1,400 - $1,500/seat",
          best_for: "Custom cohort for your team",
        },
      ];

  const refundPolicyRows = cohortDetails?.refund_deferral_policy?.length
    ? cohortDetails.refund_deferral_policy
    : [
        { program: "Within 7 days of enrollment", price_per_seat: "Full refund" },
        { program: "Up to 30 days before cohort start", price_per_seat: "50% refund" },
        { program: "Within 7 days of start date", price_per_seat: "No refunds" },
        { program: "Deferral", price_per_seat: "One-time deferral to a future cohort is allowed" },
      ];

  useEffect(() => {
    if (!cohortId) return;

    const getCohortDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts/${cohortId}`,
        );

        console.log("Cohort details:", response?.data);
        setCohortDetails(response?.data?.data ?? null);
      } catch (error) {
        console.error("Error fetching cohort details", error);
      }
    };

    console.log("Cohort id from success payment:", cohortId);
    getCohortDetails();
  }, [cohortId]);

  return (
    <div className={styles.page}>
      <Header />
      <main>

        <section
          className={`${styles.ctaBanner} bg-[url('/cohort/cohort-small.png')] md:bg-[url('/cohort/cohort.webp')]`}
          style={{
            // backgroundImage: "url(/aboutImages/bg-about.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-col gap-10 items-center max-w-[802px] px-4 sm:px-0">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <p
                className={`${styles.heroTitle} ${playfair.className}`}
                style={{ color: "white" }}
              >
                Cohort Program
              </p>
              <p className={`${styles.heroText} max-w-[54rem]`}>
                {cohortDetails?.name || "AI Automation for Enterprise Transformation Leaders"}
              </p>
            </div>
          </div>
        </section>


        <section className={styles.section}>
          <div className="container-width w-full ">

            <div className={styles.gridTwo}>

              {/* LEFT */}
              <div className="flex flex-col gap-5">
                <h2 className={styles.aiTitle}>
                  {cohortDetails?.name || "AI Automation For Enterprise Transformation Leaders"}
                </h2>
                <div >

                  <p className={styles.aiText}>
                    {cohortDetails?.description ||
                      "Ship AI-driven workflows that go beyond meeting notes-automate real transformation and data insights tasks that save hours, reduce friction, and are ready to demo."}
                  </p>
                </div>

                <div>
                  <p className={styles.subTitle}>WHAT YOU’LL LEAVE WITH:</p>

                  <ul className={styles.list}>
                    {leaveWith.map((item) => (
                      <li className={styles.listItem} key={item}>
                        <Image src="/cohort/correct.svg" alt="tick" width={16} height={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* <button className={styles.buttonPrimaryAi}>
          Call to Action
        </button> */}
              </div>

              {/* RIGHT */}
              <div>
                <img
                  src="/cohort/cohort-image.webp"
                  alt="session"
                  className={styles.image}
                />
              </div>

            </div>

            {/* OVERVIEW */}


          </div>
        </section>


        <section className="container-width mb-12">


          <div className={styles.availabilityBox}>

            <p className={styles.sectionheading_box}>Program Overview</p>

            <h3 className={styles.sectiondsubdescription}>
              What This Program Is
            </h3>

            <p className={styles.availabilityText}>
              {cohortDetails?.program_overview ||
                "This is a 5-week, hands-on cohort designed for leaders responsible for driving real transformation inside their organizations. You will design and deploy one AI-powered workflow tied directly to your role - focused on saving time, improving visibility, or accelerating execution."}
            </p>

            <div className={` grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-5 gap-6  `}>
              {programCards.map((card) => (
                <div
                  className={`${styles.programcard} flex flex-col gap-1  items-start justify-start `}
                  key={card.title}
                >
                  <div className=" flex flex-col gap-3 align-start justify-start ">
                    <Image
                      src={card.image}
                      alt="cardheading"
                      width={48}
                      height={48}
                    />
                    <div className={styles.programcardtitle}>{card.phase}</div>
                  </div>

                  <div className={`${styles.programcardheading} text-start`}>{card.title}</div>
                  {card?.learnMore && <Link href="/contact" className="font-chivo cursor-pointer font-semibold text-sm text-burgundy underline">Learn more</Link>}
                </div>
              ))}
            </div>

          </div>

        </section>



        <section className="bg-nearBlack py-20">


          <div className={styles.availabilityBox}>

            <p className={styles.sectionheading_box}>Pricing</p>

            <h3 className={styles.pricingdsubdescription}>
              Investment Options
            </h3>


            <div className="max-w-[986px] mx-auto">
              <div className="grid grid-cols-1 mt-8 md:grid-cols-2 gap-[30px] justify-items-center">
                {investmentTiers.map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.pricingCard} ${index === 0 ? styles.pricingCardHighlight : ""
                      }`}
                  >
                    {/* TAG */}
                    {index === 0 && (
                      <div className={styles.pricingTag}>
                        <img src="/cohort/star.png" alt="" />
                        <p>

                          Most Selected
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className={styles.pricingTitle}>{card.tier || "Investment Tier"}</p>
                      <p className={styles.pricingPrice}>{card.price}</p>
                      <p className={styles.pricingDesc}>{card.best_for || "Flexible payment options"}</p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

        </section>



        <section className="container-width mt-10">


          <div className={styles.availabilityBoxSeat}>

            <p className={styles.sectionheading_box}>Availability</p>

            <h3 className={styles.sectiondsubdescription}>
              Seat Availability
            </h3>

            <p className={styles.availabilityText}>
              This is a small, curated cohort to ensure quality and meaningful peer interaction.
            </p>

            <div className={styles.availabilityRow}>

              <div className={` bg-white ${styles.availabilityItem}`}>
                <img
                  src="/cohort/security.svg"
                  alt="users"
                  className={styles.availabilityIcon}
                />
                <span>Limited to {cohortDetails?.seat_limit || "8-14"} participants</span>
              </div>

              <div className={` bg-white ${styles.availabilityItem}`}>
                <img
                  src="/cohort/user.svg"
                  alt="security"
                  className={styles.availabilityIcon}
                />
                <span>Applications are reviewed before acceptance</span>
              </div>

              <div className={` bg-white ${styles.availabilityItem}`}>
                <img
                  src="/cohort/clock.svg"
                  alt="clock"
                  className={styles.availabilityIcon}
                />
                <span>Cohorts typically fill before the deadline</span>
              </div>

            </div>

          </div>

        </section>




        <div className="flex flex-col gap-10 mt-12  bg-[#F5F3EF]">
          <div className={` py-20 container-width `}>
            <div className="flex flex-col gap-6">
              <div className={`${styles.carddescriptiongrid}`}>
                <div className="flex flex-col gap-5">
                  <div className='space-y-[1.25rem]'>
                    <p className={styles.sectionheading_box}>
                      Policy
                    </p>
                    <p className={styles.sectionDescription}>
                      Refund & Deferral Policy
                    </p>
                  </div>

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
                      {refundPolicyRows.map((row, index) => (
                        <tr key={`${row.program}-${index}`}>
                          <td data-label="Tier">{row.program || "-"}</td>
                          <td data-label="Price" className={styles.price}>
                            {row.price_per_seat || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>




        </div>



        <section
          className={styles.ctaBanner}
          style={{
            backgroundImage: "url(/sponsorshipImages/cohort-ready-bg.webp)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex  flex-col gap-10 items-center">
            <div className='flex flex-col items-center justify-center text-center gap-4'>
              <p
                className={`${styles.sectionheading} ${playfair.className}`}
                style={{ color: "white" }}
              >
                Ready to Apply?

              </p>
              {/* <p className={`${styles.sectionDescription} max-w-[42rem] text-center text-white`}> */}
              <p
                className={`text-[#FFFFFFCC] leading-[28px] font-chivo text-[#65758B] mx-auto w-full text-[18px] text-center font-medium max-w-[670px]`}
              >
                Seats are limited and filled through a <br /> short application process.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 md:flex-row">
               <button className={styles.buttonPrimary} onClick={()=>{
                downloadCalendar()
              }}>
                Download Cohort Calendar
              </button>
              <a className={`${styles.buttonPrimary} !px-16`} href="/registration">
                Register
              </a>
             
              {/* <CohortCalendarDownloadButton className={`${styles.buttonPrimary} !px-16`}>
                Download Cohort Calendar
              </CohortCalendarDownloadButton> */}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

export default function Cohort() {
  return (
    <Suspense fallback={null}>
      <CohortContent />
    </Suspense>
  );
}
