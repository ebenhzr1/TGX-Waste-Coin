import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing } from "../utils/theme";

export const BottomNavigation = ({
    activeTab,
    onTabPress,
    tabs = []
}) => {
    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabPress(tab.id)}
                        activeOpacity={0.7}
                        style={styles.tabButton}
                    >
                        <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                            {tab.icon}
                        </Text>
                        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.grayBorder,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        justifyContent: "space-around",
        alignItems: "center"
    },
    tabButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    tabIcon: {
        fontSize: 20,
        color: colors.grayText,
        marginBottom: 2
    },
    activeTabIcon: {
        color: colors.emerald
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: colors.grayText
    },
    activeTabLabel: {
        color: colors.darkGreen,
        fontWeight: "700"
    }
});

export default BottomNavigation;
