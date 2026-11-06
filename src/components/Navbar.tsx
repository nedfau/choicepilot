"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/research", label: "Research" },
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/chat", label: "Chat" },
  { href: "/demo", label: "Demo" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActive(href: string): boolean {
    return href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;
  }

  return (
    <header className="border-b border-zinc-100">
      <nav className="mx-auto max-w-5xl px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
            ChoicePilot
          </Link>

          <div className="hidden items-center gap-6 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="mt-4 flex flex-col gap-4 border-t border-zinc-100 pt-4 sm:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive(link.href) ? "text-zinc-900" : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
