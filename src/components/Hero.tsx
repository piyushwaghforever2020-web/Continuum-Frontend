"use client";
import Link from "next/link";
import styles from "../app/enterprise/enterprise.module.css";
import Image from "next/image";


export default function Hero() {

  return (
    <>
      <section
        className={` ${styles.homehero} relative overflow-hidden`}
      >
          <div className="absolute inset-0 block md:hidden">
    <Image
      src="/images/mainpagebannermobile.webp"
      alt="Banner"
      fill
      priority
     className="object-cover object-center"
    />
  </div>

  {/* Desktop Image */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/images/HomePagebanner.webp"
      alt="Banner"
      fill
      priority
     className="object-cover object-center"
    />
  </div>

        <div className="relative z-10  container-width w-full">
          <div className={styles.heroContent}>
            <div
              className=" section-tag"
              aria-label="Category"
            >
              Enterprise Transformation, De-Risked
            </div>
            <h1 className={styles.heroTitle}>
              Turning messy, high-stakes enterprise change into measurable results.
            </h1>
            <div className="flex flex-col gap-6">
              <p className={styles.heroText}>
                We partner with CMOs, CDOs, and growth leaders to de-risk transformation
                and deliver outcomes without Big-4 bloat.
              </p>
              <div className="flex flex-col md:flex-row align-center gap-2">

                <Link href="/contact"
                  className={`${styles.buttonPrimary} ${styles.text14}`}
                >
                  Talk to Us About Your Transformation
                </Link>

                <a className={`${styles.buttonSecondaryOutline} ${styles.text14}`} href="/transformlab">

                  Explore the Transformation Lab
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>


  );
}
