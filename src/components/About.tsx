import Link from "next/link";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const features = [
  "Built-for-you space to be fully seen as a woman of color leader, not “the only one in the room.",
  "Practical tools to negotiate power, politics, and promotion while stewarding high-stakes initiatives.",
  "Executive-level coaching, peer community, and frameworks you can bring back to your teams.",
  "A lab to experiment with your voice, your leadership story, and your next role or mandate.",
];

export default function About() {
  return (
    <section
      className="relative overflow-hidden h-[40rem] lg:h-[38rem]"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #111827 60%, #0d1117 100%)",
        paddingTop: "100px",
        paddingBottom: "var(--space-20)",
      }}
      aria-labelledby="lab-heading"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-[0.75] w-full h-full"
        style={{
          backgroundImage: `url('/images/aboutBgImg.png')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          top: 0,
        }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 md:hidden" aria-hidden="true" />
      <div className={`container-width relative z-10 ${inter.className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12rem] items-center">
          {/* Left: Content */}
          <div className='space-y-6'>
            <p className="section-tag font-bold ">
              About
            </p>
            <h2
              className={`text-white text-[28px] font-chivo lg:text-[34px] capitalize`}
              id="lab-heading"
              style={{ lineHeight: 1.12 }}
            >
              Led by an operator who's been inside the enterprise.
            </h2>
            {/* Pull quote */}
            <blockquote
              className="relative"
              style={{ marginBottom: "var(--space-8)" }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                style={{ background: "white" }}
                aria-hidden="true"
              />
              <p
                className="text-[#F5F5F5] italic font-chivo text-[14px] md:text-[18px] font-semibold"
                style={{
                  lineHeight: 1.6,
                  paddingLeft: "var(--space-6)",
                }}
              >
                "I've sat in the rooms where transformation gets approved, funded,
                stalled, and killed. That's why I built Continuum—to give leaders a
                partner who understands the politics, the pressure, and the path forward."
              </p>
            </blockquote>

            <Link
              href="/about"
              className={"btn bg-warmCreamy rounded-[10px]  text-[16px] font-semibold font-chivo text-burgundy hover:bg-[var(--color-warmCreamy-hover)] hover:-translate-y-[2px] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all"}
              style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}
            >
              About Continuum
              <Image
                src='/images/arrow1.svg'
                alt="Continuum Transformation Logo"
                width={10}
                height={10}
                className="object-contain w-full"
                priority
              />
            </Link>
          </div>

          {/* Right: Visual */}

        </div>
      </div>
    </section>
  );
}
