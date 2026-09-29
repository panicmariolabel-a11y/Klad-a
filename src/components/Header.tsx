import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Sparkles, ShieldAlert, Flame, Coins, Calculator, Share2 } from 'lucide-react';
import { sounds } from '../utils/audio';
import { GameMode } from '../types';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onOpenSim: () => void;
  onResetAll: () => void;
  onOpenShare?: () => void;
  activeRescueCount: number;
  activeMode: GameMode;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onOpenSim,
  onResetAll,
  onOpenShare,
  activeRescueCount,
  activeMode,
}) => {
  return (
    <header className="relative z-20 border-b border-white/[0.08] bg-zinc-950/85 backdrop-blur-xl px-4 lg:px-8 py-3.5 sticky top-0 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5">
        {/* Brand / Logo & Status */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="relative shrink-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ring-1 ${
                activeMode === 'ludilo25'
                  ? 'bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 ring-orange-500/40 shadow-orange-500/20'
                  : activeMode === 'variable'
                  ? 'bg-gradient-to-tr from-cyan-600 via-blue-500 to-indigo-500 ring-cyan-500/40 shadow-cyan-500/20'
                  : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 ring-amber-500/40 shadow-amber-500/20'
              }`}
            >
              {activeMode === 'ludilo25' ? (
                <Flame className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              ) : activeMode === 'variable' ? (
                <Calculator className="w-5 h-5 text-zinc-950" />
              ) : (
                <Coins className="w-5 h-5 text-zinc-950 fill-zinc-950" />
              )}
            </div>
            {activeRescueCount > 0 && activeMode === 'kvota2' && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border border-zinc-950 text-[9px] font-black text-white items-center justify-center">
                  !
                </span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5 truncate">
                {activeMode === 'ludilo25' ? (
                  <>
                    <span>LUDILO 25+</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      TRI HEROJA
                    </span>
                  </>
                ) : activeMode === 'variable' ? (
                  <>
                    <span>PROFIT MAŠINA</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                      VARIJABILNI
                    </span>
                  </>
                ) : (
                  <>
                    <span>KVOTA 2.0</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                      TRI HEROJA
                    </span>
                  </>
                )}
              </h1>

              {/* Status Indicator */}
              <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wider uppercase">Sistem Aktivan</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 truncate">
              {activeMode === 'ludilo25'
                ? 'Igra 7+ & Prelazi 2-1 / 1-2 · 75 Pokušaja (20x 100 RSD + Progresija)'
                : activeMode === 'variable'
                ? 'Ciljani profit 1.000 / 5.000 / 10.000 RSD · Automatska formula uloga'
                : 'Nezavisni nizovi: 100 · 300 · 1.000 · 3.000 · 9.000 RSD + Heroj za Izvlačenje'}
            </p>
          </div>
        </div>

        {/* Action Controls - Master Command Cluster (Cleaned: No Install, No Download) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Share Button */}
          {onOpenShare && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenShare();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-white/[0.08] hover:border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Pošalji link aplikacije prijateljima na Viber ili WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Pošalji</span>
            </button>
          )}

          {/* Rescue alert pill if active in kvota2 */}
          {activeRescueCount > 0 && activeMode === 'kvota2' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>SPASAVANJE ({activeRescueCount})</span>
            </div>
          )}

          {/* Rules & Tools Group */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenRules();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-all cursor-pointer"
              title="Uputstvo i pravila sistema"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Pravila</span>
            </button>

            {activeMode === 'kvota2' && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenSim();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-all cursor-pointer"
                title="Testiraj i simuliraj scenarije"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simulator</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                soundEnabled
                  ? 'text-amber-400 hover:bg-white/[0.06]'
                  : 'text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.06]'
              }`}
              title={soundEnabled ? 'Isključi zvuk' : 'Uključi zvuk'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Safe Reset Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onResetAll();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 text-xs font-semibold border border-white/[0.08] hover:border-red-800/40 transition-all cursor-pointer"
            title="Resetuj celokupno stanje"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
