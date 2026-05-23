import { useState } from "react";
import { CartItem } from "../types";
import { ShoppingBag, X, CheckSquare, Trash2, Shield, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar({
  cart,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
}: {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalValue = cart.reduce(
    (acc, curr) => acc + curr.variant.discountPrice * curr.quantity,
    0
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-24 flex items-center justify-between">
          
          {/* Custom SVG logo: Abstract Premium PEMA Symbol */}
          <a href="#" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-[#C5A059] to-[#96743A] rounded-xl p-0.5 shadow-[0_0_20px_rgba(197,160,89,0.2)] group-hover:scale-105 transition duration-300">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#050505] stroke-[#050505] fill-none stroke-[8]"
              >
                {/* Custom interlocking luxury P-M geometric lines */}
                <path
                  d="M 25,75 L 25,25 C 25,25 45,15 55,25 C 65,35 55,55 25,55 Q 65,55 75,75 M 50,55 L 75,25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Gold light ring glowing */}
              <span className="absolute -inset-0.5 rounded-xl border border-[#C5A059]/40 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-2xl font-light tracking-[0.35em] text-white font-serif uppercase">
                PEMA
              </span>
              <span className="text-[8px] uppercase tracking-[0.5em] text-[#C5A059] font-mono font-bold leading-none mt-1">
                KUALA LUMPUR
              </span>
            </div>
          </a>

          {/* Center Brand Note (Slogan) */}
          <div className="hidden md:flex items-center gap-2.5 text-white/40 font-mono text-[9px] tracking-[0.3em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span>Limited Run: 50 Numbered Pairs</span>
          </div>

          {/* Cart Trigger Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/10 text-white cursor-pointer transition group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-[#C5A059] transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#C5A059]/20">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Shopping Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />

            {/* Slider container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#050505] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-sm font-bold tracking-[0.1em] text-white uppercase text-[#C5A059]">
                    YOUR RESERVATION SELECTIONS
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="w-16 h-16 bg-zinc-900/20 rounded-full flex items-center justify-center mb-4 text-zinc-600 border border-dashed border-white/10">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-zinc-400 font-medium">Your suite is empty</p>
                    <p className="text-zinc-600 text-xs mt-1 px-8 font-serif italic">
                      Select your sized pair below to begin the elite craft reservation process.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-4 bg-zinc-950/80 border border-white/10 rounded-xl flex gap-4 hover:border-[#C5A059]/40 transition relative group"
                      >
                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-white/5 shrink-0">
                          <img
                            src={item.variant.images.main}
                            alt={item.variant.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-contain group-hover:scale-110 transition duration-300"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate font-serif">
                            {item.variant.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="text-white/40">Size:</span>
                            <span className="font-mono text-[#C5A059] font-bold bg-[#050505] px-1.5 py-0.5 rounded text-[10px] border border-white/5">
                              EU {item.size}
                            </span>
                            <span className="text-zinc-800">|</span>
                            <span className="text-white/40">Qty:</span>
                            <span className="text-white font-mono font-semibold">
                              {item.quantity}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-xs text-[#C5A059] font-mono font-bold">
                              RM {item.variant.discountPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-zinc-600 line-through font-mono">
                              RM {item.variant.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Remove Action Button */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="absolute right-3 top-3 p-1 hover:bg-red-500/10 rounded text-zinc-600 hover:text-red-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Bottom Checkout summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/60 relative">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono uppercase text-white/40 tracking-widest">
                      Total Value:
                    </span>
                    <span className="text-xl font-light font-mono text-[#C5A059] text-right">
                      RM {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <p className="text-[10px] text-white/40 leading-relaxed mb-4 flex items-start gap-1.5 font-serif italic">
                    <Shield className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>Complimentary white-glove delivery included in Malaysia. Campaign benefits applied.</span>
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenCheckout();
                      }}
                      className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#C5A059] hover:bg-[#D4AF37] active:scale-98 text-black font-bold text-sm tracking-widest uppercase rounded-none shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.25)] transition duration-300 cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Proceed to Private Reservation
                    </button>
                    
                    <button
                      onClick={onClearCart}
                      className="w-full py-2 text-center text-xs text-white/30 hover:text-white transition cursor-pointer"
                    >
                      Reset Suite Selections
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
