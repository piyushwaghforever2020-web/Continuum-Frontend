import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "../legal.module.css";

type PrivacySubsection = {
  title: string;
  body?: string[];
  list?: string[];
};

type PrivacySection = {
  title: string;
  body?: string[];
  list?: string[];
  subsections?: PrivacySubsection[];
  footer?: string;
};

const privacySections: PrivacySection[] = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect different types of information to provide, operate, and improve our website, programs, registration flows, and related Continuum Transformation services.",
    ],
    subsections: [
      {
        title: "a. Personal Information",
        body: [
          "When you register, inquire, join an email list, reserve a seat, sponsor a participant, or use our Services, we may collect personally identifiable information, including but not limited to:",
        ],
        list: [
          "Full name",
          "Email address",
          "Mobile number",
          "Billing and shipping address",
          "Organization, role, and program interests",
          "Account login credentials, where applicable",
        ],
      },
      {
        title: "b. Payment Information",
        body: [
          "We use trusted third-party payment gateways such as Stripe and PayPal to process payments securely. We do not store or have access to your full credit or debit card details. Payment information is handled directly by these providers in accordance with their own privacy policies and security standards.",
        ],
      },
      {
        title: "c. Usage Data",
        body: [
          "We may automatically collect certain information when you use our Services, including:",
        ],
        list: [
          "IP address",
          "Browser type and version",
          "Device type and operating system",
          "Pages visited and time spent",
          "Referring URLs and interaction data",
        ],
      },
      {
        title: "d. Cookies and Tracking Technologies",
        body: [
          "We use cookies and similar tracking technologies to monitor activity on our Services and improve user experience. You can control cookie preferences through your browser settings.",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: ["We use the collected information for various purposes, including:"],
    list: [
      "To provide, operate, and maintain our Services",
      "To process transactions and send confirmations",
      "To manage registrations, cohorts, sponsorship inquiries, and program communications",
      "To improve, personalize, and expand our Services",
      "To communicate with you about customer support, updates, and notifications",
      "To detect and prevent fraud, abuse, and security issues",
      "To comply with legal obligations",
    ],
  },
  {
    title: "3. Sharing and Disclosure of Information",
    body: ["We may share your information in the following situations:"],
    list: [
      "With payment providers to securely process transactions, including Stripe and PayPal",
      "With service providers that support hosting, analytics, email delivery, customer support, and technical services",
      "For legal requirements, if required by law, regulation, legal process, or lawful public authority request",
      "For business transfers, in case of a merger, sale, acquisition, financing, or transfer of business assets",
    ],
    footer: "We do not sell, rent, or trade your personal information to third parties.",
  },
  {
    title: "4. Data Security",
    body: [
      "We implement reasonable industry-standard security measures such as encryption, access controls, firewalls, and secure service providers to protect your data. However, no method of transmission over the Internet or electronic storage is completely secure.",
    ],
  },
  {
    title: "5. Data Retention",
    body: [
      "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, support our programs and Services, resolve disputes, maintain business records, and comply with legal obligations.",
    ],
  },
  {
    title: "6. Your Rights and Choices",
    body: ["Depending on your location, you may have the following rights:"],
    list: [
      "Access, update, or delete your personal data",
      "Withdraw consent at any time",
      "Object to data processing",
      "Request data portability",
      "Unsubscribe from marketing communications using the unsubscribe link included in those messages",
    ],
  },
  {
    title: "7. Third-Party Services",
    body: [
      "Our Services may contain links or integrations with third-party services such as Stripe, PayPal, analytics providers, email tools, downloadable resources, and external websites. We are not responsible for the privacy practices of these external services. We recommend reviewing their privacy policies separately.",
    ],
  },
  {
    title: "8. Children's Privacy",
    body: [
      "Our Services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "9. Changes to This Privacy Policy",
    body: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.',
    ],
  },
  {
    title: "10. Contact Us",
    body: [
      "If you have any questions or concerns about this Privacy Policy, you can contact Continuum Transformation using the details below.",
    ],
    list: [
      "Email: info@continuumtransformation.com",
      "Phone: +1 682 600 2719",
      "Contact page: /contact",
    ],
  },
];

export const metadata = {
  title: "Privacy Policy | Continuum Transformation",
  description:
    "Review how Continuum Transformation collects, uses, and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className={`${styles.legalPage} ${styles.plainLegalPage}`}>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Continuum Transformation</p>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.intro}>
              This Privacy Policy explains how Continuum Transformation
              collects, uses, stores, and protects your personal information
              when you access or use our website, application, programs, or
              services.
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
                This Privacy Policy explains how <strong>Continuum Transformation</strong>{" "}
                (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects,
                uses, stores, and protects your personal information when you
                access or use our website, application, programs, or services
                (&quot;Services&quot;).
              </p>
              <p>
                By using our Services, you agree to the collection and use of
                information in accordance with this Privacy Policy.
              </p>
            </div>

            {privacySections.map((section) => (
              <section className={styles.section} key={section.title}>
                <h2>{section.title}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list ? (
                  <ul>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.subsections?.map((subsection) => (
                  <div className={styles.subsection} key={subsection.title}>
                    <h3>{subsection.title}</h3>
                    {subsection.body?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {subsection.list ? (
                      <ul>
                        {subsection.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
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
