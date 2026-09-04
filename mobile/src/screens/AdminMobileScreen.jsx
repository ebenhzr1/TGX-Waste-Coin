import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import { colors, spacing, shadows } from "../utils/theme";
import { CardDashboard } from "../components/CardDashboard";
import { mobileAPI } from "../api/api";

export const AdminMobileScreen = ({ navigation, user, onLogout }) => {
    const [stats, setStats] = useState({
        active_users: 1240,
        todays_waste_kg: 480.2,
        pending_approvals: 12,
        field_pickups_active: 3,
        co2_avoided_kg: 1152.48,
        active_partners: 8,
        active_csr_campaigns: 4
    });
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const res = await mobileAPI.getDashboard();
            if (res.data?.dashboard) {
                setStats(res.data.dashboard);
            }
        } catch (err) {
            console.warn("Using cached admin mobile stats:", err.message);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {/* Header Admin JET */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.badge}>EXECUTIVE MOBILE OVERSIGHT</Text>
                    <Text style={styles.headerTitle}>Admin JET Operasional</Text>
                    <Text style={styles.subTitle}>PT Jwalita Energi Trenggalek</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.sectionHeader}>Metrik Realtime Lapangan Hari Ini:</Text>

                {/* 1. Active Users & Today's Waste */}
                <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Pengguna Aktif"
                            value={stats.active_users?.toLocaleString("id-ID") || "1.240"}
                            unit="User"
                            icon={<Text style={{ fontSize: 20 }}>👥</Text>}
                            badgeText="Online"
                            badgeColor={colors.mintLight}
                        />
                    </View>

                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Sampah Hari Ini"
                            value={stats.todays_waste_kg || 480.2}
                            unit="Kg"
                            icon={<Text style={{ fontSize: 20 }}>♻️</Text>}
                            badgeText="Harian"
                            badgeColor={colors.infoLight}
                        />
                    </View>
                </View>

                {/* 2. Pending Approval & Field Activity */}
                <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Pending Approval"
                            value={stats.pending_approvals || 12}
                            unit="Setoran"
                            icon={<Text style={{ fontSize: 20 }}>⏳</Text>}
                            badgeText="Verifikasi"
                            badgeColor={colors.warningLight}
                            textColor={colors.warning}
                        />
                    </View>

                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Aktivitas Lapangan"
                            value={stats.field_pickups_active || 3}
                            unit="Truk/Rute"
                            icon={<Text style={{ fontSize: 20 }}>🚛</Text>}
                            badgeText="Aktif"
                            badgeColor={colors.mintLight}
                        />
                    </View>
                </View>

                {/* 3. Carbon Impact Card */}
                <CardDashboard
                    title="Dampak Karbon Terhindar (CO2 Avoided)"
                    subtitle="Akumulasi Terverifikasi PT JET"
                    value={stats.co2_avoided_kg || 1152.48}
                    unit="kgCO2e"
                    icon={<Text style={{ fontSize: 22 }}>🌍</Text>}
                    badgeText="Jwalita Carbon Tech"
                    badgeColor={colors.mintLight}
                    textColor={colors.forestGreen}
                >
                    <View style={styles.carbonInfoRow}>
                        <Text style={styles.carbonEq}>
                            🌱 Setara dengan {((stats.co2_avoided_kg || 1152) / 20).toFixed(0)} pohon tertanam selama 1 tahun
                        </Text>
                    </View>
                </CardDashboard>

                {/* 4. CSR & Partnership Overview */}
                <View style={styles.csrOverviewCard}>
                    <Text style={styles.csrOverviewTitle}>Kemitraan CSR Terintegrasi</Text>
                    <View style={styles.csrRow}>
                        <View style={styles.csrCol}>
                            <Text style={styles.csrVal}>{stats.active_partners || 8}</Text>
                            <Text style={styles.csrLbl}>Perusahaan Mitra</Text>
                        </View>
                        <View style={styles.csrCol}>
                            <Text style={styles.csrVal}>{stats.active_csr_campaigns || 4}</Text>
                            <Text style={styles.csrLbl}>Kampanye Berjalan</Text>
                        </View>
                        <View style={styles.csrCol}>
                            <Text style={styles.csrVal}>100%</Text>
                            <Text style={styles.csrLbl}>Audit Trail</Text>
                        </View>
                    </View>
                </View>

                {/* Navigasi Cepat Admin */}
                <View style={styles.quickActionsCard}>
                    <Text style={styles.qaTitle}>Tautan Operasional Mobile</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate ? navigation.navigate("VerifyWaste") : null}
                        style={[styles.qaButton, { backgroundColor: colors.emerald }]}
                    >
                        <Text style={styles.qaIcon}>📋</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.qaBtnTitle}>Verifikasi Antrean Sampah</Text>
                            <Text style={styles.qaBtnSubtitle}>Periksa transaksi pending semua sekolah</Text>
                        </View>
                        <Text style={styles.qaChevron}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate ? navigation.navigate("FieldCollector") : null}
                        style={[styles.qaButton, { backgroundColor: colors.forestGreen }]}
                    >
                        <Text style={styles.qaIcon}>🚛</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.qaBtnTitle}>Monitoring Rute Penjemputan</Text>
                            <Text style={styles.qaBtnSubtitle}>Pantau status pengangkutan TPS</Text>
                        </View>
                        <Text style={styles.qaChevron}>›</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    header: {
        backgroundColor: colors.darkGreen,
        paddingTop: 44,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    badge: {
        color: colors.mint,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.white
    },
    subTitle: {
        fontSize: 11,
        color: colors.mintLight
    },
    logoutBtn: {
        backgroundColor: "rgba(255,255,255,0.15)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    logoutText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: "600"
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 40
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.xs
    },
    gridRow: {
        flexDirection: "row",
        marginHorizontal: -spacing.xs
    },
    gridCol: {
        flex: 1,
        paddingHorizontal: spacing.xs
    },
    carbonInfoRow: {
        marginTop: 6,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: colors.grayLight
    },
    carbonEq: {
        fontSize: 11,
        color: colors.forestGreen,
        fontWeight: "600"
    },
    csrOverviewCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    csrOverviewTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkGreen,
        marginBottom: spacing.sm
    },
    csrRow: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    csrCol: {
        alignItems: "center"
    },
    csrVal: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.darkGreen
    },
    csrLbl: {
        fontSize: 11,
        color: colors.grayText,
        marginTop: 2
    },
    quickActionsCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    qaTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.sm
    },
    qaButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.sm
    },
    qaIcon: {
        fontSize: 22,
        marginRight: 10
    },
    qaBtnTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.white
    },
    qaBtnSubtitle: {
        fontSize: 10,
        color: "rgba(255,255,255,0.85)",
        marginTop: 1
    },
    qaChevron: {
        fontSize: 20,
        color: colors.white,
        fontWeight: "700",
        marginLeft: 6
    }
});

export default AdminMobileScreen;
