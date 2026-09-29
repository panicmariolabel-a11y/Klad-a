import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, Flame, Zap, Calculator, Target, DollarSign } from 'lucide-react';
import { GameMode } from '../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<GameMode>('ludilo25');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 my-8 text-zinc-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-orange-500/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Vodič i Pravila Sistema</h2>
            <p className="text-xs sm:text-sm text-zinc-400">Izaberite režim igre da vidite pravila i matematiku</p>
          </div>
        </div>

        {/* Tab switch between the 3 modes */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('ludilo25')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'ludilo25'
                ? 'bg-orange-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Ludilo 7+ & Prelazi (25+)
          </button>
          <button
            onClick={() => setActiveTab('kvota2')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'kvota2'
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Kvota 2.0 Sistem
          </button>
          <button
            onClick={() => setActiveTab('variable')}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              activeTab === 'variable'
                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Varijabilni Profit
          </button>
        </div>

        {/* TAB 1: LUDILO 7+ & PRELAZI */}
        {activeTab === 'ludilo25' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 via-zinc-900/90 to-zinc-900/90 border border-orange-500/40">
              <div className="flex items-center gap-2 text-orange-400 font-black text-sm uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4" />
                <span>Pravila Režima: Ludilo 7+ i Prelazi (Kvota 25+)</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                Ovaj sistem je dizajniran za visoke kvote (<strong>25.0 ili veće</strong>) na atraktivne igre poput <strong>7+ golova</strong> ili prelaza <strong>iz 2 u 1</strong> i <strong>iz 1 u 2</strong>.
              </p>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <strong className="text-amber-300">1. Prva faza (Pokušaji 1 do 20):</strong>
                  <p className="text-zinc-400 mt-0.5">
                    Svaki od 3 heroja ulaže fiksno <strong>100 RSD</strong> po utakmici tokom prvih 20 pokušaja.
                    Ako bilo kada u prvih 20 pokušaja pogodi kvotu 25+, ostvaruje ogroman čist dobitak (npr. ulog 100 RSD x kvota 25 = 2.500 RSD).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <strong className="text-orange-300">2. Druga faza (Pokušaji 21 do 75):</strong>
                  <p className="text-zinc-400 mt-0.5">
                    Ako se promaši 20 puta, heroji imaju na raspolaganju ukupno <strong>do 75 pokušaja</strong>.
                    Od 21. pokušaja računar blago povećava ulog tako da <strong>samo jedan pogodak</strong> automatski vrati SVE što je uloženo u prethodnih 20+ pokušaja i donese zagarantovan profit!
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <strong className="text-emerald-300">3. Na Pogodak:</strong>
                  <p className="text-zinc-400 mt-0.5">
                    Heroj zaključava profit, čisti svoj minus i vraća se na početak (1. pokušaj od 100 RSD).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KVOTA 2.0 SISTEM */}
        {activeTab === 'kvota2' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4" />
                <span>Niz 5 Koraka Kvote 2.0</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                Tri heroja (Vukadin, Senka, Gromovnik) vode nezavisne nizove:
              </p>

              <div className="grid grid-cols-5 gap-2 my-2 text-center text-xs">
                <div className="p-2 bg-zinc-950 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-zinc-400">K1</div>
                  <div className="font-bold text-amber-300">100</div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-zinc-400">K2</div>
                  <div className="font-bold text-amber-300">300</div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-zinc-400">K3</div>
                  <div className="font-bold text-amber-300">1.000</div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-zinc-400">K4</div>
                  <div className="font-bold text-amber-300">3.000</div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-xl border border-amber-500/30">
                  <div className="text-[10px] text-zinc-400">K5</div>
                  <div className="font-bold text-amber-300">9.000</div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mt-2">
                Pogodak na bilo kom koraku vraća heroja na 100 RSD sa čistim profitom. Promašaj na 9.000 RSD pali <strong>Heroja za Izvlačenje (Feniks)</strong> koji ulaže 50% duga (6.500 RSD), a na promašaj pokriva ulog + 25% dok ne izvuče ceo dug.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: VARIJABILNI PROFIT */}
        {activeTab === 'variable' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-900/90 to-zinc-900/90 border border-cyan-500/40">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-sm uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4" />
                <span>Pravila Režima: Varijabilni Profit Mašina</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-3">
                U ovom režimu vi birate <strong>koliki čist profit želite da zaradite</strong> na svakom od 3 heroja (brzi izbori: <strong>1.000 RSD</strong>, <strong>5.000 RSD</strong> ili <strong>10.000 RSD</strong>).
              </p>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <strong className="text-cyan-300">Kako računar sabira ulog:</strong>
                  <p className="text-zinc-400 mt-0.5">
                    Za svaku utakmicu upišete kvotu (npr. 1.85, 2.30, 3.10). Računar automatski uzima <strong>sve prethodno uloženo u nizu</strong> i izračunava tačan ulog po formuli:
                    <br />
                    <span className="font-mono text-cyan-300 font-bold">Ulog = (Ukupno Izgubljeno + Željeni Profit) / (Kvota - 1)</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <strong className="text-emerald-300">Zagarantovan profit:</strong>
                  <p className="text-zinc-400 mt-0.5">
                    Kada tiket prođe, isplata pokriva svaki pojedinačni dinar koji ste prethodno uložili u tom nizu, plus vam ostavlja tačno vaš željeni profit (1.000, 5.000 ili 10.000 RSD)!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};
