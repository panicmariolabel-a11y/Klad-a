import React from 'react';
import { ArrowLeft, RotateCcw, Volume2, VolumeX, BookOpen, User, Flame, Shield, Calculator, ChevronRight } from 'lucide-react';
import { GameMode, UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface ModeNavBarProps {
  activeMode: GameMode;
  profile: UserProfile;
  soundEnabled: boolean;
  onBackToHub: () => void;
  onSwitchMode?: (mode: GameMode) => void;
  onOpenProfiles: () => void;
  onOpenRules: () => void;
  onOpenResetConfirm: () => void;
  onToggleSound: () => void;
}

export const ModeNavBar: React.FC<ModeNavBarProps> = ({
  activeMode,
  profile,
  soundEnabled,
  onBackToHub,
  onSwitchMode,
  onOpenProfiles,
  onOpenRules,
  onOpenResetConfirm,
  onToggleSound,
}) => {
  return (
    <div className="relative z-20 border-b border-white/[0.08] bg-zinc-950/85 backdrop-blur-xl px-4 lg:px-8 py-3 sticky top-0 mb-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Back Button & Mode Tabs */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              sounds.playClick();
              onBackToHub();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-white/[0.08] transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
            title="Povratak na početni ekran"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Meni</span>
          </button>

          <div className="h-5 w-px bg-white/[0.1] shrink-0" />

          {/* Quick Mode Switcher Segmented Tabs */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-900/90 border border-white/[0.08] shrink-0">
            {/* Tab 1: Ludilo 25 */}
            <button
              onClick={() => {
                if (activeMode !== 'ludilo25' && onSwitchMode) {
                  sounds.playClick();
                  onSwitchMode('ludilo25');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'ludilo25'
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${activeMode === 'ludilo25' ? 'fill-zinc-950' : 'text-orange-400'}`} />
              <span>Ludilo 25+</span>
            </button>

            {/* Tab 2: Kvota 2.0 */}
            <button
              onClick={() => {
                if (activeMode !== 'kvota2' && onSwitchMode) {
                  sounds.playClick();
                  onSwitchMode('kvota2');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'kvota2'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${activeMode === 'kvota2' ? 'fill-zinc-950' : 'text-amber-400'}`} />
              <span>Kvota 2.0</span>
            </button>

            {/* Tab 3: Profit Mašina */}
            <button
              onClick={() => {
                if (activeMode !== 'variable' && onSwitchMode) {
                  sounds.playClick();
                  onSwitchMode('variable');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'variable'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-950 shadow-md font-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Mašina</span>
            </button>
          </div>
        </div>

        {/* Right: Active Profile Bankroll Pill, Rules, Sound & Safe Reset */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Active Profile Pill */}
          <button
            onClick={onOpenProfiles}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] hover:border-white/[0.15] text-xs text-zinc-200 transition-all cursor-pointer shadow-sm"
            title="Klikni da promeniš profil ili napraviš novog igrača"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">{profile.name}</span>
            <span className="text-[11px] font-mono text-amber-300 font-semibold num-tabular">
              {profile.bankroll.current.toLocaleString('sr-RS')} RSD
            </span>
          </button>

          {/* Rules & Sound Group */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-900/90 border border-white/[0.08]">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenRules();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Pravila</span>
            </button>

            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                soundEnabled ? 'text-amber-400 hover:bg-white/[0.06]' : 'text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.06]'
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
              onOpenResetConfirm();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 text-xs font-semibold border border-white/[0.08] hover:border-red-800/40 transition-all cursor-pointer"
            title="Resetuj mod ili celokupnu igru uz potvrdu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
