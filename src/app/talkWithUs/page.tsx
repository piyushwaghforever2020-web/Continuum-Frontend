"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import styles from "./talkWithUs.module.css";
import Footer from "@/components/Footer";
import { Playfair_Display } from "next/font/google";
import ConsultationModal from "@/components/Consultation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const data = [
  { label: "Fuzzy strategy and misaligned goals", value: 88 },
  { label: "Overloaded top talent", value: 73 },
  { label: "Change fatigue and trust gaps", value: 66 },
  { label: "Shallow operating models", value: 60 },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [consultationModal, setConsultationModal] = useState(false);
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    message: "",
  });

  const validate = () => {
    const newErrors = {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      message: "",
    };

    if (!form.fname.trim()) {
      newErrors.fname = "First name is required";
    }
    if (!form.lname.trim()) {
      newErrors.lname = "Last name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!form.message.trim()) {
      newErrors.message = "Type your message in the message box";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main>
        {/* ---------- Continuum transformation about section -------------- */}
      <section className={`${styles.ctaBanner} relative overflow-hidden`}>

  {/* Mobile Background */}
  <div className="absolute inset-0 block md:hidden">
    <Image
      src="/talkWithUs/talkWithUs-small.webp"
      alt="Talk With Us Background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/talkWithUs/talkWithUs.webp"
      alt="Talk With Us Background"
      fill
      // priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col gap-10 items-center max-w-[802px] px-4 sm:px-0">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <p
                className={`${styles.heroTitle} ${playfair.className}`}
                style={{ color: "white" }}
              >
                Talk With Us About Scope & Investment
              </p>
              <p className={`${styles.heroText} max-w-[54rem]`}>
                Every organization’s needs are different. Let’s explore the
                right level of support, resourcing, and investment for your
                team.
              </p>
            </div>
          </div>
        </section>

        <section id="form" className={styles.sectionWrapper}>
          <div className="container-width w-full ">
            <div className="flex flex-col gap-6 items-center ">
              <div className="flex flex-col gap-5 justify-center items-center ">
                <div className={`${styles.container} space-y-10 md:space-y-0`}>
                  {/* LEFT SIDE */}
                  <div className={styles.card}>
                    <h2 className={`${styles.cardTitle} text-nearBlack mb-2`}>
                      VALUE PROPOSITION
                    </h2>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>
                        What we can help you clarify:
                      </h3>
                      <ul className={styles.list}>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>Scope of work and delivery model</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>Team size and leadership level</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>Timeline and readiness</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>Pricing ranges and investment options</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>
                            Whether a cohort, workshop series, or full
                            transformation is the best fit
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className={styles.section}>
                      <h3 className={styles.sectionTitle}>Who this is for:</h3>
                      <ul className={styles.list}>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>ERG & DEI leaders</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>Chiefs of Staff</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>People & Culture teams</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>People & Culture teams</span>
                        </li>
                        <li>
                          <img src="/talkWithUs/arrow.svg" alt="" />
                          <span>VPs and Directors leading change</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className={styles.consultCard}>
                    <h3 className={styles.consultTitle}>
                      SCHEDULE A CONSULTATION
                    </h3>

                    <p className={styles.consultText}>
                      Let’s talk through your goals, team needs, and the right
                      investment level. We’ll help you determine the best path
                      forward.
                    </p>

                    <button onClick={() => setConsultationModal(true)} className={styles.consultBtn}>Book A Call</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {consultationModal && <ConsultationModal isOpen={consultationModal} onClose={() => setConsultationModal(false)} />}

    </div>
  );
}
