import React, { useState } from 'react';
import { Share2, Copy, Check, X, Smartphone, MessageCircle, Send, QrCode, AlertCircle, ExternalLink } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copiedPublic, setCopiedPublic] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);

  if (!isOpen) return null;

  // The permanent public URL for shared app
  const publicShareUrl = 'https://ais-pre-eil2wgpppocubmxjll4tf4-668820845587.europe-west1.run.app';
  // The development URL (for the owner)
  const devShareUrl = 'https://ais-dev-eil2wgpppocubmxjll4tf4-668820845587.europe-west1.run.app';

  const shareText = `Isprobaj aplikaciju Kvota 2.0 & Ludilo 7+ sa 3 heroja i kalkulatorom profita!\n${publicShareUrl}`;

  const handleCopyPublic = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicShareUrl);
      setCopiedPublic(true);
      setTimeout(() => setCopiedPublic(false), 2500);
    }
  };

  const handleCopyDev = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(devShareUrl);
      setCopiedDev(true);
      setTimeout(() => setCopiedDev(false), 2500);
    }
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    publicShareUrl
  )}&bgcolor=09090b&color=f59e0b`;

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

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-zinc-950 shadow-lg shadow-orange-500/20 font-black">
            <Share2 className="w-6 h-6 text-zinc-950" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Kako Otvoriti i Poslati</h2>
            <p className="text-xs text-zinc-400">Uputstvo za otvaranje na telefonu i deljenje sa drugima</p>
          </div>
        </div>

        {/* Critical Instructions Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs mb-5 space-y-2">
          <div className="font-black text-amber-300 flex items-center gap-1.5 text-sm">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Zašto je pisalo "Ne radi link" (404)?</span>
          </div>
          <p className="text-zinc-200 leading-relaxed">
            Google AI Studio ne pušta javni link u rad <strong>dokle god vi u gornjem desnom uglu ovog AI Studio ekrana ne kliknete dugme "Share"</strong> (ikona za deljenje 🔗).
          </p>
          <p className="text-amber-200/90 font-medium">
            👉 <strong>Rešenje:</strong> Kliknite na dugme <strong>"Share"</strong> (ili "Publish") u samom vrhu AI Studija i potvrdite deljenje. Tog trenutka javni link za prijatelje se aktivira!
          </p>
        </div>

        {/* Section 1: For the Owner on Phone */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>1. Link za VAS da odmah otvorite na telefonu:</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-2">
            Ovaj link radi ODMAH za vas (potrebno je samo da ste na telefonu ulogovani na vaš Google nalog):
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={devShareUrl}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyDev}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs shrink-0 cursor-pointer"
            >
              {copiedDev ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDev ? 'Kopirano' : 'Kopiraj'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: For Friends (Public URL) */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-orange-400" />
              <span>2. Javni link za PRIJATELJE (bez prijave):</span>
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mb-2">
            Radi za bilo koga čim kliknete dugme "Share" gore desno u AI Studiju:
          </p>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              readOnly
              value={publicShareUrl}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyPublic}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md shrink-0 cursor-pointer"
            >
              {copiedPublic ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPublic ? 'Kopirano!' : 'Kopiraj'}</span>
            </button>
          </div>

          {/* Quick share buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pošalji na WhatsApp</span>
            </a>

            <a
              href={`viber://forward?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Pošalji na Viber</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>Svaki igrač može napraviti svoj profil</span>
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
