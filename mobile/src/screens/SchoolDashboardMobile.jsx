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
import { mobileAPI, wasteAPI } from "../api/api";

export const SchoolDashboardMobile = ({ navigation, user, onLogout }) => {
    const [stats, setStats] = useState({
        school_name: "SDN 2 Bendorejo",
        active_students: 450,
        pending_approvals: 8,
        total_school_waste_kg: 1250.5,
        school_ranking: 1,
        adiwiyata_status: "Mandiri"
    });
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const res = await mobileAPI.getDashboard();
            if (res.data?.dashboard) {
                setStats(res.data.dashboard);
            }
        } catch (err) {
            console.warn("Using fallback school dashboard data");
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
            {/* Header Sekolah */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.badge}>OPERATOR SEKOLAH ADIWIYATA</Text>
                    <Text style={styles.schoolTitle}>{stats.school_name || "SDN 2 Bendorejo"}</Text>
                    <Text style={styles.schoolSubtitle}>Operator: {user?.name || "Budi Waluyo, S.Pd"}</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Pending Verification Alert Banner */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation?.navigate ? navigation.navigate("VerifyWaste") : null}
                    style={[styles.pendingAlert, shadows.card]}
                >
                    <View style={styles.alertLeft}>
                        <Text style={styles.alertIcon}>⚡</Text>
                        <View>
                            <Text style={styles.alertTitle}>Verifikasi Setoran Siswa</Text>
                            <Text style={styles.alertDesc}>
                                Ada {stats.pending_approvals || 8} setoran sampah menunggu konfirmasi
                            </Text>
                        </View>
                    </View>
                    <View style={styles.alertAction}>
                        <Text style={styles.alertActionText}>Buka →</Text>
                    </View>
                </TouchableOpacity>

                {/* 4 Kartu Metrik Sekolah */}
                <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Siswa Aktif"
                            value={stats.active_students || 450}
                            unit="Siswa"
                            icon={<Text style={{ fontSize: 20 }}>👥</Text>}
                            badgeText="Adiwiyata"
                            badgeColor={colors.mintLight}
                        />
                    </View>

                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Pending Approval"
                            value={stats.pending_approvals || 8}
                            unit="Antrean"
                            icon={<Text style={{ fontSize: 20 }}>⏳</Text>}
                            badgeText="Perlu Aksi"
                            badgeColor={colors.warningLight}
                            textColor={colors.warning}
                        />
                    </View>
                </View>

                <View style={styles.gridRow}>
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Total Sampah"
                            value={stats.total_school_waste_kg || 1250.5}
                            unit="Kg"
                            icon={<Text style={{ fontSize: 20 }}>⚖️</Text>}
                            badgeText="Semester Ini"
                            badgeColor={colors.infoLight}
                        />
                    </View>

                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Peringkat Sekolah"
                            value={`#${stats.school_ranking || 1}`}
                            unit="Trenggalek"
                            icon={<Text style={{ fontSize: 20 }}>🏆</Text>}
                            badgeText={stats.adiwiyata_status || "Mandiri"}
                            badgeColor={colors.mintLight}
                        />
                    </View>
                </View>

                {/* Navigasi Aksi Sekolah */}
                <View style={styles.actionCard}>
                    <Text style={styles.actionCardTitle}>Manajemen Operasional Sekolah</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate ? navigation.navigate("VerifyWaste") : null}
                        style={[styles.menuButton, { backgroundColor: colors.emerald }]}
                    >
                        <Text style={styles.menuIcon}>📋</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.menuTitle}>Verifikasi Setoran Sampah</Text>
                            <Text style={styles.menuSubtitle}>Periksa foto timbangan & setujui koin siswa</Text>
                        </View>
                        <Text style={styles.menuChevron}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation?.navigate ? navigation.navigate("QRScanner") : null}
                        style={[styles.menuButton, { backgroundColor: colors.forestGreen }]}
                    >
                        <Text style={styles.menuIcon}>📷</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.menuTitle}>Pindai QR Siswa</Text>
                            <Text style={styles.menuSubtitle}>Identifikasi cepat siswa saat setor di pos sekolah</Text>
                        </View>
                        <Text style={styles.menuChevron}>›</Text>
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
    schoolTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.white
    },
    schoolSubtitle: {
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
    pendingAlert: {
        backgroundColor: colors.warningLight,
        borderRadius: 16,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.warning,
        marginBottom: spacing.md
    },
    alertLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    alertIcon: {
        fontSize: 24,
        marginRight: 10
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#92400e"
    },
    alertDesc: {
        fontSize: 11,
        color: "#78350f",
        marginTop: 2
    },
    alertAction: {
        backgroundColor: colors.warning,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    alertActionText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: "800"
    },
    gridRow: {
        flexDirection: "row",
        marginHorizontal: -spacing.xs
    },
    gridCol: {
        flex: 1,
        paddingHorizontal: spacing.xs
    },
    actionCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.md,
        marginTop: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    actionCardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.sm
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        borderRadius: 14,
        marginBottom: spacing.sm
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 12
    },
    menuTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.white
    },
    menuSubtitle: {
        fontSize: 11,
        color: "rgba(255,255,255,0.85)",
        marginTop: 2
    },
    menuChevron: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.white,
        marginLeft: 8
    }
});

export default SchoolDashboardMobile;
