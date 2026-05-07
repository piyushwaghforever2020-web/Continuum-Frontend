"use client";
import Header from "@/components/Header";
import styles from "../enterprise/enterprise.module.css";
import studiesstyles from "./studies.module.css";
import { Tab } from "@headlessui/react";
import Footer from "@/components/Footer";
export default function RegistrationPage() {


  const tabs = ["All", "Banking", "Payments", "Marketing", "Operations"];

  const cards = [

    {
      tab: "Marketing",
      category: "Marketing / MarTech",
      title: (
        <>
          Email Acquisition Platform <br /> Evaluation
        </>
      ),
      client: "AT&T Wireless",
      description: (
        <>
          85% higher incremental sales at <br /> half the cost.
        </>
      ),
      metrics: [
        { value: "$3.8M", label: "in higher savings and acquisition opportunities" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Banking",
      category: "Wealth / Advisor Experience",
      title: "Wealth Management Customer Dashboard",
      client: "Comerica Wealth Management",
      description: "Full client visibility across portfolios, products, and services.",
      metrics: [
        { value: "$15M+", label: "in efficiency gains and higher advisor capacity" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Banking",
      category: "Retail Banking / Onboarding",
      title: (
        <>
          Retail Account Onboarding <br /> Platform
        </>
      ),
      client: "National Retail Banking",
      description: (
        <>
          50% branch productivity increase in <br /> first 90 days."
        </>
      ),
      metrics: [
        { value: "$50K", label: "in productivity gains and faster account opening" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Banking",
      category: "Commercial Lending / Digitization",
      title: "Commercial Lending Digital Loan Application",
      client: "JPMorgan Chase Commercial Banking",
      description: (
        <>
          Reduced time-to-close from 13 days <br /> to 48 hours.
        </>
      ),
      metrics: [
        { value: "$8M", label: "yearly faster funding and higher capacity" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Operations",
      category: "Operations / Compliance",
      title: "Account Opening Workflow Modernization",
      client: "Comerica Bank",
      description: "Eliminated manual processes with audit-ready workflows.",
      metrics: [
        { value: "$2.5M", label: "in efficiency, risk reduction, and compliance readiness" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Payments",
      category: "Global Payments / ECommerce",
      title: "Global Merchant Payments & eCommerce Platform",
      client: "JPMorgan Chase Merchant Services",
      description: "Single integrated platform for global merchant payments.",
      metrics: [
        { value: "$75M", label: "annual merchant revenue supported at launch" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Operations",
      category: "Operations / Global Workflow",
      title: (
        <>
          Global Merchant Services <br /> Workflow Integration
        </>
      ),
      client: "JPMorgan Chase Merchant Services",
      description: "Integrated global operations into single transparent workflow.",
      metrics: [
        { value: "$7M", label: "in efficiency and coordination gains" },
      ],
      accent: "#c9a84c",
    },
    {
      tab: "Banking",
      category: "Mobile Onboarding / Growth",
      title: "Retail Mobile Application & Onboarding",
      client: "Citibank Retail Bank",
      description: "40% increase in new accounts, 60% improvement in retention.",
      metrics: [
        { value: "$1.5M", label: "from higher acquisition and retention" },
      ],
      accent: "#c9a84c",
    },
  ];
  function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className={styles.page}>
      <Header />
      <main>
        <section
          className={studiesstyles.hero}
          style={{ backgroundImage: "url(/enterprise/studiesherobg.png)" }}
        >
          <div className="container-width w-full flex justify-center">
            <div className={`${studiesstyles.heroContent} `}>
              <h1 className={styles.heroTitle}>
                Case Studies
              </h1>
              <div className="flex flex-col gap-6">
                <p className={studiesstyles.heroText}>
                  Enterprise transformation outcomes across banking, payments, and telecommunications
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          className={styles.sectionsmall}

        >
          <div className="container-width w-full">
            <Tab.Group>
              {/* Tabs */}
              <Tab.List className="flex flex-wrap justify-center gap-3 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        studiesstyles.tab,
                        selected
                          ? studiesstyles.tabselected
                          : ""
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>

              {/* Panels */}
              <Tab.Panels>
                {tabs.map((item) => {
                  const filtered =
                    item === "All"
                      ? cards
                      : cards.filter((c) => c.tab === item);

                  return (
                    <Tab.Panel key={item}>
                      <div className="grid  xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4">
                        {filtered.map((item, index) => (

                          <article
                            key={index}
                            className="rounded-[20px] border border-[#E8E8E8] bg-white shadow-[0px_8.12px_24.35px_0px_#0000000A] hover:shadow-[0px_16px_40px_0px_#00000014] hover:-translate-y-1 transition-all duration-300 cursor-pointer  p-4"
                          >
                            {/* <div className="p-4 " > */}
                            {/* <div> */}
                            {/* Category tag */}
                            <p
                              className="outcome-tag"
                              style={{ marginBottom: "var(--space-4)" }}
                            >
                              {item.category}
                            </p>

                            {/* Title */}
                            <h4
                              className=" text-[16.5px] font-bold text-nearBlack font-chivo"
                              style={{ marginBottom: "var(--space-4)", lineHeight: 1.3 }}
                            >
                              {item.title}
                            </h4>

                            {/* Client */}
                            <p
                              className="font-medium text-[#65758B] text-[12px]  font-chivo"
                              style={{ lineHeight: "100%", marginBottom: "var(--space-4)" }}
                            >
                              {item.client}
                            </p>

                            {/* Description */}
                            <p
                              className="text-[var(--color-nearBlack)] text-[14px] font-chivo "
                              style={{ lineHeight: 1.3, marginBottom: "var(--space-5)" }}
                            >
                              {item.description}
                            </p>

                            {/* </div>
                              <div> */}
                            {/* Metrics */}
                            {item.metrics.map((metric) => (
                              <div
                                key={metric.value}
                                className="rounded-[var(--radius-md)] border-t  pt-5 font-chivo"
                                style={{
                                  // padding: "var(--space-4) var(--space-5)",
                                }}
                              >
                                <span
                                  className="text-[13px] font-regular text-[#65758B] leading-[1]"
                                >
                                  {metric.value}

                                  {metric.label}
                                </span>
                              </div>
                            ))}
                            {/* </div> */}
                            {/* </div> */}
                          </article>

                        ))}
                      </div>
                    </Tab.Panel>
                  );
                })}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </section>




      </main>
      <Footer />
    </div>
  );
}
