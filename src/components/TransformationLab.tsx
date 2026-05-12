import Link from "next/link";
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

export default function TransformationLab() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #111827 60%, #0d1117 100%)",
        paddingTop: "var(--space-20)",
        paddingBottom: "var(--space-20)",
      }}
      aria-labelledby="lab-heading"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/images/transformationLab.webp')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 md:hidden" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        {/* your content goes here */}
      </div>
      {/* Gold accent blob */}
      <div
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(201,168,76,0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className={`container-width relative z-10 ${inter.className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12rem] items-center">
          {/* Left: Content */}
          <div className='space-y-6'>
            <p className="section-tag font-bold ">
              The Transformation Lab
            </p>
            <h2
              className={`text-white  text-[28px] md:text-[34px] font-chivo ${inter.className}`}
              id="lab-heading"
              style={{ lineHeight: 1.12 }}
            >
              Accelerating women of color leading complex change.
            </h2>
            <p
              className="text-white text-[16px] md:text-[18px]  font-chivo font-medium mb-5 "
            >
              The Transformation Lab is a cohort-based experience designed for women of
              color who are driving enterprise change while navigating bias, visibility,
              and safety at work.
            </p>

            {/* Feature list */}
            <ul
              className="space-y-4"
              style={{ marginBottom: "var(--space-6)" }}
              aria-label="Lab features"
            >
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 font-medium  font-chivo text-[#F5F5F5] text-[16px] md:text-[18px]  leading-[1.4] md:leading-[1.65]"

                >
                  <div className="mt-2">
                      <img
                                            src="/enterprise/arrowfill.svg"
                                            alt="people Icon"
                                           className="w-4 h-4 min-w-4 min-h-4 md:h-5 md-w-5"
                                          />{" "}
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/transformlab"
              className={"btn bg-warmCreamy rounded-[10px] w-[201px] text-[16px] font-semibold font-chivo text-burgundy hover:bg-[var(--color-warmCreamy-hover)] hover:-translate-y-[2px] hover:shadow-[0_4px_10px_rgba(0,0,0,0.2)] transition-all"}
              style={{ boxShadow: '0px 1px 2px 0px #0000000D' }}
            >
              Explore the Lab
            </Link>
          </div>

          {/* Right: Visual */}

        </div>
      </div>
    </section>
  );
}
