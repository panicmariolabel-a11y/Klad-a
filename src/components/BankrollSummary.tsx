import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Award, Wallet, Edit3, Check, Layers, Zap } from 'lucide-react';
import { GameMode } from '../types';

interface BankrollSummaryProps {
  totalTickets: number;
  totalStaked: number;
  totalWon: number;
  netProfit: number;
  totalWins: number;
  totalLosses: number;
  activeMode: GameMode;
  bankroll: {
    initial: number;
    current: number;
  };
  onUpdateInitialBankroll: (amount: number) => void;
}

export const BankrollSummary: React.FC<BankrollSummaryProps> = ({
  totalTickets,
  totalStaked,
  totalWon,
  netProfit,
  totalWins,
  totalLosses,
  activeMode,
  bankroll,
  onUpdateInitialBankroll,
}) => {
  const [isEditingBankroll, setIsEditingBankroll] = useState(false);
  const [tempBankroll, setTempBankroll] = useState(bankroll.initial.toString());

  const winRate = totalTickets > 0 ? Math.round((totalWins / totalTickets) * 100) : 0;
  const currentBankroll = bankroll.initial + netProfit;
  const roi = totalStaked > 0 ? (((totalWon - totalStaked) / totalStaked) * 100).toFixed(1) : '0.0';

  const handleSaveBankroll = () => {
    const val = parseInt(tempBankroll, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateInitialBankroll(val);
    }
    setIsEditingBankroll(false);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {/* 1. Neto Profit */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-white/[0.08] p-4 shadow-sm hover:border-white/[0.15] transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Čist Profit</span>
          <div
            className={`p-1.5 rounded-lg border ${
              netProfit >= 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {netProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          </div>
        </div>
        <div className={`text-xl sm:text-2xl font-black num-tabular ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {netProfit >= 0 ? '+' : ''}
          {netProfit.toLocaleString('sr-RS')}{' '}
          <span className="text-xs font-semibold text-zinc-500">RSD</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zinc-400">
          <span className={`w-1.5 h-1.5 rounded-full ${netProfit >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span>{netProfit >= 0 ? 'Sistem u plusu' : 'Privremeni minus'}</span>
        </div>
      </div>

      {/* 2. Trenutni Bankroll */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-white/[0.08] p-4 shadow-sm hover:border-white/[0.15] transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Trenutni Bankroll</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                if (isEditingBankroll) handleSaveBankroll();
                else setIsEditingBankroll(true);
              }}
              className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-colors"
              title="Promeni početni budžet"
            >
              {isEditingBankroll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
            </button>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {isEditingBankroll ? (
          <div className="flex items-center gap-1.5 my-1">
            <input
              type="number"
              value={tempBankroll}
              onChange={(e) => setTempBankroll(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveBankroll()}
              className="w-full bg-zinc-950 border border-amber-500/60 rounded-lg px-2 py-1 text-sm font-bold text-white focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveBankroll}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="text-xl sm:text-2xl font-black text-white num-tabular">
            {currentBankroll.toLocaleString('sr-RS')}{' '}
            <span className="text-xs font-semibold text-zinc-500">RSD</span>
          </div>
        )}
        <p className="text-[11px] text-zinc-400 mt-1">
          Početni: <span className="font-semibold text-zinc-300 num-tabular">{bankroll.initial.toLocaleString('sr-RS')} RSD</span>
        </p>
      </div>

      {/* 3. Ukupno Uloženo / Osvojeno */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-white/[0.08] p-4 shadow-sm hover:border-white/[0.15] transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Promet (Ulog / Dobitak)</span>
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-base sm:text-lg font-black text-zinc-200 num-tabular">
          {totalStaked.toLocaleString('sr-RS')}{' '}
          <span className="text-xs text-zinc-500 font-normal">/ {totalWon.toLocaleString('sr-RS')}</span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          ROI: <span className={`font-bold num-tabular ${Number(roi) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{Number(roi) >= 0 ? '+' : ''}{roi}%</span>
        </p>
      </div>

      {/* 4. Uspešnost (Win Rate) */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-white/[0.08] p-4 shadow-sm hover:border-white/[0.15] transition-all">
        <div className="flex items-center justify-between text-zinc-400 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Uspešnost (Win Rate)</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Target className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-amber-300 num-tabular">
          {winRate}%
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          {totalWins} Dobitnih · {totalLosses} Pao
        </p>
      </div>

      {/* 5. Ukupno Tiketa */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-white/[0.08] p-4 shadow-sm hover:border-white/[0.15] transition-all col-span-2 md:col-span-1">
        <div className="flex items-center justify-between text-zinc-400 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ukupno Odigrano</span>
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-white num-tabular">
          {totalTickets} <span className="text-xs font-semibold text-zinc-500">tiketa</span>
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          {activeMode === 'ludilo25' ? 'Ludilo 25+' : activeMode === 'variable' ? 'Profit Mašina' : 'Kvota 2.0'}
        </p>
      </div>
    </div>
  );
};
