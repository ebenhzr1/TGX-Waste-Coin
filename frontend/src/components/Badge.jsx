import React from 'react';

export default function Badge({ status, className = '' }) {
  const getStatusConfig = (val) => {
    switch (val) {
      case 'Terverifikasi':
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'Selesai':
        return {
          bg: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
          dot: 'bg-sky-400'
        };
      case 'Dalam Penimbangan':
      case 'Dalam Proses':
      case 'Menunggu':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400 animate-pulse'
        };
      default:
        return {
          bg: 'bg-slate-700/30 border-slate-600/30 text-slate-300',
          dot: 'bg-slate-400'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
