import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWaste } from '../context/WasteContext';
import { formatNumber } from '../utils/carbonCalc';
import EcoLogo from './EcoLogo';
import { Coins, LogOut, User, LayoutDashboard, PlusCircle, History, Trophy } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { tgxBalance } = useWaste();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Setor Sampah', path: '/setor', icon: PlusCircle },
    { name: 'Riwayat', path: '/riwayat', icon: History },
    { name: 'Ranking', path: '/ranking', icon: Trophy },
    { name: 'Profil', path: '/profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
          <EcoLogo size="sm" showSubtitle={false} className="sm:hidden" />
          <EcoLogo size="md" showSubtitle={true} className="hidden sm:flex" />
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-white/5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* User Status / Wallet Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* TGX Coin Balance Chip */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all text-xs sm:text-sm font-semibold shadow-inner"
              >
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span>{formatNumber(tgxBalance, 1)}</span>
                <span className="text-[10px] text-emerald-400 font-bold tracking-wider">TGX</span>
              </Link>

              {/* User Avatar & Name linking to Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 border-l border-white/10 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.slice(0, 2).toUpperCase() || 'BS'}
                  </div>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'Budi Santoso'}</span>
                  <span className="text-[10px] text-emerald-400/90 leading-tight">Trenggalek Kota</span>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs sm:text-sm hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
            >
              <User className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
