import React, { useState } from 'react';
import { X, Sparkles, Zap, Flame, RotateCcw, Play, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Hero, RescueState } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroes: Hero[];
  rescueState: RescueState;
  onSimulateHeroFall: (heroId: string) => void;
  onSimulateRescueBet: (win: boolean) => void;
  onSimulateRandomHeroBet: (heroId: string, winProb: number) => void;
  onResetSimulation: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  heroes,
  rescueState,
  onSimulateHeroFall,
  onSimulateRescueBet,
  onSimulateRandomHeroBet,
  onResetSimulation,
}) => {
  const [winProb, setWinProb] = useState<number>(50); // 50% default for odd 2.0
  const [simResults, setSimResults] = useState<string[]>([]);

  if (!isOpen) return null;

  const isRescueActive = !!rescueState.activeHeroId;

  const logSim = (msg: string) => {
    setSimResults((prev) => [msg, ...prev.slice(0, 19)]);
  };

  const handleSimulate10Rounds = () => {
    for (let i = 0; i < 10; i++) {
      // Pick random active hero
      const activeHeroes = heroes.filter((h) => h.status === 'active');
      if (activeHeroes.length > 0) {
        const picked = activeHeroes[Math.floor(Math.random() * activeHeroes.length)];
        onSimulateRandomHeroBet(picked.id, winProb / 100);
      } else if (isRescueActive) {
        const isWin = Math.random() < winProb / 100;
        onSimulateRescueBet(isWin);
      }
    }
    logSim(`Simulirano 10 rundi sa verovatnoćom dobitka ${winProb}%.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 my-8 text-zinc-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-purple-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Simulator & Sandbox Testiranje</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Isprobajte matematički model, izazovite pad heroja ili testirajte spasavanje
            </p>
          </div>
        </div>

        {/* Win Probability Slider */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-zinc-300">Verovatnoća Pogotka za Kvote 2.0 (Simulacija):</span>
            <span className="text-amber-400 font-black text-sm">{winProb}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="70"
            value={winProb}
            onChange={(e) => setWinProb(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
            <span>30% (Loša serija)</span>
            <span>50% (Teorijski prosek za kvotu 2.0)</span>
            <span>70% (Dobra serija)</span>
          </div>
        </div>

        {/* Action Group 1: Force Trigger a Hero Fall */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-red-950/30 to-zinc-900/90 border border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>1. Izazovi Pad Heroja (Aktiviraj Spasitelja)</span>
          </div>
          <p className="text-xs text-zinc-300 mb-3">
            Ovo automatski simulira 5 uzastopnih promašaja (100 → 300 → 1.000 → 3.000 → 9.000 RSD) i pali Heroja za Izvlačenje sa dugom od 13.000 RSD.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {heroes.map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  onSimulateHeroFall(h.id);
                  logSim(`Simuliran pad heroja ${h.name} na koraku 9.000 RSD.`);
                }}
                disabled={h.status !== 'active'}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold transition-all disabled:opacity-30 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Pad: {h.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Group 2: Rescue Hero Actions if Active */}
        {isRescueActive && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 to-zinc-900/90 border border-orange-500/40">
            <div className="flex items-center gap-2 text-orange-400 font-black text-xs uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4" />
              <span>2. Testiraj Heroja za Izvlačenje (Spasitelja)</span>
            </div>
            <p className="text-xs text-zinc-300 mb-3">
              Isprobaj kako se menja ulog prema formuli u slučaju dobitka ili promašaja:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onSimulateRescueBet(true);
                  logSim('Spasitelj: Simuliran POGODAK.');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simuliraj Pogodak Spasitelja</span>
              </button>
              <button
                onClick={() => {
                  onSimulateRescueBet(false);
                  logSim('Spasitelj: Simuliran PROMAŠAJ.');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Simuliraj Promašaj Spasitelja</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Group 3: Mass Simulation */}
        <div className="mb-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center gap-2 text-purple-400 font-black text-xs uppercase tracking-wider mb-2">
            <Zap className="w-4 h-4" />
            <span>3. Masovna Simulacija Rundi</span>
          </div>
          <p className="text-xs text-zinc-300 mb-3">
            Odigrajte brzu seriju od 10 rundi kako biste videli kretanje profita i dinamiku heroja.
          </p>
          <button
            onClick={handleSimulate10Rounds}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950/50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Odigraj 10 Rundi Odmah</span>
          </button>
        </div>

        {/* Simulation Event Log */}
        {simResults.length > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 space-y-1 max-h-32 overflow-y-auto">
            <div className="text-xs font-sans font-bold text-zinc-300 mb-1">Dnevnik simulacije:</div>
            {simResults.map((msg, i) => (
              <div key={i} className="text-zinc-400">
                • {msg}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => {
              onResetSimulation();
              setSimResults(['Svi podaci i simulator su resetovani na početno stanje.']);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/30 text-zinc-400 hover:text-red-300 text-xs font-semibold border border-zinc-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetuj Sve</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};
