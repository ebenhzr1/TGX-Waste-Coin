import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitWaste from "./pages/SubmitWaste";
import Ranking from "./pages/Ranking";
import AdminDashboard from "./pages/AdminDashboard";
import SchoolDashboard from "./pages/SchoolDashboard";
import CarbonImpact from "./pages/CarbonImpact";
import ImpactReport from "./pages/ImpactReport";
import UserManagement from "./pages/UserManagement";
import Marketplace from "./pages/Marketplace";
import MyRewards from "./pages/MyRewards";
import RewardManagement from "./pages/RewardManagement";
import Achievement from "./pages/Achievement";
import EcoCompetition from "./pages/EcoCompetition";
import CarbonAssetDashboard from "./pages/CarbonAssetDashboard";
import CarbonProjectManagement from "./pages/CarbonProjectManagement";
import CarbonOffset from "./pages/CarbonOffset";
import CarbonCertificate from "./pages/CarbonCertificate";
import CorporateDashboard from "./pages/CorporateDashboard";
import CSRManagement from "./pages/CSRManagement";
import PartnerProfile from "./pages/PartnerProfile";
import CSRImpactReport from "./pages/CSRImpactReport";
import AIVerificationDashboard from "./pages/AIVerificationDashboard";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import EconomicImpactDashboard from "./pages/EconomicImpactDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/submit" element={<SubmitWaste />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/school" element={<SchoolDashboard />} />
        <Route path="/carbon" element={<CarbonImpact />} />
        <Route path="/carbon-impact" element={<CarbonImpact />} />
        <Route path="/impact-report" element={<ImpactReport />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/my-rewards" element={<MyRewards />} />
        <Route path="/reward-management" element={<RewardManagement />} />
        <Route path="/achievement" element={<Achievement />} />
        <Route path="/competition" element={<EcoCompetition />} />
        <Route path="/carbon-assets" element={<CarbonAssetDashboard />} />
        <Route path="/carbon-projects" element={<CarbonProjectManagement />} />
        <Route path="/carbon-offset" element={<CarbonOffset />} />
        <Route path="/carbon-certificate" element={<CarbonCertificate />} />
        <Route path="/csr-dashboard" element={<CorporateDashboard />} />
        <Route path="/csr-management" element={<CSRManagement />} />
        <Route path="/csr-partner" element={<PartnerProfile />} />
        <Route path="/csr-partner/:id" element={<PartnerProfile />} />
        <Route path="/csr-report" element={<CSRImpactReport />} />
        <Route path="/csr-report/:id" element={<CSRImpactReport />} />
        <Route path="/ai-verification" element={<AIVerificationDashboard />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/executive" element={<ExecutiveDashboard />} />
        <Route path="/ecosystem/partners" element={<PartnerDashboard />} />
        <Route path="/ecosystem/impact" element={<EconomicImpactDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
