import React from 'react';

export default function StatCard({
  title,
  value,
  unit = '',
  subtitle = '',
  icon: Icon,
  variant = 'emerald',
  badgeText = '',
  trend = null,
  onClick = null,
  className = ''
}) {
  const variantStyles = {
    emerald: {
      card: 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950',
      iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
      glow: 'shadow-emerald-500/5',
      textAccent: 'text-emerald-400'
    },
    blue: {
      card: 'border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-slate-900/80 to-slate-950',
      iconBox: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
      glow: 'shadow-sky-500/5',
      textAccent: 'text-sky-400'
    },
    cyan: {
      card: 'border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900/80 to-slate-950',
      iconBox: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
      glow: 'shadow-cyan-500/5',
      textAccent: 'text-cyan-400'
    },
    amber: {
      card: 'border-amber-500/20 bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-950',
      iconBox: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
      glow: 'shadow-amber-500/5',
      textAccent: 'text-amber-400'
    }
  }[variant] || {
    card: 'border-slate-800 bg-slate-900/80',
    iconBox: 'bg-slate-800 text-slate-300',
    glow: '',
    textAccent: 'text-white'
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border p-4.5 backdrop-blur-md transition-all duration-300 shadow-xl ${variantStyles.card} ${variantStyles.glow} ${
        onClick ? 'cursor-pointer hover:border-opacity-50 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {/* Ambient background decoration */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/[0.02] blur-xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${variantStyles.iconBox}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className={`text-sm font-semibold ${variantStyles.textAccent}`}>
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5">
        <span className="truncate">{subtitle}</span>
        {badgeText && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-slate-200">
            {badgeText}
          </span>
        )}
        {trend && (
          <span className="text-emerald-400 font-medium flex items-center gap-0.5 text-[11px]">
            ↑ {trend}
          </span>
        )}
      </div>
    </div>
  );
}
