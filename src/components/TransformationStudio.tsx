import Link from "next/link";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const episodes = [
   {
    category: "Introduction",
    title: "Welcome to The Transformation Studio",
    excerpt:
      "A space for C-suite and C-suite-ready women of color to turn hyper-visibility, bias, and pressure into strategic advantage.",
    href: "/transformation-studio",
  },
  {
    category: "Strategy",
    title: "Designing Your AI-Powered Leadership Stack",
    excerpt:
      "Turn AI into your executive copilot so your week runs smarter, not harder.",
    href: "/transformation-studio",
  },
  {
    category: "Leadership",
    title: "Owning the Data Story (When You Don't Own the Data Team)",
    excerpt:
      "Lead the data and AI narrative with sharp questions that protect your people and your power.",
    href: "/transformation-studio",
  },
];

export default function TransformationStudio() {
  return (
    <section
      className="section-padding bg-nearBlack"
      aria-labelledby="studio-heading"
    >
      <div className="container-width">
        {/* Header */}
        <div className="text-center space-y-3" style={{ marginBottom: "var(--space-10)" }}>
          <p className="section-tag">
            The Transformation Studio
          </p>
          <h2
            className={`section-subtag font-chivo !text-[#FAF7F2] ${inter.className}`}
            id="choose-path-heading"
          >
            Stories and Strategies from Inside Transformation
          </h2>
          <p
            className="text-[#FAF7F2] mx-auto font-chivo w-full md:max-w-[44rem] lg:max-w-[56rem] text-[18px] font-bold leading-[23px] md:leading-[29.25px]"
          >
            The Transformation Studio is where we open the black box of enterprise change – through podcasts, articles, and tools from operators who’ve lived it.</p>
        </div>


        {/* Episode cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 "
          style={{ marginBottom: "var(--space-10)" }}
        >
          {episodes.map((ep) => (
            <article
              key={ep.title}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-[#F1F1F11A] flex flex-col gap-[20px] justify-between p-7 px-8 rounded-[24px]"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Content */}
              <div className="">
                <p className="text-[13px] font-semibold text-deepGold font-chivo mb-3 uppercase">
                  {ep.category}
                </p>
                <h4
                  className="text-[18px] text-white font-chivo transition-colors w-full max-w-[17rem] mb-2"
                  style={{ lineHeight: 1.35 }}
                >
                  {ep.title}
                </h4>
                <p
                  className="text-white font-chivo text-[15px] font-regular"
                  style={{ lineHeight: '22.75px' }}
                >
                  {ep.excerpt}
                </p>
              </div>
              <Link
                href={ep.href}
                className="inline-flex items-center gap-2 text-[16px] font-semibold text-deepGold font-chivo hover:text-[var(--color-gold)] transition-colors uppercase"
                aria-label={`Listen to ${ep.title}`}
              >
                Listen now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/transformation-studio"
            className="btn bg-warmCreamy rounded-[10px] w-[201px] text-[16px] font-semibold font-chivo text-burgundy hover:bg-[var(--color-warmCreamy-hover)] hover:-translate-y-[2px] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all"
            style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}>
            Visit the Studio
            <Image
              src='/images/arrow1.svg'
              alt="Continuum Transformation Logo"
              width={6}
              height={6}
              className="object-contain w-full"
              priority
            />
          </Link>
        </div>
      </div>
    </section >
  );
}
