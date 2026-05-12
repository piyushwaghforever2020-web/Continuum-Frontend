import Link from "next/link";
import { Inter } from 'next/font/google';
import Image from "next/image";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const paths = [
  {
    tag: "For Enterprise Leaders",
    title: "Senior Partner Engagement",
    description:
      "A dedicated senior partner to stabilize complex change, align stakeholders, and turn strategy into traction in the rooms that matter.",
    cta: "Explore Enterprise Transformation",
    href: "/enterprise",
    image: "/images/card_1.webp",
  },
  {
    tag: "For WOC Leaders",
    title: "The Transformation Lab",
    description:
      "A leadership lab built for women of color navigating enterprise power, politics, and visibility while delivering transformation outcomes.",
    cta: "Explore the Transformation Lab",
    href: "/transformlab",
    image: "/images/choosePath2.webp",
  },
  {
    tag: "Podcast & Resources",
    title: "The Transformation Studio",
    description:
      "Stories, frameworks, and candid conversations from inside real transformation journeys.",
    cta: "Visit the Transformation Studio",
    href: "/transformation-studio",
    image: "/images/card_2.webp",
  },
];

export default function ChoosePath() {
  return (
    <section
      className="section-padding bg-[#FAF7F2]"
      // style={{ background: "var(--color-light)" }}
      aria-labelledby="choose-path-heading"
    >
      <div className={`container-width ${inter.className}`}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: "var(--space-10)" }}>
          <p className="section-tag" style={{ marginBottom: "var(--space-4)" }}>
            Choose Your Path
          </p>
          <h2
            className={`section-subtag ${inter.className}`}
            id="choose-path-heading"
          >
            Start Where You Are
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {paths.map((path) => (
            <article
              key={path.tag}
              className="card group flex flex-col border-0 p-0 rounded-t-[25px]"
              style={{
                boxShadow: "0px 10px 30px 0px #0000000A"

              }}
            >
              {/* Image placeholder */}
              <div
                className="rounded-t-[24px] overflow-hidden"
                style={{
                  // background: "linear-gradient(135deg, #1a1a2e, #0d1117)",
                  // display: "flex",
                  // alignItems: "center",
                  // justifyContent: "center",
                }}
                aria-hidden="true"
              >
                <div className="">
                  <Image
                    src={path.image}
                    alt="Continuum Transformation Logo"
                    width={580}
                    height={303}
                    className="w-full h-[308px] object-cover"
                    priority
                  />
                </div>
              </div>

              <div style={{ padding: "var(--space-10)", }} className="flex flex-col justify-betweentext-[#65758B] flex-1 text-[17px] leading-[24px] md:leading-[28px]">
                {/* Tag */}
                <p className="text-[19.4px] font-bold  text-[#111827] font-chivo" style={{ marginBottom: "var(--space-2)" }}>
                  {path.tag}
                </p>

                {/* Description */}
                <p
                  className="text-[#65758B] font-chivo flex-1 text-[15px] md:text-[17px] leading-[28px]"
                  style={{ marginBottom: "var(--space-6)" }}
                >
                  {path.description}
                </p>

                {/* CTA Link */}
                <Link
                  href={path.href}
                  className="inline-flex items-center gap-2 text-[12px] md:text-[14px] font-semibold font-chivo text-[var(--color-burgundy)] hover:text-[var(--color-burgundy-hover)] transition-colors"
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
      </div>
    </section>
  );
}
