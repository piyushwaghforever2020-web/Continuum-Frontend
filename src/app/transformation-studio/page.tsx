"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Link from "next/link";
import styles from "./studio.module.css";
import styles1 from "../enterprise/enterprise.module.css";
import Footer from "@/components/Footer";
import { Playfair_Display } from 'next/font/google';
import { Inter } from 'next/font/google';
import InviteToSpeakModal from "@/components/InviteToSpeakModal";
import EmailListModal from "./EmailListModal";
import { IoMdCheckmark } from "react-icons/io";

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
});

const paths = [
    {
        title: "The Transformation Introduction: Let's talk hard truths",
        description:
            "Welcome to the Transformation Studio—a space where women of color…can turn that type of pressure into strategic advantage.",
        cta: "Coming soon",
        href: "/enterprise",
        image: "/studioImages/tes-studio.webp",
    },
    {
        title: "Lead the Data Narrative",
        description:
            "You can absolutely own the data and AI story…even if you’ve never managed a data team a day in your life.",
        cta: "Coming soon",
        href: "/lab",
        image: "/studioImages/ts-podcast02.webp",
    },
    {
        title: "Outgrowing the Box",
        description:
            "When You’re Too Big for Your Role.",
        cta: "Coming soon",
        href: "/studio",
        image: "/studioImages/ts-podcast.webp",
    },
];

const podcastEpisodeTags = ["Enterprise Transformation", "Women of Color in Leadership", "Culture and Change", "Future of Work"];

export default function TransformationStudioPage() {

    const [openInvite, setOpenInvite] = useState(false);
    const [joinEmail, setJoinEmail] = useState(false);

    return (
        <div className={styles.page}>
            <Header />
            <main>
               <section className={`${styles.hero} relative overflow-hidden`}>

  {/* Mobile Background */}
  <div className="absolute inset-0 block md:hidden">
    <Image
      src="/studioImages/transformation-mobile.webp"
      alt="Transformation Studio Banner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/studioImages/transformation-studio04.webp"
      alt="Transformation Studio Banner"
      fill
    //   priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 container-width w-full">
                        <div className={styles.heroContent}>
                            <h1 className={`${styles.heroTitle} max-w-[500px]`}>
                                The Transformation Studio
                            </h1>
                            <div className="flex flex-col gap-6">
                                <p className={`${styles1.heroText} max-w-[500px]`}>
                                    Conversations and tools for leaders making complex
                                    change stick.
                                </p>
                                <div className="flex flex-col md:flex-row align-center gap-[0.8rem] md:gap-6">
                                    <a
                                        href='#youtube'
                                        className={`${styles1.buttonPrimary} justify-center flex-1`}>
                                        Subscribe to the podcast
                                    </a>
                                    <button
                                        onClick={() => setOpenInvite(true)}
                                        className={`${styles1.buttonSecondaryOutline} justify-center flex-1 `} >
                                        Invite Lisa Bennings to speak
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* ----------- Podcast Episodes ---------------- */}
                <section
                    className="container-width w-full py-[var(--space-20)]"
                    // style={{ background: "var(--color-light)" }}
                    aria-labelledby="choose-path-heading"
                >
                    <div className={`container-width`}>
                        {/* Header */}
                        <div className="text-center space-y-3" style={{ marginBottom: "var(--space-10)" }}>
                            <p className="section-tag">
                                Podcast
                            </p>
                            <h2
                                className={`section-subtag ${inter.className}`}
                                id="choose-path-heading"
                            >
                                Podcast Episodes
                            </h2>
                            <p
                                className="text-[#65758B] font-chivo  mx-auto w-full md:max-w-[44rem] lg:max-w-[58rem] text-[18px] font-medium"
                                style={{ lineHeight: '29.25px' }}
                            >
                                Where transformation gets personal and practical. Each episode explores how visionary leaders—especially women of color in enterprise and innovation roles—turn disruption into sustainable growth
                            </p>
                        </div>

                        <div className="my-10">
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {podcastEpisodeTags.map((ep, index) => (
                                    <article
                                        key={index}
                                        className="border-0 py-[9px] px-4 bg-[#491B271A] text-burgundy font-chivo text-[14px] font-medium rounded-full"
                                        style={{
                                            boxShadow: "0px 10px 30px 0px #0000000A"

                                        }}
                                    >
                                        {ep}
                                    </article>
                                ))}
                            </div>
                        </div>
                        {/* Grid */}
                        <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {paths.map((path, index) => (
                                <article
                                    key={index}
                                    className="card group rounded-[20px] flex flex-col border-0 p-0"
                                    style={{
                                        boxShadow: "0px 10px 30px 0px #0000000A",
                                        border: '1px solid #DCDEE5'
                                    }}
                                >
                                    {/* Image placeholder */}
                                    <div
                                        className="rounded-t-[20px] overflow-hidden"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        aria-hidden="true"
                                    >
                                        <div className="relative">
                                            <Image
                                                src={path.image}
                                                alt="Continuum Transformation Logo"
                                                width={450}
                                                height={310}
                                                className="object-contain"
                                                priority
                                            />
                                            <Image
                                                src='/studioImages/playButton.svg'
                                                alt="Continuum Transformation Logo"
                                                width={56}
                                                height={56}
                                                className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 object-contain"
                                                priority
                                            />
                                            {/* Overlay */}
                                            <div className="absolute inset-0 bg-[#381F514D]" aria-hidden="true" />
                                        </div>
                                    </div>

                                    <div style={{ padding: "var(--space-10)", }} className="flex flex-col gap-1 justify-between flex-1">
                                        {/* Tag */}
                                        <p className="text-[19.4px] font-bold text-nearBlack font-chivo flex-1 ">
                                            {path.title}
                                        </p>

                                        {/* Description */}
                                        <p
                                            className="text-[#65758B] flex-1 text-[17px] font-chivo leading-[24px]"
                                            style={{ marginBottom: "var(--space-5)" }}
                                        >
                                            {path.description}
                                        </p>

                                        {/* CTA Link */}
                                        <Link
                                            href={path.href}
                                            className="inline-flex items-center gap-2 text-[14px] text-burgundy font-chivo font-medium hover:text-[var(--color-gold)] transition-colors"
                                            aria-label={path.cta}
                                        >
                                            {path.cta}
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex justify-center">
                            <Link
                                href="#"
                                className={`${styles.buttonPrimary} ${styles.mt60} bg-burgundy `}>
                                View all episodes
                                <Image
                                    src='/studioImages/arrow-d.svg'
                                    alt="Continuum Transformation Logo"
                                    width={26}
                                    height={14}
                                    className={`object-contain`}
                                />
                            </Link>
                        </div>
                    </div>
                </section>


                {/* ----------- Featured Insights & Tools --------- */}
                <section className={`${styles.sectionsmall} fadeYellow`}>
                    <div className="container-width w-full ">
                        <div className="flex flex-col gap-6 items-center ">
                            <div className="flex flex-col gap-3 justify-center items-center text-center">
                                <p className="section-tag">
                                    Featured Insights & Tools
                                </p>
                                <p className="section-subtag">
                                    Frameworks you can use tomorrow
                                </p>
                                <p
                                    className="text-[#65758B] font-chivo  mx-auto w-full md:max-w-[44rem] lg:max-w-[58rem] text-[18px] font-medium"
                                >
                                    Get practical resources built from real transformation work – podcast takeaways, executive playbooks, and leadership frameworks designed for immediate action.
                                </p>
                            </div>
                            <div className={`${styles.mt60} grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1100px] `}>
                                {[
                                    {
                                        image: "/studioImages/featureTools1.svg",
                                        imgWidth: '72',
                                        imgHeight: '72',
                                        text: "Strategic frameworks for sustaining enterprise change",
                                    },
                                    {
                                        image: "/studioImages/featureTools2.svg",
                                        imgWidth: '58',
                                        imgHeight: '58',
                                        text: "Conversation guides for inclusive leadership",
                                    },
                                    {
                                        image: "/studioImages/featureTools3.svg",
                                        imgWidth: '48',
                                        imgHeight: '48',
                                        text: "Transformation Lab toolkits and downloads",
                                    },

                                ].map((card) => (
                                    <div
                                        className={`${styles.card} flex gap-4 items-center align-start justify-start bg-[#ffffff80] `}
                                        key={card.text}
                                    >
                                        <div className=" flex flex-col gap-2 align-start justify-start ">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={Number(card.imgWidth)}
                                                height={Number(card.imgHeight)}
                                            />
                                        </div>
                                        <p className={styles.carddescription}>{card.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    className={`${styles.buttonPrimary} bg-burgundy font-chivo  !text-white  mt-8`}
                                    href="#framework"
                                >
                                    Access the full resource library <Image src="/studioImages/arrow-d.svg" alt="arrow right icon" width={30} height={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* -------------------- Speaking & Live Sessions ---------------------- */}
                <section className={styles.section}>
                    <div className="container-width w-full">
                        <div className="grid grid-cols-2 gap-6 justify-between items-center ">
                            <div className="flex flex-col gap-6  items-start">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1">
                                        <p className="section-tag">
                                            Speaking & Live Sessions
                                        </p>
                                        <p className="section-subtag font-chivo   leading-[45px]                                                                                                  ">
                                            Bring the conversation into your organization
                                        </p>
                                    </div>
                                    <p className="text-[#65758B] font-chivo  mx-auto w-full md:max-w-[44rem] lg:max-w-[58rem] text-[18px] font-medium">
                                        Create a shared language of transformation inside your company. Lisa leads sessions for executive teams, leadership cohorts, and live audience events that blend podcast insights with proven playbooks.
                                    </p>
                                </div>

                                <div>
                                    <p className={`${styles.listheading} pb-2`}>Popular topics include:</p>
                                    <ul className={styles.sectionList}>
                                        <li className="flex items-center gap-3 text-[#737B8C] font-chivo">
                                            {" "}
                                           <IoMdCheckmark className="purpleTick min-w-4 min-h-4 w-4 h-4 md:w-5 md:h-5" />
                                            Leading transformation without losing trust
                                        </li>
                                        <li className="flex items-center gap-3 font-chivo">
                                            {" "}
                                           <IoMdCheckmark className="purpleTick w-4 h-4 md:w-5 min-w-4 min-h-4 md:h-5" />
                                            Building equity-centered enterprise strategy
                                        </li>
                                        <li className="flex items-center gap-3 font-chivo ">
                                            {" "}
                                           <IoMdCheckmark className="purpleTick w-4 h-4 min-w-4 min-h-4 md:w-5 md:h-5" />
                                            Designing transformation that scales sustainably
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => setOpenInvite(true)}
                                    className={`${styles.buttonPrimary} bg-burgundy font-chivo  !text-white  `}>
                                    Invite Lisa Bennings to Speak
                                </button>
                            </div>

                            <Image
                                className="justify-self-end "
                                src="/studioImages/speakingSession.webp"
                                alt="Enterprise leaders in a meeting"
                                width={700}
                                height={600}
                            />
                        </div>
                    </div>
                </section>

                {/* ----------------- Continuum transformation -------------------- */}
                <section
                    className={styles.ctaBanner}
                    style={{
                        backgroundImage: "url(/studioImages/bg-studio.webp)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="flex flex-col gap-10 items-center">
                        <div className='flex flex-col items-center justify-center text-center gap-4'>
                            <p
                                className={`${styles.sectionheading} ${playfair.className}`}
                                style={{ color: "white" }}
                            >
                                Stay in the continuum of transformation
                            </p>
                            {/* <p className={`${styles.sectionDescription} max-w-[42rem] text-center text-white`}> */}
                            <p
                                className={`text-[#FFFFFFCC] font-chivo leading-[28px] text-[#65758B] mx-auto w-full text-[18px] text-center font-medium max-w-[680px]`}
                            >
                                Transformation doesn't stop here. Stay connected to new episodes, leadership
                                tools, and live experiences that help you lead what's next.
                            </p>
                        </div>
                        <div className="flex flex-col flex-wrap md:flex-row items-center gap-3 justify-center">
                            <a className={`${styles1.buttonPrimary} w-full md:w-auto`} href="#youtube">
                                Subscribe to the podcast
                            </a>
                            <button onClick={() => setJoinEmail(true)} className={`${styles1.buttonSecondaryOutline} w-full md:w-auto`}>
                                Join the email list
                            </button>
                            <button
                                onClick={() => setOpenInvite(true)}
                                className={`${styles1.buttonSecondaryOutline} w-full md:w-auto`}>
                                Invite Lisa Bennings to speak <Image src="/enterprise/rightarrow.svg" alt="arrow right icon" width={16} height={16} />
                            </button>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
            {openInvite && <InviteToSpeakModal isOpen={openInvite} onClose={() => setOpenInvite(false)} />}
            {joinEmail && <EmailListModal isOpen={joinEmail} onClose={() => setJoinEmail(false)} />}
        </div >
    );
}