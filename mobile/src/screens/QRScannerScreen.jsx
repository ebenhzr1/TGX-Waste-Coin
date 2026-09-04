import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native";
import { colors, spacing, shadows } from "../utils/theme";

export const QRScannerScreen = ({ navigation, onScanResult }) => {
    const [scannedResult, setScannedResult] = useState(null);
    const [scanMode, setScanMode] = useState("student"); // 'student', 'school', 'drop_point'

    const handleBarcodeScanned = (type, data) => {
        let parsed = {
            student_id: null,
            school_id: null,
            location_id: null,
            raw_data: data
        };

        try {
            if (data.startsWith("{") && data.endsWith("}")) {
                const obj = JSON.parse(data);
                parsed = { ...parsed, ...obj };
            } else if (data.startsWith("TGX-STUDENT-")) {
                parsed.student_id = parseInt(data.replace("TGX-STUDENT-", ""));
            } else if (data.startsWith("TGX-SCHOOL-")) {
                parsed.school_id = parseInt(data.replace("TGX-SCHOOL-", ""));
            } else if (data.startsWith("TGX-DROP-")) {
                parsed.location_id = parseInt(data.replace("TGX-DROP-", ""));
            }
        } catch (e) {
            console.warn("QR parsing error:", e);
        }

        setScannedResult(parsed);
        if (onScanResult) {
            onScanResult(parsed);
        }
    };

    // Simulasi scanner cepat untuk pengujian
    const simulateScan = (type) => {
        if (type === "student") {
            handleBarcodeScanned("qr", JSON.stringify({
                student_id: 107,
                student_name: "Ahmad Santoso",
                school_id: 1,
                school_name: "SDN 2 Bendorejo"
            }));
        } else if (type === "school") {
            handleBarcodeScanned("qr", JSON.stringify({
                school_id: 1,
                school_name: "SDN 2 Bendorejo",
                district: "Pogalan, Trenggalek"
            }));
        } else {
            handleBarcodeScanned("qr", JSON.stringify({
                location_id: 501,
                drop_point_name: "Drop Point TPS 3R Surodakan",
                latitude: -8.051234,
                longitude: 111.712345
            }));
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack ? navigation.goBack() : null} style={styles.backBtn}>
                    <Text style={styles.backText}>← Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Pemindai QR TGX</Text>
                <Text style={styles.screenSubtitle}>Scan QR Siswa, Sekolah, & Drop Point TPS</Text>
            </View>

            {/* Mode Selector */}
            <View style={styles.modeTabs}>
                <TouchableOpacity
                    onPress={() => setScanMode("student")}
                    style={[styles.modeTab, scanMode === "student" && styles.modeTabActive]}
                >
                    <Text style={[styles.modeTabText, scanMode === "student" && styles.modeTabTextActive]}>
                        QR Siswa
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setScanMode("school")}
                    style={[styles.modeTab, scanMode === "school" && styles.modeTabActive]}
                >
                    <Text style={[styles.modeTabText, scanMode === "school" && styles.modeTabTextActive]}>
                        QR Sekolah
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setScanMode("drop_point")}
                    style={[styles.modeTab, scanMode === "drop_point" && styles.modeTabActive]}
                >
                    <Text style={[styles.modeTabText, scanMode === "drop_point" && styles.modeTabTextActive]}>
                        Drop Point
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Simulated Camera Viewfinder */}
            <View style={[styles.viewfinderCard, shadows.card]}>
                <View style={styles.viewfinderBox}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <Text style={styles.viewfinderText}>
                        Arahkan kamera ke kode QR {scanMode === "student" ? "Siswa" : scanMode === "school" ? "Sekolah" : "Drop Point"}
                    </Text>
                    <View style={styles.laserLine} />
                </View>
            </View>

            {/* Quick Test Scanner Triggers */}
            <View style={styles.simSection}>
                <Text style={styles.simTitle}>Simulasi Deteksi Barcode / QR (Testing):</Text>
                <View style={styles.simButtonsRow}>
                    <TouchableOpacity
                        onPress={() => simulateScan("student")}
                        style={[styles.simBtn, { backgroundColor: colors.emerald }]}
                    >
                        <Text style={styles.simBtnText}>🎓 Scan Siswa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => simulateScan("school")}
                        style={[styles.simBtn, { backgroundColor: colors.forestGreen }]}
                    >
                        <Text style={styles.simBtnText}>🏫 Scan Sekolah</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => simulateScan("drop_point")}
                        style={[styles.simBtn, { backgroundColor: colors.darkGreen }]}
                    >
                        <Text style={styles.simBtnText}>📍 Drop Point</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scan Output Return Result */}
            {scannedResult ? (
                <View style={[styles.resultCard, shadows.card]}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.resultTitle}>Hasil Pindaian Terverifikasi</Text>
                        <View style={styles.badgeValid}>
                            <Text style={styles.badgeValidText}>VALID</Text>
                        </View>
                    </View>

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>student_id:</Text>
                        <Text style={styles.resultValue}>{scannedResult.student_id ?? "null"}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>school_id:</Text>
                        <Text style={styles.resultValue}>{scannedResult.school_id ?? "null"}</Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>location_id:</Text>
                        <Text style={styles.resultValue}>{scannedResult.location_id ?? "null"}</Text>
                    </View>

                    {scannedResult.student_name ? (
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Nama:</Text>
                            <Text style={styles.resultValue}>{scannedResult.student_name}</Text>
                        </View>
                    ) : null}

                    {scannedResult.school_name ? (
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Sekolah:</Text>
                            <Text style={styles.resultValue}>{scannedResult.school_name}</Text>
                        </View>
                    ) : null}

                    {scannedResult.drop_point_name ? (
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Drop Point:</Text>
                            <Text style={styles.resultValue}>{scannedResult.drop_point_name}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        onPress={() => setScannedResult(null)}
                        style={styles.resetBtn}
                    >
                        <Text style={styles.resetBtnText}>Pindai QR Lain</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc"
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 40
    },
    header: {
        marginBottom: spacing.md
    },
    backBtn: {
        marginBottom: 8
    },
    backText: {
        color: colors.forestGreen,
        fontSize: 14,
        fontWeight: "700"
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.darkGreen
    },
    screenSubtitle: {
        fontSize: 12,
        color: colors.grayText
    },
    modeTabs: {
        flexDirection: "row",
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        padding: 4,
        marginBottom: spacing.md
    },
    modeTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: "center",
        borderRadius: 8
    },
    modeTabActive: {
        backgroundColor: colors.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    modeTabText: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.grayText
    },
    modeTabTextActive: {
        color: colors.darkGreen,
        fontWeight: "700"
    },
    viewfinderCard: {
        backgroundColor: colors.black,
        borderRadius: 20,
        height: 240,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    viewfinderBox: {
        width: 180,
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    corner: {
        position: "absolute",
        width: 24,
        height: 24,
        borderColor: colors.emerald,
        borderWidth: 3
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    viewfinderText: {
        color: colors.white,
        fontSize: 11,
        textAlign: "center",
        paddingHorizontal: 16,
        opacity: 0.8
    },
    laserLine: {
        position: "absolute",
        height: 2,
        width: "90%",
        backgroundColor: colors.emerald,
        opacity: 0.7
    },
    simSection: {
        marginTop: spacing.md
    },
    simTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.grayText,
        marginBottom: 8
    },
    simButtonsRow: {
        flexDirection: "row",
        gap: 8
    },
    simBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center"
    },
    simBtnText: {
        color: colors.white,
        fontSize: 11,
        fontWeight: "700"
    },
    resultCard: {
        marginTop: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    resultHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.sm,
        paddingBottom: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.darkGreen
    },
    badgeValid: {
        backgroundColor: colors.mintLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8
    },
    badgeValidText: {
        fontSize: 10,
        fontWeight: "800",
        color: colors.forestGreen
    },
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4
    },
    resultLabel: {
        fontSize: 12,
        color: colors.grayText,
        fontWeight: "600"
    },
    resultValue: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.darkSlate
    },
    resetBtn: {
        marginTop: spacing.sm,
        backgroundColor: colors.grayLight,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center"
    },
    resetBtnText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.darkGreen
    }
});

export default QRScannerScreen;
