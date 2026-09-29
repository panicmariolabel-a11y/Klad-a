import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Plus, Check, Trash2, X, Lock, Key, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { createDefaultProfile } from '../utils/storage';
import { sounds } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onCreateProfile: (profile: UserProfile) => void;
  onDeleteProfile: (id: string) => void;
  onUpdateProfilePassword: (profileId: string, newPassword?: string) => void;
}

const AVATAR_COLORS = [
  { name: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-400', text: 'text-amber-400', label: 'Zlatni' },
  { name: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-400', text: 'text-emerald-400', label: 'Zeleni' },
  { name: 'cyan', bg: 'bg-cyan-500', ring: 'ring-cyan-400', text: 'text-cyan-400', label: 'Cijan' },
  { name: 'purple', bg: 'bg-purple-600', ring: 'ring-purple-400', text: 'text-purple-400', label: 'Ljubičasti' },
  { name: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-400', text: 'text-rose-400', label: 'Crveni' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onUpdateProfilePassword,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBankroll, setNewBankroll] = useState('50000');
  const [selectedColor, setSelectedColor] = useState('amber');

  // Password for new profile
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password edit state for existing profile
  const [editingPasswordProfileId, setEditingPasswordProfileId] = useState<string | null>(null);
  const [editPassInput, setEditPassInput] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (enablePassword) {
      if (!password || password.length < 3) {
        setPasswordError('Šifra mora imati najmanje 3 karaktera.');
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Šifre se ne podudaraju.');
        return;
      }
    }

    const bankrollNum = parseInt(newBankroll, 10) || 50000;
    const newProfile = createDefaultProfile(
      `profile-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      newName.trim(),
      selectedColor,
      enablePassword ? password : undefined
    );
    newProfile.bankroll = { initial: bankrollNum, current: bankrollNum };

    onCreateProfile(newProfile);
    setNewName('');
    setPassword('');
    setConfirmPassword('');
    setEnablePassword(false);
    setPasswordError('');
    setIsCreating(false);
    sounds.playWin();
  };

  const handleSavePasswordForExisting = (profileId: string) => {
    const trimmed = editPassInput.trim();
    onUpdateProfilePassword(profileId, trimmed ? trimmed : undefined);
    setEditingPasswordProfileId(null);
    setEditPassInput('');
    sounds.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-zinc-200 glass-panel-elevated">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/20">
            <User className="w-6 h-6 fill-zinc-950" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Profili & Zaštita Šifrom</h2>
            <p className="text-xs text-zinc-400">Kreirajte profil i postavite šifru za čuvanje podataka</p>
          </div>
        </div>

        {!isCreating ? (
          <div>
            {/* List Existing Profiles */}
            <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-1">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const totalStaked = p.logs.reduce((acc, l) => acc + l.stake, 0);
                const totalWon = p.logs.reduce((acc, l) => acc + (l.result === 'win' ? l.potentialReturn : 0), 0);
                const netProfit = totalWon - totalStaked;
                const colorCfg = AVATAR_COLORS.find((c) => c.name === p.avatarColor) || AVATAR_COLORS[0];
                const hasPassword = !!p.password;
                const isEditingThisPass = editingPasswordProfileId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-zinc-900/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-zinc-900/40 border-white/[0.06] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Clickable Profile Switcher */}
                      <div
                        onClick={() => onSelectProfile(p.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div
                          className={`w-11 h-11 rounded-xl ${colorCfg.bg} flex items-center justify-center text-zinc-950 font-black shadow-md shrink-0`}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-sm text-white truncate">{p.name}</h4>
                            {isActive && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                Aktivan
                              </span>
                            )}
                            {hasPassword ? (
                              <span
                                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                title="Ovaj profil je zaštićen šifrom"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Šifra</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500">Bez šifre</span>
                            )}
                          </div>

                          <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span>
                              Bankroll: <strong className="text-zinc-200 num-tabular">{p.bankroll.current.toLocaleString('sr-RS')} RSD</strong>
                            </span>
                            <span>•</span>
                            <span className={`num-tabular font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('sr-RS')} RSD
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {/* Change/Set Password Button */}
                        <button
                          onClick={() => {
                            setEditingPasswordProfileId(isEditingThisPass ? null : p.id);
                            setEditPassInput(p.password || '');
                          }}
                          className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            hasPassword
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                          }`}
                          title={hasPassword ? 'Promeni ili ukloni šifru' : 'Postavi šifru za ovaj profil'}
                        >
                          <Key className="w-4 h-4" />
                        </button>

                        {isActive ? (
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          profiles.length > 1 && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Da li ste sigurni da želite da obrišete profil "${p.name}"?`)) {
                                  onDeleteProfile(p.id);
                                }
                              }}
                              className="p-2 text-zinc-500 hover:text-red-400 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Obriši profil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Inline Password Edit Form */}
                    {isEditingThisPass && (
                      <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center gap-2">
                        <input
                          type="password"
                          placeholder="Unesi novu šifru (ostavi prazno za uklanjanje)"
                          value={editPassInput}
                          onChange={(e) => setEditPassInput(e.target.value)}
                          className="flex-1 bg-zinc-950 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePasswordForExisting(p.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black rounded-xl cursor-pointer"
                        >
                          Sačuvaj
                        </button>
                        <button
                          onClick={() => setEditingPasswordProfileId(null)}
                          className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-xl cursor-pointer"
                        >
                          Odustani
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Create New Profile Button */}
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer mb-2 active:scale-95"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>Napravi Svoj Profil (sa opcijom šifre)</span>
            </button>
          </div>
        ) : (
          /* Create Profile Form with Password Option */
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Ime Igrača / Profila:
              </label>
              <input
                type="text"
                required
                placeholder="npr. Mario, Stefan, Glavni Nalog"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.1] rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Početni Budžet (Bankroll) u RSD:
              </label>
              <input
                type="number"
                step="1000"
                min="1000"
                value={newBankroll}
                onChange={(e) => setNewBankroll(e.target.value)}
                className="w-full bg-zinc-900 border border-white/[0.1] rounded-2xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 num-tabular"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Izaberite Boju Profila:
              </label>
              <div className="flex items-center gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center transition-all cursor-pointer ${
                      selectedColor === c.name ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === c.name && <Check className="w-4 h-4 text-zinc-950 font-black" />}
                  </button>
                ))}
              </div>
            </div>

            {/* PASSWORD / SECURITY TOGGLE */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/[0.08] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Postavi Šifru za čuvanje podataka o igri</span>
                </span>
                <input
                  type="checkbox"
                  checked={enablePassword}
                  onChange={(e) => {
                    setEnablePassword(e.target.checked);
                    if (!e.target.checked) setPasswordError('');
                  }}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </label>

              {enablePassword && (
                <div className="space-y-3 pt-2 border-t border-white/[0.06] animate-in fade-in duration-200">
                  <p className="text-[11px] text-zinc-400">
                    Samo vi sa unetom šifrom možete otključati ovaj profil i pristupiti njegovom bankroll-u i istoriji.
                  </p>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Unesite šifru / PIN (min. 3 karaktera)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Potvrdite šifru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {passwordError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-400 font-bold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit / Cancel */}
            <div className="flex gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setPasswordError('');
                }}
                className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer transition-all"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              >
                Sačuvaj Profil
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};
