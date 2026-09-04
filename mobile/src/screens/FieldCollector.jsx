import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    RefreshControl
} from "react-native";
import { colors, spacing, shadows } from "../utils/theme";
import { mobileAPI } from "../api/api";
import { getCurrentCoordinates, recordLocationToBackend } from "../services/locationService";

export const FieldCollector = ({ navigation, user, onLogout }) => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentCoords, setCurrentCoords] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [gpsLogging, setGpsLogging] = useState(false);
    const [feedback, setFeedback] = useState("");

    const fetchPickups = async () => {
        try {
            const res = await mobileAPI.getPickups();
            if (res.data?.pickups) {
                setPickups(res.data.pickups);
            }
        } catch (err) {
            console.warn("fetchPickups error, using fallback pickups:", err.message);
            setPickups([
                {
                    id: 1,
                    tps_name: "TPS 3R Surodakan Trenggalek",
                    school_name: "SDN 2 Bendorejo",
                    address: "Jl. Ki Mangunsarkoro No. 12, Trenggalek",
                    latitude: -8.051234,
                    longitude: 111.712345,
                    waste_type: "Plastik & Kertas",
                    estimated_kg: 85.0,
                    status: "requested",
                    photo_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80"
                },
                {
                    id: 2,
                    tps_name: "TPS Terpadu Karangan",
                    school_name: "SMPN 1 Trenggalek",
                    address: "Jl. Panglima Sudirman No. 45, Trenggalek",
                    latitude: -8.062345,
                    longitude: 111.705432,
                    waste_type: "Organik & Anorganik",
                    estimated_kg: 120.0,
                    status: "picked_up",
                    photo_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80"
                },
                {
                    id: 3,
                    tps_name: "Bank Sampah Induk Trenggalek",
                    school_name: "SMAN 1 Trenggalek",
                    address: "Jl. Soekarno Hatta No. 88, Trenggalek",
                    latitude: -8.045678,
                    longitude: 111.718765,
                    waste_type: "Logam & Elektronik",
                    estimated_kg: 45.0,
                    status: "completed",
                    photo_url: "https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=600&auto=format&fit=crop&q=80"
                }
            ]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPickups();
        handleLogGps();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPickups();
    };

    const handleLogGps = async () => {
        setGpsLogging(true);
        try {
            const loc = await recordLocationToBackend("field_collector_route");
            setCurrentCoords(loc.coords);
            setFeedback(`📍 GPS Tersinkron: ${loc.coords.latitude.toFixed(6)}, ${loc.coords.longitude.toFixed(6)}`);
        } catch (e) {
            console.warn("GPS log error:", e);
        } finally {
            setGpsLogging(false);
        }
    };

    const handleNextStatus = async (item) => {
        let nextStatus = "picked_up";
        if (item.status === "requested") nextStatus = "picked_up";
        else if (item.status === "picked_up") nextStatus = "completed";
        else nextStatus = "completed";

        setUpdatingId(item.id);
        try {
            await mobileAPI.updatePickupStatus(item.id, nextStatus);
            setPickups(prev => prev.map(p => p.id === item.id ? { ...p, status: nextStatus } : p));
            setFeedback(`Status pickup ${item.tps_name} diperbarui menjadi: ${nextStatus.toUpperCase()}`);
            // Otomatis log lokasi saat status berubah
            handleLogGps();
        } catch (err) {
            console.warn("updatePickupStatus error:", err.message);
            setPickups(prev => prev.map(p => p.id === item.id ? { ...p, status: nextStatus } : p));
            setFeedback(`Status pickup ${item.tps_name} diperbarui menjadi: ${nextStatus.toUpperCase()} (Local)`);
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "requested":
                return { bg: colors.warningLight, text: "#b45309", label: "MENUNGGU PICKUP" };
            case "picked_up":
                return { bg: colors.infoLight, text: "#1d4ed8", label: "SEDANG DIANGKUT" };
            case "completed":
                return { bg: colors.mintLight, text: colors.forestGreen, label: "SELESAI DI TPS 3R" };
            default:
                return { bg: colors.grayLight, text: colors.darkSlate, label: status };
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Field Collector */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.badge}>OPERATOR LAPANGAN & LOGISTIK JET</Text>
                    <Text style={styles.headerTitle}>Rute Pengangkutan TPS</Text>
                    <Text style={styles.collectorName}>Petugas: {user?.name || "Operator Lapangan 01"}</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Keluar</Text>
                </TouchableOpacity>
            </View>

            {/* GPS Status Tracker Bar */}
            <View style={styles.gpsBar}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.gpsBarTitle}>Pelacak Rute GPS Lapangan</Text>
                    <Text style={styles.gpsBarCoords}>
                        {currentCoords
                            ? `Lat: ${currentCoords.latitude.toFixed(6)} | Lng: ${currentCoords.longitude.toFixed(6)}`
                            : "Mengambil data satelit GPS..."}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleLogGps}
                    disabled={gpsLogging}
                    style={styles.gpsRefreshBtn}
                >
                    <Text style={styles.gpsRefreshText}>
                        {gpsLogging ? "Logging..." : "📡 Kirim Titik GPS"}
                    </Text>
                </TouchableOpacity>
            </View>

            {feedback ? (
                <View style={styles.feedbackBox}>
                    <Text style={styles.feedbackText}>{feedback}</Text>
                </View>
            ) : null}

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Daftar Titik Penjemputan ({pickups.length})</Text>
                    <Text style={styles.listSubtitle}>Tujuan: Pengolahan Terpadu TPS 3R Trenggalek</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color={colors.emerald} style={{ marginTop: 20 }} />
                ) : (
                    pickups.map((item) => {
                        const statusMeta = getStatusStyle(item.status);
                        return (
                            <View key={item.id} style={[styles.pickupCard, shadows.card]}>
                                {/* Header Card */}
                                <View style={styles.pickupHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.tpsTitle}>{item.tps_name}</Text>
                                        <Text style={styles.schoolOrigin}>Asal: {item.school_name}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                                        <Text style={[styles.statusText, { color: statusMeta.text }]}>
                                            {statusMeta.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* Body Info & Foto TPS */}
                                <View style={styles.pickupBody}>
                                    <View style={styles.pickupDetails}>
                                        <Text style={styles.addressText}>📍 {item.address}</Text>
                                        <Text style={styles.metaRow}>
                                            Jenis: <Text style={{ fontWeight: "700" }}>{item.waste_type}</Text>
                                        </Text>
                                        <Text style={styles.metaRow}>
                                            Estimasi Berat: <Text style={styles.weightText}>{item.estimated_kg} Kg</Text>
                                        </Text>
                                        <Text style={styles.coordsText}>
                                            GPS: {item.latitude}, {item.longitude}
                                        </Text>
                                    </View>

                                    {/* Foto TPS */}
                                    <View style={styles.photoBox}>
                                        <Image
                                            source={{ uri: item.photo_url }}
                                            style={styles.tpsPhoto}
                                        />
                                        <Text style={styles.photoCaption}>Foto TPS</Text>
                                    </View>
                                </View>

                                {/* Lifecycle Action Button */}
                                <View style={styles.actionContainer}>
                                    {item.status === "requested" ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={updatingId === item.id}
                                            onPress={() => handleNextStatus(item)}
                                            style={[styles.btnAction, { backgroundColor: colors.warning }]}
                                        >
                                            <Text style={styles.btnActionText}>🚚 Mulai Angkut (Picked Up)</Text>
                                        </TouchableOpacity>
                                    ) : item.status === "picked_up" ? (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            disabled={updatingId === item.id}
                                            onPress={() => handleNextStatus(item)}
                                            style={[styles.btnAction, { backgroundColor: colors.emerald }]}
                                        >
                                            <Text style={styles.btnActionText}>✅ Selesai Bongkar di TPS 3R (Completed)</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.completedBanner}>
                                            <Text style={styles.completedText}>✨ Telah Selesai Diangkut & Ditimbang</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
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
    collectorName: {
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
    gpsBar: {
        backgroundColor: colors.emeraldDark,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    gpsBarTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.white
    },
    gpsBarCoords: {
        fontSize: 10,
        color: colors.mintLight,
        marginTop: 2
    },
    gpsRefreshBtn: {
        backgroundColor: colors.white,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    gpsRefreshText: {
        fontSize: 11,
        fontWeight: "800",
        color: colors.darkGreen
    },
    feedbackBox: {
        backgroundColor: colors.mintLight,
        padding: 8,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        borderRadius: 8
    },
    feedbackText: {
        fontSize: 11,
        color: colors.darkGreen,
        fontWeight: "700",
        textAlign: "center"
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 40
    },
    listHeader: {
        marginBottom: spacing.sm
    },
    listTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.darkSlate
    },
    listSubtitle: {
        fontSize: 11,
        color: colors.grayText
    },
    pickupCard: {
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    pickupHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight
    },
    tpsTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.darkSlate
    },
    schoolOrigin: {
        fontSize: 12,
        color: colors.forestGreen,
        fontWeight: "600"
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8
    },
    statusText: {
        fontSize: 10,
        fontWeight: "800"
    },
    pickupBody: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacing.sm
    },
    pickupDetails: {
        flex: 1,
        paddingRight: 8
    },
    addressText: {
        fontSize: 11,
        color: colors.darkSlate,
        marginBottom: 4
    },
    metaRow: {
        fontSize: 12,
        color: colors.grayText,
        marginVertical: 1
    },
    weightText: {
        fontSize: 14,
        fontWeight: "800",
        color: colors.darkGreen
    },
    coordsText: {
        fontSize: 10,
        color: colors.grayText,
        marginTop: 4,
        fontFamily: "monospace"
    },
    photoBox: {
        width: 85,
        alignItems: "center"
    },
    tpsPhoto: {
        width: 85,
        height: 65,
        borderRadius: 8,
        backgroundColor: colors.grayLight
    },
    photoCaption: {
        fontSize: 9,
        color: colors.grayText,
        marginTop: 3
    },
    actionContainer: {
        marginTop: 6
    },
    btnAction: {
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    btnActionText: {
        fontSize: 12,
        fontWeight: "800",
        color: colors.white
    },
    completedBanner: {
        backgroundColor: colors.mintLight,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center"
    },
    completedText: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.forestGreen
    }
});

export default FieldCollector;
