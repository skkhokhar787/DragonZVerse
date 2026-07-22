import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/characters", label: "Characters" },
  { to: "/planets", label: "Planets" },
  { to: "/transformations", label: "Transformations" },
  { to: "/battles", label: "Battles" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-8 transition-all duration-300 ${
        scrolled
          ? "h-16 bg-surface-container/95 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_0_15px_rgba(255,183,129,0.3)]"
          : "h-20 bg-secondary/60 backdrop-blur-xl border-b border-outline/30"
      }`}
    >
      <Link
        to="/"
        className="font-display-lg text-display-lg text-primary tracking-tighter italic hover:scale-105 transition-transform duration-200"
      >
        DragonVerse
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `font-headline-md text-headline-md transition-all duration-200 hover:scale-105 ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-primary hover:scale-110 transition-transform active:scale-95">
          <span className="material-symbols-outlined text-4xl">account_circle</span>
        </button>

        <button
          className="md:hidden text-primary hover:scale-110 transition-transform"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-surface-container/95 backdrop-blur-md border-b border-outline-variant/30 md:hidden">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-headline-md text-headline-md px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
