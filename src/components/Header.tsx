"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Enterprise", href: "/enterprise/" },
  { label: "Lab", href: "/transformlab/" },
  { label: "Studio", href: "/transformation-studio/" },
  { label: "Registration", href: "/registration/", hideOnTablet: true },
];

const moreItems = [
  { label: "Registration", href: "/registration/", tabletOnly: true },
  { label: "Sponsorship", href: "/sponsorship/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

const mobileMenuItems = [
  { label: "Enterprise", href: "/enterprise/" },
  { label: "Lab", href: "/transformlab/" },
  { label: "Studio", href: "/transformation-studio/" },
  { label: "Registration", href: "/registration/" },
  { label: "Sponsorship", href: "/sponsorship/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

const alterLogo = [
  { label: "Case Studies", href: "/transformation-studio/" },
];


export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // console.log(mobileOpen, "mobileOpen")
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownDesktopRef = useRef<HTMLDivElement>(null);
  const dropdownTabletRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const showAlternateLogo = alterLogo.some((item) =>
    pathname.startsWith(item.href)
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownDesktopRef.current &&
        !dropdownDesktopRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled
          ? ""
          : ""
          }`}
        style={{ height: "var(--header-height-desktop)" }}
        aria-label="Main navigation"
      >
        <div
          className="flex items-center justify-between h-full bg-white max-w-[1440px] mx-auto px-5 md:px-6 lg:px-8"
        >
          {/* Logo */}

          <Link
            href="/"
            className="flex-shrink-0 flex items-center"
            aria-label="Continuum Transformation Home"
          >
            <Image
              // src="/images/Logo.svg"
              src={showAlternateLogo ? "/images/lb_logo.png" : "/images/Logo.svg"}
              alt="Continuum Transformation Logo"
              width='180'
              height={50}
              className={`object-contain ${showAlternateLogo ? 'w-[180px] md:w-[210px] lg:w-[242px]' : 'w-[140px] md:w-[150px] lg:w-[180px]'}`}
              priority
            />
          </Link>

          <div className='flex gap-[32px]'>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center px-6" style={{ gap: "var(--space-8)" }} aria-label="Primary navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={` text-nearBlack font-chivo transition-colors duration-150 font-body font-medium text-base ${isActive
                ? "border-b-2 border-nearBlack"
                : "border-b-2 border-white "
              }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div ref={dropdownDesktopRef} className="relative" style={{ minWidth: "44px" }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center justify-betweenh-[44px] w-[32px] text-[#65758B] hover:text-[#38629c] font-body font-medium text-[16px]transition-colors duration-150 `}
              aria-haspopup="true"
            // aria-expanded={dropdownOpen}
            >
              <span className="mr-1 font-chivo text-nearBlack">More</span>
              {/* <span
                    className={`inline-block text-[12px] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} `}
                  >
                    ▾
                  </span> */}

              <img src="/images/menu-icon.png" alt="" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0 bg-white rounded-[8px] animate-slide-down w-[240px] mt-2 shadow-[var(--shadow-dropdown)] py-4 px-1"
              >
                {moreItems
                  .filter((item) => !item.tabletOnly)
                  .map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center font-body transition-colors text-nearBlack font-chivo duration-150
                            ${isActive
                            ? "bg-[#4D2E6B1A] text-nearBlack font-chivo font-bold"
                            : "text-nearBlack  font-chivo font-medium"
                          }
                            `}
                        style={{
                          padding: "var(--space-3) var(--space-5)",
                          fontSize: "15px",
                          minHeight: "44px",
                        }}
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </nav>

        {/* ── Tablet Nav ── */}
        <nav className="hidden md:flex lg:hidden items-center" style={{ gap: "var(--space-6)" }}>
          {navItems
            .filter((item) => !item.hideOnTablet)
            .map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={` text-nearBlack transition-colors font-chivo duration-150 font-body font-medium border-b-2 ${isActive
                    ? "border-nearBlack text-nearBlack "
                    : "border-transparent "
                    } `}
                  style={{ fontSize: "15px" }}
                >
                  {item.label}
                </Link>
              );
            })}

          {/* Tablet More - includes registration */}
          <div ref={dropdownTabletRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-nearBlack font-chivo transition-colors font-body font-medium"
              style={{ fontSize: "15px", height: "44px", padding: "0 var(--space-3)" }}
            // aria-expanded={dropdownOpen}
            >
              More
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0 bg-white rounded-[var(--radius-dropdown)] animate-slide-down px-1"
                style={{ width: "240px", marginTop: "8px", boxShadow: "var(--shadow-dropdown)", paddingTop: "var(--space-4)", paddingBottom: "var(--space-4)" }}
              >
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center text-[var(--color-dark)] hover:text-[var(--color-gold)] hover:bg-[var(--color-light)] transition-colors font-body font-medium
                          ${isActive
                          ? "bg-[#4D2E6B1A] text-nearBlack font-chivo font-bold"
                          : "text-nearBlack font-chivo font-medium"
                        }
                        `}
                      style={{ padding: "var(--space-3) var(--space-5)", fontSize: "15px", minHeight: "44px" }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        {/* ── CTA (Desktop + Tablet) ── */}
        <div className="hidden md:flex items-center" style={{ paddingRight: "0" }}>
          <Link
            href="/contact"
            className="btn btn-primary rounded-full bg-burgundy font-chivo text-white border-burgundy font-medium text-[16px] "
            style={{ height: "44px", padding: "var(--space-4) var(--space-6)" }}
          >
            Get in Touch
          </Link>
        </div>

        {/* ── Hamburger (Mobile) ── */}
        <button
          className="md:hidden flex items-center justify-center text-[#65758B] hover:text-[#38629c] relative z-999"
          style={{ width: "44px", height: "44px", marginRight: "calc(var(--space-5) - var(--space-8))" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div >
      </header >

    {/* ── Mobile Menu Overlay ── */ }
  {
    mobileOpen && (
      <div
        className="fixed inset-0 z-40 flex flex-col bg-[var(--color-dark)]"
        style={{ paddingTop: "var(--header-height-mobile)" }}
        ref={mobileRef}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <nav className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "var(--space-6) var(--space-5)" }}>
          {mobileMenuItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center text-white  font-chivo  border-b border-nearBlack font-body font-medium transition-colors"
              style={{ fontSize: "18px", padding: "var(--space-5) 0", animationDelay: `${i * 0.05}s` }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: "var(--space-8)" }}>
            <Link
              href="/contact"
              className="btn btn-primary w-full bg-burgundy font-chivo text-white border-burgundy font-medium text-[16px] "
              style={{ padding: "var(--space-4) var(--space-6)" }}
              onClick={() => setMobileOpen(false)}
            >
              Get in Touch
            </Link>
          </div>
        </nav>
      </div>
    )
  }
  {/* Spacer to prevent content from hiding under fixed header */ }
  <div
    className="block"
    style={{ height: "var(--header-height-desktop)" }}
    aria-hidden="true"
  />
    </>
  );
}
