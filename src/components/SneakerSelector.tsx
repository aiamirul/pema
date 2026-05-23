import { useState, useEffect } from "react";
import { ShoeVariant } from "../types";
import { Sparkles, Trophy, ShoppingCart, Percent, Layers, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Importing generated assets
const obsidianSneaker = "https://i.imgur.com/q7HzJW1.jpeg";
const sunriseSneaker = "https://i.imgur.com/jaSh5CT.jpeg";

const VARIANTS: ShoeVariant[] = [
  {
    id: "gold-obsidian",
    name: "PEMA Gold Obsidian Elite",
    description: "Deep obsidian composite construction laced with gold-leaf metallic threads, layered overlays and structural 24k gold-plated polymer midsoles for elite lightweight strength.",
    originalPrice: 25999,
    discountPrice: 5199.80,
    discountPercentage: 80,
    colors: ["#000000", "#C5A059"],
    gradientClass: "from-[#050505] via-[#0c0c0c] to-[#121212]",
    borderAccent: "border-white/10",
    badgeColor: "text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/20",
    images: {
      main: obsidianSneaker,
    },
    tags: ["Gold Plated Midsoles", "Obsidian Woven Mesh", "Ultra Rare"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    stockCount: 4,
  },
  {
    id: "neon-sunrise",
    name: "PEMA Neon Sunrise Limited",
    description: "Aerodynamic sports model mixing sunset gradient weaving, cyber-hues, and electric orange overlays contrasted by polished pure gold structural counters for active style.",
    originalPrice: 25999,
    discountPrice: 5199.80,
    discountPercentage: 80,
    colors: ["#FF4500", "#FF007F", "#00FFFF", "#C5A059"],
    gradientClass: "from-[#050505] via-[#0a0a0a] to-[#1c1614]",
    borderAccent: "border-white/10",
    badgeColor: "text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/20",
    images: {
      main: sunriseSneaker,
    },
    tags: ["Gradient Sunset Fiber", "High-Bounce Soles", "Limited Edition"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    stockCount: 5,
  }
];

export default function SneakerSelector({
  onAddToCart,
}: {
  onAddToCart: (variant: ShoeVariant, size: number, qty: number) => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState<ShoeVariant>(VARIANTS[0]);
  const [selectedSize, setSelectedSize] = useState<number | null>(40);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"features" | "tech" | "sizing">("features");
  const [addingState, setAddingState] = useState(false);

  // Material Hotspots state
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      x: "28%",
      y: "40%",
      title: "Hand-Crafted Mesh",
      desc: "Italian-woven breathable fibers lightweight Kevlar composite core."
    },
    {
      id: 2,
      x: "72%",
      y: "35%",
      title: "24K Gold Plating",
      desc: "Sleek electroplated gold stabilizers providing extreme heel guidance."
    },
    {
      id: 3,
      x: "52%",
      y: "75%",
      title: "Carbon-Plated Core",
      desc: "Full-length aerospace grade carbon fiber plate optimizing energy rebound."
    }
  ];

  const handleVariantChange = (v: ShoeVariant) => {
    setSelectedVariant(v);
    if (!v.sizes.includes(selectedSize || 0)) {
      setSelectedSize(v.sizes[0]);
    }
    console.log("Colorway variant switched:", { id: v.id, name: v.name });
  };

  const handleAddClick = () => {
    if (!selectedSize) return;
    setAddingState(true);
    
    console.log("Adding item to cart - state initialized. Payload:", {
      itemId: selectedVariant.id,
      selectedSize,
      quantity,
      price: selectedVariant.discountPrice
    });

    // Simulate interactive micro-feedback delay
    setTimeout(() => {
      onAddToCart(selectedVariant, selectedSize, quantity);
      setAddingState(false);
      console.log("Item successfully added to UI state drawer collection.");
    }, 850);
  };

  return (
    <div className={`relative bg-gradient-to-br ${selectedVariant.gradientClass} border ${selectedVariant.borderAccent} rounded-none p-6 sm:p-12 backdrop-blur-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-700`}>
      {/* Visual lighting spots */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 relative z-10">
        
        {/* LEFT COLUMN: Visual display & hotspots (Col Span 5) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between py-2">
          <div>
            <div className="flex gap-2.5">
              <span className={`px-3 py-1 text-[9px] font-mono rounded-none font-bold uppercase ${selectedVariant.badgeColor} tracking-widest`}>
                LIMITED RUN: ONLY 50 PAIRS
              </span>
              <span className="px-3 py-1 text-[9px] font-mono rounded-none font-bold uppercase bg-white/5 text-white/50 border border-white/5 tracking-widest">
                MALAYSIA EXCLUSIVE
              </span>
            </div>

            {/* Title display */}
            <h3 className="text-3xl sm:text-4xl font-light mt-5 tracking-[0.05em] text-white font-serif italic">
              {selectedVariant.name.replace("PEMA ", "")}
            </h3>
            
            <p className="text-white/50 text-xs sm:text-[13px] mt-4 leading-relaxed font-sans">
              {selectedVariant.description}
            </p>
          </div>

          {/* Interactive Showcase Box with hotspots */}
          <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-950/60 rounded-none border border-white/5 flex items-center justify-center p-6 mt-8 group">
            
            <div className="absolute inset-0 bg-radial-glowing pointer-events-none opacity-25" />

            <AnimatePresence mode="wait">
              <motion.img
                key={selectedVariant.id}
                src={selectedVariant.images.main}
                alt={selectedVariant.name}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0, scale: 0.82, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[320px] sm:max-w-[420px] object-contain drop-shadow-[0_35px_50px_rgba(0,0,0,0.9)] select-none group-hover:scale-105 transition duration-500"
              />
            </AnimatePresence>

            {/* Interactive Material Hotspots */}
            {hotspots.map((h) => (
              <div
                key={h.id}
                className="absolute"
                style={{ left: h.x, top: h.y }}
              >
                <button
                  onMouseEnter={() => setActiveHotspot(h.id)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                  className="w-7 h-7 rounded-none bg-[#C5A059]/25 border border-[#C5A059] flex items-center justify-center cursor-pointer transition animate-pulse relative hover:scale-110 active:scale-95 text-xs text-[#C5A059] hover:bg-[#C5A059] hover:text-black font-semibold"
                >
                  +
                  {/* Floating tooltip */}
                  <AnimatePresence>
                    {activeHotspot === h.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-9 left-1/2 -translate-x-1/2 w-52 bg-black border border-white/10 p-3.5 rounded-none shadow-2xl text-left z-20 pointer-events-none"
                      >
                        <h5 className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">{h.title}</h5>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-sans">{h.desc}</p>
                        <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-white/10 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ))}
          </div>

          {/* Quick core technology tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {selectedVariant.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono font-medium px-3.5 py-1 rounded-none bg-white/5 text-white/50 border border-white/5"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Selector Controls (Col Span 6) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
          
          {/* Price details with FOMO */}
          <div className="p-6 bg-black/60 border border-white/5 rounded-none">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-white/40 block">
                  Original Private Valuation
                </span>
                <span className="text-md text-white/30 font-mono mt-1 text-zinc-500 line-through">
                  RM 25,999.00
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-[9px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest">
                  80% VIP Campaign
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between border-b border-white/5 pb-5">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-white/50 block mb-1">
                  Private Allocation Price
                </span>
                <span className="text-3xl sm:text-4xl font-light tracking-tight text-[#C5A059] font-mono">
                  RM {selectedVariant.discountPrice.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-widest">
                Flash Save RM 20,799
              </span>
            </div>

            <div className="text-[10px] text-white/30 font-mono mt-4 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping shrink-0" />
              <span>Extremely limited. Campaign prices lock unit allocation instantly.</span>
            </div>
          </div>

          {/* COLOR / VARIANT SELECTOR */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] block">
              Choose Atelier Colorway
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              {VARIANTS.map((v) => {
                const isActive = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v)}
                    className={`p-4 bg-black border flex items-center gap-3.5 cursor-pointer text-left transition group rounded-none ${
                      isActive ? "border-[#C5A059] bg-[#C5A059]/5" : "border-white/10"
                    }`}
                  >
                    <div className="flex -space-x-1.5 justify-center">
                      {v.colors.map((c) => (
                        <span
                          key={c}
                          style={{ backgroundColor: c }}
                          className="w-4.5 h-4.5 rounded-full border border-black shrink-0"
                        />
                      ))}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white group-hover:text-[#C5A059] transition uppercase tracking-wider">
                        {v.name.replace("PEMA ", "").replace(" Elite", "").replace(" Limited", "")}
                      </span>
                      <span className="block text-[9px] text-white/30 font-mono uppercase tracking-widest">
                        {v.id === "gold-obsidian" ? "Gold Plated" : "Cyber Sunset"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIZING SELECTION */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              <span>Select Fitting size (EU)</span>
              <span className="text-[9px] text-white/30 normal-case">Adult Unisex Sizing</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-9 gap-2">
              {selectedVariant.sizes.map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 rounded-none text-xs font-mono font-bold cursor-pointer transition flex items-center justify-center border ${
                      isSelected
                        ? "bg-[#C5A059]/15 border-[#C5A059] text-white"
                        : "bg-[#050505] text-white border-white/10 hover:border-[#C5A059]"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-white/30 leading-normal font-serif italic mt-1.5">
              * Fits perfectly true to size. If you fit in between EU numbers, we recommend selecting the next size up for optimal sport breathing space.
            </p>
          </div>

          {/* QUANTITY & ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="bg-black border border-white/10 rounded-none p-1.5 flex items-center justify-between col-span-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-none hover:bg-white/5 text-white/50 hover:text-white font-mono font-medium text-lg cursor-pointer transition flex items-center justify-center"
              >
                -
              </button>
              <span className="font-mono text-white text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-none hover:bg-white/5 text-white/50 hover:text-white font-mono font-medium text-lg cursor-pointer transition flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddClick}
              disabled={addingState}
              className="sm:col-span-2 relative overflow-hidden flex items-center justify-center gap-3 py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs tracking-[0.25em] uppercase rounded-none transition duration-300 transform active:scale-98 cursor-pointer"
            >
              {addingState ? "Locking Suite Allocator..." : "Add to Collection"}
              {/* Premium Button Shine */}
              <span className="absolute top-0 -inset-full h-full w-1/2 block bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shine" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-[9px] font-mono uppercase tracking-[0.15em] text-white/30 border-t border-white/5 pt-5">
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#C5A059]" /> Custom Series Certificate
            </span>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Private Luxury Insured Courier
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
