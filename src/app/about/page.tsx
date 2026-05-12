"use client";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "./about.module.css";
import Footer from "@/components/Footer";
import { Playfair_Display } from 'next/font/google';
import Link from "next/link";

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
});



const data = [
    { label: "Fuzzy strategy and misaligned goals", value: 88 },
    { label: "Overloaded top talent", value: 73 },
    { label: "Change fatigue and trust gaps", value: 66 },
    { label: "Shallow operating models", value: 60 },
];

export default function AboutPage() {

    return (
        <div className={styles.page}>
            <Header />
            <main>
                {/* ---------- Continuum transformation about section -------------- */}
               <section className={`${styles.ctaBanner} relative overflow-hidden`}>

  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/aboutImages/bg-about.webp"
      alt="About Background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col gap-10 items-center">
                        <div className='flex flex-col items-center justify-center text-center gap-4'>
                            <p
                                className={`${styles.heroTitle} ${playfair.className}`}
                                style={{ color: "white" }}
                            >
                                About Continuum<br />
                                Transformation
                            </p>
                            {/* <p className={`${styles.sectionDescription} max-w-[42rem] text-center text-white`}> */}
                            <p
                                className={`${styles.heroText} max-w-[54rem]`}
                            >
                                Continuum Transformation exists to turn high‑stakes change into durable results for enterprises and the women of color leaders driving them. We bridge strategy, execution, and the human realities that make-or-break transformation in the rooms that matter.
                            </p>
                        </div>
                    </div>
                </section>

                {/* -------------------- Lisa Bennings Introduction ---------------------- */}
                <section className={`${styles.section} ${styles.frameWorkSection}`}>
                    <div className="container-width w-full">
                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                            <Image
                                className=" justify-self-center lg:justify-self-start shadow-lisa "

                                src="/aboutImages/Lisa.webp"
                                alt="Enterprise leaders in a meeting"
                                width={600}
                                height={622}
                            />
                            <div className="flex flex-col gap-6 items-center lg:items-start text-center lg:text-left lg:max-w-[40rem]">
                                {/* <div className="flex flex-col gap-5"> */}
                                <div className="flex flex-col gap-1">
                                    <p className={`${styles.sectionheading} ${styles.sub_head_w}`}>
                                        Meet Lisa Bennings
                                    </p>
                                </div>
                                <p className={styles.sectionDescription}>
                                    Lisa Bennings is the founder of Continuum Transformation, where she helps leaders and organizations navigate the realities of change with clarity and confidence. Drawing on more than two decades leading transformation across marketing, digital, and customer experience, she brings both the operator’s precision and the coach’s instinct for human dynamics.
                                </p>
                                <p className={styles.sectionDescription}>
                                    Having spent years inside the C‑suite where strategy, politics, and execution collide, Lisa knows how easily even the best‑intentioned transformations can stall. Before launching Continuum, she guided complex enterprise programs, partnering with CMOs, CDOs, and growth leaders to modernize how their organizations work and deliver meaningful results.
                                </p>
                                <p className={styles.sectionDescription}>
                                    Today, she uses those lessons to help clients de‑risk transformation and strengthen the leadership muscle required to sustain it. Known for her clear, unfiltered counsel and gift for creating rooms where senior leaders can be honest about what’s really at stake, Lisa blends big‑picture thinking with practical execution—turning bold visions into durable change.

                                </p>
                                <p className={styles.sectionDescription}>
                                    Outside of work, Lisa is married to her best friend and is a regular on the pickleball court, where teamwork, agility, and a bit of friendly competition keep her grounded and growing—just like in life.

                                </p>
                                {/* </div> */}
                            </div>


                        </div>
                    </div>
                </section>

                {/* ----------- Continuum Approach --------- */}
                <section className={`${styles.sectionsmall} `}>
                    <div className="container-width w-full ">
                        <div className="flex flex-col gap-6 items-center ">
                            <div className="flex flex-col gap-5 justify-center items-center text-center">
                                <p className={styles.sectionsmallheading}>
                                    The Continuum Approach
                                </p>
                                <p className={styles.sectionheading}>
                                    From big decks to durable outcomes
                                </p>
                                <p
                                    className={`${styles.sectionDescription} max-w-[35rem] w-full`}
                                >
                                    Most transformation partners stop at strategy. Continuum stays with you across the
                                    continuum—from decision to design to delivery—so change is felt in customer
                                    experiences, financials, and culture.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------- Before / After ----------------- */}
                <section className={`${styles.section} ${styles.pt0}`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-10 items-center ">
                            <div className="flex flex-col gap-5 justify-center items-center text-center">
                                <p className={styles.sectionsmallheading}>
                                    Before / After
                                </p>
                                <p className={styles.sectionheading}>
                                    What change looks like before and after Continuum
                                </p>
                            </div>

                            {/* ============================== */}

                            {/* Cards */}
                            <div className={styles.cardsWrapper}>

                                {/* Before Card */}
                                <div className={styles.beforeCard}>
                                    <p className={styles.cardTitle}>Before Continuum</p>

                                    <ul className={styles.list}>
                                        <li>
                                            Fragmented initiatives, unclear ownership, and overlapping programs competing for the same people and budget.
                                        </li>
                                        <li>
                                            Transformation framed as a technology or “tool” project with little connection to business outcomes.
                                        </li>
                                        <li>
                                            Change fatigue, quiet resistance, and a narrative of another initiative that will blow over.
                                        </li>
                                        <li>
                                            Women of color leaders carrying disproportionate invisible labor for culture and inclusion on top of high-stakes work.
                                        </li>
                                    </ul>
                                </div>

                                {/* After Card */}
                                <div className={styles.afterCard}>
                                    <p className={styles.cardTitleLight}>After Continuum</p>

                                    <ul className={styles.listLight}>
                                        <li>
                                            A coherent portfolio view of transformation with clear choices, priorities, and owners.
                                        </li>
                                        <li>
                                            Outcomes-based roadmaps that tie technology, process, and talent decisions to measurable goals.
                                        </li>
                                        <li>
                                            An operating rhythm that surfaces risks early, supports decision-making, and reduces change fatigue.
                                        </li>
                                        <li>
                                            Women of color leaders better equipped and supported to lead at the center of power, not the margins.
                                        </li>
                                    </ul>
                                </div>

                            </div>

                            {/* ========================================= */}
                        </div>
                    </div>
                </section>

                {/* --------------- Operating Rhythm Frameworks ----------------- */}
                <section className={`${styles.section} ${styles.darkSection}`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-6 items-center ">
                            <div className="flex flex-col gap-5 justify-center items-center text-center">
                                <p className={`${styles.sectionsmallheading} mb-2 `}>
                                    Operating Rhythm Frameworks
                                </p>
                                <p className={`${styles.sectionheading} ${styles.bgWhite}`}>
                                    Making transformation a rhythm, not a one-off event
                                </p>
                                <p
                                    className={`${styles.sectionDescription} ${styles.text_F1F1F1} ${styles.text18px} font-semibold max-w-[46rem] w-full`}
                                >
                                    Successful transformations don't run on heroics; they run on an operating rhythm that
                                    keeps strategy, execution, and learning in sync. Continuum helps you install a
                                    transformation rhythm that fits your culture and scale.
                                </p>
                            </div>
                            <div className={`${styles.mt60}  grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 `}>
                                {[
                                    {
                                        image: "/aboutImages/operating-rythem1.svg",
                                        title: "Diagnose",
                                        text: "Clarify the real problem, stakes, and constraints—and who must be in the room.",
                                    },
                                    {
                                        image: "/aboutImages/operating-rythem4.svg",
                                        title: "Design",
                                        text: "Co‑create initiatives, roles, and governance that can survive contact with reality.",
                                    },
                                    {
                                        image: "/aboutImages/operating-rythem3.svg",
                                        title: "Deliver",
                                        text: "Run execution labs, stand‑ups, and decision forums that keep work moving and risks visible.",
                                    },
                                    {
                                        image: "/aboutImages/operating-rythem2.svg",
                                        title: "Debrief",
                                        text: "Capture learnings, reset bets, and update the roadmap so progress compounds instead of resetting.",
                                    },
                                ].map((card) => (
                                    <div
                                        className={`${styles.card} flex flex-col gap-3 items-center justify-center `}
                                        key={card.title}
                                    >
                                        <div className=" flex flex-col gap-2 items-center justify-center mb-3">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={58}
                                                height={58}
                                            />
                                        </div>

                                        <div className={styles.cardheading}>{card.title}</div>
                                        <p className={styles.carddescription}>{card.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------- Why Transformations Fail ---------------- */}

                <section className={`${styles.section} ${styles.frameWorkSection}`}>
                    <div className="max-w-4xl mx-auto text-center px-4">

                        {/* Top Label */}
                        <p className={styles.sectiontitle_sm}>
                            Why Transformations Fail (And how we respond)
                        </p>

                        {/* Heading */}
                        <h2 className={`${styles.sectionheading} text-inter mt-2`}>
                            Why So Many Transformations Fail
                        </h2>

                        {/* Description */}
                        <p
                            className={`${styles.color65758B} ${styles.sectionDescription} ${styles.text18px} font-semibold max-w-[49rem] w-full mx-auto mt-4`}
                        >
                            Depending on the study, between 70% and 88% of business and digital
                            transformations fail to meet their original ambitions. The reasons are
                            remarkably consistent—and addressable.
                        </p>

                        {/* Progress Bars */}
                        <div className={styles.rangeAlign}>
                            {data.map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1">
                                        <span className={`${styles.text29303D} ${styles.sectionDescription} `}>{item.label}</span>
                                        <span className={styles.sectionDescription}>
                                            {item.value}%
                                        </span>
                                    </div>

                                    {/* Track */}
                                    <div className="w-full bg-[#D7CBCA] h-[12px] rounded-full">
                                        {/* Fill */}
                                        <div
                                            className="h-[12px] rounded-full bg-burgundy"
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Card */}
                        <div className={`${styles.bgF2E5FF4D} ${styles.card} mt-12 text-left border-none`}>
                            <h3 className={`${styles.text17} ${styles.listheading} text-inter `}>Continuum's Response</h3>
                            <p className={`${styles.textChange} ${styles.sectionDescription} `}>
                                Continuum designs every engagement to counter these failure modes—
                                by clarifying strategy, right-sizing the portfolio, protecting
                                critical roles, and building an operating rhythm that respects
                                human limits.
                            </p>
                        </div>

                    </div>
                </section>


                {/* --------------- Case studies from inside the work ----------------- */}
                <section className={styles.section}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-10 items-center ">
                            <div className="flex flex-col gap-5 justify-center items-center text-center">
                                <p className={styles.sectionheading}>
                                    Case studies from inside the work
                                </p>
                            </div>

                            {/* ============================== */}

                            {/* Cards */}
                            <div className={`${styles.gap10} ${styles.cardsWrapper}`}>

                                {/* Before Card */}
                                <div className={styles.caseStudiesCard}>
                                    <p className={styles.cardTitleCase}>JP Morgan Chase – Global Merchant Payments & eCommerce Platform</p>
                                    <p
                                        className={`${styles.sectionDescriptionCaseStudies} max-w-[35rem] w-full`}
                                    >
                                        JPMorgan Chase needed a unified payments and eCommerce platform to support global merchants across EMEA, APAC, and LATAM. As VP of Digital Innovation and Transformation, Lisa led the design of the foundational platform that became a core building block for what is now Chase Payment Solutions used by global merchants, as a single, integrated way to manage cross border payments.

                                    </p>
                                </div>

                                {/* After Card */}
                                <div className={styles.caseStudiesCard}>
                                    <p className={styles.cardTitleCase}>Comerica – Account Opening Workflow <br /> Modernization</p>
                                    <p
                                        className={`${styles.sectionDescriptionCaseStudies} max-w-[35rem] w-full`}
                                    >
                                        Comerica’s manual, email driven account opening workflows created operational risk, inconsistent audit trails, and limited visibility. As SVP of Business Transformation, Lisa led a cross functional team to implement Adobe Workfront, standardize workflows, and embed audit and performance reporting into the process. The new model eliminated spreadsheets, made status transparent, and delivered an estimated $2.5M in value through efficiency and risk reduction.
                                    </p>
                                </div>
                            </div>
                            <a className={styles.buttonPrimary} href="/casestudies">
                                View more case studies
                            </a>
                        </div>
                    </div>
                </section>


                {/* -------------------------------------------------- */}


                {/* --------------- Enterprise Testimonials ----------------- */}
                <section className={`${styles.section} ${styles.darkSection}`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-14 items-center ">
                            <div className="flex flex-col gap-2 justify-center items-center text-center">
                                <p className={styles.sectionsmallheading}>
                                    Enterprise Testimonials
                                </p>
                                <p className={`${styles.sectionheading} ${styles.bgWhite}`}>
                                    What enterprise leaders say
                                </p>
                            </div>
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 `}>
                                {[
                                    {
                                        image: "/aboutImages/quote-sign.svg",
                                        title: "SVP, Enterprise Strategy",
                                        text: "Lisa doesn't just advise—she operates. She understood our politics, our constraints, and still moved us forward faster than we thought possible.",
                                        tag: "Fortune 200 Financial Services"
                                    },
                                    {
                                        image: "/aboutImages/quote-sign.svg",
                                        title: "Chief Digital Officer",
                                        text: "The operating rhythm Continuum installed changed how our leadership team makes decisions. We went from reactive to proactive in under six months.",
                                        tag: "Global Retail Brand"
                                    },
                                    {
                                        image: "/aboutImages/quote-sign.svg",
                                        title: "VP, Customer Experience",
                                        text: "As a woman of color in a senior role, I finally felt seen and supported—not as a diversity initiative, but as a leader driving results.",
                                        tag: "Enterprise Technology Company"
                                    },
                                ].map((card) => (
                                    <div
                                        className={`${styles.card} flex flex-col gap-3 items-start justify-start `}
                                        key={card.title}
                                    >
                                        <div className=" flex flex-col gap-2 align-start justify-start mb-3">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={32}
                                                height={32}
                                            />
                                        </div>

                                        <p className={styles.carddescription_Testimonials}>{card.text}</p>
                                        <div>
                                            <div className={`${styles.carddescription_Testimonials} ${styles.carddescription_title} `}>{card.title}</div>
                                            <div className={styles.carddescription_tag}>{card.tag}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --------------- Engagement Levels ----------------- */}
                <section className={`${styles.section}`}>
                    <div className="container-width w-full">
                        <div className="flex flex-col gap-10 items-center ">
                            <div className="flex flex-col gap-3 justify-center items-center text-center">
                                <p className={styles.sectionsmallheading}>
                                    Engagement Levels
                                </p>
                                <p className={`${styles.sectionheading}`}>
                                    How we structure investment
                                </p>
                                <p
                                    className={`${styles.sectionDescription} ${styles.text18px} font-semibold max-w-[46rem] w-full`}
                                >
                                    Every engagement is scoped to your context, scale, and urgency, but most enterprise clients invest at three levels: advisory, cohort experiences, and execution labs.
                                </p>
                            </div>
                            <div className={`${styles.mt60}  grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 `}>
                                {[
                                    {
                                        image: "/aboutImages/engagementLevel23.svg",
                                        title: "Advisory Partnerships",
                                        text: "Retainer‑based, typically scoped to support C‑suite leaders and transformation offices on a monthly or quarterly basis.",
                                    },
                                    {
                                        image: "/aboutImages/engagementLevel22.svg",
                                        title: "Enterprise Cohorts",
                                        text: "Facilitated leadership experiences for cross-functional team priced per cohort based on size, duration, and level of customization.  ",
                                    },
                                    {
                                        image: "/aboutImages/engagementLevel21.svg",
                                        title: "Execution Labs",
                                        text: "Hands-on transformation sprints that move from diagnosis to delivery offered at fixed‑fee or project‑based for tightly defined sprints with clear outcomes and timeframes.",
                                    },
                                ].map((card) => (
                                    <div
                                        className={`${styles.cardBorder} !bg-[#F6F6F9] !border-none`}
                                        key={card.title}
                                    >
                                        <div className=" flex flex-col gap-2 align-start justify-start mb-3">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={56}
                                                height={56}
                                            />
                                        </div>

                                        <div className={styles.cardheading}>{card.title}</div>
                                        <p className={`${styles.w19} ${styles.carddescription}`}>{card.text}</p>
                                    </div>
                                ))}
                            </div>
                            <p className={`${styles.sectionDescription} ${styles.text18px} text-center font-semibold  w-full`}
                            >
                                We'll work with you to design a scope and investment that aligns to the value at stake in your transformation.
                            </p>
                            <Link className={styles.buttonPrimary} href="/talkWithUs">
                                Talk with us about scope and investment
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    )
}