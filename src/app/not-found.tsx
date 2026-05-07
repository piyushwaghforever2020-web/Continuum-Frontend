import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#f8f7fb",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 10px 30px rgba(20, 12, 35, 0.08)",
          textAlign: "center",
        }}
      >
        <p className="font-chivo text-nearBlack">Error 404</p>
        <h3 className="font-chivo text-burgundy">Page Not Found</h3>
        <p className=" font-chivo ">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          style={{
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--color-burgundy)",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "10px",
  padding: "0.7rem 1rem",
  fontWeight: 600,
}}
        >
          Go to Home
        </Link>
      </section>
    </main>
  );
}

