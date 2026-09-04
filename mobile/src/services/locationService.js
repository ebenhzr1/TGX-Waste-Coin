/**
 * Location Tracking Service
 * Sprint 23: GPS Latitude, Longitude, Timestamp & Backend Location Logging
 */
import { mobileAPI } from "../api/api";

let Location;
try {
    Location = require("expo-location");
} catch (e) {
    Location = null;
}

// Default Trenggalek Regional GPS Coordinates
const DEFAULT_TRENGGALEK_COORDS = {
    latitude: -8.051234,
    longitude: 111.712345,
    accuracy: 10,
    timestamp: Date.now()
};

/**
 * Minta izin akses lokasi pengguna
 */
export const requestLocationPermission = async () => {
    try {
        if (Location && Location.requestForegroundPermissionsAsync) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            return status === "granted";
        }
        return true;
    } catch (err) {
        console.warn("Location permission warning:", err);
        return true;
    }
};

/**
 * Dapatkan koordinat lokasi GPS saat ini
 */
export const getCurrentCoordinates = async () => {
    try {
        if (Location && Location.getCurrentPositionAsync) {
            const hasPerm = await requestLocationPermission();
            if (hasPerm) {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy?.Balanced || 3
                });
                return {
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    accuracy: loc.coords.accuracy,
                    timestamp: loc.timestamp || Date.now()
                };
            }
        }
    } catch (err) {
        console.warn("Could not get native GPS, using regional reference:", err.message);
    }

    return {
        ...DEFAULT_TRENGGALEK_COORDS,
        timestamp: Date.now()
    };
};

/**
 * Catat koordinat ke backend audit trail
 */
export const recordLocationToBackend = async (activity = "field_activity") => {
    try {
        const coords = await getCurrentCoordinates();
        const response = await mobileAPI.logLocation(coords.latitude, coords.longitude, activity);
        return {
            success: true,
            coords,
            log: response.data?.log
        };
    } catch (error) {
        console.warn("recordLocationToBackend warning:", error.message);
        return {
            success: false,
            coords: DEFAULT_TRENGGALEK_COORDS,
            error: error.message
        };
    }
};

export default {
    requestLocationPermission,
    getCurrentCoordinates,
    recordLocationToBackend,
    DEFAULT_TRENGGALEK_COORDS
};
