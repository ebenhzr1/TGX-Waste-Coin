import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, PlusCircle, Trophy, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      active: currentPath === '/' || currentPath === '/dashboard'
    },
    {
      name: 'Riwayat',
      path: '/riwayat',
      icon: History,
      active: currentPath === '/riwayat'
    },
    {
      name: 'Setor',
      path: '/setor',
      icon: PlusCircle,
      isPrimary: true,
      active: currentPath === '/setor'
    },
    {
      name: 'Ranking',
      path: '/ranking',
      icon: Trophy,
      active: currentPath === '/ranking'
    },
    {
      name: 'Profil',
      path: '/profile',
      icon: User,
      active: currentPath === '/profile'
    }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.name}
                to={item.path}
                className="relative -top-4 flex flex-col items-center group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-0.5">Setor</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                item.active
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
