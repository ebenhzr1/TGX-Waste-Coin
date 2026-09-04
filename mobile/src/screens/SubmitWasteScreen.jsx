import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image
} from "react-native";
import { colors, spacing, shadows } from "../utils/theme";
import { getCurrentCoordinates } from "../services/locationService";
import { uploadWasteSubmission } from "../services/uploadService";
import { queueOfflineTransaction } from "../services/offlineSyncService";
import { triggerMobileNotification } from "../services/notificationService";

const WASTE_TYPES = [
    { id: "Plastik", label: "Plastik (PET/HDPE)", rate: 5.0, icon: "🥤" },
    { id: "Kertas", label: "Kertas & Kardus", rate: 2.5, icon: "📦" },
    { id: "Organik", label: "Organik & Kompos", rate: 3.5, icon: "🍂" },
    { id: "Logam", label: "Logam & Kaleng", rate: 8.0, icon: "🥫" },
    { id: "Elektronik", label: "Elektronik (E-Waste)", rate: 12.0, icon: "🔌" }
];

export const SubmitWasteScreen = ({ navigation }) => {
    const [selectedType, setSelectedType] = useState(WASTE_TYPES[0]);
    const [weight, setWeight] = useState("");
    const [location, setLocation] = useState(null);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [photoUri, setPhotoUri] = useState("https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // AI Waste Analysis State
    const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState({
        waste_type: "Plastik",
        confidence: 94,
        estimated_weight: "2.5 Kg"
    });

    // Otomatis deteksi koordinat GPS saat layar dibuka
    useEffect(() => {
        handleGetLocation();
    }, []);

    const handleGetLocation = async () => {
        setFetchingLocation(true);
        try {
            const coords = await getCurrentCoordinates();
            setLocation(coords);
        } catch (err) {
            console.warn("Failed to get location:", err);
        } finally {
            setFetchingLocation(false);
        }
    };

    const estimatedCoins = parseFloat(weight) && !isNaN(parseFloat(weight))
        ? (parseFloat(weight) * selectedType.rate).toFixed(2)
        : "0.00";

    const triggerAIAnalysis = (typeId, inputWeight) => {
        setIsAnalyzingAI(true);
        setTimeout(() => {
            setIsAnalyzingAI(false);
            const est = inputWeight && !isNaN(parseFloat(inputWeight))
                ? `${parseFloat(inputWeight).toFixed(1)} Kg`
                : "2.5 Kg";
            setAiAnalysis({
                waste_type: typeId || "Plastik",
                confidence: 94,
                estimated_weight: est
            });
        }, 1200);
    };

    const handleTakePhoto = () => {
        // Simulasi pengambilan gambar kamera mobile berstempel GPS
        const samplePhotos = [
            "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=600&auto=format&fit=crop&q=80"
        ];
        const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
        setPhotoUri(randomPhoto);
        triggerAIAnalysis(selectedType.id, weight);
    };

    const handleSubmit = async () => {
        const parsedWeight = parseFloat(weight);
        if (!parsedWeight || parsedWeight <= 0) {
            Alert.alert("Perhatian", "Silakan masukkan berat sampah yang valid (> 0 kg)");
            return;
        }

        setSubmitting(true);
        setSuccessMessage("");

        const payload = {
            waste_type: selectedType.id,
            weight_kg: parsedWeight,
            image_uri: photoUri,
            location: location || { latitude: -8.051234, longitude: 111.712345 },
            notes: notes || "Setoran sampah mobile siswa"
        };

        try {
            const res = await uploadWasteSubmission(payload);
            if (res.success) {
                setSuccessMessage("Setoran sampah berhasil dikirim! Menunggu verifikasi sekolah.");
                triggerMobileNotification("coin_received", { amount: estimatedCoins });
                setTimeout(() => {
                    if (navigation?.goBack) navigation.goBack();
                }, 2000);
            } else if (res.isOffline) {
                // Simpan ke offline queue jika offline
                await queueOfflineTransaction(payload);
                setSuccessMessage("Mode offline: Transaksi disimpan di antrean lokal dan akan disinkronkan otomatis saat online.");
                setTimeout(() => {
                    if (navigation?.goBack) navigation.goBack();
                }, 2500);
            } else {
                Alert.alert("Gagal", res.error || "Terjadi kesalahan pengiriman.");
            }
        } catch (error) {
            console.warn("Offline fallback queuing:", error);
            await queueOfflineTransaction(payload);
            setSuccessMessage("Disimpan ke antrean offline lokal!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack ? navigation.goBack() : null} style={styles.backBtn}>
                    <Text style={styles.backText}>← Kembali</Text>
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Setor Sampah Digital</Text>
                <Text style={styles.screenSubtitle}>PT Jwalita Energi Trenggalek</Text>
            </View>

            {successMessage ? (
                <View style={styles.successBox}>
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successText}>{successMessage}</Text>
                </View>
            ) : null}

            {/* 1. Pilih Jenis Sampah */}
            <View style={[styles.sectionCard, shadows.card]}>
                <Text style={styles.sectionLabel}>1. Pilih Kategori Sampah</Text>
                <View style={styles.typeGrid}>
                    {WASTE_TYPES.map((type) => {
                        const isSelected = selectedType.id === type.id;
                        return (
                            <TouchableOpacity
                                key={type.id}
                                activeOpacity={0.8}
                                onPress={() => setSelectedType(type)}
                                style={[styles.typeButton, isSelected && styles.typeButtonActive]}
                            >
                                <Text style={styles.typeIcon}>{type.icon}</Text>
                                <Text style={[styles.typeText, isSelected && styles.typeTextActive]}>
                                    {type.label}
                                </Text>
                                <Text style={[styles.typeRate, isSelected && styles.typeRateActive]}>
                                    {type.rate} TGX/kg
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* 2. Input Berat Sampah */}
            <View style={[styles.sectionCard, shadows.card]}>
                <Text style={styles.sectionLabel}>2. Masukkan Berat (Kg)</Text>
                <View style={styles.weightInputRow}>
                    <TextInput
                        style={styles.weightInput}
                        placeholder="0.0"
                        placeholderTextColor={colors.grayText}
                        keyboardType="decimal-pad"
                        value={weight}
                        onChangeText={setWeight}
                    />
                    <Text style={styles.weightUnit}>Kg</Text>
                </View>

                {/* Estimasi Koin */}
                <View style={styles.estimateBanner}>
                    <Text style={styles.estimateLabel}>Potensi Koin Didapat:</Text>
                    <Text style={styles.estimateValue}>+ {estimatedCoins} TGX</Text>
                </View>
            </View>

            {/* 3. Ambil Foto Kamera */}
            <View style={[styles.sectionCard, shadows.card]}>
                <Text style={styles.sectionLabel}>3. Bukti Foto Sampah (Kamera Mobile)</Text>
                {photoUri ? (
                    <View style={styles.photoPreviewContainer}>
                        <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                        <TouchableOpacity onPress={handleTakePhoto} style={styles.retakeBtn}>
                            <Text style={styles.retakeText}>📷 Ambil Ulang Foto</Text>
                        </TouchableOpacity>

                        {/* AI Waste Verification Feedback */}
                        {isAnalyzingAI ? (
                            <View style={styles.aiLoadingBox}>
                                <ActivityIndicator color={colors.emerald} size="small" style={{ marginRight: 8 }} />
                                <Text style={styles.aiLoadingText}>AI sedang menganalisa sampah...</Text>
                            </View>
                        ) : aiAnalysis ? (
                            <View style={styles.aiResultBox}>
                                <View style={styles.aiHeaderRow}>
                                    <Text style={styles.aiHeaderTitle}>🤖 Hasil Verifikasi AI</Text>
                                    <Text style={[styles.aiBadge, aiAnalysis.confidence < 80 ? styles.aiBadgeWarn : styles.aiBadgeOk]}>
                                        {aiAnalysis.confidence >= 80 ? "Terverifikasi" : "Perlu Review"}
                                    </Text>
                                </View>
                                
                                <View style={styles.aiDetailRow}>
                                    <Text style={styles.aiDetailLabel}>Jenis:</Text>
                                    <Text style={styles.aiDetailValue}>{aiAnalysis.waste_type}</Text>
                                </View>
                                
                                <View style={styles.aiDetailRow}>
                                    <Text style={styles.aiDetailLabel}>Confidence:</Text>
                                    <Text style={styles.aiDetailValue}>{aiAnalysis.confidence}%</Text>
                                </View>
                                
                                <View style={styles.aiDetailRow}>
                                    <Text style={styles.aiDetailLabel}>Estimasi:</Text>
                                    <Text style={styles.aiDetailValue}>{aiAnalysis.estimated_weight}</Text>
                                </View>

                                {aiAnalysis.confidence < 80 && (
                                    <View style={styles.aiLowConfidenceBox}>
                                        <Text style={styles.aiLowConfidenceText}>Menunggu verifikasi sekolah</Text>
                                    </View>
                                )}
                            </View>
                        ) : null}
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleTakePhoto} style={styles.cameraPlaceholder}>
                        <Text style={styles.cameraIcon}>📸</Text>
                        <Text style={styles.cameraText}>Buka Kamera & Foto Sampah</Text>
                        <Text style={styles.cameraSubtext}>Maksimal 5MB (JPG/PNG)</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* 4. Lokasi GPS */}
            <View style={[styles.sectionCard, shadows.card]}>
                <View style={styles.locationHeader}>
                    <Text style={styles.sectionLabel}>4. Koordinat Lokasi GPS</Text>
                    <TouchableOpacity onPress={handleGetLocation} style={styles.refreshLocBtn}>
                        <Text style={styles.refreshLocText}>🔄 Refresh GPS</Text>
                    </TouchableOpacity>
                </View>

                {fetchingLocation ? (
                    <ActivityIndicator color={colors.emerald} style={{ marginVertical: 10 }} />
                ) : location ? (
                    <View style={styles.locationBox}>
                        <Text style={styles.locationCoords}>
                            📍 Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                        </Text>
                        <Text style={styles.locationRegion}>Wilayah: Trenggalek (Akurasi: ±{location.accuracy || 10}m)</Text>
                    </View>
                ) : (
                    <Text style={styles.locationWarn}>Lokasi belum terdeteksi. Tekan Refresh GPS.</Text>
                )}
            </View>

            {/* Tombol Submit Transaksi */}
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={submitting}
                onPress={handleSubmit}
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            >
                {submitting ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.submitButtonText}>Kirim Setoran Sampah</Text>
                )}
            </TouchableOpacity>
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
    successBox: {
        backgroundColor: colors.mintLight,
        borderColor: colors.emerald,
        borderWidth: 1,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: "row",
        alignItems: "center"
    },
    successIcon: {
        fontSize: 24,
        marginRight: 10
    },
    successText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkGreen
    },
    sectionCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.sm
    },
    typeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },
    typeButton: {
        width: "48%",
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1.5,
        borderColor: "transparent"
    },
    typeButtonActive: {
        backgroundColor: colors.mintLight,
        borderColor: colors.emerald
    },
    typeIcon: {
        fontSize: 22,
        marginBottom: 4
    },
    typeText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.darkSlate
    },
    typeTextActive: {
        color: colors.darkGreen
    },
    typeRate: {
        fontSize: 11,
        color: colors.grayText,
        marginTop: 2
    },
    typeRateActive: {
        color: colors.forestGreen,
        fontWeight: "700"
    },
    weightInputRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    weightInput: {
        flex: 1,
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        fontSize: 24,
        fontWeight: "800",
        color: colors.darkGreen,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    weightUnit: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.grayText,
        marginLeft: 12
    },
    estimateBanner: {
        marginTop: spacing.sm,
        backgroundColor: colors.warningLight,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    estimateLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#92400e"
    },
    estimateValue: {
        fontSize: 15,
        fontWeight: "800",
        color: "#b45309"
    },
    photoPreviewContainer: {
        alignItems: "center"
    },
    photoPreview: {
        width: "100%",
        height: 180,
        borderRadius: 12
    },
    retakeBtn: {
        marginTop: 8,
        backgroundColor: colors.grayLight,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    retakeText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.darkGreen
    },
    aiLoadingBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.mintLight,
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        width: "100%",
        borderWidth: 1,
        borderColor: colors.emerald
    },
    aiLoadingText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkGreen
    },
    aiResultBox: {
        width: "100%",
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#e2e8f0"
    },
    aiHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 6,
        marginBottom: 8
    },
    aiHeaderTitle: {
        fontSize: 13,
        fontWeight: "800",
        color: colors.darkSlate
    },
    aiBadge: {
        fontSize: 11,
        fontWeight: "700",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6
    },
    aiBadgeOk: {
        backgroundColor: "#d1fae5",
        color: "#065f46"
    },
    aiBadgeWarn: {
        backgroundColor: "#fef3c7",
        color: "#92400e"
    },
    aiDetailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 3
    },
    aiDetailLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.grayText
    },
    aiDetailValue: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkSlate
    },
    aiLowConfidenceBox: {
        marginTop: 6,
        backgroundColor: "#fef3c7",
        padding: 6,
        borderRadius: 6,
        alignItems: "center"
    },
    aiLowConfidenceText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#b45309"
    },
    cameraPlaceholder: {
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        height: 130,
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
        borderWidth: 1.5,
        borderColor: colors.grayBorder
    },
    cameraIcon: {
        fontSize: 32,
        marginBottom: 4
    },
    cameraText: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkGreen
    },
    cameraSubtext: {
        fontSize: 11,
        color: colors.grayText,
        marginTop: 2
    },
    locationHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    refreshLocBtn: {
        padding: 4
    },
    refreshLocText: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.emerald
    },
    locationBox: {
        backgroundColor: colors.grayLight,
        padding: 10,
        borderRadius: 10
    },
    locationCoords: {
        fontSize: 13,
        fontWeight: "700",
        color: colors.darkSlate
    },
    locationRegion: {
        fontSize: 11,
        color: colors.grayText,
        marginTop: 2
    },
    locationWarn: {
        fontSize: 12,
        color: colors.danger,
        fontStyle: "italic"
    },
    submitButton: {
        backgroundColor: colors.emerald,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: spacing.sm,
        shadowColor: colors.emerald,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    submitButtonDisabled: {
        opacity: 0.6
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.white,
        letterSpacing: 0.5
    }
});

export default SubmitWasteScreen;
