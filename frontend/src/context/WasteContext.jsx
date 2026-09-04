import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateReward, WASTE_TYPES } from '../utils/carbonCalc';
import api from '../api/api';

const WasteContext = createContext();

const INITIAL_TRANSACTIONS = [
  {
    id: 'TX-2026-0901',
    date: '02 Sep 2026, 14:15',
    wasteTypeId: 'plastic',
    wasteTypeName: 'Plastik (PET / HDPE)',
    weightKg: 12.5,
    tgxEarned: 62.5,
    idrValue: 62500,
    carbonSavedKg: 26.25,
    location: 'Bank Sampah Jwalita - Hub Pogalan',
    status: 'Terverifikasi',
    photoUrl: null
  },
  {
    id: 'TX-2026-0828',
    date: '28 Agu 2026, 10:45',
    wasteTypeId: 'organic',
    wasteTypeName: 'Sampah Organik / Sisa Makanan',
    weightKg: 25.0,
    tgxEarned: 87.5,
    idrValue: 87500,
    carbonSavedKg: 46.25,
    location: 'TPST Pusat Trenggalek',
    status: 'Selesai',
    photoUrl: null
  },
  {
    id: 'TX-2026-0820',
    date: '20 Agu 2026, 16:30',
    wasteTypeId: 'paper',
    wasteTypeName: 'Kertas & Karton / Kardus',
    weightKg: 18.2,
    tgxEarned: 45.5,
    idrValue: 45500,
    carbonSavedKg: 21.84,
    location: 'Hub Kompos Durenan Indah',
    status: 'Selesai',
    photoUrl: null
  },
  {
    id: 'TX-2026-0814',
    date: '14 Agu 2026, 11:20',
    wasteTypeId: 'metal',
    wasteTypeName: 'Logam & Kaleng Aluminium',
    weightKg: 8.0,
    tgxEarned: 64.0,
    idrValue: 64000,
    carbonSavedKg: 36.00,
    location: 'Bank Sampah Jwalita - Hub Pogalan',
    status: 'Selesai',
    photoUrl: null
  }
];

export function WasteProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('tgx_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Calculate aggregations dynamically or initialize
  const totalWasteKg = transactions.reduce((sum, item) => sum + (parseFloat(item.weightKg) || 0), 0);
  const tgxBalance = transactions.reduce((sum, item) => sum + (parseFloat(item.tgxEarned) || 0), 0);
  const carbonImpactKg = transactions.reduce((sum, item) => sum + (parseFloat(item.carbonSavedKg) || 0), 0);
  
  // Dynamic leaderboard ranking based on total kilograms contributed
  const ranking = totalWasteKg > 100 ? '#4 di Trenggalek' : totalWasteKg > 50 ? '#8 di Trenggalek' : '#15 di Trenggalek';

  useEffect(() => {
    localStorage.setItem('tgx_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addSubmission = async ({ wasteTypeId, weightKg, location, photoUrl, notes }) => {
    const weight = parseFloat(weightKg);
    const wasteConfig = WASTE_TYPES[wasteTypeId] || WASTE_TYPES.plastic;
    const { tgxEarned, idrEquivalent, co2eAvoided } = calculateReward(wasteTypeId, weight);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    let serverTx = null;
    try {
      const response = await api.post('/waste/submit', {
        waste_type: wasteTypeId,
        weight_kg: weight,
        location,
        notes
      });
      if (response.data && response.data.transaction) {
        serverTx = response.data.transaction;
      }
    } catch (err) {
      console.warn("Backend submit API offline/error, saving locally:", err.message);
    }

    const newTx = {
      id: serverTx ? `TX-${serverTx.id.toString().padStart(6, '0')}` : `TX-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      date: dateFormatted,
      wasteTypeId,
      wasteTypeName: wasteConfig.name,
      weightKg: weight,
      tgxEarned,
      idrValue: idrEquivalent,
      carbonSavedKg: co2eAvoided,
      location: location || 'TPST Pusat Trenggalek',
      status: serverTx ? serverTx.status : 'Terverifikasi',
      photoUrl: photoUrl || null,
      notes: notes || ''
    };

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const resetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem('tgx_transactions');
  };

  return (
    <WasteContext.Provider
      value={{
        transactions,
        totalWasteKg,
        tgxBalance,
        carbonImpactKg,
        ranking,
        addSubmission,
        resetData
      }}
    >
      {children}
    </WasteContext.Provider>
  );
}

export function useWaste() {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
}
