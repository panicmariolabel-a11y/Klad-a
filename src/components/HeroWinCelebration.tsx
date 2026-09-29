import React, { useEffect } from 'react';
import { Sparkles, Trophy, CheckCircle, ArrowRight, Zap, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface WinCelebrationData {
  heroName: string;
  heroAvatar: string;
  heroTitle?: string;
  modeName: string;
  stake: number;
  odd: number;
  grossReturn: number;
  netProfit: number;
}

interface HeroWinCelebrationProps {
  data: WinCelebrationData | null;
  onClose: () => void;
}

export const HeroWinCelebration: React.FC<HeroWinCelebrationProps> = ({ data, onClose }) => {
  useEffect(() => {
    if (!data) return;

    // Fire celebratory confetti cannons
    try {
      // First burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#10b981', '#f59e0b', '#fbbf24', '#34d399', '#ffffff'],
      });

      // Second burst slightly delayed
      const t1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#ec4899'],
        });
      }, 250);

      // Auto dismiss after 3 seconds
      const autoDismiss = setTimeout(() => {
        onClose();
      }, 3000);

      return () => {
        clearTimeout(t1);
        clearTimeout(autoDismiss);
      };
    } catch {
      // ignore
    }
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-zinc-950 border-2 border-emerald-500/80 shadow-[0_0_80px_rgba(16,185,129,0.35)] p-6 sm:p-8 text-center text-white overflow-hidden glass-panel-elevated animate-pulse-glow"
      >
        {/* Animated Radial Background Sunburst Rays */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500 via-amber-500 to-teal-400 blur-3xl animate-win-rays" />
        </div>

        {/* Hero Avatar with Animated Victory Ring */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl mb-4 animate-hero-win ring-4 ring-emerald-500/40">
          <img
            src={data.heroAvatar}
            alt={data.heroName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-zinc-950 shadow-lg">
            <Trophy className="w-5 h-5 fill-zinc-950" />
          </div>
        </div>

        {/* Victory Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>POGODAK! TIKET JE PROŠAO</span>
        </div>

        {/* Hero Name & Mode */}
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          {data.heroName} SLAVI!
        </h3>
        <p className="text-xs text-zinc-400 mb-4 font-medium">
          {data.heroTitle || data.modeName}
        </p>

        {/* Profit Display Banner */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/40 mb-5 shadow-inner">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
            Čist Profit sa ovog tiketa:
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 num-tabular tracking-tight">
            +{data.netProfit.toLocaleString('sr-RS')}{' '}
            <span className="text-xs font-bold text-zinc-400">RSD</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.08] text-[11px]">
            <div>
              <span className="text-zinc-500 block">Ulog</span>
              <span className="font-bold text-white num-tabular">{data.stake.toLocaleString('sr-RS')} RSD</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Kvota</span>
              <span className="font-bold text-amber-400 num-tabular">{data.odd.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Isplata</span>
              <span className="font-bold text-emerald-300 num-tabular">{data.grossReturn.toLocaleString('sr-RS')} RSD</span>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95"
        >
          <span>NASTAVI DALJE</span>
          <ArrowRight className="w-4 h-4 text-zinc-950" />
        </button>

        <p className="text-[10px] text-zinc-500 mt-2.5">
          Heroj je vraćen na početni nivo profita. Klikni bilo gde za nastavak.
        </p>
      </div>
    </div>
  );
};
