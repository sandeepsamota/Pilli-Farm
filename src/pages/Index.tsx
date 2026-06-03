import { motion } from "framer-motion";
import { ShieldCheck, Truck, Phone, MessageCircle, MapPin, Droplet, Star, ArrowRight, Search, X, Plus, Leaf, Sparkles, Zap, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerDetailsDialog } from "@/components/CustomerDetailsDialog";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { useCart } from "@/hooks/use-cart";
import { useProducts, type Product } from "@/hooks/use-products";
import { toast } from "@/hooks/use-toast";
import store from "@/assets/store.jpeg";
import Navbar from "@/components/ui/navbar";
import logo from "@/assets/logo.png";

const PHONE = "+917297820374";
const WA_LINK = `https://wa.me/917297820374?text=${encodeURIComponent("Hi Pilli Farm, I want to place an order")}`;

const brands = ["All Brands", "Tirupati", "Gulab", "Fortune"];
const categories = ["All", "Oils", "Ghee"];

const BADGE_ICONS: Record<string, typeof Leaf> = {
  "Best Seller": Sparkles,
  "Cold Pressed": Droplet,
  "Chemical-Free": Leaf,
};

const getProductBadges = (p: Product) => {
  const labels: string[] = [];
  if (p.isBestSeller) labels.push("Best Seller");
  for (const b of p.badges) if (!labels.includes(b)) labels.push(b);
  return labels.slice(0, 3).map((label) => ({ label, icon: BADGE_ICONS[label] ?? Leaf }));
};

const Index = () => {
  const [cat, setCat] = useState("All");
  const [brand, setBrand] = useState("All Brands");
  const [query, setQuery] = useState("");
  const { add } = useCart();
  const { data: products = [], isLoading } = useProducts();

  const handleAdd = (p: Product) => {
    add({ id: p.id, name: p.name, brand: p.brand, size: p.size, price: p.price, img: p.img });
    toast({ title: "Added to cart", description: `${p.name} • ${p.size}` });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "All" && p.category.trim().toLowerCase() !== cat.trim().toLowerCase()) return false;
      if (brand !== "All Brands" && p.brand.trim().toLowerCase() !== brand.trim().toLowerCase()) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.size.toLowerCase().includes(q)
      );
    });
  }, [cat, brand, query, products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      {/* <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/60">
        <div className="container flex items-center justify-between py-4">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
              <Droplet className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-tight">Pilli Farm</span>
              <span className="block text-xs text-muted-foreground">Live Healthy, Cook Healthier</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#products" className="hover:text-primary transition-colors">Products</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <CartDrawer />
            <a href={WA_LINK} target="_blank" rel="noreferrer">
              <Button variant="whatsapp" size="lg" className="hidden sm:inline-flex">
                <MessageCircle className="h-4 w-4" /> Order via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </header> */}

      <Navbar />
      {/* Hero */}
      <HeroSlider />

      {/* Products */}
      <section id="products" className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold">Our Products</h2>
            <p className="mt-4 text-muted-foreground">
              Choose from our wide range of premium quality edible oils and pure
              ghee from trusted brands.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-10 max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand, type or size — e.g. Tirupati 15 kg, Ghee, Mustard…"
              className="h-14 rounded-full pl-14 pr-14 text-base bg-card shadow-card border-border focus-visible:ring-primary"
              aria-label="Search products"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${cat === c
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-foreground hover:bg-secondary border border-border"
                  }`}
              >
                {c}
              </button>
            ))}
            <span className="mx-2 hidden sm:block h-6 w-px bg-border" />
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${brand === b
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-secondary border border-border"
                  }`}
              >
                {b}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {products.length} products
          </p>

          {isLoading && (
            <div className="mt-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => {
              const cardBadges = getProductBadges(p);
              const benefit = p.benefit;
              const isBestSeller = p.isBestSeller;
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "120px 0px" }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.03 }}
                  className="group flex flex-col rounded-3xl bg-card p-5 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1.5 border border-border/40"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                    {isBestSeller && (
                      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-[11px] font-semibold shadow-soft">
                        <Sparkles className="h-3 w-3" /> Best Seller
                      </span>
                    )}
                    <span className="absolute top-3 right-3 z-10 rounded-full bg-card/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-soft">
                      {p.size}
                    </span>
                    <ProductImageCarousel images={p.images} alt={p.name} />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{p.brand}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">{p.category}</span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug line-clamp-2 min-h-[3.25rem]">
                    {p.name}
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Leaf className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="line-clamp-1">{benefit}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cardBadges.map((b) => (
                      <span
                        key={b.label}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-[10.5px] font-medium border border-border/60"
                      >
                        <b.icon className="h-3 w-3 text-primary" />
                        {b.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Price</p>
                      <p className="font-display text-2xl font-bold leading-none mt-1">{p.price}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Zap className="h-3.5 w-3.5" /> In Stock
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="hero" onClick={() => handleAdd(p)} className="w-full">
                      <Plus className="h-4 w-4" /> Add to Cart
                    </Button>
                    <CustomerDetailsDialog
                      title={`Buy Now — ${p.name}`}
                      description="Enter your delivery details and we'll send this order to WhatsApp."
                      buildOrderLines={() => [
                        `1. ${p.name} (${p.size}) — 1 × ${p.price}`,
                        "",
                        `Subtotal: ${p.price}`,
                      ]}
                      trigger={
                        <Button variant="outline-hero" className="w-full">
                          Buy Now <ArrowRight className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </motion.article>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">No products match your search or filters.</p>
                <button
                  onClick={() => { setQuery(""); setCat("All"); setBrand("All Brands"); }}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 lg:py-28 bg-secondary/40">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={store}
              alt="Pilli Farm store interior"
              loading="lazy"
              width={1024}
              height={1024}
              className="rounded-3xl shadow-elevated w-full aspect-square object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-elevated p-6 max-w-[200px]">
              <p className="font-display text-4xl font-bold text-primary">18+</p>
              <p className="text-sm text-muted-foreground mt-1">Years of Trust</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium">
              <Star className="h-4 w-4 text-primary" /> About Us
            </span>
            <h2 className="mt-6 font-display text-4xl md:text-5xl font-bold leading-tight">
              Your Trusted Partner for Quality Oils
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Pilli Farm has been serving households with premium quality
              edible oils and pure ghee for over 18 years. We are authorized
              retailers for top brands including Tirupati (Kadi, Kalol), Gulab,
              and Fortune.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, t: "100% Authentic", d: "Genuine branded products" },
                { icon: Truck, t: "Same Day Delivery", d: "Quick doorstep delivery" },
              ].map((f) => (
                <div key={f.t} className="flex gap-4 p-5 rounded-2xl bg-card shadow-card">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{f.t}</p>
                    <p className="text-sm text-muted-foreground">{f.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Cotton Seed Oil", "Groundnut Oil", "Corn Oil", "Sunflower Oil", "Pure Ghee"].map((t) => (
                <span key={t} className="px-4 py-2 rounded-full bg-background border border-border text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}


      <section id="contact" className="py-20 lg:py-28 bg-[#f8f5ef]">
        <div className="container">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-green-900">
              Ready to Order Fresh Oils?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Choose the fastest way to order. We deliver fresh, chemical-free oils directly to your home.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: "Order on WhatsApp",
                desc: "Fastest way • Instant response",
                cta: "Chat & Order Now",
                href: WA_LINK,
                tone: "whatsapp",
                highlight: true,
                badge: "Recommended",
              },
              {
                icon: Phone,
                title: "Call to Order",
                desc: `Speak directly • +91 72978 20374`,
                cta: "Call Now",
                href: `tel:${PHONE}`,
                tone: "primary",
              },
              {
                icon: MapPin,
                title: "Visit Our Store",
                desc: "Pilli kothi, Shiv nager, Loharwara, Rajasthan",
                cta: "Get Directions",
                href: "https://www.google.com/maps/place/Pilli+Farm/@27.5495041,75.6886748,17z/data=!3m1!4b1!4m6!3m5!1s0x396ce1527757e3cb:0xb32113fe9570295!8m2!3d27.5494994!4d75.6912497!16s%2Fg%2F11vd8ncq9t?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D",
                tone: "primary",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`relative rounded-3xl p-8 text-center transition-all duration-300
          ${c.highlight
                    ? "bg-green-50 border border-green-200 shadow-[0_12px_40px_rgba(0,128,0,0.12)] scale-[1.02]"
                    : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  }
          hover:-translate-y-2 hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)]`}
              >

                {/* Badge */}
                {c.badge && (
                  <span className="absolute top-4 right-4 text-[10px] px-2 py-1 rounded-full bg-green-700 text-white font-medium">
                    {c.badge}
                  </span>
                )}

                {/* Icon */}
                <span
                  className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ring-2
            ${c.tone === "whatsapp"
                      ? "bg-green-100 text-green-700 ring-green-200"
                      : "bg-green-50 text-green-800 ring-green-100"
                    }`}
                >
                  <c.icon className="h-6 w-6" />
                </span>

                {/* Title */}
                <h3 className="mt-5 text-xl font-semibold text-green-900">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {c.desc}
                </p>

                {/* CTA */}
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="mt-6 inline-block w-full"
                >
                  <Button
                    className={`w-full rounded-full transition-all duration-200
              ${c.tone === "whatsapp"
                        ? "bg-green-700 text-white hover:bg-green-800 shadow-md hover:scale-105"
                        : c.tone === "primary"
                          ? "bg-green-800 text-white hover:bg-green-900"
                          : "border border-green-700 text-green-700 hover:bg-green-50"
                      }`}
                  >
                    {c.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>

          {/* Trust Row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
         
            <span className="flex items-center gap-2">
              ⚡ <span>Delivery Available</span>
            </span>
            <span className="flex items-center gap-2">
              💬 <span>Quick WhatsApp Response</span>
            </span>
          </div>

        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border bg-secondary/40 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          {/* <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Droplet className="h-4 w-4" />
            </span>
            <span className="font-display font-bold text-foreground">Pilli Farm</span>
          </div> */}

            <img
                        src={logo}
                        width={96}
                        height={36}
                        className={`object-contain transition-all duration-300`}
                        alt="Pilli Farm"
                      />
          <p>© {new Date().getFullYear()} Pilli Farm. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default Index;
