import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, shadows, spacing } from "../utils/theme";

export const FloatingActionButton = ({
    label = "Setor Sampah",
    icon = "+",
    onPress,
    style
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={[styles.fab, shadows.fab, style]}
        >
            <Text style={styles.fabIcon}>{icon}</Text>
            {label ? <Text style={styles.fabLabel}>{label}</Text> : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 24,
        right: 20,
        backgroundColor: colors.emerald,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30,
        zIndex: 999
    },
    fabIcon: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.white,
        marginRight: 6
    },
    fabLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: colors.white,
        letterSpacing: 0.3
    }
});

export default FloatingActionButton;
