import React from 'react';
import { UserProfile, GameMode } from '../types';
import { Flame, Shield, Calculator, User, ArrowRight, Wallet, TrendingUp, Sparkles, ChevronRight, Award, History, Share2, Zap, CheckCircle2, Lock, Key } from 'lucide-react';

interface HomeHubProps {
  profile: UserProfile;
  onEnterMode: (mode: GameMode) => void;
  onOpenProfiles: () => void;
  onOpenRules: () => void;
  onOpenReset: () => void;
  onOpenShare?: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  profile,
  onEnterMode,
  onOpenProfiles,
  onOpenRules,
  onOpenReset,
  onOpenShare,
}) => {
  const totalStaked = profile.logs.reduce((acc, l) => acc + l.stake, 0);
  const totalWon = profile.logs.reduce((acc, l) => acc + (l.result === 'win' ? l.potentialReturn : 0), 0);
  const netProfit = totalWon - totalStaked;
  const totalTickets = profile.logs.length;
  const totalWins = profile.logs.filter((l) => l.result === 'win').length;
  const winRate = totalTickets > 0 ? Math.round((totalWins / totalTickets) * 100) : 0;

  // Active rescue check in kvota2
  const isRescueActive = profile.rescueState.activeHeroId !== null;

  // VIP Rank calculation
  const getRank = () => {
    if (netProfit >= 25000) return { title: 'DIJAMANTSKI TIPSTER', color: 'from-cyan-400 to-blue-500', icon: '💎' };
    if (netProfit >= 10000) return { title: 'ZLATNI MASTER', color: 'from-amber-400 to-yellow-500', icon: '👑' };
    if (netProfit > 0) return { title: 'PRO STRATEG', color: 'from-emerald-400 to-green-500', icon: '⚡' };
    return { title: 'AKTIVAN IGRAČ', color: 'from-zinc-400 to-zinc-500', icon: '🎯' };
  };

  const rank = getRank();

  return (
    <div className="space-y-8">
      {/* Player Profile VIP Dashboard Header */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900/90 border border-white/[0.08] p-5 sm:p-7 shadow-2xl glass-panel-elevated">
        {/* Subtle ambient background glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Player Avatar, Name & VIP Rank */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-zinc-950 font-black text-2xl shadow-xl shadow-amber-500/20 ring-2 ring-white/20">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1">
                  <span>{rank.icon}</span>
                  <span>{rank.title}</span>
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-[11px] text-zinc-400">
                  {totalTickets} {totalTickets === 1 ? 'tiket' : 'tiketa'}
                </span>
                <span className="text-zinc-600">·</span>
                {profile.password ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Zaštićeno Šifrom</span>
                  </span>
                ) : (
                  <button
                    onClick={onOpenProfiles}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 cursor-pointer transition-colors"
                    title="Kliknite da postavite šifru za čuvanje podataka"
                  >
                    <Key className="w-3 h-3 text-amber-400" />
                    <span>Postavi Šifru</span>
                  </button>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{profile.name}</h1>

              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <span>Početni budžet:</span>
                <span className="font-semibold text-zinc-200 num-tabular">
                  {profile.bankroll.initial.toLocaleString('sr-RS')} RSD
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Live Financial KPIs */}
          <div className="flex items-center flex-wrap gap-3">
            {/* KPI 1: Trenutni Bankroll */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] flex items-center gap-3.5 min-w-[170px]">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                  Trenutni Bankroll
                </span>
                <span className="text-base sm:text-lg font-black text-white num-tabular">
                  {profile.bankroll.current.toLocaleString('sr-RS')}{' '}
                  <span className="text-xs font-semibold text-zinc-500">RSD</span>
                </span>
              </div>
            </div>

            {/* KPI 2: Čist Profit */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] flex items-center gap-3.5 min-w-[170px]">
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  netProfit >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                  Čist Profit
                </span>
                <span
                  className={`text-base sm:text-lg font-black num-tabular ${
                    netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {netProfit >= 0 ? '+' : ''}
                  {netProfit.toLocaleString('sr-RS')}{' '}
                  <span className="text-xs font-semibold text-zinc-500">RSD</span>
                </span>
              </div>
            </div>

            {/* KPI 3: Uspešnost Win Rate */}
            <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] flex items-center gap-3.5 min-w-[140px]">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                  Uspešnost
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-amber-300 num-tabular">
                    {winRate}%
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    ({totalWins}W / {totalTickets - totalWins}L)
                  </span>
                </div>
              </div>
            </div>

            {/* Action: Promeni Profil */}
            <button
              onClick={onOpenProfiles}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <User className="w-4 h-4 text-zinc-950" />
              <span>Promeni Profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Selection Grid Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              IZABERITE IGRU · 3 SISTEMA
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Svaki mod je potpuno matematički nezavisan sa svojim herojima, algoritmom uloga i praćenjem profita.
          </p>
        </div>
      </div>

      {/* The 3 Dedicated Game Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: LUDILO 7+ & PRELAZI (KVOTA 25+) */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950 border border-orange-500/30 hover:border-orange-500/70 shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-orange-950/40">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/10 transition-colors" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 text-zinc-950 shadow-lg shadow-orange-500/20">
                <Flame className="w-6 h-6 fill-zinc-950" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                Kvote 7.0 — 25.0+
              </span>
            </div>

            <h3 className="text-xl font-black text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
              <span>LUDILO 7+ & PRELAZI</span>
            </h3>
            <p className="text-xs text-orange-400 font-bold mt-0.5">
              3 Heroja · 75 Pokušaja (20x 100 RSD + Progresija)
            </p>

            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
              Dizajniran za "bombe" i visoke kvote (7+ golova, prelaze 2 u 1 i 1 u 2). Prvih 20 tiketa po 100 RSD.
              Čim jedan tiket prođe, <strong className="text-white">vraća sav prethodni ulog i pravi rekordan plus!</strong>
            </p>

            {/* Quick Hero Preview */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex -space-x-2">
                {profile.ludiloHeroes.map((h) => (
                  <img
                    key={h.id}
                    src={h.avatar}
                    alt={h.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover ring-1 ring-orange-500/40"
                  />
                ))}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                <span>Vukadin (7+)</span> · <span>Senka (2-1)</span> · <span>Gromovnik (1-2)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => onEnterMode('ludilo25')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-950/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>UĐI U LUDILO REŽIM</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>

        {/* CARD 2: KVOTA 2.0 SISTEM (3 HEROJA + SPASITELJ) */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950 border border-amber-500/40 hover:border-amber-500/80 shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-950/40">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 text-zinc-950 shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6 fill-zinc-950" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Kvota 2.00 Fiksna
              </span>
            </div>

            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
              <span>KVOTA 2.0 SISTEM</span>
            </h3>
            <p className="text-xs text-amber-400 font-bold mt-0.5">
              3 Heroja + Feniks Spasitelj (Sigurnosni Štit)
            </p>

            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
              Matematički niz od 5 nivoa: <strong className="text-white font-mono">100 · 300 · 1.000 · 3.000 · 9.000 RSD</strong>.
              Ako heroj padne na koraku 5, <strong className="text-white">Heroj za Izvlačenje (Feniks)</strong> preuzima dug i spasava bankroll!
            </p>

            {/* Rescue alert if active */}
            {isRescueActive && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Spasavanje u toku (Feniks aktivan)!</span>
              </div>
            )}

            {/* Quick Hero Preview */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex -space-x-2">
                {profile.heroes.map((h) => (
                  <img
                    key={h.id}
                    src={h.avatar}
                    alt={h.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover ring-1 ring-amber-500/40"
                  />
                ))}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                <span>3 Heroja</span> · <span className="text-amber-400">Feniks Spasitelj</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => onEnterMode('kvota2')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>UĐI U KVOTU 2.0</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>

        {/* CARD 3: VARIJABILNI PROFIT MAŠINA */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950 border border-cyan-500/30 hover:border-cyan-500/70 shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-950/40">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-zinc-950 shadow-lg shadow-cyan-500/20">
                <Calculator className="w-6 h-6 text-zinc-950" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Varijabilne Kvote
              </span>
            </div>

            <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <span>PROFIT MAŠINA</span>
            </h3>
            <p className="text-xs text-cyan-400 font-bold mt-0.5">
              Ciljani profit 1.000 / 5.000 / 10.000 RSD
            </p>

            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
              Vi unosite kvotu tiketa (npr. 1.85, 2.40, 3.10), a mašina automatski izračunava ulog tako da{' '}
              <strong className="text-white">pokrije sve prethodne promašaje i donese tačno željeni profit!</strong>
            </p>

            {/* Quick Hero Preview */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex -space-x-2">
                {profile.variableHeroes.map((h) => (
                  <img
                    key={h.id}
                    src={h.avatar}
                    alt={h.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover ring-1 ring-cyan-500/40"
                  />
                ))}
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">
                <span>T1 (1.000)</span> · <span>T2 (5.000)</span> · <span>T3 (10.000 RSD)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => onEnterMode('variable')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>UĐI U PROFIT MAŠINU</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
