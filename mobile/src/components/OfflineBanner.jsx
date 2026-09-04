import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing } from "../utils/theme";

export const OfflineBanner = ({
    queueLength = 0,
    onSyncPress,
    isSyncing = false
}) => {
    if (queueLength === 0) return null;

    return (
        <View style={styles.banner}>
            <View style={styles.textContainer}>
                <Text style={styles.icon}>📡</Text>
                <View>
                    <Text style={styles.title}>Mode Offline Aktif</Text>
                    <Text style={styles.desc}>{queueLength} setoran tersimpan lokal di antrean</Text>
                </View>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={isSyncing}
                onPress={onSyncPress}
                style={[styles.syncButton, isSyncing && styles.syncingButton]}
            >
                <Text style={styles.syncButtonText}>
                    {isSyncing ? "Syncing..." : "Sync Sekarang"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: colors.warningLight,
        borderColor: colors.warning,
        borderWidth: 1,
        borderRadius: 12,
        padding: spacing.sm,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    icon: {
        fontSize: 20,
        marginRight: spacing.sm
    },
    title: {
        fontSize: 13,
        fontWeight: "700",
        color: "#92400e"
    },
    desc: {
        fontSize: 11,
        color: "#78350f"
    },
    syncButton: {
        backgroundColor: colors.warning,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    syncingButton: {
        opacity: 0.6
    },
    syncButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: "700"
    }
});

export default OfflineBanner;
