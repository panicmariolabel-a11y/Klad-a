import React, { useState } from 'react';
import { Smartphone, Download, Share, PlusSquare, Check, X, Copy, QrCode } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 my-8 text-zinc-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-orange-500/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Instaliraj na Telefon</h2>
            <p className="text-xs text-zinc-400">Radi kao prava aplikacija na celom ekranu (PWA)</p>
          </div>
        </div>

        {/* Instant Native Install Button if supported by browser */}
        {isInstallable && (
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-white">Brza instalacija jednim klikom</div>
                <div className="text-xs text-zinc-300">Vaš pretraživač podržava direktno preuzimanje.</div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instaliraj</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab switch for Android vs iPhone */}
        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl mb-5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
              activeTab === 'android'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Android (Chrome)
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            iPhone / iOS (Safari)
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'android' ? (
          <div className="space-y-3 mb-6 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-white">Otvorite link u Google Chrome:</strong>
                <p className="text-zinc-400 mt-0.5">Uverite se da ste link aplikacije otvorili u Chrome pregledaču na vašem Android telefonu.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-white">Dodirnite tri tačkice (Meni):</strong>
                <p className="text-zinc-400 mt-0.5">U gornjem desnom uglu Chrome-a pritisnite ikonicu sa tri tačkice <span className="font-mono text-amber-400 font-bold">⋮</span>.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-white">Izaberite "Instaliraj aplikaciju":</strong>
                <p className="text-zinc-400 mt-0.5">Ili izaberite <span className="text-amber-400 font-bold">"Dodaj na početni ekran"</span> (Add to Home screen). Aplikacija dobija svoju ikonu među vašim aplikacijama!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mb-6 text-xs text-zinc-300">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-white">Otvorite link u Safari pregledaču:</strong>
                <p className="text-zinc-400 mt-0.5">Apple podržava instalaciju isključivo preko <strong>Safari</strong> pregledača na iPhone-u.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-white flex items-center gap-1.5">
                  Dodirnite dugme Deli: <Share className="w-3.5 h-3.5 text-blue-400" />
                </strong>
                <p className="text-zinc-400 mt-0.5">Dugme na dnu ekrana sa kvadratom i strelicom na gore (Share).</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-white flex items-center gap-1.5">
                  Izaberite "Dodaj na početni ekran": <PlusSquare className="w-3.5 h-3.5 text-amber-400" />
                </strong>
                <p className="text-zinc-400 mt-0.5">Pomerite listu na dole, kliknite "Dodaj na početni ekran" i potvrdite sa "Dodaj" (Add) u gornjem desnom uglu.</p>
              </div>
            </div>
          </div>
        )}

        {/* Share / Copy App Link Section */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 mb-5">
          <div className="text-[11px] text-zinc-400 font-semibold mb-2">
            Link aplikacije koji otvarate na telefonu:
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopirano!' : 'Kopiraj'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Bez Google Play / App Store naloga</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};
