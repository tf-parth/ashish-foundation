"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Heart, LogIn, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-forest/95 glass shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
        role="banner"
      >
        <nav
          className="container-wide mx-auto flex items-center justify-between px-4 md:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Ashish Foundation — Home"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Ashish Foundation Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-lg md:text-xl font-semibold tracking-tight transition-colors duration-300 ${
                  scrolled ? "text-white" : "text-white"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ashish Foundation
              </span>
              <span
                className={`text-[10px] md:text-xs tracking-widest uppercase transition-colors duration-300 ${
                  scrolled ? "text-white/70" : "text-white/60"
                }`}
              >
                Creating Opportunities
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  scrolled
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Login / Admin Button */}
            {!loading && (
              user ? (
                <Link
                  href="/admin"
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white/85 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white/85 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )
            )}

            <Link
              href="/#donate"
              className="ml-3 inline-flex items-center gap-2 px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-saffron/30 hover:scale-105"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </div>

          {/* Mobile: Donate + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/#donate"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white font-semibold text-xs rounded-full transition-all duration-300"
            >
              <Heart className="w-3.5 h-3.5" />
              Donate
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                scrolled
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-forest/98 glass lg:hidden"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-6"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl font-medium text-white/90 hover:text-saffron transition-colors duration-300"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Login / Admin in mobile */}
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {user ? (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium text-white/90 hover:text-saffron transition-colors duration-300 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-2xl font-medium text-white/90 hover:text-saffron transition-colors duration-300 flex items-center gap-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <LogIn className="w-5 h-5" />
                      Login
                    </Link>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/#donate"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 px-8 py-3 bg-saffron hover:bg-saffron-dark text-white font-semibold text-lg rounded-full transition-all duration-300"
                >
                  <Heart className="w-5 h-5" />
                  Donate Now
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
