import React from 'react';
import { GameMode } from '../types';
import { Flame, Shield, Calculator, Sparkles } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Izaberite Režim Igre (Strategiju):
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Mode 1: LUDILO 7+ & PRELAZI (KVOTA 25+) */}
        <button
          onClick={() => onSelectMode('ludilo25')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
            currentMode === 'ludilo25'
              ? 'bg-gradient-to-br from-red-950/80 via-zinc-950 to-orange-950/80 border-orange-500/80 shadow-[0_0_25px_rgba(249,115,22,0.25)] ring-1 ring-orange-400/50'
              : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className={`p-2.5 rounded-xl ${
                currentMode === 'ludilo25'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            {currentMode === 'ludilo25' && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40">
                Aktivno
              </span>
            )}
          </div>
          <h3 className="text-base font-black text-white">LUDILO 7+ & PRELAZI</h3>
          <p className="text-xs text-orange-400 font-bold mt-0.5">Kvote 25+ • 75 Pokušaja</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
            3 heroja: 7+, 2u1 i 1u2. Niz od 20x 100 RSD pa progresivni ulog koji vraća sve uloženo + profit!
          </p>
        </button>

        {/* Mode 2: KVOTA 2.0 (Tri Heroja + Spasitelj) */}
        <button
          onClick={() => onSelectMode('kvota2')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
            currentMode === 'kvota2'
              ? 'bg-gradient-to-br from-amber-950/80 via-zinc-950 to-yellow-950/80 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
              : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className={`p-2.5 rounded-xl ${
                currentMode === 'kvota2'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-zinc-950 shadow-lg'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Shield className="w-5 h-5" />
            </div>
            {currentMode === 'kvota2' && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                Aktivno
              </span>
            )}
          </div>
          <h3 className="text-base font-black text-white">KVOTA 2.0 SISTEM</h3>
          <p className="text-xs text-amber-400 font-bold mt-0.5">3 Heroja + Feniks Spasitelj</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
            Nizovi 100 - 300 - 1.000 - 3.000 - 9.000 RSD. Na 5. promašaj pokreće se Feniks za izvlačenje (50% i 25%).
          </p>
        </button>

        {/* Mode 3: VARIJABILNI ULOZI & CILJANI PROFIT */}
        <button
          onClick={() => onSelectMode('variable')}
          className={`relative text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
            currentMode === 'variable'
              ? 'bg-gradient-to-br from-cyan-950/80 via-zinc-950 to-blue-950/80 border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
              : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div
              className={`p-2.5 rounded-xl ${
                currentMode === 'variable'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 shadow-lg'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Calculator className="w-5 h-5" />
            </div>
            {currentMode === 'variable' && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                Aktivno
              </span>
            )}
          </div>
          <h3 className="text-base font-black text-white">VARIJABILNI PROFIT</h3>
          <p className="text-xs text-cyan-400 font-bold mt-0.5">Cilj: 1.000 • 5.000 • 10.000 RSD</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
            Unesite kvotu, a računar sabira sve prethodne uloge i tačno računa potreban ulog za garantovan profit!
          </p>
        </button>
      </div>
    </div>
  );
};
