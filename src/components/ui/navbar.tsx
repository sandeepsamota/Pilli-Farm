import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "../CartDrawer";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating pill navbar */}
      <header
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl transition-all duration-300 ease-out ${
          scrolled ? "top-3" : "top-5"
        }`}
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
      >
        <div
          className={`flex items-center justify-between rounded-full border transition-all duration-500 ease-out ${
            scrolled ? "py-2 pl-3 pr-2" : "py-2.5 pl-4 pr-2.5"
          }`}
          style={{
            backgroundColor: "rgba(248, 244, 237, 0.65)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderColor: "rgba(255, 255, 255, 0.4)",
            boxShadow: scrolled
              ? "0 8px 28px -14px rgba(20, 50, 30, 0.18)"
              : "0 12px 36px -18px rgba(20, 50, 30, 0.20)",
          }}
        >
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 shrink-0 pl-1">
            <img
              src={logo}
              width={96}
              height={36}
              className={`object-contain transition-all duration-300 ${
                scrolled ? "h-8" : "h-9"
              }`}
              alt="Pilli Farm"
            />
          </a>

          {/* Centered nav links */}
          <nav className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {["Home", "Products", "About", "Contact Us"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-[13px] font-normal tracking-wide text-[#1f4a2c]/85 hover:text-[#1f4a2c] transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <div className="grid place-items-center h-10 w-10 rounded-full text-[#1f4a2c] hover:bg-white/50 transition-colors duration-300">
              <CartDrawer />
            </div>

            <a href="#products" className="hidden sm:inline-flex">
              <button
                className={`rounded-full text-white font-medium tracking-wide transition-all duration-500 hover:scale-[1.02] ${
                  scrolled ? "px-4 py-2 text-[12.5px]" : "px-5 py-2.5 text-[13px]"
                }`}
                style={{
                  backgroundColor: "#4a8c3f",
                  boxShadow: "0 4px 14px -6px rgba(74,140,63,0.45)",
                }}
              >
                Shop Now
              </button>
            </a>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden h-10 w-10 grid place-items-center rounded-full text-[#1f4a2c] hover:bg-white/60 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#f5f1e9] z-50 shadow-xl p-6 flex flex-col"
              style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-semibold text-[#1f4a2c]">Menu</span>
                <button onClick={() => setOpen(false)}>
                  <X className="h-6 w-6 text-[#1f4a2c]" />
                </button>
              </div>
              <div className="flex flex-col gap-5 text-[#1f4a2c] text-base font-medium">
                {["Home", "Products", "About", "Contact"].map((label) => (
                  <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setOpen(false)}>
                    {label}
                  </a>
                ))}
              </div>
              <div className="flex-1" />
              <a href="#products" onClick={() => setOpen(false)}>
                <button
                  className="w-full rounded-full text-white py-3 text-sm font-medium transition hover:opacity-90"
                  style={{ backgroundColor: "#4a8c3f" }}
                >
                  Shop Now
                </button>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
