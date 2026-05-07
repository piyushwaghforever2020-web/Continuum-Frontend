import Link from "next/link";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const outcomes = [
  {
    category: "Operations / Global Workflow",
    title: "Global Merchant Services Workflow Integration",
    client: "JPMorgan Chase Merchant Services",
    description: "Integrated global operations into single transparent workflow.",
    metrics: [
      { value: "$7M", label: "in efficiency and coordination gains" },
    ],
    accent: "#c9a84c",
  },
  {
    category: "Marketing / MarTech",
    title: "Email Acquisition Platform Evaluation",
    client: "AT&T Wireless",
    description: "85% higher incremental sales at half the cost.",
    metrics: [
      { value: "$20M", label: "in budget savings and reallocation opportunities" },
    ],
    accent: "#c9a84c",
  },
  {
    category: "Operations / Compliance",
    title: "Account Opening Workflow Modernization",
    client: "Comerica Bank",
    description: "Eliminated manual processes with audit-ready workflows.",
    metrics: [
      { value: "$2.5M", label: "in efficiency, risk reduction, and compliance readiness" },
    ],
    accent: "#c9a84c",
  },
];

export default function Outcomes() {
  return (
    <section
      className="section-padding bg-[#FAF7F2]"
      aria-labelledby="outcomes-heading"
    >
      <div className={`container-width ${inter.className}`}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "var(--space-10)" }}>
          <p className="section-tag" style={{ marginBottom: "var(--space-4)" }}>
            Outcomes Our Clients See
          </p>
          <h2
            className={`section-subtag ${inter.className}`}
            id="choose-path-heading"
          >
            Results in the Rooms That Matter
          </h2>
        </div>

        {/* Case studies grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" style={{ marginBottom: "var(--space-10)" }}>
          {outcomes.map((item) => (
            <article
              key={item.title}
              className="relative overflow-hidden rounded-[var(--radius-card)] border border-[#E8E8E8] bg-white group transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: '0px 10px 30px 0px #0000000A' }}
            >

              <div style={{ padding: "var(--space-8)" }} className="w-[24rem]">
                {/* Category tag */}
                <p
                  className="outcome-tag "
                  style={{ marginBottom: "var(--space-4)" }}
                >
                  {item.category}
                </p>

                {/* Title */}
                <h4
                  className=" text-[20px] font-bold text-nearBlack font-chivo"
                  style={{ marginBottom: "var(--space-4)", lineHeight: 1.3 }}
                >
                  {item.title}
                </h4>

                {/* Client */}
                <p
                  className="font-medium font-chivo text-[#65758B] text-[14px] font-regular"
                  style={{ lineHeight: "100%", marginBottom: "var(--space-4)" }}
                >
                  {item.client}
                </p>

                {/* Description */}
                <p
                  className="text-nearBlack font-chivo text-[16px] "
                  style={{ lineHeight: 1.3, marginBottom: "var(--space-5)" }}
                >
                  {item.description}
                </p>

                {/* <p
                  className="text-[var(--color-nearBlack)] text-[16px] "
                  style={{ lineHeight: 1.65, marginBottom: "var(--space-5)" }}
                >
                  {item.description} $7M in efficiency and coordination gains
                </p> */}

                {/* Metrics */}
                {item.metrics.map((metric) => (
                  <div
                    key={metric.value}
                    className="rounded-[var(--radius-md)] border-t  pt-5"
                    style={{
                      // padding: "var(--space-4) var(--space-5)",
                    }}
                  >
                    <span
                      className="text-[16px] font-regular font-chivo text-[#65758B]"
                    >
                      {metric.value}

                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/casestudies"
            className="btn view-btn"
          >
            View Enterprise Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}
