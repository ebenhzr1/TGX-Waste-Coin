import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { colors } from "../utils/theme";
import { getItem, setItem, removeItem, StorageKeys } from "../utils/storage";
import { BottomNavigation } from "../components/BottomNavigation";

// Import Screens
import { LoginScreen } from "../screens/LoginScreen";
import { StudentHome } from "../screens/StudentHome";
import { SubmitWasteScreen } from "../screens/SubmitWasteScreen";
import { QRScannerScreen } from "../screens/QRScannerScreen";
import { SchoolDashboardMobile } from "../screens/SchoolDashboardMobile";
import { VerifyWasteScreen } from "../screens/VerifyWasteScreen";
import { FieldCollector } from "../screens/FieldCollector";
import { AdminMobileScreen } from "../screens/AdminMobileScreen";

export const AppNavigator = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState("Login");
    const [history, setHistory] = useState([]);

    // Check stored session
    useEffect(() => {
        const checkAuth = async () => {
            const token = await getItem(StorageKeys.AUTH_TOKEN);
            const user = await getItem(StorageKeys.USER_PROFILE, true);
            if (token && user) {
                setCurrentUser(user);
                routeUserByRole(user);
            } else {
                setCurrentScreen("Login");
            }
        };
        checkAuth();
    }, []);

    const routeUserByRole = (user) => {
        const role = (user.role || "student").toLowerCase();
        if (role.includes("admin")) {
            setCurrentScreen("AdminMobile");
        } else if (role.includes("school") || role.includes("operator_sekolah")) {
            setCurrentScreen("SchoolDashboardMobile");
        } else if (role.includes("collector") || role.includes("lapangan")) {
            setCurrentScreen("FieldCollector");
        } else {
            setCurrentScreen("StudentHome");
        }
    };

    const handleLoginSuccess = (user, token) => {
        setCurrentUser(user);
        routeUserByRole(user);
    };

    const handleLogout = async () => {
        await removeItem(StorageKeys.AUTH_TOKEN);
        await removeItem(StorageKeys.USER_PROFILE);
        setCurrentUser(null);
        setCurrentScreen("Login");
        setHistory([]);
    };

    const navigate = (screenName) => {
        setHistory((prev) => [...prev, currentScreen]);
        setCurrentScreen(screenName);
    };

    const goBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setHistory((prev) => prev.slice(0, -1));
            setCurrentScreen(previous);
        } else if (currentUser) {
            routeUserByRole(currentUser);
        } else {
            setCurrentScreen("Login");
        }
    };

    const navProps = {
        navigate,
        goBack,
        replace: (screenName) => setCurrentScreen(screenName)
    };

    // Bottom Navigation Tabs
    const getTabsForUser = () => {
        if (!currentUser) return [];
        const role = (currentUser.role || "student").toLowerCase();

        if (role.includes("admin")) {
            return [
                { id: "AdminMobile", label: "Executive", icon: "🛡️" },
                { id: "VerifyWaste", label: "Verifikasi", icon: "📋" },
                { id: "FieldCollector", label: "Logistik TPS", icon: "🚛" }
            ];
        }

        if (role.includes("school") || role.includes("operator_sekolah")) {
            return [
                { id: "SchoolDashboardMobile", label: "Sekolah", icon: "🏫" },
                { id: "VerifyWaste", label: "Verifikasi", icon: "📋" },
                { id: "QRScanner", label: "Scan QR", icon: "📷" }
            ];
        }

        if (role.includes("collector") || role.includes("lapangan")) {
            return [
                { id: "FieldCollector", label: "Rute TPS", icon: "🚛" },
                { id: "QRScanner", label: "Scan Drop", icon: "📍" }
            ];
        }

        // Student Tabs
        return [
            { id: "StudentHome", label: "Beranda", icon: "🌱" },
            { id: "SubmitWaste", label: "Setor", icon: "📸" },
            { id: "QRScanner", label: "Scan QR", icon: "📱" }
        ];
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case "Login":
                return <LoginScreen navigation={navProps} onLoginSuccess={handleLoginSuccess} />;
            case "StudentHome":
                return <StudentHome navigation={navProps} user={currentUser} onLogout={handleLogout} />;
            case "SubmitWaste":
                return <SubmitWasteScreen navigation={navProps} user={currentUser} />;
            case "QRScanner":
                return <QRScannerScreen navigation={navProps} />;
            case "SchoolDashboardMobile":
                return <SchoolDashboardMobile navigation={navProps} user={currentUser} onLogout={handleLogout} />;
            case "VerifyWaste":
                return <VerifyWasteScreen navigation={navProps} user={currentUser} />;
            case "FieldCollector":
                return <FieldCollector navigation={navProps} user={currentUser} onLogout={handleLogout} />;
            case "AdminMobile":
                return <AdminMobileScreen navigation={navProps} user={currentUser} onLogout={handleLogout} />;
            default:
                return <StudentHome navigation={navProps} user={currentUser} onLogout={handleLogout} />;
        }
    };

    const tabs = getTabsForUser();
    const showBottomNav = currentScreen !== "Login" && tabs.length > 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={colors.darkGreen} />
            <View style={styles.screenContainer}>{renderScreen()}</View>
            {showBottomNav ? (
                <BottomNavigation
                    activeTab={currentScreen}
                    onTabPress={(tabId) => setCurrentScreen(tabId)}
                    tabs={tabs}
                />
            ) : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.darkGreen
    },
    screenContainer: {
        flex: 1,
        backgroundColor: "#f8fafc"
    }
});

export default AppNavigator;
