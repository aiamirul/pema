import React, { useState } from "react";
import { CartItem, PreOrderSubmission } from "../types";
import { metaApi } from "../services/api";
import { ShieldCheck, Mail, Phone, MapPin, User, ChevronRight, CheckCircle, HelpCircle, FileText } from "lucide-react";
import { motion } from "motion/react";

// Standard Malaysian states lists for perfect localization
const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Pulau Pinang",
  "Perak",
  "Perlis",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya"
];

export default function ReservationForm({
  cart,
  onSuccess,
  onCancel,
}: {
  cart: CartItem[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Selangor",
    postalCode: "",
    notes: "",
    paymentMethod: "Bank Instant Transfer (FPX)",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [generatedId, setGeneratedId] = useState("");

  const totalValue = cart.reduce(
    (acc, curr) => acc + curr.variant.discountPrice * curr.quantity,
    0
  );

  const cartUnits = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Full Name is required.";
    if (!formData.email.trim() || !formData.email.includes("@")) return "A valid Email Address is required.";
    if (!formData.phone.trim()) return "Phone number is required.";
    if (!formData.address.trim()) return "Delivery address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.postalCode.trim()) return "Postal Code is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      // Craft unique matching booking ticket
      const orderNum = `PEMA-MY-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Since form accommodates multiple items, we structure the core reservation
      const submission: PreOrderSubmission = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        deliveryAddress: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        quantity: cartUnits,
        totalPrice: totalValue,
        variantId: cart[0]?.variant.id || "gold-obsidian",
        variantName: cart[0]?.variant.name || "Pema Limited Edition",
        size: cart[0]?.size || 42,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      const payload = {
        datakey: orderNum,
        datagroup: "pema_preorders",
        datatype: "USER" as const,
        metadata: {
          status: "confirmed",
          timestamp: new Date().toISOString(),
          submittedData: submission,
        }
      };

      // Perform real Laravel Meta API save, output detailed developers console.logs
      console.log("Submitting preorder to Laravel Meta API...");
      const result = await metaApi.save(payload);

      if (result && result.success) {
        setGeneratedId(orderNum);
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3500);
      } else {
        throw new Error(result.message || "Failed saving reservation records to datagroup.");
      }
    } catch (err: any) {
      console.error("Meta API submission fault: ", err);
      setErrorMsg("Connection error registering reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 px-8 bg-black border border-white/10 rounded-none max-w-xl mx-auto shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C5A059] to-[#96743A] animate-pulse" />
        <div className="w-20 h-20 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-none flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#C5A059] animate-bounce" />
        </div>
        <h3 className="text-2xl font-light font-serif uppercase tracking-wider text-white">
          Reservation Secured
        </h3>
        <p className="text-[#C5A059] font-mono text-sm font-semibold tracking-widest mt-2.5">
          {generatedId}
        </p>
        
        <p className="text-sm text-white/50 mt-4 px-4 leading-relaxed font-sans">
          Assalammualaikum & Greetings! Your reservation is validated on the PEMA Malaysia ledger database.
          A premium advisor will reach out to you via WhatsApp / SMS at <span className="text-white font-mono font-bold">{formData.phone}</span> in 15 minutes to coordinate custom fitting.
        </p>

        <div className="mt-8 pt-6 border-t border-white/5 text-xs text-white/30 font-mono flex items-center justify-center gap-1.5 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
          <span>Secured Private Verification Ticket Ledgered</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/10 rounded-none overflow-hidden backdrop-blur-md shadow-[0_4px_40px_rgba(0,0,0,0.8)] text-white">
      {/* Decorative top title */}
      <div className="p-6 bg-black border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-light uppercase tracking-wider text-white flex items-center gap-2.5 font-serif">
            <FileText className="w-5 h-5 text-[#C5A059]" />
            Apply For Limited Allocation
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Complete your security files. Free insurance & shipping across Malaysia.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-[#C5A059] hover:text-[#D4AF37] uppercase underline tracking-widest cursor-pointer font-bold"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        
        {/* Form fields: 3 cols */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 lg:col-span-3">
          
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-none font-medium uppercase tracking-wider font-mono">
              {errorMsg}
            </div>
          )}

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Ahmad Razak"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. ahmad@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
              Contact Number (WhatsApp enabled) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
              <input
                type="text"
                name="phone"
                placeholder="e.g. +60123456789"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
              Premium Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
              <textarea
                name="address"
                rows={2}
                placeholder="Suite, Street name, Neighborhood..."
                value={formData.address}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                placeholder="Kuala Lumpur"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans cursor-pointer"
              >
                {MALAYSIAN_STATES.map((st) => (
                  <option key={st} value={st} className="bg-black text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                placeholder="50450"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
              Secure VIP Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3.5 bg-[#0a0a0a] border border-white/10 rounded-none cursor-pointer hover:border-[#C5A059]/40 transition text-xs font-mono uppercase tracking-wider">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Instant Transfer (FPX)"
                  checked={formData.paymentMethod === "Bank Instant Transfer (FPX)"}
                  onChange={handleInputChange}
                  className="accent-[#C5A059]"
                />
                FPX Transfer
              </label>
              <label className="flex items-center gap-2 p-3.5 bg-[#0a0a0a] border border-white/10 rounded-none cursor-pointer hover:border-[#C5A059]/40 transition text-xs font-mono uppercase tracking-wider">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit / Debit Premium Cards"
                  checked={formData.paymentMethod === "Credit / Debit Premium Cards"}
                  onChange={handleInputChange}
                  className="accent-[#C5A059]"
                />
                Visa / Master
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1.5">
              Special fitting instructions / requests (Optional)
            </label>
            <textarea
              name="notes"
              rows={2}
              placeholder="E.g. wide-foot fitting advice or specific delivery times."
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full p-3 bg-[#0a0a0a] border border-white/10 rounded-none text-sm text-white focus:outline-none focus:border-[#C5A059]/60 transition font-sans resize-none"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-none shadow-lg shadow-[#C5A059]/15 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {submitting ? "Signing Security Files..." : "Complete Official Reservation"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </form>

        {/* Investment Drawer: 2 cols */}
        <div className="p-6 bg-white/[0.02] lg:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
              Reservation Summary
            </h4>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 justify-between items-start">
                  <div className="min-w-0">
                    <span className="font-light text-sm text-white block truncate font-serif">
                      {item.variant.name}
                    </span>
                    <span className="text-xs text-white/50 font-sans block mt-0.5">
                      Size: <span className="font-mono text-[#C5A059] font-bold">EU {item.size}</span> | Qty: {item.quantity}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-mono text-[#C5A059] font-bold block">
                      RM {(item.variant.discountPrice * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-white/30 line-through">
                      RM {(item.variant.originalPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 mt-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/40">Retail Listing:</span>
              <span className="font-mono text-white/60">
                RM {(cart.reduce((a,c) => a + c.variant.originalPrice * c.quantity, 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs text-emerald-400 font-medium">
              <span>80% Limited Campaign Saved:</span>
              <span className="font-mono">
                - RM {(cart.reduce((a,c) => a + (c.variant.originalPrice - c.variant.discountPrice) * c.quantity, 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="text-white/40">VIP White-glove Courier Service:</span>
              <span className="uppercase tracking-widest text-[8px] font-mono text-[#C5A059] font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded-none border border-[#C5A059]/20">
                COMPLIMENTARY
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                Total Security Fee:
              </span>
              <span className="text-2xl font-light font-mono text-[#C5A059]">
                RM {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3 bg-[#050505] border border-white/5 rounded-none text-[11px] text-white/40 leading-relaxed font-sans">
              <strong className="text-[#C5A059] font-mono block mb-1">🇲🇾 PROUDLY DISTRIBUTED IN MALAYSIA</strong>
              Includes complete PEMA luxury package, individual serialization plaque, premium aluminum dust case, certificate of authenticity. 100% money-back guarantee.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
