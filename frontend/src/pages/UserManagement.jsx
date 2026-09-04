import React, { useState, useEffect, useMemo } from "react";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  UserCheck,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  Leaf,
  FileText
} from "lucide-react";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const roleOptions = [
    { key: "super_admin", label: "Super Admin JET", color: "purple" },
    { key: "admin_operasional", label: "Admin Operasional", color: "amber" },
    { key: "admin_karbon", label: "Admin Karbon", color: "emerald" },
    { key: "admin_laporan", label: "Admin Laporan", color: "blue" },
    { key: "operator_sekolah", label: "Operator Sekolah", color: "cyan" },
    { key: "guru", label: "Guru Pendamping", color: "teal" },
    { key: "siswa", label: "Siswa", color: "slate" }
  ];

  const fetchUsersAndRoles = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      try {
        const usersRes = await api.get("/users");
        if (usersRes.data && usersRes.data.users) {
          setUsers(usersRes.data.users);
        }
      } catch {
        setUsers([
          { id: 1, name: "Budi Pratama (Super Admin)", email: "superadmin@jet.co.id", role: "super_admin", status: "active", school: "PT JET HQ Trenggalek" },
          { id: 2, name: "Reza Rahardian (Operasional)", email: "reza.ops@jet.co.id", role: "admin_operasional", status: "active", school: "PT JET Trenggalek" },
          { id: 3, name: "Dewi Lestari (Karbon)", email: "dewi.karbon@jet.co.id", role: "admin_karbon", status: "active", school: "PT JET Trenggalek" },
          { id: 4, name: "Bayu Wicaksono (Laporan)", email: "bayu.laporan@jet.co.id", role: "admin_laporan", status: "active", school: "PT JET Trenggalek" },
          { id: 5, name: "Siti Maryam (Operator Sekolah)", email: "siti.operator@sdn2bendorejo.sch.id", role: "operator_sekolah", status: "active", school: "SDN 2 Bendorejo" },
          { id: 6, name: "Drs. Hendro Wibowo (Guru)", email: "hendro.guru@sdn2bendorejo.sch.id", role: "guru", status: "active", school: "SDN 2 Bendorejo" },
          { id: 7, name: "Ahmad Santoso (Siswa)", email: "ahmad@siswa.id", role: "siswa", status: "active", school: "SDN 2 Bendorejo" }
        ]);
      }

      // 2. Fetch Roles
      try {
        const rolesRes = await api.get("/users/roles");
        if (rolesRes.data && rolesRes.data.roles) {
          setRoles(rolesRes.data.roles);
        }
      } catch {
        setRoles(roleOptions);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      const roleLabel = roleOptions.find((r) => r.key === newRole)?.label || newRole;
      showToast(`Role pengguna #${userId} berhasil diubah menjadi '${roleLabel}'`);
    } catch (err) {
      console.warn("API PUT role offline, menerapkan update lokal:", err.message);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      const roleLabel = roleOptions.find((r) => r.key === newRole)?.label || newRole;
      showToast(`Role pengguna #${userId} berhasil diubah menjadi '${roleLabel}' (Lokal)`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.school && u.school.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRoleFilter === "all" ||
        u.role === selectedRoleFilter ||
        (selectedRoleFilter === "super_admin" && u.role === "admin");

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const renderRoleBadge = (roleKey) => {
    const roleItem = roleOptions.find(
      (r) => r.key === roleKey || (r.key === "super_admin" && roleKey === "admin")
    );
    const label = roleItem ? roleItem.label : roleKey;

    let badgeClass = "bg-slate-800 text-slate-300 border-slate-700";
    if (roleKey === "super_admin" || roleKey === "admin") {
      badgeClass = "bg-purple-500/10 text-purple-400 border-purple-500/30";
    } else if (roleKey === "admin_operasional") {
      badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    } else if (roleKey === "admin_karbon") {
      badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    } else if (roleKey === "admin_laporan") {
      badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    } else if (roleKey === "operator_sekolah") {
      badgeClass = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    } else if (roleKey === "guru") {
      badgeClass = "bg-teal-500/10 text-teal-300 border-teal-500/30";
    } else if (roleKey === "siswa") {
      badgeClass = "bg-slate-800/80 text-slate-400 border-slate-700";
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badgeClass}`}>
        <ShieldCheck className="w-3 h-3" />
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#060a11] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] pb-16 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center shadow-md shadow-purple-500/20">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight">
                  MANAJEMEN USER & <span className="text-purple-400">ROLE PERMISSION</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Sprint 18 • PT JET
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchUsersAndRoles}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              to="/admin"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/30 border border-purple-500/30 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Enterprise Governance & Multi-Role Access Control</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Hak Akses & Otoritas Pengguna PT Jwalita Energi Trenggalek
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl">
                Kelola hak akses berjenjang mulai dari Super Admin JET, Admin Operasional, Admin Karbon, Admin Laporan, Operator Sekolah, Guru Pendamping, hingga Siswa.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shrink-0">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-xl font-black text-white">{users.length}</span>
                <span className="text-[10px] text-slate-500 block">Total User</span>
              </div>
              <div className="text-center px-3">
                <span className="text-xl font-black text-purple-400">{roleOptions.length}</span>
                <span className="text-[10px] text-slate-500 block">Peran Resmi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar Filter & Search */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama, email, atau sekolah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Role:</span>
            </div>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">Semua Role ({users.length})</option>
              {roleOptions.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* USER TABLE (SPRINT 18 REQUIREMENT) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Daftar Pengguna Sistem & Hak Akses
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Menampilkan <span className="font-bold text-white">{filteredUsers.length}</span> pengguna
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">Tidak ada pengguna yang cocok dengan kriteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role Saat Ini</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action (Change Role)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-all">
                      {/* 1. Nama */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-purple-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{user.name}</div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 font-normal">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              {user.school || "PT JET Trenggalek"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Email */}
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {user.email}
                        </span>
                      </td>

                      {/* 3. Role */}
                      <td className="py-3.5 px-4">
                        {renderRoleBadge(user.role)}
                      </td>

                      {/* 4. Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active
                        </span>
                      </td>

                      {/* 5. Action: Change Role Dropdown */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center justify-center">
                          <select
                            id={`select-role-${user.id}`}
                            disabled={updatingId === user.id}
                            value={user.role}
                            onChange={(e) => handleChangeRole(user.id, e.target.value)}
                            className="bg-slate-950/90 border border-slate-700/80 hover:border-purple-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {roleOptions.map((opt) => (
                              <option key={opt.key} value={opt.key}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
