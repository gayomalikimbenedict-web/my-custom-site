"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

const linkClass =
  "text-sm transition-colors hover:text-white hover:underline underline-offset-4 focus-visible:text-white focus-visible:underline";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Placeholder: replace this timer with a database call later.
    setTimeout(() => setStatus("success"), 800);
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">Sechurplets Studio</p>
            <p className="mt-3 text-sm">
              A calmer, more capable creative studio for the work you are excited to share.
            </p>
            <div className="mt-4 flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={linkClass}>Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={linkClass}>Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={linkClass}>LinkedIn</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">Company</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className={linkClass}>About Us</Link></li>
              <li><Link href="/careers" className={linkClass}>Careers</Link></li>
              <li><Link href="/press" className={linkClass}>Press</Link></li>
              <li><Link href="/help" className={linkClass}>Help Center</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Legal</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={linkClass}>Terms of Service</Link></li>
            </ul>
            <p className="mt-6 font-semibold text-white">Contact</p>
            <ul className="mt-3 space-y-2">
              <li><a href="mailto:info@yourcompany.com" className={linkClass}>info@yourcompany.com</a></li>
              <li><a href="tel:+15550199" className={linkClass}>+1 555 0199</a></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-white">Newsletter</p>
            <p className="mt-3 text-sm">News and updates, no spam.</p>
            {status === "success" ? (
              <p role="status" className="mt-3 text-sm text-emerald-400">
                Thank you! You are subscribed.
              </p>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-3 flex flex-col gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="you@example.com"
                  aria-invalid={status === "error"}
                  className="min-h-11 rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-[var(--color-brand)] focus:outline-none"
                />
                {status === "error" && (
                  <p role="alert" className="text-sm text-red-400">Please enter a valid email.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="min-h-11 rounded-lg bg-[var(--color-brand)] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} Sechurplets Studio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}