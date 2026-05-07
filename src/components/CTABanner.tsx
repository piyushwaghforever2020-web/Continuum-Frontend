import Link from "next/link";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function CTABanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: "var(--space-20)",
        paddingBottom: "var(--space-20)",
      }}
      aria-labelledby="cta-heading"
    >
      {/* Inner card */}
      <div className="container-width bg-[#FAF7F2]">
        <div
          className={`relative overflow-hidden text-center ${inter.className}`}
        >

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              className={`text-nearBlack  font-chivo  ${inter.className} text-[28px] lg:text-[45px]  mb-4 capitalize`}
              id="cta-heading"
            >
              Ready to de-risk your next transformation?
            </h2>
            <p
              className="text-[#65758B] px-[30px] font-chivo"
              style={{
                fontSize: "var(--fs-lg)",
                lineHeight: '28px',
                marginBottom: "var(--space-8)",
              }}
            >
              Bring us into the rooms that matter and let’s make your net move measurable, defensible, and human-centered
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="btn view-btn"
                style={{ height: "52px", padding: "0 var(--space-8)", fontSize: "16px" }}
              >
                Schedule a transformation consult
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
