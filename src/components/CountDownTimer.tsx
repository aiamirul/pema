import { useEffect, useState } from "react";

export default function CountDownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date: June 15, 2026 (RM 25,999 with 80% discount until next month June)
    const targetDate = new Date("2026-06-15T00:00:00+08:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-4 font-mono">
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-none w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center text-[#C5A059] text-lg sm:text-2xl font-bold font-mono shadow-[0_0_15px_rgba(197,160,89,0.05)]">
          <span className="relative z-10">{formatNumber(timeLeft.days)}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none" />
        </div>
        <span className="text-[9px] text-white/40 mt-1.5 uppercase tracking-[0.2em]">DAYS</span>
      </div>
 
      <div className="text-[#C5A059]/40 text-xl font-bold -mt-4">:</div>
 
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-none w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center text-[#C5A059] text-lg sm:text-2xl font-bold font-mono shadow-[0_0_15px_rgba(197,160,89,0.05)]">
          <span className="relative z-10">{formatNumber(timeLeft.hours)}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none" />
        </div>
        <span className="text-[9px] text-white/40 mt-1.5 uppercase tracking-[0.2em]">HOURS</span>
      </div>
 
      <div className="text-[#C5A059]/40 text-xl font-bold -mt-4">:</div>
 
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-none w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center text-[#C5A059] text-lg sm:text-2xl font-bold font-mono shadow-[0_0_15px_rgba(197,160,89,0.05)]">
          <span className="relative z-10">{formatNumber(timeLeft.minutes)}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none" />
        </div>
        <span className="text-[9px] text-white/40 mt-1.5 uppercase tracking-[0.2em]">MINS</span>
      </div>
 
      <div className="text-[#C5A059]/40 text-xl font-bold -mt-4">:</div>
 
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-none w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center text-[#C5A059] text-lg sm:text-2xl font-bold font-mono shadow-[0_0_15px_rgba(197,160,89,0.05)]">
          <span className="relative z-10">{formatNumber(timeLeft.seconds)}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none" />
        </div>
        <span className="text-[9px] text-white/40 mt-1.5 uppercase tracking-[0.2em]">SECS</span>
      </div>
    </div>
  );
}
