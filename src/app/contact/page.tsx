"use client";
import { useEffect, useState } from 'react';
import Image from "next/image";
import Header from "@/components/Header";
import styles from "./contact.module.css";
import Footer from "@/components/Footer";
import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { isPossiblePhoneNumber } from "libphonenumber-js";

import { Playfair_Display } from 'next/font/google';
import axios from 'axios';

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
});
type Cohort = {
    id: number;
    name: string;
    is_active: boolean;
    status: string;
};

type SuccessModalProps = {
    isOpen: boolean;
    onClose: () => void;
};



const topics = [
    "Cohorts & Leadership Labs",
    "Executive Coaching & Advisory",
    "Fractional & Consulting Services",
    "Speaking & Experiences",
];

export default function ContactPage() {

    const [submitted, setSubmitted] = useState(false);
    const [optionBox, setOptionBox] = useState(false);
    const [cohorts, setCohorts] = useState<Cohort[]>([])

    const [form, setForm] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
    });
    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
    });

    const validate = () => {
        const newErrors = {
            fname: "",
            lname: "",
            email: "",
            phone: "",
            topic: "",
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
        } else if (!isPossiblePhoneNumber(form.phone)) {
            newErrors.phone = "Enter a valid phone number";
        }
        if (!form.topic.trim()) {
            newErrors.topic = "Select the topic";
        }

        if (!form.message.trim()) {
            newErrors.message = "Type your message in the message box";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some((err) => err);
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (validate()) {
    //         setSubmitted(true);
    //     }
    // };


    useEffect(() => {
        const getCohorts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`
                );

                const activeCohorts =
                    response?.data?.data?.filter(
                        (cohort: Cohort) => cohort.is_active && cohort.status === "active"
                    ) || [];

                setCohorts(activeCohorts);
            } catch (error) {
                console.error("Error fetching cohorts", error);
            }
        };

        getCohorts();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-us`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    fist_name: form.fname,
                    last_name: form.lname,
                    email: form.email,
                    selectedTopic: form.topic,
                    message: form.message,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setForm({
                    fname: "",
                    lname: "",
                    email: "",
                    phone: "",
                    topic: "",
                    message: "",
                });
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Error in catch block: ", error);
        }
    };

    const handleOptionBoxToggle = () => {
        setOptionBox((prev) => !prev);
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
      src="/contactImages/contact-bg.webp"
      alt="Contact Background"
      fill
      priority
      className="object-cover object-center"
    />
  </div>

  {/* Desktop Background */}
  <div className="absolute inset-0 hidden md:block">
    <Image
      src="/aboutImages/bg-about.webp"
      alt="About Background"
      fill
    //   priority
      className="object-cover object-center"
    />
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col gap-10 items-center">
                        <div className='flex flex-col items-center justify-center text-center gap-4'>
                            <p
                                className={`${styles.heroTitle} ${playfair.className}`}
                                style={{ color: "white" }}
                            >
                                Contact Us
                            </p>
                            <p
                                className={`${styles.heroText} max-w-[54rem]`}
                            >
                                Ready to build what is needed?
                            </p>
                        </div>
                    </div>
                </section>


                <section id='form' className={styles.sectionWrapper}>
                    <div className="container-width w-full ">
                        <div className="flex flex-col gap-6 items-center ">
                            <div className="flex flex-col gap-5 justify-center items-center ">
                                <p className={`${styles.infoTitle} ${styles.maxWidth} w-full text-center capitalize`}  >
                                    Whether you are looking to stabilize a massive organizational shift or sharpen your personal leadership edge, we are ready to partner with you.
                                </p>
                                <div className={`${styles.container} space-y-10 md:space-y-0`}>
                                    {/* LEFT SIDE */}
                                    <div className={styles.card}>
                                        <h2 className={styles.sectionheading}>Contact Us</h2>
                                        <p className={`${styles.sectionDescription} my-2 mb-5`}>
                                            Fill out the form below and our team will respond within 24 hours.
                                        </p>

                                        <div className={`${styles.gridCols} grid grid-cols-2 gap-4 mb-4`}>
                                            <div>
                                                <input
                                                    id="wl-name"
                                                    type="text"
                                                    required
                                                    placeholder="First Name*"
                                                    value={form.fname}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setForm((p) => ({ ...p, fname: value }));
                                                        if (errors.fname) {
                                                            setErrors((prev) => ({ ...prev, fname: "" }));
                                                        }
                                                    }}
                                                    className={`w-full border text-[14px] rounded-[14px] font-chivo text-[#3d4046] bg-[#FBF9F6] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.fname
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-[#DCDEE5] focus:border-burgundy focus:ring-[rgba(109,40,217,0.12)]"
                                                        }`}
                                                    style={{ height: "40px", padding: "12px 13px" }}
                                                />
                                                {errors.fname && (
                                                    <p className="text-red-500 text-[12px] mt-1">{errors.fname}</p>
                                                )}
                                            </div>

                                            <div>
                                                <input
                                                    id="wl-name"
                                                    type="text"
                                                    required
                                                    placeholder="Last Name*"
                                                    value={form.lname}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setForm((p) => ({ ...p, lname: value }));
                                                        if (errors.lname) {
                                                            setErrors((prev) => ({ ...prev, lname: "" }));
                                                        }
                                                    }}
                                                    className={`w-full border text-[14px] rounded-[14px] font-chivo text-[#3d4046] bg-[#FBF9F6] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.lname
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-[#DCDEE5] focus:border-burgundy focus:ring-[rgba(109,40,217,0.12)]"
                                                        }`}
                                                    style={{ height: "40px", padding: "12px 13px" }}
                                                />
                                                {errors.lname && (
                                                    <p className="text-red-500 text-[12px] mt-1">{errors.lname}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className={`${styles.gridCols} grid grid-cols-2 gap-4 mb-4`}>
                                            <div>
                                                <input
                                                    id="wl-name"
                                                    type="text"
                                                    required
                                                    placeholder="Email Address*"
                                                    value={form.email}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setForm((p) => ({ ...p, email: value }));
                                                        if (errors.email) {
                                                            setErrors((prev) => ({ ...prev, email: "" }));
                                                        }
                                                    }}
                                                    className={`w-full border text-[14px] rounded-[14px] font-chivo text-[#3d4046] bg-[#FBF9F6] placeholder-[#737B8C] focus:outline-none focus:ring-2 transition-all ${errors.email
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-[#DCDEE5] focus:border-burgundy focus:ring-[rgba(109,40,217,0.12)]"
                                                        }`}
                                                    style={{ height: "40px", padding: "12px 13px" }}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <PhoneInput
                                                    international
                                                    defaultCountry="IN"
                                                    value={form.phone}
                                                    onChange={(value) => {
                                                        if (value !== undefined) {
                                                            setForm((p) => ({ ...p, phone: value }));
                                                        }

                                                        if (errors.phone) {
                                                            setErrors((prev) => ({ ...prev, phone: "" }));
                                                        }
                                                    }}
                                                    className={`phone-input phoneInput_2 w-full text-[14px] rounded-[14px] font-chivo text-[#3d4046] !bg-[#FBF9F6] transition-all focus:!ring-2 ${errors.phone ? "error border-red-500" : ""}`}
                                                    style={{ height: "40px", padding: "12px 13px" }}
                                                />

                                                {errors.phone && (
                                                    <p className=" border-red-500 text-red-500 text-[12px] mt-1">{errors.phone}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: "18px", position: "relative" }}>
                                            {/* <label
                                                className="block font-medium text-[#29303D] text-[14px]"
                                                style={{ marginBottom: "5px" }}
                                            >
                                                Desired timeline<span>*</span>
                                            </label> */}
                                            <button
                                                type="button"
                                                onClick={handleOptionBoxToggle}
                                                className={`w-full border rounded-[14px] text-[14px] font-chivo bg-[#FBF9F6] text-left px-[13px] h-[40px] text-[#6A7181] flex justify-between items-center focus:outline-none focus:ring-2 transition-all
                                                      ${errors.topic
                                                        ? "border-red-500 focus:ring-red-200"
                                                        : "border-[#DCDEE5] focus:border-burgundy focus:ring-[rgba(109,40,217,0.12)]"
                                                    }`}
                                            >
                                                {form.topic || "Select the Topic*"}

                                                <Image
                                                    src="/images/arrow-down.svg"
                                                    alt="arrow"
                                                    width={14}
                                                    height={14}
                                                    className={`transition-transform ${optionBox ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            {optionBox && (
                                                <div className="absolute w-full z-50 mt-2">
                                                    <div className="bg-white rounded-[18px] shadow-lg border border-[#E5E7EB] overflow-hidden px-5">
                                                        {topics.map((item, index) => (
                                                            <div
                                                                key={item}
                                                                onClick={() => {
                                                                    setForm((p) => ({ ...p, topic: item }));
                                                                    setOptionBox(false);

                                                                    if (errors.topic) {
                                                                        setErrors((prev) => ({
                                                                            ...prev,
                                                                            topic: "",
                                                                        }));
                                                                    }
                                                                }}
                                                                className={`py-2 text-[14px] text-[#29303D] cursor-pointer hover:bg-[#F6F6F9]
    ${index !== topics.length - 1 ? "border-b border-[#E5E7EB]" : "pb-4"}
    ${index === 0 ? "pt-4" : ""}`}
                                                            >
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {errors.topic && (
                                                <p className="text-red-500 text-[12px] mt-1">
                                                    {errors.topic}
                                                </p>
                                            )}
                                        </div>


                                        <div className="mb-4">
                                            <textarea
                                                id="wl-urgent"
                                                maxLength={250}
                                                rows={4}
                                                placeholder="Your Message"
                                                value={form.message}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setForm((p) => ({ ...p, message: value }));
                                                    if (errors.message) {
                                                        setErrors((prev) => ({ ...prev, message: "" }));
                                                    }
                                                }}
                                                className={`w-full resize-none border text-[14px] font-chivo rounded-[14px] bg-[#FBF9F6] text-[#3d4046] placeholder-[#737B8C] focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-[rgba(109,40,217,0.12)] transition-all h-[140px] ${errors.message
                                                    ? "border-red-500 focus:ring-red-200"
                                                    : "border-[#DCDEE5] focus:border-burgundy focus:ring-[rgba(109,40,217,0.12)]"
                                                    }`}
                                                style={{ padding: "12px 13px" }}
                                            />
                                            {errors.message && (
                                                <p className="text-red-500 text-[12px] mt-1">{errors.message}</p>
                                            )}
                                        </div>

                                        <button onClick={handleSubmit} className={`${styles.buttonPrimary} w-full md:w-auto`}>
                                            Send Message
                                        </button>
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className={styles.infoCard}>
                                        <h3 className={styles.sectionheading}>Get In Touch</h3>
                                        <p className={`${styles.sectionDescription} my-[27px] md:mb-5`}>
                                            Your transformation is too important to leave to chance. Let’s build a plan that is realistic, grounded in enterprise experience, and designed to last.
                                        </p>

                                        <div className="flex gap-4 mb-3">
                                            <Image
                                                src="/contactImages/emailIcon.svg"
                                                alt="cardheading"
                                                width={40}
                                                height={40}
                                            />
                                            <div className={styles.infoItem}>
                                                <p className={styles.infosemiboldItem}>Email</p>
                                                <p className={styles.infoRegularItem}>info@continuumtransformation.com</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mb-3">
                                            <Image
                                                src="/contactImages/phoneIcon.svg"
                                                alt="cardheading"
                                                width={40}
                                                height={40}
                                            />
                                            <div className={styles.infoItem}>
                                                <p className={styles.infosemiboldItem}>Phone</p>
                                                <p className={styles.infoRegularItem}>+1 682 600 2719</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mb-3">
                                            <Image
                                                src="/contactImages/locationIcon.svg"
                                                alt="cardheading"
                                                width={40}
                                                height={40}
                                            />
                                            <div className={styles.infoItem}>
                                                <p className={styles.infosemiboldItem}>Office</p>
                                                <p className={styles.infoRegularItem}>United States</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ----------- Bottom Section --------- */}
                <section className={` ${styles.bgF6F6F9} container-width w-full`}>
                    <div className={`${styles.py70} border-t border-[#E5E7EB]`}>
                        <div className="flex flex-col gap-6 items-center ">
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-full`}>
                                {[
                                    {
                                        image: "/contactImages/medal.svg",
                                        imgWidth: '48',
                                        imgHeight: '48',
                                        title: "Expert-Led Transformation",
                                        text: "Seasoned practitioners with enterprise experience",
                                    },
                                    {
                                        image: "/contactImages/trust.svg",
                                        imgWidth: '48',
                                        imgHeight: '48',
                                        title: "Trusted by Enterprises",
                                        text: "Partnering with leading global organizations",
                                    },
                                    {
                                        image: "/contactImages/result.svg",
                                        imgWidth: '48',
                                        imgHeight: '48',
                                        title: "Proven Measurable Results",
                                        text: "Data-driven outcomes and ROI accountability",
                                    },

                                ].map((card) => (
                                    <div
                                        className={`flex gap-4 items-center align-start justify-start`}
                                        key={card.text}
                                    >
                                        <div className="flex flex-col gap-2 align-start justify-start ">
                                            <Image
                                                src={card.image}
                                                alt="cardheading"
                                                width={Number(card.imgWidth)}
                                                height={Number(card.imgHeight)}
                                            />
                                        </div>
                                        <div className={styles.infoItem}>
                                            <p className={styles.infosemiboldItem}>{card.title}</p>
                                            <p className={styles.infoRegularItem}>{card.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                {submitted && (
                    <SuccessFullEmailSend
                        isOpen={submitted}
                        onClose={() => setSubmitted(false)}
                    />
                )}
                <Footer />

            </main>
        </div>
    )
}





const SuccessFullEmailSend = ({ isOpen, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[12px] w-[320px] md:w-[512px] p-6 relative text-center shadow-lg">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{ width: "20px", height: "20px" }}
                    aria-label="Close modal"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1l12 12M1 13L13 1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <img src="/images/success.png" alt="" />
                </div>
                <div className="flex flex-col gap-3">

                    {/* Title */}
                    <h2 className="font-chivo font-bold text-2xl leading-8 text-center text-nearBlack">
                        Message sent successfully
                    </h2>

                    {/* Subtitle */}
                    <p className="font-chivo font-medium text-sm leading-5 text-center text-[#737B8C]">
                        Thank you for reaching out! Our team will review your query and get back to you shortly.
                    </p>

                    {/* Button */}
                    <button type="submit"
                        onClick={onClose}
                        className="w-full font-semibold text-[16px] font-chivo bg-burgundy text-white rounded-[14px] transition-all hover:opacity-90 active:scale-[0.99] py-[12px] px-[13px] capitalize"
                        style={{
                            marginBottom: "10px",
                            border: "none",
                            cursor: "pointer",
                        }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};