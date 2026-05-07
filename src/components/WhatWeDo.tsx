import Link from "next/link";
import Image from "next/image";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const services = [
  {
    image: '/images/Overlay (2).png',
    title: "Advisory",
    description:
      "Strategic counsel for CMOs, CDOs, and growth leaders on portfolio‑level transformation, operating models, and governance that hold under pressure",
  },
  {
    image: '/images/Overlay.png',
    title: "Enterprise Cohorts",
    description: (
      <>
        Immersive, facilitator-led cohorts that align cross-functional leaders, build change muscle, and translate strategy into<br /> day-to-day decisions.,
      </>
    )
  },
  {
    image: '/images/Overlay (1).png',
    title: "Execution Labs",
    description: (
      <>
        Hands-on sprints where we work side-by-side with your teams to design, test, <br /> and operationalize high-stakes <br /> initiatives before they scale,
      </>
    )
  },
];

export default function WhatWeDo() {
  return (
    <section
      className="section-padding"
      style={{ background: "var(--color-white)" }}
      aria-labelledby="what-we-do-heading"
    >
      <div className="container-width">
        {/* Header */}
        <div className="text-center space-y-3" style={{ marginBottom: "var(--space-10)" }}>
          <p className="section-tag">
            What We Do
          </p>
          <h2
            className={`section-subtag ${inter.className}`}
            id="choose-path-heading"
          >
            A Senior Partner for Complex Enterprise Change
          </h2>
          <p
            className="text-[#65758B] font-chivo mx-auto w-full md:max-w-[44rem] lg:max-w-[56rem] text-[16px] md:text-[18px] font-semibold leading-[23px] md:leading-[29.25px]"
          >
            <span className="font-bold">Continuum Transformation </span> helps you de-risk critical initiatives, accelerate adoption, and make transformation tangible for your board, your teams, and your customers.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8" style={{ marginBottom: "var(--space-8)" }}>
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col items-center text-center group space-y-8"
              style={{ padding: "var(--space-10)" }}
            >
              {/* <div
                className="transition-transform duration-300 group-hover:-translate-y-1"
                style={{ marginBottom: "var(--space-5)" }}
              >
                {service.image}
              </div> */}

              <div className="">
                <Image
                  src={service.image}
                  alt="Continuum Transformation Logo"
                  width={432}
                  height={303}
                  className="object-contain w-full"
                  priority
                />
              </div>
              <h4
                className="text-[16px] font-chivo font-bold text-nearBlack"
                style={{ fontSize: "var(--fs-lg)" }}
              >
                {service.title}
              </h4>
              <p
                className="text-[#65758B] font-chivo text-[17px] font-medium"
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/enterprise"
            className="btn view-btn"
          >
            See Enterprise Offers and Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}
