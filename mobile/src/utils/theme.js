/**
 * PT Jwalita Energi Trenggalek - Mobile UI Theme System
 * Sprint 23: Jwalita Green Environment
 */

export const colors = {
    // Primary Brand Colors
    emerald: "#10b981",
    emeraldDark: "#059669",
    darkGreen: "#064e3b",
    forestGreen: "#047857",
    mint: "#a7f3d0",
    mintLight: "#ecfdf5",

    // Neutrals
    white: "#ffffff",
    black: "#0f172a",
    darkSlate: "#1e293b",
    grayText: "#64748b",
    grayLight: "#f1f5f9",
    grayBorder: "#e2e8f0",

    // Accent Status Colors
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    danger: "#ef4444",
    dangerLight: "#fee2e2",
    info: "#3b82f6",
    infoLight: "#eff6ff",
    gold: "#fbbf24"
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
};

export const typography = {
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.darkGreen
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.darkSlate
    },
    body: {
        fontSize: 14,
        color: colors.darkSlate
    },
    caption: {
        fontSize: 12,
        color: colors.grayText
    },
    button: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.white
    }
};

export const shadows = {
    card: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
    },
    fab: {
        shadowColor: "#064e3b",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6
    }
};

export default {
    colors,
    spacing,
    typography,
    shadows
};
