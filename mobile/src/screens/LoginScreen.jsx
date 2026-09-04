import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { colors, spacing, shadows } from "../utils/theme";
import { authAPI } from "../api/api";
import { setItem, StorageKeys } from "../utils/storage";
import { registerForPushNotifications } from "../services/notificationService";

export const LoginScreen = ({ navigation, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (overrideEmail = null, overridePassword = null) => {
        const loginEmail = overrideEmail || email;
        const loginPassword = overridePassword || password;

        if (!loginEmail || !loginPassword) {
            setErrorMessage("Email dan password wajib diisi");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await authAPI.login(loginEmail, loginPassword);
            const { token, user } = response.data;

            // Simpan JWT ke AsyncStorage
            await setItem(StorageKeys.AUTH_TOKEN, token);
            await setItem(StorageKeys.USER_PROFILE, user);

            // Register push notification token
            registerForPushNotifications().catch(() => {});

            if (onLoginSuccess) {
                onLoginSuccess(user, token);
            } else if (navigation) {
                const role = (user.role || "student").toLowerCase();
                if (role.includes("admin")) {
                    navigation.replace("AdminMobile");
                } else if (role.includes("school") || role.includes("operator_sekolah")) {
                    navigation.replace("SchoolDashboardMobile");
                } else if (role.includes("collector") || role.includes("lapangan")) {
                    navigation.replace("FieldCollector");
                } else {
                    navigation.replace("StudentHome");
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(error.message || "Email atau password salah");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = (roleKey) => {
        const demoCredentials = {
            student: { email: "ahmad@tgx.id", pass: "password123" },
            school: { email: "sdn2@tgx.id", pass: "password123" },
            collector: { email: "collector@jet.id", pass: "password123" },
            admin: { email: "admin@tgx.id", pass: "admin123" }
        };

        const creds = demoCredentials[roleKey] || demoCredentials.student;
        setEmail(creds.email);
        setPassword(creds.pass);
        handleLogin(creds.email, creds.pass);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Brand Header */}
                <View style={styles.header}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoEmoji}>🌱</Text>
                    </View>
                    <Text style={styles.appName}>TGX Waste Coin</Text>
                    <Text style={styles.appSubtitle}>PT Jwalita Energi Trenggalek</Text>
                    <Text style={styles.tagline}>Mobile Field Operations & Student Eco-Platform</Text>
                </View>

                {/* Login Form Card */}
                <View style={[styles.card, shadows.card]}>
                    <Text style={styles.cardTitle}>Masuk ke Akun Mobile</Text>

                    {errorMessage ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Terdaftar</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="nama@sekolah.id / nama@jet.id"
                            placeholderTextColor={colors.grayText}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={colors.grayText}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                        onPress={() => handleLogin()}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.loginBtnText}>Masuk Sekarang</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Quick Access Persona Demo Buttons */}
                <View style={styles.quickAccessSection}>
                    <Text style={styles.quickAccessTitle}>Login Cepat Pengujian (Role Access):</Text>
                    <View style={styles.quickGrid}>
                        <TouchableOpacity
                            onPress={() => handleQuickLogin("student")}
                            style={[styles.quickBtn, { borderColor: colors.emerald }]}
                        >
                            <Text style={styles.quickBtnEmoji}>🎓</Text>
                            <Text style={styles.quickBtnText}>Siswa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleQuickLogin("school")}
                            style={[styles.quickBtn, { borderColor: colors.forestGreen }]}
                        >
                            <Text style={styles.quickBtnEmoji}>🏫</Text>
                            <Text style={styles.quickBtnText}>Sekolah</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleQuickLogin("collector")}
                            style={[styles.quickBtn, { borderColor: colors.info }]}
                        >
                            <Text style={styles.quickBtnEmoji}>🚛</Text>
                            <Text style={styles.quickBtnText}>Collector</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleQuickLogin("admin")}
                            style={[styles.quickBtn, { borderColor: colors.darkGreen }]}
                        >
                            <Text style={styles.quickBtnEmoji}>🛡️</Text>
                            <Text style={styles.quickBtnText}>Admin JET</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mintLight
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.md,
        justifyContent: "center"
    },
    header: {
        alignItems: "center",
        marginBottom: spacing.lg
    },
    logoBadge: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.emerald,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: spacing.sm,
        shadowColor: colors.darkGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5
    },
    logoEmoji: {
        fontSize: 36
    },
    appName: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.darkGreen,
        letterSpacing: -0.5
    },
    appSubtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.forestGreen,
        marginTop: 2
    },
    tagline: {
        fontSize: 12,
        color: colors.grayText,
        marginTop: 4,
        textAlign: "center"
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.darkSlate,
        marginBottom: spacing.md
    },
    errorBox: {
        backgroundColor: colors.dangerLight,
        padding: spacing.sm,
        borderRadius: 8,
        marginBottom: spacing.md
    },
    errorText: {
        color: colors.danger,
        fontSize: 12,
        fontWeight: "600"
    },
    inputGroup: {
        marginBottom: spacing.md
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.darkSlate,
        marginBottom: 6
    },
    input: {
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: 12,
        fontSize: 14,
        color: colors.black,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    loginBtn: {
        backgroundColor: colors.emerald,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: spacing.sm
    },
    loginBtnDisabled: {
        opacity: 0.7
    },
    loginBtnText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: "700"
    },
    quickAccessSection: {
        marginTop: spacing.lg,
        alignItems: "center"
    },
    quickAccessTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.grayText,
        marginBottom: spacing.sm
    },
    quickGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    quickBtn: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingVertical: 10,
        marginHorizontal: 3,
        alignItems: "center",
        borderWidth: 1.5
    },
    quickBtnEmoji: {
        fontSize: 18,
        marginBottom: 2
    },
    quickBtnText: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.darkSlate
    }
});

export default LoginScreen;
