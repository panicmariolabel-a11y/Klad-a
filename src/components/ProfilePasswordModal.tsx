import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, X, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/audio';

interface ProfilePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSuccess: () => void;
}

export const ProfilePasswordModal: React.FC<ProfilePasswordModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === profile.password) {
      sounds.playWin();
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      sounds.playLoss();
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-zinc-200 glass-panel-elevated">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-500/20 mb-3.5">
            <Lock className="w-8 h-8 fill-zinc-950" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Otključaj Profil
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Profil <strong className="text-amber-300">{profile.name}</strong> je zaštićen šifrom za čuvanje podataka.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Unesite Šifru / PIN:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Unesite vašu šifru"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full bg-zinc-900 border rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                  error
                    ? 'border-red-500 ring-2 ring-red-500/30'
                    : 'border-white/[0.1] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-400 font-bold mt-2 animate-bounce">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Netačna šifra! Pokušajte ponovo.</span>
              </p>
            )}
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer transition-all"
            >
              Odustani
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer transition-all"
            >
              <span>Otključaj</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
