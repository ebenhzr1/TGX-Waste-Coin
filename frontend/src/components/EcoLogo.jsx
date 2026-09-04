import React from 'react';

export default function EcoLogo({ size = 'md', showSubtitle = true, className = '' }) {
  const sizeClasses = {
    sm: { box: 'w-8 h-8', icon: 'w-5 h-5', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 'w-8 h-8', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-sm' }
  }[size] || { box: 'w-10 h-10', icon: 'w-6 h-6', text: 'text-lg', sub: 'text-[10px]' };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 ${sizeClasses.box}`}>
        <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center">
          {/* Custom TGX Leaf Coin SVG */}
          <svg
            className={`${sizeClasses.icon} text-emerald-400`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer coin circle */}
            <circle cx="12" cy="12" r="10" className="stroke-emerald-400/50" strokeDasharray="2 2" />
            {/* Dynamic eco leaf cutting through coin */}
            <path
              d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
              className="fill-emerald-500/20 stroke-emerald-400"
            />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" className="stroke-cyan-300" />
          </svg>
        </div>
        {/* Ambient glow point */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent ${sizeClasses.text}`}>
            TGX
          </span>
          <span className={`font-semibold tracking-wide text-slate-200 ${sizeClasses.text}`}>
            WASTE COIN
          </span>
        </div>
        {showSubtitle && (
          <span className={`font-medium tracking-wider text-emerald-400/80 uppercase ${sizeClasses.sub}`}>
            PT Jwalita Energi Trenggalek
          </span>
        )}
      </div>
    </div>
  );
}
