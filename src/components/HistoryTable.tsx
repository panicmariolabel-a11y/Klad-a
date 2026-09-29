import React, { useState } from 'react';
import { TicketLog, GameMode } from '../types';
import { History, Download, Trash2, CheckCircle2, XCircle, Filter } from 'lucide-react';

interface HistoryTableProps {
  logs: TicketLog[];
  onClearLogs: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ logs, onClearLogs }) => {
  const [filterMode, setFilterMode] = useState<string>('all');

  const filteredLogs = logs.filter((l) => {
    if (filterMode === 'all') return true;
    return l.mode === filterMode;
  });

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Vreme', 'Režim', 'Heroj', 'Opis Koraka', 'Ulog (RSD)', 'Kvota', 'Dobitak (RSD)', 'Ishod', 'Neto Profit (RSD)', 'Opaska'];
    const rows = logs.map((l) => [
      new Date(l.timestamp).toLocaleString('sr-RS'),
      l.mode === 'ludilo25' ? 'Ludilo 25+' : l.mode === 'variable' ? 'Varijabilni' : 'Kvota 2.0',
      l.heroName,
      l.stepDescription,
      l.stake,
      l.odd,
      l.potentialReturn,
      l.result === 'win' ? 'POGODAK' : 'PROMAŠAJ',
      l.netProfit,
      l.note || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heroji_istorija_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl bg-zinc-950/90 border border-white/[0.08] p-5 sm:p-6 shadow-2xl glass-panel">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">Istorija Odigranih Tiketa</h3>
            <p className="text-xs text-zinc-400">Kompletan zapis svih uloga, kvota i ishoda kroz sisteme</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Segmented Control */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-zinc-900 border border-white/[0.08] text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Svi ({logs.length})
            </button>
            <button
              onClick={() => setFilterMode('ludilo25')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'ludilo25'
                  ? 'bg-orange-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ludilo
            </button>
            <button
              onClick={() => setFilterMode('kvota2')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'kvota2'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kvota 2.0
            </button>
            <button
              onClick={() => setFilterMode('variable')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterMode === 'variable'
                  ? 'bg-cyan-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mašina
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={exportCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/[0.08] disabled:opacity-30 transition-all cursor-pointer shadow-sm"
            title="Preuzmi CSV tabelu za Excel"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 text-xs font-semibold border border-white/[0.08] hover:border-red-800/40 disabled:opacity-30 transition-all cursor-pointer"
            title="Isprazni istoriju tiketa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-zinc-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 text-zinc-400 uppercase font-black tracking-wider text-[10px] border-b border-white/[0.08]">
            <tr>
              <th className="py-3 px-4">Vreme</th>
              <th className="py-3 px-3">Režim</th>
              <th className="py-3 px-3">Heroj</th>
              <th className="py-3 px-3">Opis Koraka</th>
              <th className="py-3 px-3">Ulog</th>
              <th className="py-3 px-3">Kvota</th>
              <th className="py-3 px-3">Ishod</th>
              <th className="py-3 px-4 text-right">Neto Profit</th>
              <th className="py-3 px-4">Opaska</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500">
                  <p className="font-semibold text-zinc-400">Nema evidentiranih tiketa</p>
                  <p className="text-[11px] text-zinc-600 mt-1">Odigrajte tiket u bilo kom modu da biste videli detaljnu statistiku.</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isWin = log.result === 'win';
                return (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap num-tabular">
                      {new Date(log.timestamp).toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          log.mode === 'ludilo25'
                            ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                            : log.mode === 'variable'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {log.mode === 'ludilo25' ? 'Ludilo' : log.mode === 'variable' ? 'Mašina' : 'Kvota 2.0'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {log.heroName}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 whitespace-nowrap">{log.stepDescription}</td>
                    <td className="py-3 px-3 font-bold text-zinc-200 whitespace-nowrap num-tabular">
                      {log.stake.toLocaleString('sr-RS')} RSD
                    </td>
                    <td className="py-3 px-3 text-amber-400 font-bold whitespace-nowrap num-tabular">
                      {log.odd.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isWin ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">
                          <CheckCircle2 className="w-3 h-3" />
                          DOBIO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-black">
                          <XCircle className="w-3 h-3" />
                          PAO
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-black whitespace-nowrap num-tabular ${
                        isWin ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {log.netProfit >= 0 ? '+' : ''}
                      {log.netProfit.toLocaleString('sr-RS')} RSD
                    </td>
                    <td className="py-3 px-4 text-zinc-400 max-w-[200px] truncate">
                      {log.note || <span className="text-zinc-700">—</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
