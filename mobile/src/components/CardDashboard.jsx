import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, shadows, spacing } from "../utils/theme";

export const CardDashboard = ({
    title,
    subtitle,
    value,
    unit = "",
    icon = null,
    backgroundColor = colors.white,
    textColor = colors.darkGreen,
    onPress,
    badgeText = null,
    badgeColor = colors.mintLight,
    children
}) => {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                { backgroundColor },
                shadows.card
            ]}
        >
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    {icon && <View style={styles.iconWrapper}>{icon}</View>}
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                    </View>
                </View>
                {badgeText && (
                    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.badgeText}>{badgeText}</Text>
                    </View>
                )}
            </View>

            {value !== undefined && (
                <View style={styles.valueRow}>
                    <Text style={[styles.value, { color: textColor }]}>
                        {value}
                    </Text>
                    {unit ? <Text style={styles.unit}>{unit}</Text> : null}
                </View>
            )}

            {children && <View style={styles.childrenContainer}>{children}</View>}
        </Component>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: spacing.md,
        marginVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.grayBorder
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    iconWrapper: {
        marginRight: spacing.sm
    },
    title: {
        fontSize: 13,
        fontWeight: "600",
        color: colors.grayText,
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    subtitle: {
        fontSize: 12,
        color: colors.darkSlate,
        marginTop: 2
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.darkGreen
    },
    valueRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: spacing.xs
    },
    value: {
        fontSize: 28,
        fontWeight: "800"
    },
    unit: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.grayText,
        marginLeft: 6
    },
    childrenContainer: {
        marginTop: spacing.sm
    }
});

export default CardDashboard;
