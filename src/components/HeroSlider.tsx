import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import slideOilMobile from "@/assets/hero-oil.png";
import slideOil from "@/assets/hero-slide-oil.png";
import slideGhee from "@/assets/hero-slide-ghee.png";
// import slideFamily from "@/assets/hero-slide-family.jpg";
import slideFamily from "@/assets/hero-slide-family.png";
import slideFamilyMobile from "@/assets/hero-family.png";

type Slide = {
  img: string;
  mobileImg: string;
  alt: string;
  headline: string;
  highlight: string;
  subtext: string;
  cta: string;
  href: string;
  trustBadges?: string[];
};

const slides: Slide[] = [
  {
    img: slideOil,
    mobileImg: slideOilMobile,
    alt: "Golden cold-pressed oil pouring into a glass jar",
    headline: "Trusted by",
    highlight: "10,000+ Families",
    subtext: "Serving Ahmedabad Families with Quality and Trust for 18+ Years ",
    cta: "Shop Now",
    href: "#products",
    trustBadges: ["Groundnut Oil", "Sunflower Oil", "Cottonseed Oil", "Blended Oils"],

  },
  {
    img: slideGhee,
    mobileImg: slideGhee,
    alt: "Rustic glass jar of pure desi cow ghee",
    headline: "From Trusted Brands to",
    highlight: "Your Kitchen",
    subtext: "Premium Edible Oils & Pure Ghee for Every Home",
    cta: "Explore Ghee",
    href: "#products",
    trustBadges: ["Direct Company Sourcing", "Genuine Products", "Competitive Prices"],

  },
  {
    img: slideFamily,
    mobileImg: slideFamilyMobile,
    alt: "Happy family cooking together with pure oils",
    headline: "Choose Health",
    highlight: "Choose Purity",
    subtext: "Carefully Selected Products for Healthy Cooking & Better Living",
    cta: "View Products",
    href: "#products",
    trustBadges: ["Cold Pressed Oils", "Pure Ghee", "Traditional Nutrition"],
  },
];


export const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-hero">
      <div className="relative h-[640px] md:h-[700px] lg:h-[760px]">
        {/* Background image with fade */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Desktop */}
            <img
              src={slide.img}
              alt={slide.alt}
              width={1600}
              height={1200}
              className="hidden md:block h-full w-full object-cover scale-[1.02]"
            />

            {/* Mobile */}
            <img
              src={slide.mobileImg}
              alt={slide.alt}
              width={800}
              height={1200}
              className="block md:hidden h-full w-full object-cover"
            />
            {/* Softer, more cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c1a10]/80 via-[#0c1a10]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a10]/55 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}


        {/* Refined slide indicators */}


        {/* Content */}
        <div className="container relative z-10 h-full flex items-start md:items-center">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="pt-24 md:pt-0"
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/75">
                  <Leaf className="h-3 w-3 text-[#e6b450]" />
                  Trust · Quality · Purity
                </span>

                <h1 className="mt-4 md:mt-7 font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.04] text-balance text-white">
                  {slide.headline}
                  <span className="block italic font-light mt-1 md:mt-2" style={{ color: "#e6b450" }}>
                    {slide.highlight}
                  </span>
                </h1>

                {/* Hide subtext on mobile — too much vertical space */}
                <p className="hidden md:block mt-7 text-base md:text-lg text-white/80 max-w-lg leading-relaxed font-light">
                  {slide.subtext}
                </p>

                {/* Desktop CTA only — mobile CTA is in the fixed bottom bar */}
                <div className="hidden md:flex mt-10 items-center gap-6 flex-wrap">
                  <a href={slide.href}>
                    <button
                      className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium text-[#1f1503] transition-all duration-500 hover:scale-[1.02]"
                      style={{
                        background: "linear-gradient(135deg, #e6b450 0%, #c9962b 100%)",
                        boxShadow: "0 10px 30px -12px rgba(201, 150, 43, 0.55)",
                      }}
                    >
                      {slide.cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </button>
                  </a>

                  <div className="hidden sm:flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-white/65">
                    {slide.trustBadges.map((b, i) => (
                      <span key={b} className="flex items-center gap-4">
                        {i > 0 && <span className="h-1 w-1 rounded-full bg-white/30" />}
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile-only fixed bottom CTA bar */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 pt-10"
          style={{
            background: "linear-gradient(to top, #0c1a10 30%, transparent)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-cta-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href={slide.href} className="block">
                <button
                  className="group w-full inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-medium text-[#1f1503] transition-all duration-500 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #e6b450 0%, #c9962b 100%)",
                    boxShadow: "0 10px 30px -12px rgba(201, 150, 43, 0.55)",
                  }}
                >
                  {slide.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </a>

              {/* Slide indicators shifted here on mobile, above CTA */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-[2px] rounded-full transition-all duration-700 ease-out ${i === index ? "w-10 bg-[#e6b450]" : "w-5 bg-white/30 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop-only slide indicators */}
        <div className="hidden md:flex absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 z-10 items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[2px] rounded-full transition-all duration-700 ease-out ${i === index ? "w-10 bg-[#e6b450]" : "w-5 bg-white/30 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
