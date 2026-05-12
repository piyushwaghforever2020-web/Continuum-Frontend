"use client";

import Header from "@/components/Header";
import styles from "./cohort.module.css";
import Footer from "@/components/Footer";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import CohortCalendarDownloadButton from "@/components/CohortCalendarDownloadButton";
const calendarHref = "/Upcoming_Cohort_Dates_v2.pdf";



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

export default function Cohort() {
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
                AI Automation for Enterprise Transformation Leaders
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
                  AI Automation For Enterprise Transformation Leaders
                </h2>
                <div >

                  <p className={styles.aiText}>
                    Ship AI-driven workflows that go beyond meeting notes—automate real
                    transformation and data insights tasks that save hours, reduce friction,
                    and are ready to demo.
                  </p>
                </div>

                <div>
                  <p className={styles.subTitle}>WHAT YOU’LL LEAVE WITH:</p>

                  <ul className={styles.list}>
                    <li className={styles.listItem}>
                      <Image src="/cohort/correct.svg" alt="tick" width={16} height={16} />
                      <span>At least one production-ready AI automation tied to a live transformation, reporting, or data task</span>
                    </li>

                    <li className={styles.listItem}>
                      <Image src="/cohort/correct.svg" alt="tick" width={16} height={16} />
                      <span>Automation Playbook you can use internally or present to a sponsor.</span>
                    </li>

                    <li className={styles.listItem}>
                      <Image src="/cohort/correct.svg" alt="tick" width={16} height={16} />
                      <span>7–10+ hours per week reclaimed — based on targeting one high-leverage workflow.</span>
                    </li>

                    <li className={styles.listItem}>
                      <Image src="/cohort/correct.svg" alt="tick" width={16} height={16} />
                      <span>A leadership narrative: "Here is how I lead AI-enabled transformation".</span>
                    </li>
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
              This is a 5-week, hands-on cohort designed for leaders responsible for driving real transformation inside their organizations. You will design and deploy one AI-powered workflow tied  directly to your role — focused on saving time, improving visibility, or accelerating execution.
            </p>

            <div className={` grid grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-5 gap-6  `}>
              {[
                {
                  image: "/cohort/program5.png",
                  phase: "Dates",
                  title: "May 11 – June 12,2026",
                  learnMore: true

                },
                {
                  image: "/cohort/program4.png",
                  phase: "Duration",
                  title: "5 weeks",

                },
                {
                  image: "/cohort/program3.png",
                  phase: "Format",
                  title: "Live sessions + hands-on workshops",

                },
                {
                  image: "/cohort/program2.png",
                  phase: "Time Commitment",
                  title: "3–4 hours perweek",

                },
                {
                  image: "/cohort/program1.png",
                  phase: "Cohort Size",
                  title: "8–14 leaders",

                },
              ].map((card) => (
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
                {[
                  {
                    tag: "Most Selected",
                    title: "Fast-Track Cohort (Pilot)",
                    price: "$1,300",
                    desc: "Limited pilot pricing",
                    highlight: true,
                  },
                  {
                    title: "Standard Org-Paid Seat",
                    price: "$1,800",
                    desc: "Invoiced to your organization",
                  },
                  {
                    title: "Standard Self-Pay",
                    price: "$1,300 – $1,500",
                    desc: "Flexible payment options",
                  },
                  {
                    title: "Internal Org Cohort (10–12)",
                    price: "$1,400 – $1,500/seat",
                    desc: "Custom cohort for your team",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className={`${styles.pricingCard} ${card.highlight ? styles.pricingCardHighlight : ""
                      }`}
                  >
                    {/* TAG */}
                    {card.tag && (
                      <div className={styles.pricingTag}>
                        <img src="/cohort/star.png" alt="" />
                        <p>

                          {card.tag}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <p className={styles.pricingTitle}>{card.title}</p>
                      <p className={styles.pricingPrice}>{card.price}</p>
                      <p className={styles.pricingDesc}>{card.desc}</p>
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
                <span>Limited to 8–14 participants</span>
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
                      <tr>
                        <td data-label="Tier">Within 7 days of enrollment</td>
                        <td data-label="Price" className={styles.price}>
                          Full refund
                        </td>
                      </tr>

                      <tr>
                        <td data-label="Tier">Up to 30 days before cohort start</td>
                        <td data-label="Price" className={styles.price}>
                          50% refund
                        </td>
                      </tr>

                      <tr>
                        <td data-label="Tier">Within 7 days of start date</td>
                        <td data-label="Price" className={styles.price}>
                          No refunds
                        </td>
                      </tr>

                      <tr>
                        <td data-label="Tier">Deferral</td>
                        <td data-label="Price" className={styles.price}>
                          One-time deferral to a future cohort is allowed
                        </td>
                      </tr>
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
