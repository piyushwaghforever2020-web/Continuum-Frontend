import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../legal.module.css";

type RefundSection = {
  title: string;
  body?: React.ReactNode[];
  list?: React.ReactNode[];
  footer?: React.ReactNode;
};

const refundSections: RefundSection[] = [
  {
    title: "1. Cohort Programs & Leadership Lab Enrollment",
    body: [
      "Cohort seats are limited and reserved upon payment.",
      "Refunds are available under the following conditions: ",
    ],
    list: [
      <><strong>Full refund</strong> if requested within <strong>72 hours</strong> of purchase <em>and</em> before program materials or onboarding access has been delivered. </>,
      <><strong>50% refund</strong> if requested <strong>7 days before</strong> the program start date. </>,
      <><strong>No refunds</strong> will be issued <strong>within 7 days of the program start date</strong>, after program materials have been delivered, or once the cohort has begun. </>,
    ],
    footer: (
      <>
        <strong>Transfers:</strong><br /> 
        Participants may request a <strong>one-time transfer</strong> to a future cohort up to <strong>5 days before</strong> the program start date, subject to availability.
      </>
    ),
  },
  {
    title: "2. 1:1 Executive Coaching",
    body: [
      "Because coaching engagements reserve dedicated time on our calendar: ",
    ],
    list: [
      <><strong>Full refund</strong> if canceled within <strong>72 hours</strong> of purchase and before the first session is scheduled. </>,
      <>After scheduling begins, <strong>no refunds</strong> are offered. </>,
      <>Sessions may be rescheduled with <strong>48 hours' notice</strong>. </>,
    ],
  },
  {
    title: "3. Enterprise Consulting & Transformation Services",
    body: [
      "Enterprise engagements are governed by a separate Statement of Work (SOW). ",
      "Unless otherwise stated in the SOW: ",
    ],
    list: [
      "Deposits are non-refundable. ",
      "Project fees are refundable only if Continuum Transformation has not begun work and no deliverables have been initiated.",
      "Once work has started, no refunds are issued.",
    ],
  },
  {
    title: "4. Digital Products, Templates & On-Demand Content",
    body: [
      "All digital products-including templates, playbooks, recordings, and downloadable resources-are non-refundable due to the immediate access provided upon purchase. ",
      "If you experience technical issues accessing your content, please contact us and we will ensure you receive your materials. ",
    ],
  },
  {
    title: "5. Payment Processing & Disputes",
    body: [
      "Payments are securely processed through Stripe and PayPal. ",
    ],
    list: [
      "Refunds, when approved, will be issued to the original payment method. ",
      "Processing times may vary depending on your bank or payment provider. ",
      "If a chargeback or dispute is filed, access to all Continuum Transformation services will be paused until the matter is resolved. ",
    ],
  },
  {
    title: "6. How to Request a Refund",
    body: [
      "To request a refund, email: ",
      "support@continuumtransformation.com ",
      "Subject line: Refund Request - [Your Name] ",
      "Please include: ",
    ],
    list: [
      "Your full name ",
      "Email used at purchase ",
      "Program or service purchased ",
      "Reason for the request ",
    ],
    footer: "We respond to all refund inquiries within 3 business days. ",
  },
  {
    title: "7. Exceptions",
    body: [
      "Continuum Transformation reserves the right to make case-by-case exceptions in situations involving: ",
    ],
    list: [
      "Medical emergencies ",
      "Unexpected life events ",
      "Documented hardship ",
    ],
    footer: "These exceptions are not guaranteed but will be reviewed with care. ",
  },
  {
    title: "8. Contact",
    body: [
      "If you have questions about this policy, please contact: ",
      "support@continuumtransformation.com ",
    ],
  },
];

export const metadata = {
  title: "Refund Policy | Continuum Transformation",
  description:
    "Review the refund policy for Continuum Transformation programs, services, coaching, and digital products.",
};

export default function RefundPolicyPage() {
  return (
    <div className={`${styles.legalPage} ${styles.plainLegalPage}`}>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Continuum Transformation </p>

            <h1 className={styles.title}>Refund Policy</h1>
          </div>
        </section>

        <section className={styles.contentBand}>
          <div className={styles.content}>
            <div className={styles.summary}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: 0 }}>
                  <strong>Last Updated:</strong> May 2026 
                </p>
                <a 
                  href="/Refund_policy.pdf" 
                  download 
                  style={{
                    background: 'var(--color-burgundy)',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    padding: '13px 32px',
                    color: 'var(--color-warmCreamy)',
                    fontFamily: 'var(--font-chivo) !important',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    textTransform: 'capitalize',
                    textDecoration: 'none' 
                  }}
                   
                >
                  Download Refund Policy PDF
                </a>
              </div>

              <p>
                Continuum Transformation is committed to delivering
                high-quality programs, coaching, and enterprise
                transformation services. Because our offerings include
                digital products, live cohort experiences, and professional
                services with limited capacity, our refund policy varies by
                service type. 
              </p>

              <p>
                Please review the details below before completing your
                purchase or enrollment. 
              </p>
            </div>

            {refundSections.map((section, sectionIdx) => (
              <section className={styles.section} key={section.title}>
                <h2>{section.title}</h2>

                {section.body?.map((paragraph, bodyIdx) => (
                  <p key={`body-${sectionIdx}-${bodyIdx}`}>{paragraph}</p>
                ))}

                {section.list ? (
                  <ul>
                    {section.list.map((item, itemIdx) => (
                      <li key={`list-${sectionIdx}-${itemIdx}`}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {section.footer ? <p>{section.footer}</p> : null}
              </section>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}