"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";

const cartCount = 0;
const linkStyles =
  "relative inline-flex min-h-11 items-center text-sm font-medium text-foreground after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:opacity-0 after:transition-[transform,opacity] after:duration-200 hover:after:scale-x-100 hover:after:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand focus-visible:after:scale-x-100 focus-visible:after:opacity-100";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function CurrentLink({ href, children, onClick }: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${linkStyles} ${active ? "text-brand after:scale-x-100 after:opacity-100" : ""}`}
    >
      {children}
    </Link>
  );
}

function CartLink() {
  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${cartCount} items`}
      className="group inline-flex min-h-11 min-w-11 items-center justify-center rounded-full transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="relative inline-block h-5 w-5 text-foreground" aria-hidden="true">
        <span className="absolute left-1 top-1 h-2 w-3 -skew-x-12 border-x border-b border-current" />
        <span className="absolute left-0 top-0.5 h-px w-1 bg-current" />
        <span className="absolute bottom-0 left-1 h-1 w-1 rounded-full bg-current" />
        <span className="absolute bottom-0 right-1 h-1 w-1 rounded-full bg-current" />
      </span>
      {cartCount > 0 && (
        <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerOpenRef = useRef(false);
  const lastScrollY = useRef(0);
  const scrollTravel = useRef(0);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const delta = scrollY - lastScrollY.current;
      scrollTravel.current =
        delta === 0 || Math.sign(delta) === Math.sign(scrollTravel.current)
          ? scrollTravel.current + delta
          : delta;

      setScrolled(scrollY > 8);
      setProgress(maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0);

      if (!drawerOpenRef.current) {
        if (scrollY < 96 || scrollTravel.current < -8) {
          setHidden(false);
          scrollTravel.current = 0;
        } else if (scrollTravel.current > 8) {
          setHidden(true);
          scrollTravel.current = 0;
        }
      } else {
        scrollTravel.current = 0;
      }

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    drawerOpenRef.current = false;
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusableElements = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    getFocusableElements()[0]?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        drawerOpenRef.current = false;
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    drawer.addEventListener("keydown", trapFocus);
    return () => drawer.removeEventListener("keydown", trapFocus);
  }, [drawerOpen]);

  const setDrawerVisibility = (open: boolean) => {
    drawerOpenRef.current = open;
    setDrawerOpen(open);
    if (open) setHidden(false);
  };

  const moveCta = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.12;
    const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.18;
    event.currentTarget.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  };

  const resetCta = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  const closeDropdownIfFocusLeaves = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setServicesOpen(false);
    }
  };

  const cta = (
    <Link
      href="/signup"
      onPointerMove={moveCta}
      onPointerLeave={resetCta}
      className="relative isolate inline-flex min-h-11 items-center justify-center overflow-visible rounded-full bg-brand px-6 text-sm font-semibold text-white transition-transform duration-150 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-brand/40 before:opacity-0 before:blur-lg before:transition-opacity before:duration-200 hover:before:opacity-100 focus-visible:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span className="relative">Contact Us</span>
    </Link>
  );

  const servicesActive = isActive(pathname, "/services");

  return (
    <>
      <header
        className={`sticky top-0 z-50 -mx-4 h-16 px-4 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} ${scrolled ? "bg-surface/85 backdrop-blur-lg" : "bg-surface"}`}
      >
        <div className={`mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 transition-transform duration-300 ${scrolled ? "scale-[0.98]" : "scale-100"}`}>
          <Link
            href="/"
            aria-label="Sechurplets Studio home"
            aria-current={pathname === "/" ? "page" : undefined}
            className="shrink-0 rounded-sm text-base font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Sechurplets Studio
          </Link>

          <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
            <CurrentLink href="/">Home</CurrentLink>
            <CurrentLink href="/about">About</CurrentLink>
            <div
              className="relative flex items-center gap-1"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onFocusCapture={() => setServicesOpen(true)}
              onBlur={closeDropdownIfFocusLeaves}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setServicesOpen(false);
                  dropdownButtonRef.current?.focus();
                }
              }}
            >
              <CurrentLink href="/services">Services</CurrentLink>
              <button
                ref={dropdownButtonRef}
                type="button"
                aria-label="Toggle Services menu"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen((open) => !open)}
                className="inline-flex size-8 items-center justify-center rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rotate-45 border-b border-r border-current transition-transform duration-200 ${servicesOpen ? "-translate-y-0.5 rotate-[225deg]" : "translate-y-[-2px]"}`}
                />
              </button>
              <div
                id="services-menu"
                aria-hidden={!servicesOpen}
                inert={!servicesOpen}
                className={`absolute left-0 top-full min-w-40 origin-top-left rounded-card border border-foreground/10 bg-surface p-2 shadow-lg transition-[opacity,transform] duration-200 ${servicesOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
              >
                <CurrentLink href="/services">Services</CurrentLink>
              </div>
            </div>
            <CurrentLink href="/contact">Contact</CurrentLink>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <CurrentLink href="/login">Login</CurrentLink>
            <CartLink />
            {cta}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation"
            onClick={() => setDrawerVisibility(!drawerOpen)}
            className="inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:hidden"
          >
            <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span className={`h-px w-full bg-current transition-transform ${drawerOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-px w-full bg-current transition-opacity ${drawerOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`h-px w-full bg-current transition-transform ${drawerOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>

          <div
            id="mobile-navigation"
            ref={drawerRef}
            role="dialog"
            aria-modal={drawerOpen ? true : undefined}
            aria-hidden={!drawerOpen}
            inert={!drawerOpen}
            aria-label="Mobile navigation"
            className={`absolute left-0 right-0 top-full origin-top rounded-b-card border-t border-foreground/10 bg-surface/95 p-4 shadow-lg backdrop-blur-lg transition-[opacity,transform] duration-200 md:hidden ${drawerOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
          >
            <nav aria-label="Mobile navigation links" className="flex flex-col">
              <CurrentLink href="/" onClick={() => setDrawerVisibility(false)}>Home</CurrentLink>
              <CurrentLink href="/about" onClick={() => setDrawerVisibility(false)}>About</CurrentLink>
              <CurrentLink href="/services" onClick={() => setDrawerVisibility(false)}>Services</CurrentLink>
              <CurrentLink href="/contact" onClick={() => setDrawerVisibility(false)}>Contact</CurrentLink>
            </nav>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-foreground/10 pt-4">
              <CurrentLink href="/login" onClick={() => setDrawerVisibility(false)}>Login</CurrentLink>
              <CartLink />
              <span onClick={() => setDrawerVisibility(false)}>{cta}</span>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      {drawerOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          tabIndex={-1}
          onClick={() => setDrawerVisibility(false)}
          className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
        />
      )}
    </>
  );
}