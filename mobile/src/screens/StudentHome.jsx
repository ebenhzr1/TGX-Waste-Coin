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
import { FloatingActionButton } from "../components/FloatingActionButton";
import { OfflineBanner } from "../components/OfflineBanner";
import { mobileAPI } from "../api/api";
import { getOfflineQueue, syncOfflineTransactions } from "../services/offlineSyncService";
import { triggerMobileNotification } from "../services/notificationService";

export const StudentHome = ({ navigation, user, onLogout }) => {
    const [dashboard, setDashboard] = useState({
        balance_tgx: 185.5,
        level: "Eco Warrior",
        level_progress: 68,
        badge_count: 5,
        ranking: 3,
        total_waste_kg: 34.2
    });
    const [offlineQueue, setOfflineQueue] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const loadData = async () => {
        try {
            const queue = await getOfflineQueue();
            setOfflineQueue(queue);

            const res = await mobileAPI.getDashboard();
            if (res.data?.dashboard) {
                setDashboard(res.data.dashboard);
            }
        } catch (err) {
            console.warn("Using cached student dashboard data");
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

    const handleManualSync = async () => {
        setIsSyncing(true);
        await syncOfflineTransactions();
        await loadData();
        setIsSyncing(false);
    };

    return (
        <View style={styles.container}>
            {/* Header Profil Siswa */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Halo, Eco Student! 🌱</Text>
                    <Text style={styles.userName}>{user?.name || "Ahmad Santoso"}</Text>
                    <Text style={styles.schoolName}>SDN 2 Bendorejo Trenggalek</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            {/* Offline Banner */}
            <OfflineBanner
                queueLength={offlineQueue.length}
                onSyncPress={handleManualSync}
                isSyncing={isSyncing}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* 1. Saldo TGX Coin Card */}
                <View style={[styles.balanceCard, shadows.card]}>
                    <View style={styles.balanceHeader}>
                        <Text style={styles.balanceTitle}>Saldo Dompet TGX</Text>
                        <View style={styles.coinBadge}>
                            <Text style={styles.coinBadgeText}>🪙 TGX COIN</Text>
                        </View>
                    </View>
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceValue}>{dashboard.balance_tgx || 185.5}</Text>
                        <Text style={styles.balanceCurrency}>TGX</Text>
                    </View>
                    <Text style={styles.balanceEstimate}>≈ Rp {((dashboard.balance_tgx || 185.5) * 1000).toLocaleString("id-ID")} Nilai Reward Terbuka</Text>
                </View>

                {/* Grid Metrik: Level, Badge, Ranking, Total Sampah */}
                <View style={styles.gridRow}>
                    {/* Level */}
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Level Siswa"
                            value={dashboard.level || "Eco Warrior"}
                            unit=""
                            icon={<Text style={{ fontSize: 20 }}>⭐</Text>}
                            badgeText="Lvl 4"
                            badgeColor={colors.mintLight}
                        >
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${dashboard.level_progress || 68}%` }]} />
                            </View>
                            <Text style={styles.progressLabel}>{dashboard.level_progress || 68}% ke Level Master</Text>
                        </CardDashboard>
                    </View>

                    {/* Badge */}
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Lencana"
                            value={dashboard.badge_count || 5}
                            unit="Badge"
                            icon={<Text style={{ fontSize: 20 }}>🏆</Text>}
                            badgeText="Terbuka"
                            badgeColor={colors.warningLight}
                        >
                            <Text style={styles.subText}>2 Lencana baru siap dibuka</Text>
                        </CardDashboard>
                    </View>
                </View>

                <View style={styles.gridRow}>
                    {/* Ranking */}
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Peringkat"
                            value={`#${dashboard.ranking || 3}`}
                            unit="di Sekolah"
                            icon={<Text style={{ fontSize: 20 }}>🎖️</Text>}
                            badgeText="Top 5%"
                            badgeColor={colors.mintLight}
                        />
                    </View>

                    {/* Total Sampah */}
                    <View style={styles.gridCol}>
                        <CardDashboard
                            title="Total Sampah"
                            value={dashboard.total_waste_kg || 34.2}
                            unit="Kg"
                            icon={<Text style={{ fontSize: 20 }}>♻️</Text>}
                            badgeText="Terkumpul"
                            badgeColor={colors.infoLight}
                        />
                    </View>
                </View>

                {/* Action Buttons Section */}
                <View style={styles.actionSection}>
                    <Text style={styles.sectionTitle}>Aksi Cepat Siswa</Text>
                    <View style={styles.actionGrid}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation?.navigate ? navigation.navigate("SubmitWaste") : null}
                            style={[styles.actionCard, { backgroundColor: colors.emerald }]}
                        >
                            <Text style={styles.actionIcon}>📸</Text>
                            <Text style={styles.actionTitle}>Setor Sampah</Text>
                            <Text style={styles.actionDesc}>Foto & Catat GPS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation?.navigate ? navigation.navigate("QRScanner") : null}
                            style={[styles.actionCard, { backgroundColor: colors.forestGreen }]}
                        >
                            <Text style={styles.actionIcon}>📱</Text>
                            <Text style={styles.actionTitle}>Pindai QR</Text>
                            <Text style={styles.actionDesc}>ID Siswa / Drop Point</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Push Notification Simulator Button for Demo Testing */}
                <View style={styles.testNotificationBox}>
                    <Text style={styles.testTitle}>Uji Event Notifikasi Mobile (Sprint 23):</Text>
                    <View style={styles.notifBtnRow}>
                        <TouchableOpacity
                            onPress={() => triggerMobileNotification("coin_received", { amount: 50 })}
                            style={styles.notifBtn}
                        >
                            <Text style={styles.notifBtnText}>+ Koin Masuk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => triggerMobileNotification("badge_earned", { badge_name: "Sahabat Bumi Trenggalek" })}
                            style={styles.notifBtn}
                        >
                            <Text style={styles.notifBtnText}>+ Badge Baru</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => triggerMobileNotification("csr_campaign", { campaign_name: "Green School Movement" })}
                            style={styles.notifBtn}
                        >
                            <Text style={styles.notifBtnText}>+ CSR Info</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <FloatingActionButton
                label="Setor Sampah"
                icon="+"
                onPress={() => navigation?.navigate ? navigation.navigate("SubmitWaste") : null}
            />
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
    greeting: {
        fontSize: 12,
        color: colors.mint,
        fontWeight: "600"
    },
    userName: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.white
    },
    schoolName: {
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
        paddingBottom: 90
    },
    balanceCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    balanceHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    balanceTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.grayText,
        textTransform: "uppercase"
    },
    coinBadge: {
        backgroundColor: colors.warningLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12
    },
    coinBadgeText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#b45309"
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 6
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: "900",
        color: colors.darkGreen
    },
    balanceCurrency: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.forestGreen,
        marginLeft: 8
    },
    balanceEstimate: {
        fontSize: 12,
        color: colors.grayText,
        marginTop: 4
    },
    gridRow: {
        flexDirection: "row",
        marginHorizontal: -spacing.xs
    },
    gridCol: {
        flex: 1,
        paddingHorizontal: spacing.xs
    },
    progressBarBg: {
        height: 6,
        backgroundColor: colors.grayLight,
        borderRadius: 3,
        overflow: "hidden",
        marginTop: 8
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: colors.emerald,
        borderRadius: 3
    },
    progressLabel: {
        fontSize: 10,
        color: colors.grayText,
        marginTop: 4
    },
    subText: {
        fontSize: 11,
        color: colors.grayText,
        marginTop: 4
    },
    actionSection: {
        marginTop: spacing.md
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.sm
    },
    actionGrid: {
        flexDirection: "row",
        gap: spacing.sm
    },
    actionCard: {
        flex: 1,
        borderRadius: 16,
        padding: spacing.md,
        alignItems: "center"
    },
    actionIcon: {
        fontSize: 28,
        marginBottom: 6
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.white
    },
    actionDesc: {
        fontSize: 11,
        color: "rgba(255,255,255,0.85)",
        marginTop: 2
    },
    testNotificationBox: {
        marginTop: spacing.lg,
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    testTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.grayText,
        marginBottom: spacing.xs
    },
    notifBtnRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6
    },
    notifBtn: {
        backgroundColor: colors.grayLight,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 2,
        alignItems: "center"
    },
    notifBtnText: {
        fontSize: 10,
        fontWeight: "700",
        color: colors.darkGreen
    }
});

export default StudentHome;
