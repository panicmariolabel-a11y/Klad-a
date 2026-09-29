import React, { useState } from 'react';
import { Check, X, Flame, RotateCcw, Target, TrendingUp, Info, Sparkles, Trophy } from 'lucide-react';
import { LudiloHero } from '../types';
import { calculateLudiloStake } from '../utils/engine';

interface LudiloCardProps {
  hero: LudiloHero;
  onWin: (heroId: string, odd: number, note: string) => void;
  onLoss: (heroId: string, odd: number, note: string) => void;
  onReset: (heroId: string) => void;
}

export const LudiloCard: React.FC<LudiloCardProps> = ({ hero, onWin, onLoss, onReset }) => {
  const [odd, setOdd] = useState<number>(hero.currentOdd);
  const [note, setNote] = useState<string>('');
  const [isEditingOdd, setIsEditingOdd] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [lastWinAmount, setLastWinAmount] = useState(0);

  const calc = calculateLudiloStake(hero, odd);
  const currentStake = calc.stake;
  const potentialGrossReturn = Math.round(currentStake * odd);
  const potentialNetProfit = calc.potentialNetProfit;

  const handleWin = () => {
    setLastWinAmount(potentialNetProfit);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2500);

    onWin(hero.id, odd, note);
    setNote('');
  };

  const handleLoss = () => {
    onLoss(hero.id, odd, note);
    setNote('');
  };

  const progressPercent = Math.min(100, Math.round((hero.currentAttempt / hero.maxAttempts) * 100));

  // Badge styling per specialty
  const specialtyBadge =
    hero.specialty === '7+'
      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      : hero.specialty === '2u1'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl bg-zinc-950 border transition-all duration-300 p-5 ${
        isCelebrating
          ? 'border-emerald-400 ring-4 ring-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950 scale-[1.01]'
          : 'border-orange-500/40 hover:border-orange-500/70 shadow-xl shadow-orange-950/20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 hover:shadow-2xl'
      }`}
    >
      {/* Floating In-Card Celebration Animation */}
      {isCelebrating && (
        <div className="absolute top-2 right-4 z-20 pointer-events-none animate-float-up flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs shadow-xl">
          <Trophy className="w-3.5 h-3.5 fill-zinc-950" />
          <span>+{lastWinAmount.toLocaleString('sr-RS')} RSD BOMBA!</span>
        </div>
      )}

      <div>
        {/* Hero Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-md shrink-0">
              <img
                src={hero.avatar}
                alt={hero.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all ${
                  isCelebrating ? 'ring-4 ring-emerald-400 animate-hero-win' : ''
                }`}
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-orange-600 text-white border border-orange-400">
                {isCelebrating ? <Sparkles className="w-3 h-3 text-amber-300" /> : <Flame className="w-3 h-3" />}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-black text-white">{hero.name}</h3>
                {isCelebrating ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 animate-bounce">
                    <Trophy className="w-3 h-3 fill-zinc-950" />
                    POGODAK!
                  </span>
                ) : (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${specialtyBadge}`}>
                    {hero.specialty === '7+' ? 'Igra 7+' : hero.specialty === '2u1' ? 'Prelaz 2 u 1' : 'Prelaz 1 u 2'}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-medium">{hero.title}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                <span>
                  Ukupno: <strong className={`num-tabular ${hero.stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hero.stats.netProfit >= 0 ? '+' : ''}{hero.stats.netProfit.toLocaleString('sr-RS')} RSD
                  </strong>
                </span>
                <span>•</span>
                <span>{hero.stats.wins}W / {hero.stats.losses}L</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onReset(hero.id)}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Resetuj na pokušaj 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 75 Attempts Progress Bar */}
        <div className="mb-4 bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-orange-400" />
              Pokušaj {hero.currentAttempt} od {hero.maxAttempts}
            </span>
            <span className="text-orange-400 font-bold">
              {calc.isFirstPhase ? 'Faza 1 (100 RSD)' : 'Faza 2 (Progresija)'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1.5">
            <span>Uloženo u ovom nizu: <strong className="text-zinc-200 num-tabular">{hero.totalLostInCycle.toLocaleString('sr-RS')} RSD</strong></span>
            <span>Preostalo: {hero.maxAttempts - hero.currentAttempt + 1} pokušaja</span>
          </div>
        </div>

        {/* Next Stake & Odds Box */}
        <div className="mb-4 p-4 rounded-2xl bg-zinc-950/90 border border-white/[0.08] shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Predloženi Ulog za sledeći tiket
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span>Kvota:</span>
              {isEditingOdd ? (
                <input
                  type="number"
                  step="0.5"
                  min="2.0"
                  max="100.0"
                  value={odd}
                  onChange={(e) => setOdd(parseFloat(e.target.value) || 25.0)}
                  onBlur={() => setIsEditingOdd(false)}
                  className="w-16 bg-zinc-950 border border-orange-500/60 rounded px-1.5 py-0.5 text-xs font-bold text-white text-center focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingOdd(true)}
                  className="font-bold text-orange-400 hover:text-orange-300 bg-zinc-900 border border-white/[0.08] rounded-lg px-2 py-0.5 cursor-pointer num-tabular"
                  title="Klikni da promeniš kvotu tiketa"
                >
                  {odd.toFixed(2)}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-orange-400 tracking-tight num-tabular">
                {currentStake.toLocaleString('sr-RS')}
              </span>
              <span className="text-xs font-semibold text-zinc-400 ml-1">RSD</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-400">Mogući čist dobitak:</div>
              <div className="text-sm font-bold text-emerald-400 num-tabular">
                +{potentialNetProfit.toLocaleString('sr-RS')} RSD
              </div>
              <div className="text-[10px] text-zinc-400 num-tabular">
                (Isplata: {potentialGrossReturn.toLocaleString('sr-RS')} RSD)
              </div>
            </div>
          </div>

          {/* Explanation note */}
          <div className="mt-2.5 p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[11px] text-orange-200">
            {calc.explanation}
          </div>

          {/* Note Input */}
          <div className="mt-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Unesi meč (npr. Ajax - Feyenoord 7+)"
              className="w-full bg-zinc-900/80 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/40"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <button
          onClick={handleWin}
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/60 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Check className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>POGODAK (BOMBA!)</span>
        </button>

        <button
          onClick={handleLoss}
          className="group flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 hover:shadow-red-900/60 active:scale-[0.98] transition-all cursor-pointer"
        >
          <X className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span>PROMAŠIO</span>
        </button>
      </div>
    </div>
  );
};
