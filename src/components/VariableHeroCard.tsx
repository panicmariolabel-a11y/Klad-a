import React, { useState } from 'react';
import { Check, X, Calculator, RotateCcw, TrendingUp, DollarSign, Info, Sparkles, Trophy } from 'lucide-react';
import { VariableHero } from '../types';
import { calculateVariableStake } from '../utils/engine';

interface VariableHeroCardProps {
  hero: VariableHero;
  onWin: (heroId: string, odd: number, note: string) => void;
  onLoss: (heroId: string, odd: number, note: string) => void;
  onReset: (heroId: string) => void;
  onChangeTargetProfit: (heroId: string, newTarget: number) => void;
}

export const VariableHeroCard: React.FC<VariableHeroCardProps> = ({
  hero,
  onWin,
  onLoss,
  onReset,
  onChangeTargetProfit,
}) => {
  const [odd, setOdd] = useState<number>(hero.currentOdd);
  const [note, setNote] = useState<string>('');
  const [customProfitInput, setCustomProfitInput] = useState<string>('');
  const [isEditingCustomProfit, setIsEditingCustomProfit] = useState<boolean>(false);
  const [isCelebrating, setIsCelebrating] = useState<boolean>(false);
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);

  const calc = calculateVariableStake(hero, odd, hero.targetProfit);
  const currentStake = calc.stake;

  const handleWin = () => {
    setLastWinAmount(hero.targetProfit);
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 2500);

    onWin(hero.id, odd, note);
    setNote('');
  };

  const handleLoss = () => {
    onLoss(hero.id, odd, note);
    setNote('');
  };

  const handleSetCustom = () => {
    const val = parseInt(customProfitInput, 10);
    if (!isNaN(val) && val > 0) {
      onChangeTargetProfit(hero.id, val);
      setIsEditingCustomProfit(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl bg-zinc-950 border transition-all duration-300 p-5 ${
        isCelebrating
          ? 'border-emerald-400 ring-4 ring-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950 scale-[1.01]'
          : 'border-cyan-500/40 hover:border-cyan-500/70 shadow-xl shadow-cyan-950/20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 hover:shadow-2xl'
      }`}
    >
      {/* Floating In-Card Celebration Animation */}
      {isCelebrating && (
        <div className="absolute top-2 right-4 z-20 pointer-events-none animate-float-up flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-zinc-950 font-black text-xs shadow-xl">
          <Trophy className="w-3.5 h-3.5 fill-zinc-950" />
          <span>+{lastWinAmount.toLocaleString('sr-RS')} RSD CILJ ISPUNJEN!</span>
        </div>
      )}

      <div>
        {/* Hero Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-md shrink-0">
              <img
                src={hero.avatar}
                alt={hero.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all ${
                  isCelebrating ? 'ring-4 ring-emerald-400 animate-hero-win' : ''
                }`}
              />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-cyan-600 text-zinc-950 border border-cyan-300 font-bold">
                {isCelebrating ? <Sparkles className="w-3 h-3 text-zinc-950" /> : <Calculator className="w-3 h-3" />}
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
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Cilj: {hero.targetProfit >= 1000 ? `${hero.targetProfit / 1000}k` : hero.targetProfit} RSD
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-medium">{hero.title}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                <span>
                  Neto: <strong className={`num-tabular ${hero.stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hero.stats.netProfit >= 0 ? '+' : ''}{hero.stats.netProfit.toLocaleString('sr-RS')} RSD
                  </strong>
                </span>
                <span>•</span>
                <span>{hero.stats.completedCycles} završenih ciklusa</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onReset(hero.id)}
            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Resetuj ciklus na 0 gubitka"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Target Profit Selector */}
        <div className="mb-4 bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-3">
          <div className="flex items-center justify-between text-xs mb-2 font-semibold text-zinc-300">
            <span>Izaberi željeni čist profit:</span>
            {isEditingCustomProfit ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  placeholder="npr 2500"
                  value={customProfitInput}
                  onChange={(e) => setCustomProfitInput(e.target.value)}
                  className="w-20 bg-zinc-900 border border-cyan-500 rounded px-1.5 py-0.5 text-xs font-bold text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSetCustom}
                  className="px-2 py-0.5 bg-cyan-500 text-zinc-950 font-bold rounded text-xs cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingCustomProfit(true)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                + Prilagodi iznos
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[1000, 5000, 10000].map((amount) => (
              <button
                key={amount}
                onClick={() => onChangeTargetProfit(hero.id, amount)}
                className={`py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  hero.targetProfit === amount
                    ? 'bg-cyan-500 text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-900 border border-white/[0.06] text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                +{amount.toLocaleString('sr-RS')} RSD
              </button>
            ))}
          </div>

          {/* Current cycle loss indicator */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2.5 pt-2 border-t border-white/[0.06]">
            <span>Akumulirani promašaji u nizu:</span>
            <span className="font-bold text-red-400 num-tabular">
              {hero.totalLostInCycle.toLocaleString('sr-RS')} RSD
            </span>
          </div>
        </div>

        {/* Stake Calculation Box */}
        <div className="mb-4 p-4 rounded-2xl bg-zinc-950/90 border border-white/[0.08] shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Izračunati Ulog za sledeći tiket
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300">
              <span>Kvota:</span>
              <input
                type="number"
                step="0.05"
                min="1.10"
                max="50.0"
                value={odd}
                onChange={(e) => setOdd(parseFloat(e.target.value) || 2.0)}
                className="w-16 bg-zinc-900 border border-cyan-500/60 rounded-lg px-2 py-0.5 text-xs font-bold text-white text-center focus:outline-none num-tabular"
              />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight num-tabular">
                {currentStake.toLocaleString('sr-RS')}
              </span>
              <span className="text-xs font-semibold text-zinc-400 ml-1">RSD</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-400">Mogući čist profit:</div>
              <div className="text-sm font-bold text-emerald-400 num-tabular">
                +{calc.potentialNetProfit.toLocaleString('sr-RS')} RSD
              </div>
              <div className="text-[10px] text-zinc-400 num-tabular">
                (Isplata: {calc.potentialGrossReturn.toLocaleString('sr-RS')} RSD)
              </div>
            </div>
          </div>

          {/* Formula description */}
          <div className="mt-2.5 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200">
            {calc.explanation}
          </div>

          {/* Note Input */}
          <div className="mt-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Unesi meč ili opasku za ovaj tiket"
              className="w-full bg-zinc-900/80 border border-white/[0.06] rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/40"
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
          <span>POGODAK (CILJ OSTVAREN)</span>
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
