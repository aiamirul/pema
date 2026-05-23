import { useState, useEffect, useRef } from "react";
import { Sparkles, Trophy, ShieldCheck, Clock, Zap, ArrowRight, Award, Layers, ChevronDown, Check, HelpCircle, PackageOpen, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Components
import Navbar from "./components/Navbar";
import CountDownTimer from "./components/CountDownTimer";
import SneakerSelector from "./components/SneakerSelector";
import ReservationForm from "./components/ReservationForm";
import ReservationLedger from "./components/ReservationLedger";

// Asset Images
// @ts-ignore
import heroSneaker from "./assets/images/pema_sneaker_hero_1779521068206.png";

// Types
import { CartItem, ShoeVariant } from "./types";

// Animated Count Up helper
function CountUpElement({
  end,
  valuePrefix = "",
  valueSuffix = "",
  duration = 1500,
}: {
  end: number;
  valuePrefix?: string;
  valueSuffix?: string;
  duration?: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCurrent(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {valuePrefix}
      {current.toLocaleString()}
      {valueSuffix}
    </span>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem("pema_local_cart");
    return local ? JSON.parse(local) : [];
  });

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [refreshLedgerTrigger, setRefreshLedgerTrigger] = useState(0);
  const [ledgerStats, setLedgerStats] = useState({ count: 41, totalSaved: 851967.60 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const customizationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("pema_local_cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (variant: ShoeVariant, size: number, qty: number) => {
    const itemId = `${variant.id}_${size}`;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.id === itemId);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += qty;
        return next;
      } else {
        return [...prev, { id: itemId, variant, size, quantity: qty }];
      }
    });
    // Scroll smoothly to reservation panel or notify
    setCheckoutOpen(true);
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleReservationSuccess = () => {
    // Empty local basket
    setCart([]);
    setCheckoutOpen(false);
    // Force sync the ledger database to fetch the new entry
    setRefreshLedgerTrigger((prev) => prev + 1);
  };

  const handleLedgerCounted = (totalUnitsInDB: number) => {
    // 50 total spots limit. Let's calculate total saved RM. Original = RM 25,999. Special = RM 5,199.80.
    // Saved per unit = RM 20,799.20.
    const savedRetail = totalUnitsInDB * 20799.20;
    setLedgerStats({
      count: Math.min(50, totalUnitsInDB),
      totalSaved: savedRetail,
    });
  };

  const faqData = [
    {
      q: "Where can I view the PEMA limited custom sneakers in Malaysia?",
      a: "PEMA holds invite-only private viewing events at luxury suites in Kuala Lumpur and Penang. Once your online reservation is secured on our ledger, a private advisor coordinates an physical appointment for sizing adjustment and fit tests.",
    },
    {
      q: "Why is there such a massive 80% discount campaign currently active?",
      a: "This exclusive campaign marks PEMA's inaugural entry into the Southeast Asian market, limited until next month June 2026. This promotion serves to establish our high-performance line among elite sport and fashion circles in Malaysia prior to our global offline launch.",
    },
    {
      q: "What is included with my premium PEMA reservation?",
      a: "Each pair ships in a premium serialized acrylic vault, custom-engraved brass certificate plate matched to your shoes' limited serial number (01 to 50), high-performance maintenance kits, and custom 24k gold accented fiber dust cases.",
    },
    {
      q: "How does the reservation delivery system operate?",
      a: "We offer complimentary white-glove climate-controlled courier transport to any verified residential or corporate suite in W.P. Kuala Lumpur, Selangor, Johor, and Penang. Full transit insurance is guaranteed.",
    },
    {
      q: "Can I customized or exchange sizes if it does not fit perfectly?",
      a: "Absolutely. During your initial white-glove arrival home-fitting, our team carries adjacent half-sizes in our private luxury trunk. If sizing is unsuitable, instant custom tailoring or exchanges are finalized on the spot.",
    },
  ];

  return (
    <div className="bg-[#050505] text-zinc-100 min-h-screen font-sans selection:bg-[#C5A059] selection:text-black antialiased overflow-x-hidden">
      
      {/* 1) Premium Navigation Section */}
      <Navbar
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      {/* 2) Cinematic Animated Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] xl:min-h-screen flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#050505]">
        
        {/* Luxury Gold and Dark ambient canvas lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#96743A]/5 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Visual Background grid wireframe overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 w-full animate-fade-in">
          
          {/* Left Text layout (Col 6) */}
          <div className="col-span-1 lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-mono font-bold tracking-[0.2em] rounded-none uppercase animate-pulse">
              <Sparkles className="w-4 h-4" />
              Limited Malaysian Release
            </div>

            <h1 className="text-4xl sm:text-6xl font-light tracking-tight uppercase leading-[1.05] text-white font-serif">
              The <span className="luxury-text-gradient font-serif italic">Apex</span> Of Luxury Sports
            </h1>

            <p className="text-white/50 text-sm sm:text-[15px] leading-relaxed max-w-xl font-sans">
              Hand-fabricated footwear engineering tailored for elite collectors in Malaysia. Presenting the limited <span className="text-[#C5A059] font-semibold font-mono">PEMA Series</span> — combining aerospace grade carbon soles, Italian woven fabric, and 24K pure gold-plated stabilization armor.
            </p>

            {/* Countdown timer with 80% Discount Campaign announcement */}
            <div className="p-5 sm:p-6 bg-black/60 border border-white/10 rounded-none max-w-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-white/5">
                <div>
                  <span className="text-[9px] font-mono text-[#C5A059] tracking-[0.25em] font-bold uppercase block">Limited 80% Privilege Price</span>
                  <span className="text-xl sm:text-2xl font-light font-mono text-white mt-1.5 block">
                    RM 5,199.80 <span className="text-xs text-white/30 font-normal line-through ml-2">RM 25,999.00</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-none text-red-400 text-[9px] font-bold uppercase font-mono tracking-widest">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  Locks Soon
                </div>
              </div>
              <CountDownTimer />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => customizationRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4.5 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.25em] rounded-none shadow-lg shadow-[#C5A059]/10 hover:shadow-[#C5A059]/25 transition duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                Assemble Your Pair
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => customizationRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4.5 bg-transparent border border-white/10 hover:border-[#C5A059]/40 text-white/60 hover:text-white rounded-none font-bold text-xs uppercase tracking-[0.25em] transition duration-300 text-center cursor-pointer"
              >
                Analyze Science
              </button>
            </div>
          </div>

          {/* Right Floating Product Showcase (Col 6) */}
          <div className="col-span-1 lg:col-span-6 relative flex items-center justify-center">
            {/* Visual Ring light backdrop */}
            <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] border border-[#C5A059]/10 rounded-full animate-spin [animation-duration:65s] pointer-events-none" />
            <div className="absolute w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] border border-dashed border-white/5 rounded-full pointer-events-none" />
            
            <div className="absolute bg-gradient-to-tr from-[#C5A059]/5 to-transparent w-80 h-80 rounded-full blur-2xl animate-pulse pointer-events-none" />

            <motion.div
              initial={{ y: 15 }}
              animate={{ y: -15 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 4.5,
                ease: "easeInOut",
              }}
              className="relative z-10 p-4"
            >
              <img
                src={heroSneaker}
                alt="PEMA Luxury Apex Sneaker Series"
                referrerPolicy="no-referrer"
                className="w-full max-w-[340px] sm:max-w-[500px] object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,0.9)] filter contrast-[1.05]"
              />

              {/* Floating Specification Pills */}
              <div className="absolute top-[20%] -left-6 sm:-left-12 p-3.5 bg-black/95 border border-white/10 rounded-none shadow-2xl flex items-center gap-3 backdrop-blur pointer-events-none">
                <span className="p-2.5 rounded-none bg-[#C5A059]/10 text-[#C5A059]">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">SOLE PLATFORM</span>
                  <span className="block text-xs font-bold text-white uppercase font-sans">Woven Carbon Core</span>
                </div>
              </div>

              <div className="absolute bottom-[20%] -right-6 sm:-right-12 p-3.5 bg-black/95 border border-white/10 rounded-none shadow-2xl flex items-center gap-3 backdrop-blur pointer-events-none">
                <span className="p-2.5 rounded-none bg-[#C5A059]/10 text-[#C5A059]">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[8px] font-mono text-white/40 uppercase tracking-[0.2em]">SERIALLY NUMBERED</span>
                  <span className="block text-xs font-bold text-white uppercase font-sans">01 / 50 Pairs</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3) Luxury Golden Stats Strip (Live Count Up Anim) */}
      <section className="border-y border-white/10 bg-black py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          
          <div className="flex flex-col items-center justify-center p-2">
            <span className="text-[10px] sm:text-xs text-white/40 font-mono uppercase tracking-[0.25em]">
              Secured Allocations in Malaysia
            </span>
            <div className="text-3xl sm:text-5xl font-mono font-light text-white mt-2">
              <CountUpElement end={ledgerStats.count} />
              <span className="text-[#C5A059] font-sans font-extralight"> / 50</span>
            </div>
            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-[0.2em] font-mono">
              ONLY {Math.max(0, 50 - ledgerStats.count)} SPECIAL ATELIER SPOTS LEFT
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2">
            <span className="text-[10px] sm:text-xs text-white/40 font-mono uppercase tracking-[0.25em]">
              VIP Patron Capital Saved
            </span>
            <div className="text-3xl sm:text-5xl font-mono font-light text-[#C5A059] mt-2">
              <CountUpElement end={Math.floor(ledgerStats.totalSaved)} valuePrefix="RM " />
            </div>
            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-[0.2em] font-mono">
              80% LAUNCH REBATE APPLIED LIVE
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 pt-6 sm:pt-2">
            <span className="text-[10px] sm:text-xs text-white/40 font-mono uppercase tracking-[0.25em]">
              Handcrafted Build Duration
            </span>
            <div className="text-3xl sm:text-5xl font-mono font-light text-white mt-2">
              <CountUpElement end={44} valueSuffix=" Hours" />
            </div>
            <p className="text-[9px] text-white/30 mt-1 uppercase tracking-[0.2em] font-mono">
              PER INDIVIDUAL ATELIER ASSEMBLY
            </p>
          </div>

        </div>
      </section>

      {/* 4) Interactive Customization & Showcase Hub */}
      <section ref={customizationRef} className="py-20 lg:py-32 px-6 max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#C5A059]">
            THE ATELIER STUDIO RESIDENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-light uppercase tracking-wide text-white font-serif italic">
            Configure Your Masterpiece
          </h2>
          <p className="text-white/40 text-xs sm:text-sm leading-relaxed">
            Choose your signature colorway, verify EU dimensions, and allocate your serial number into the secure regional server booking files.
          </p>
        </div>

        {/* Sneaker Customizer and Selector */}
        <SneakerSelector onAddToCart={handleAddToCart} />

        {/* 5) Interactive Live Checkout Panel */}
        <AnimatePresence>
          {checkoutOpen && cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-16"
            >
              <ReservationForm
                cart={cart}
                onSuccess={handleReservationSuccess}
                onCancel={() => setCheckoutOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6) Real-time DB Synced Allocation Reservation Ledger */}
        <div className="pt-10">
          <ReservationLedger
            refreshTrigger={refreshLedgerTrigger}
            onOrdersCounted={handleLedgerCounted}
          />
        </div>

      </section>

      {/* 7) Benefits & Materials Structural Layout */}
      <section className="bg-black py-20 lg:py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#C5A059] block">
                PEMA MATERIAL ENGINEERING
              </span>
              <h3 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white font-serif italic leading-tight">
                Defying Gravity, Fabricated For Gold.
              </h3>
            </div>
            <p className="text-white/40 text-sm max-w-md leading-relaxed font-sans">
              We sourced performance components worldwide to model a footwear structural marvel that performs like an active racing chassis while fitting like a premium glove.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-black border border-white/10 hover:border-[#C5A059]/50 rounded-none space-y-5 transition duration-500">
              <div className="w-12 h-12 bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-none flex items-center justify-center text-[#C5A059]">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-light uppercase tracking-widest text-white font-serif">Aerospace Carbon Sole</h4>
              <p className="text-xs text-white/40 leading-relaxed font-sans">
                Full platform custom-baked carbon fiber integration beneath the high-density EVA. Distributes localized foot pressures uniformly, yielding a explosive energy rebound rate over 41%.
              </p>
            </div>

            <div className="p-8 bg-black border border-white/10 hover:border-[#C5A059]/50 rounded-none space-y-5 transition duration-500">
              <div className="w-12 h-12 bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-none flex items-center justify-center text-[#C5A059]">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-light uppercase tracking-widest text-white font-serif">Electro-Plated Armor</h4>
              <p className="text-xs text-white/40 leading-relaxed font-sans">
                The striking structural heel counter was generated through precision molten polymers and electro-plated with real 24k aurum flakes. Provides lightweight side lateral resistance.
              </p>
            </div>

            <div className="p-8 bg-black border border-white/10 hover:border-[#C5A059]/50 rounded-none space-y-5 transition duration-500">
              <div className="w-12 h-12 bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-none flex items-center justify-center text-[#C5A059]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-light uppercase tracking-widest text-white font-serif">White-Glove Insurance</h4>
              <p className="text-xs text-white/40 leading-relaxed font-sans">
                Each delivery undergoes individual quality validation under laboratory conditions. Shipped in premium climate vaults complete with unique serial plates and registered certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8) Sophisticated FAQ Section */}
      <section className="py-20 lg:py-32 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#C5A059]">
            COMMON INQUIRIES
          </span>
          <h3 className="text-3xl sm:text-5xl font-light uppercase tracking-tight text-white font-serif italic">
            Atelier Verification Q&A
          </h3>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="bg-[#050505] border border-white/10 rounded-none overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center text-white cursor-pointer hover:bg-white/5 transition"
                >
                  <span className="font-semibold text-sm sm:text-base pr-4 font-serif">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#C5A059] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-xs sm:text-sm text-white/50 leading-relaxed border-t border-white/5 bg-[#050505]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9) Elegant Premium Footer */}
      <footer className="bg-black border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#96743A] rounded-xl p-0.5 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-black stroke-black fill-none stroke-[8]">
                  <path d="M 25,75 L 25,25 C 25,25 45,15 55,25 C 65,35 55,55 25,55 Q 65,55 75,75 M 50,55 L 75,25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-light tracking-[0.3em] text-white font-serif uppercase">PEMA</span>
                <span className="text-[7px] uppercase tracking-[0.5em] text-[#C5A059] font-mono font-bold leading-none mt-1">KUALA LUMPUR</span>
              </div>
            </div>
            
            <p className="text-white/40 text-xs leading-relaxed font-sans max-w-xs">
              Hand-assembly luxury sneaker manufacture registered and ledgered. Serial numbered batch allocated inside Kuala Lumpur workshops.
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 font-mono">
            <h4 className="text-[10px] uppercase text-white/50 tracking-[0.2em] font-bold">Secure Verification Notes</h4>
            <ul className="space-y-2.5 text-white/30 text-[11px]">
              <li>✓ Host ID: Cloud Applet Service Endpoint</li>
              <li>✓ Database: Laravel Meta API (Schema-less)</li>
              <li>✓ Ledger Block: Dynamic pre_orders index</li>
              <li>✓ Encryption: TLS 256-bit Secure Sockets Layer</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4 font-mono text-zinc-400 text-xs">
            <h4 className="text-[10px] uppercase text-white/50 tracking-[0.2em] font-bold">Regional Distribution Headquarters</h4>
            <p className="text-white/30 leading-relaxed font-sans">
              Level 22, Menara Petronas 3, KLCC,<br />
              Kuala Lumpur, 50088 Malaysia.
            </p>
            <p className="text-[10px] text-[#C5A059] mt-3 font-mono uppercase tracking-widest">
              In partnership with premium Malaysian distribution networks.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 text-[9px] font-mono uppercase tracking-[0.2em]">
          <span>© 2026 PEMA ATELIER MALAYSIA. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#C5A059] transition">Terms of Allocation</a>
            <span>|</span>
            <a href="#" className="hover:text-[#C5A059] transition">Secure Cryptography Protocol</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
