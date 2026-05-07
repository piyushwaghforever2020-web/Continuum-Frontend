import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../legal.module.css";

type TermsSection = {
  title: string;
  body: string[];
  list?: string[];
};

const termsSections: TermsSection[] = [
  {
    title: "1. Use of Services",
    body: [
      "You agree to use our Services only for lawful purposes and in accordance with these Terms. You must not misuse our website, application, registration flows, payment flows, program materials, or platform, or attempt to access them using unauthorized methods.",
    ],
  },
  {
    title: "2. User Accounts",
    body: [
      "To access certain features, you may be required to create an account or provide registration information. You are responsible for maintaining the confidentiality of your account credentials.",
    ],
    list: [
      "You must provide accurate and complete information",
      "You are responsible for all activities under your account",
      "Notify us immediately of any unauthorized use",
    ],
  },
  {
    title: "3. Payments and Billing",
    body: [
      "We use third-party payment providers such as Stripe and PayPal for secure payment processing.",
    ],
    list: [
      "All payments must be made through approved payment methods",
      "We do not store your card details",
      "Transactions are subject to verification and approval",
    ],
  },
  {
    title: "4. Pricing and Changes",
    body: [
      "We reserve the right to modify pricing, features, cohort dates, program availability, or Services at any time without prior notice. Any changes will be effective immediately upon posting unless otherwise stated.",
    ],
  },
  {
    title: "5. Refund and Cancellation",
    body: [
      "Refunds and cancellations are subject to the refund, cancellation, and enrollment terms shared during registration or in applicable program materials. We may approve or reject refund requests at our discretion, depending on the circumstances and the offering purchased.",
    ],
  },
  {
    title: "6. Prohibited Activities",
    body: ["You agree not to:"],
    list: [
      "Use the Services for illegal or unauthorized purposes",
      "Attempt to hack, disrupt, damage, or impair the platform",
      "Upload malicious code or harmful content",
      "Violate any applicable laws or regulations",
      "Copy, distribute, or misuse Continuum Transformation content or program materials without permission",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "All content, trademarks, logos, frameworks, program materials, downloads, images, text, graphics, and design elements available through our Services are the property of Continuum Transformation or its licensors and are protected by applicable intellectual property laws.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      "We are not liable for any indirect, incidental, consequential, punitive, or special damages arising from your use of our Services, programs, materials, or website. Use of the Services is at your own risk.",
    ],
  },
  {
    title: "9. Disclaimer",
    body: [
      'Our Services are provided on an "as-is" and "as-available" basis. We do not guarantee that the Services will be uninterrupted, error-free, or that any particular business, leadership, or transformation outcome will be achieved.',
    ],
  },
  {
    title: "10. Termination",
    body: [
      "We reserve the right to suspend or terminate your account, registration, or access to Services at any time if you violate these Terms or use the Services in a way that may harm Continuum Transformation, other users, or third-party providers.",
    ],
  },
  {
    title: "11. Third-Party Services",
    body: [
      "Our platform may include links or integrations with third-party services such as Stripe, PayPal, analytics providers, email tools, and external resources. We are not responsible for their services, availability, terms, or policies.",
    ],
  },
  {
    title: "12. Governing Law",
    body: [
      "These Terms shall be governed and interpreted in accordance with the laws of India, unless another governing law is required by applicable consumer protection or local law.",
    ],
  },
  {
    title: "13. Changes to Terms",
    body: [
      "We may update these Terms from time to time. Continued use of the Services after changes means you accept the updated Terms.",
    ],
  },
  {
    title: "14. Contact Us",
    body: [
      "If you have any questions regarding these Terms, please contact Continuum Transformation using the details below.",
    ],
    list: [
      "Email: info@continuumtransformation.com",
      "Phone: +1 682 600 2719",
      "Contact page: /contact",
    ],
  },
];

export const metadata = {
  title: "Terms | Continuum Transformation",
  description:
    "Review the terms for using the Continuum Transformation website, programs, and services.",
};

export default function TermsPage() {
  return (
    <div className={`${styles.legalPage} ${styles.plainLegalPage}`}>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Continuum Transformation</p>
            <h1 className={styles.title}>Terms and Conditions</h1>
            <p className={styles.intro}>
              These Terms and Conditions govern your use of the Continuum
              Transformation website, application, programs, and services.
            </p>
          </div>
        </section>

        <section className={styles.contentBand}>
          <div className={styles.content}>
            <div className={styles.summary}>
              <p>
                <strong>Last Updated:</strong> May 2026
              </p>
              <p>
                Welcome to <strong>Continuum Transformation</strong>{" "}
                (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;). These Terms and Conditions
                (&quot;Terms&quot;) govern your use of our website, application,
                programs, and services (&quot;Services&quot;).
              </p>
              <p>
                By accessing or using our Services, you agree to be bound by
                these Terms. If you do not agree, please do not use our
                Services.
              </p>
            </div>

            {termsSections.map((section) => (
              <section className={styles.section} key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
