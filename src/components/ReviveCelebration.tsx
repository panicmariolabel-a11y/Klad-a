import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight } from 'lucide-react';
import { Hero } from '../types';

interface ReviveCelebrationProps {
  hero: Hero | null;
  onClose: () => void;
}

export const ReviveCelebration: React.FC<ReviveCelebrationProps> = ({ hero, onClose }) => {
  if (!hero) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 border-2 border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 sm:p-8 text-center text-white">
        <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl mb-4 relative">
          <img
            src={hero.avatar}
            alt={hero.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent pointer-events-none" />
          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-emerald-500 text-zinc-950 shadow">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HEROJ JE OSLOBOĐEN I OŽIVLJEN!</span>
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-1">
          {hero.name} je ponovo u borbi!
        </h3>
        <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
          Heroj za Izvlačenje (Feniks) je uspešno povratio celokupan dug (13.000 RSD). {hero.name} se vraća na početni korak (100 RSD).
        </p>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95"
        >
          <span>Nastavi igru</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
