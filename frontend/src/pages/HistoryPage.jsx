import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWaste } from '../context/WasteContext';
import { formatNumber, formatRupiah, TGX_TO_IDR_RATE } from '../utils/carbonCalc';
import Badge from '../components/Badge';
import {
  History,
  Search,
  PlusCircle,
  Calendar,
  Scale,
  MapPin,
  Leaf,
  FileCheck2
} from 'lucide-react';

export default function HistoryPage() {
  const { transactions, totalWasteKg, tgxBalance } = useWaste();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'VERIFIED' && tx.status === 'Terverifikasi') ||
      (filterStatus === 'COMPLETED' && tx.status === 'Selesai');

    const matchesSearch =
      tx.wasteTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Buku Besar Sirkular (Circular Ledger)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Riwayat Transaksi Setor Sampah
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Catatan verifikasi penimbangan sampah dan penerimaan TGX Waste Coin Anda.
          </p>
        </div>

        <Link
          to="/setor"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Setor Sampah Baru</span>
        </Link>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Total Transaksi
          </span>
          <span className="text-2xl font-bold text-white mt-1">
            {transactions.length} <span className="text-xs font-normal text-slate-400">kali</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Akumulasi Berat
          </span>
          <span className="text-2xl font-bold text-cyan-400 mt-1">
            {formatNumber(totalWasteKg, 1)} <span className="text-xs font-semibold">kg</span>
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl glass-card-eco border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            Total Reward Coin
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-emerald-400">
              +{formatNumber(tgxBalance, 1)}
            </span>
            <span className="text-xs font-bold text-emerald-300">TGX</span>
            <span className="text-[11px] text-slate-400 ml-1">
              ({formatRupiah(tgxBalance * TGX_TO_IDR_RATE)})
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 mb-6 border border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jenis sampah, ID transaksi, atau lokasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-sky-400 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex rounded-xl bg-slate-950/70 p-1 border border-white/5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('VERIFIED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terverifikasi
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('COMPLETED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterStatus === 'COMPLETED'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Transaction Records List */}
      {filteredTransactions.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-white/10">
          <FileCheck2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            Tidak Ada Transaksi Ditemukan
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Tidak ada transaksi yang cocok dengan kata kunci pencarian atau filter status yang dipilih.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0">
                  <Scale className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base text-white">
                      {tx.wasteTypeName}
                    </span>
                    <Badge status={tx.status} />
                    <span className="text-[10px] font-mono text-slate-500 border border-white/5 px-2 py-0.5 rounded-md">
                      {tx.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {tx.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {tx.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-cyan-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-cyan-400" />
                      Mereduksi emisi {tx.carbonSavedKg} kg CO₂e
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Reward Highlights */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-white/5 gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-emerald-400 font-extrabold text-base sm:text-xl">
                    +{formatNumber(tx.tgxEarned, 1)}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">TGX</span>
                </div>
                <div className="text-xs text-slate-400">
                  Berat: <strong className="text-slate-200">{tx.weightKg} kg</strong> ({formatRupiah(tx.idrValue)})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
