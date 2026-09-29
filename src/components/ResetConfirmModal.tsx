import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, X, ShieldAlert } from 'lucide-react';
import { GameMode } from '../types';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: GameMode | null;
  onResetMode: (mode: GameMode) => void;
  onResetEntireProfile: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  activeMode,
  onResetMode,
  onResetEntireProfile,
}) => {
  const [resetType, setResetType] = useState<'mode' | 'all'>('mode');

  if (!isOpen) return null;

  const modeName =
    activeMode === 'ludilo25'
      ? 'Ludilo 7+ & Prelazi'
      : activeMode === 'variable'
      ? 'Varijabilni Profit'
      : 'Kvota 2.0 Sistem';

  const handleConfirm = () => {
    if (resetType === 'mode' && activeMode) {
      onResetMode(activeMode);
    } else {
      onResetEntireProfile();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-7 text-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Potvrda Reseta</h3>
            <p className="text-xs text-zinc-400">Izaberite šta tačno želite da resetujete</p>
          </div>
        </div>

        {/* Choice Radio / Cards */}
        <div className="space-y-3 mb-6">
          {activeMode && (
            <div
              onClick={() => setResetType('mode')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                resetType === 'mode'
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-white">
                  1. Resetuj SAMO ovaj mod: <span className="text-amber-400">{modeName}</span>
                </span>
                <input
                  type="radio"
                  name="resetChoice"
                  checked={resetType === 'mode'}
                  onChange={() => setResetType('mode')}
                  className="accent-amber-500"
                />
              </div>
              <p className="text-[11px] text-zinc-400">
                Vraća samo 3 heroja ovog režima na početak. Ostali modovi i istorija ostaju sačuvani!
              </p>
            </div>
          )}

          <div
            onClick={() => setResetType('all')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              resetType === 'all'
                ? 'bg-red-500/10 border-red-500/80 shadow-md ring-1 ring-red-500/40'
                : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-white">
                2. Resetuj CELOKUPNU IGRU profila
              </span>
              <input
                type="radio"
                name="resetChoice"
                checked={resetType === 'all'}
                onChange={() => setResetType('all')}
                className="accent-red-500"
              />
            </div>
            <p className="text-[11px] text-zinc-400">
              Resetuje sva tri moda igre, vraća bankroll na početni iznos i briše celu istoriju tiketa za trenutnog igrača.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer"
          >
            Odustani
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
              resetType === 'all'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20'
            }`}
          >
            Potvrdi Reset
          </button>
        </div>
      </div>
    </div>
  );
};
