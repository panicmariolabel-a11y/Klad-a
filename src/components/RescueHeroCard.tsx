import React, { useState } from 'react';
import { ShieldCheck, Flame, Zap, Check, X, Info, Sparkles, HeartHandshake, AlertTriangle, Layers } from 'lucide-react';
import { Hero, RescueState, AppConfig } from '../types';
import { calculateRescueStake } from '../utils/engine';

interface RescueHeroCardProps {
  rescueState: RescueState;
  heroes: Hero[];
  config: AppConfig;
  onRescueWin: (odd: number, note: string) => void;
  onRescueLoss: (odd: number, note: string) => void;
  onChangeFormula: (formula: 'user_exact' | 'strict_covering') => void;
  onManualTriggerRescue?: (heroId: string) => void;
}

export const RescueHeroCard: React.FC<RescueHeroCardProps> = ({
  rescueState,
  heroes,
  config,
  onRescueWin,
  onRescueLoss,
  onChangeFormula,
}) => {
  const [odd, setOdd] = useState<number>(2.0);
  const [note, setNote] = useState<string>('');
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  const activeHero = heroes.find((h) => h.id === rescueState.activeHeroId);
  const isActive = !!activeHero;

  // Calculate current stake and explanation
  const calculation = calculateRescueStake(rescueState, config);
  const currentStake = calculation.stake;
  const potentialReturn = Math.round(currentStake * odd);

  const percentRecovered = rescueState.targetDebt > 0
    ? Math.min(100, Math.round((rescueState.recoveredAmount / rescueState.targetDebt) * 100))
    : 0;

  const handleWin = () => {
    onRescueWin(odd, note);
    setNote('');
  };

  const handleLoss = () => {
    onRescueLoss(odd, note);
    setNote('');
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 shadow-2xl p-6 mb-8 ${
        isActive
          ? 'bg-gradient-to-br from-red-950/80 via-zinc-950 to-orange-950/70 border-orange-500/70 shadow-orange-500/20 ring-1 ring-orange-400/40'
          : 'bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 border-zinc-800 shadow-black/40'
      }`}
    >
      {/* Background ambient flame glow if active */}
      {isActive && (
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gradient-to-br from-red-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left Side: Avatar & Hero Identification */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-orange-500/60 shadow-xl shadow-orange-950/50">
              <img
                src="/images/hero_phoenix_warden_1790685967299.jpg"
                alt="Feniks Spasitelj"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isActive ? 'scale-105 contrast-125' : 'filter brightness-90 hover:brightness-100'
                }`}
              />
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent pointer-events-none" />
              )}
            </div>

            <div
              className={`absolute -bottom-2 -right-2 p-1.5 rounded-xl border shadow-lg flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-orange-300 animate-bounce'
                  : 'bg-zinc-800 text-amber-400 border-zinc-700'
              }`}
            >
              <Flame className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                FENIKS SPASITELJ
              </h2>
              {isActive ? (
                <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/25 text-red-300 border border-red-500/50 animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  MISIJA U TOKU
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pripravnost (Standby)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-0.5">
              Čuvar Kvote 2.0 • Automatski algoritam za izvlačenje palih heroja
            </p>

            {/* Active Mission Details */}
            {isActive && activeHero && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-300">
                  Spašava se heroj: <strong className="text-orange-400 font-bold">{activeHero.name}</strong> ({activeHero.title})
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-300">
                  Dug heroja: <strong className="text-red-400 font-bold">{rescueState.targetDebt.toLocaleString('sr-RS')} RSD</strong>
                </span>
              </div>
            )}

            {!isActive && (
              <p className="text-xs text-zinc-500 mt-1 max-w-md">
                Sva 3 heroja su u igri. Ukoliko bilo koji heroj promaši 9.000 RSD, Feniks preuzima ulog od 50% i pokreće sistem oporavka.
              </p>
            )}
          </div>
        </div>

        {/* Center / Right: Active Mission Panel or Standby Overview */}
        {isActive ? (
          <div className="flex-1 max-w-xl bg-zinc-950/80 border border-orange-500/40 rounded-2xl p-4 shadow-inner">
            {/* Progress Bar of Debt Recovery */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-400" />
                  Napredak Izvlačenja:
                </span>
                <span className="font-bold text-amber-300">
                  {rescueState.recoveredAmount.toLocaleString('sr-RS')} / {rescueState.targetDebt.toLocaleString('sr-RS')} RSD ({percentRecovered}%)
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, percentRecovered)}%` }}
                />
              </div>
            </div>

            {/* Current Proposal Box */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase font-black tracking-wider text-orange-400">
                    Pokušaj #{rescueState.attemptNumber}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    (Cilj: {calculation.percentageGoal}% duga)
                  </span>
                </div>
                <div className="text-xs text-zinc-300 flex items-center gap-1">
                  <span>Kvota:</span>
                  <span className="font-bold text-amber-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {odd.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 tracking-tight">
                    {currentStake.toLocaleString('sr-RS')}
                  </span>
                  <span className="text-sm font-bold text-zinc-400 ml-1">RSD</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Dobitak na tiketu:</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {potentialReturn.toLocaleString('sr-RS')} RSD
                  </div>
                </div>
              </div>

              {/* Live Explanation Formula */}
              <div className="text-[11px] text-zinc-300/90 leading-tight bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/80 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{calculation.explanation}</span>
              </div>
            </div>

            {/* Note input */}
            <div className="mb-3">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Unesi meč ili tiket za spasavanje (npr. Zvezda 1-1, kvota 2.0)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500/60"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleWin}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Check className="w-5 h-5" />
                <span>SPASILAC POGODIO</span>
              </button>

              <button
                onClick={handleLoss}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-black text-sm shadow-lg shadow-red-950/40 active:scale-[0.98] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>SPASILAC PROMAŠIO</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standby Info & Algorithm preview */
          <div className="flex-1 max-w-md bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Algoritam Izvlačenja
              </span>
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
              >
                {showFormulaDetails ? 'Sakrij formulu' : 'Prikaži detalje'}
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black text-[10px] flex items-center justify-center">
                  1
                </span>
                <span>
                  <strong>1. Pokušaj:</strong> Izvlači 50% duga ({Math.round(config.baseDebtChoice * 0.5).toLocaleString('sr-RS')} RSD).
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 font-black text-[10px] flex items-center justify-center">
                  2
                </span>
                <span>
                  <strong>Na promašaj:</strong> Pokriva ceo ulog spasitelja + 25% uloga spasitelja + 25% duga heroja.
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/60">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[10px] flex items-center justify-center">
                  3
                </span>
                <span>
                  <strong>Na pogodak:</strong> Vraća se na cilj od 50% dok se ne vrati ceo dug. Heroj se oživljava!
                </span>
              </div>
            </div>

            {showFormulaDetails && (
              <div className="mt-3 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                <div className="flex items-center justify-between mb-2">
                  <span>Režim formule spasavanja:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onChangeFormula('user_exact')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        config.rescueFormula === 'user_exact'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Autorska (25%+25%)
                    </button>
                    <button
                      onClick={() => onChangeFormula('strict_covering')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        config.rescueFormula === 'strict_covering'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      Standard (Pokrivanje)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multiple Heroes in Queue Alert */}
      {rescueState.queue.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>
            Heroji na čekanju za izvlačenje:{' '}
            {rescueState.queue
              .map((id) => heroes.find((h) => h.id === id)?.name)
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}
    </div>
  );
};
