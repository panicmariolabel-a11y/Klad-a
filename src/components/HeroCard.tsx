import React, { useState } from 'react';
import { Check, X, ShieldAlert, Zap, Flame, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { Hero } from '../types';

interface HeroCardProps {
  hero: Hero;
  onWin: (heroId: string, odd: number, note: string) => void;
  onLoss: (heroId: string, odd: number, note: string) => void;
  onManualReset?: (heroId: string) => void;
  isBeingRescued?: boolean;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  onWin,
  onLoss,
  onManualReset,
  isBeingRescued,
}) => {
  const [odd, setOdd] = useState<number>(2.0);
  const [note, setNote] = useState<string>('');
  const [isEditingOdd, setIsEditingOdd] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);

  const currentStep = hero.currentStepIndex;
  const currentStake = hero.steps[currentStep];
  const isDown = hero.status === 'down' || hero.status === 'recovering';

  // Calculate cumulative loss in current cycle if at step X
  const cycleSpentSoFar = hero.steps.slice(0, currentStep).reduce((a, b) => a + b, 0);
  const potentialGrossReturn = Math.round(currentStake * odd);
  const potentialNetProfit = potentialGrossReturn - (cycleSpentSoFar + currentStake);

  const handleWin = () => {
    const net = potentialNetProfit > 0 ? potentialNetProfit : potentialGrossReturn - currentStake;
    setLastWinAmount(net);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2500);

    onWin(hero.id, odd, note);
    setNote('');
  };

  const handleLoss = () => {
    onLoss(hero.id, odd, note);
    setNote('');
  };

  // Color mappings
  const themeBorder =
    hero.id === 'hero-1'
      ? 'border-amber-500/40 hover:border-amber-500/70 shadow-amber-500/10'
      : hero.id === 'hero-2'
      ? 'border-purple-500/40 hover:border-purple-500/70 shadow-purple-500/10'
      : 'border-cyan-500/40 hover:border-cyan-500/70 shadow-cyan-500/10';

  const themeAccentBg =
    hero.id === 'hero-1'
      ? 'from-amber-500/15 via-zinc-900 to-zinc-950'
      : hero.id === 'hero-2'
      ? 'from-purple-500/15 via-zinc-900 to-zinc-950'
      : 'from-cyan-500/15 via-zinc-900 to-zinc-950';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl bg-zinc-950 border transition-all duration-300 p-5 ${
        isCelebrating
          ? 'border-emerald-400 ring-4 ring-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950 scale-[1.01]'
          : isDown
          ? 'border-red-600/70 bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950 shadow-red-500/10'
          : `${themeBorder} bg-gradient-to-b ${themeAccentBg} shadow-xl hover:shadow-2xl`
      }`}
    >
      {/* Floating In-Card Celebration Animation */}
      {isCelebrating && (
        <div className="absolute top-2 right-4 z-20 pointer-events-none animate-float-up flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs shadow-xl">
          <Trophy className="w-3.5 h-3.5 fill-zinc-950" />
          <span>+{lastWinAmount.toLocaleString('sr-RS')} RSD POGODAK!</span>
        </div>
      )}

      {/* Top Section: Hero Info & Avatar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={hero.avatar}
                alt={hero.name}
                referrerPolicy="no-referrer"
                className={`w-16 h-16 rounded-2xl object-cover border-2 shadow-md transition-all ${
                  isCelebrating
                    ? 'border-emerald-400 ring-4 ring-emerald-400/60 animate-hero-win'
                    : isDown
                    ? 'border-red-500/80 grayscale contrast-125'
                    : 'border-white/[0.12]'
                }`}
              />
              {/* Element badge */}
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-lg text-[10px] font-black border shadow ${
                  isCelebrating
                    ? 'bg-emerald-400 text-zinc-950 border-emerald-200'
                    : hero.id === 'hero-1'
                    ? 'bg-amber-500 text-zinc-950 border-amber-300'
                    : hero.id === 'hero-2'
                    ? 'bg-purple-600 text-white border-purple-300'
                    : 'bg-cyan-500 text-zinc-950 border-cyan-300'
                }`}
              >
                {isCelebrating ? <Sparkles className="w-3 h-3 text-zinc-950" /> : <Zap className="w-3 h-3" />}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-white tracking-wide">{hero.name}</h3>
                {isCelebrating ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 animate-bounce">
                    <Trophy className="w-3 h-3 fill-zinc-950" />
                    POGODAK!
                  </span>
                ) : isDown ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                    <ShieldAlert className="w-3 h-3" />
                    {isBeingRescued ? 'Izvlači se' : 'Zaustavljen'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Aktivno (K{currentStep + 1})
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-medium">{hero.title}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                <span>
                  Dobitak: <strong className={`num-tabular ${hero.stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hero.stats.netProfit >= 0 ? '+' : ''}{hero.stats.netProfit.toLocaleString('sr-RS')} RSD
                  </strong>
                </span>
                <span>•</span>
                <span>{hero.stats.wins}W / {hero.stats.losses}L</span>
              </div>
            </div>
          </div>

          {/* Quick restart/reset if needed */}
          {onManualReset && (
            <button
              onClick={() => onManualReset(hero.id)}
              className="text-zinc-600 hover:text-zinc-300 p-1.5 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Vrati heroja na 1. korak (100 din)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 5-Step Progression Track */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-medium">
            <span>Niz kvote 2.0 (5 koraka)</span>
            <span className="text-zinc-300 font-semibold">Korak {currentStep + 1} od 5</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {hero.steps.map((stepAmount, idx) => {
              const isPassed = idx < currentStep;
              const isCurrent = idx === currentStep && !isDown;
              const isFailedAtEnd = idx === 4 && isDown;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                    isFailedAtEnd
                      ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
                      : isCurrent
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-400/90 text-amber-200 shadow-md ring-2 ring-amber-400/30 font-bold scale-[1.03]'
                      : isPassed
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500 line-through'
                      : 'bg-zinc-950 border-white/[0.04] text-zinc-600'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold text-zinc-500 block">K{idx + 1}</span>
                  <span className="text-xs font-black num-tabular">{stepAmount >= 1000 ? `${stepAmount / 1000}k` : stepAmount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Bet Panel */}
        {!isDown && (
          <div className="mb-4 p-4 rounded-2xl bg-zinc-950/90 border border-white/[0.08] shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Sledeći Predloženi Ulog
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <span>Kvota:</span>
                {isEditingOdd ? (
                  <input
                    type="number"
                    step="0.05"
                    min="1.05"
                    max="10.0"
                    value={odd}
                    onChange={(e) => setOdd(parseFloat(e.target.value) || 2.0)}
                    onBlur={() => setIsEditingOdd(false)}
                    className="w-14 bg-zinc-950 border border-amber-500/50 rounded px-1.5 py-0.5 text-xs font-bold text-white text-center focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingOdd(true)}
                    className="font-bold text-amber-400 hover:text-amber-300 bg-zinc-900 border border-white/[0.08] rounded-lg px-2 py-0.5 cursor-pointer num-tabular"
                    title="Klikni da promeniš kvotu (podrazumevano 2.0)"
                  >
                    {odd.toFixed(2)}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight num-tabular">
                  {currentStake.toLocaleString('sr-RS')}
                </span>
                <span className="text-xs font-semibold text-zinc-400 ml-1">RSD</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-400">Mogući dobitak:</div>
                <div className="text-sm font-bold text-emerald-400 num-tabular">
                  {potentialGrossReturn.toLocaleString('sr-RS')} RSD{' '}
                  <span className="text-[11px] font-normal text-zinc-400">
                    (+{potentialNetProfit > 0 ? potentialNetProfit.toLocaleString('sr-RS') : 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Optional note input */}
            <div className="mt-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Unesi meč ili opasku (npr. Man City GG)"
                className="w-full bg-zinc-900/80 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/40"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons (Win / Loss) */}
      {!isDown ? (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleWin}
            className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/60 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>POGODIO</span>
          </button>

          <button
            onClick={handleLoss}
            className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 hover:shadow-red-900/60 active:scale-[0.98] transition-all cursor-pointer"
          >
            <X className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>PROMAŠIO</span>
          </button>
        </div>
      ) : (
        <div className="pt-2">
          <div className="w-full py-2.5 px-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] text-center text-xs text-zinc-400 font-semibold flex items-center justify-center gap-2">
            <span>Čeka se završetak misije izvlačenja (Feniks)</span>
          </div>
        </div>
      )}
    </div>
  );
};
