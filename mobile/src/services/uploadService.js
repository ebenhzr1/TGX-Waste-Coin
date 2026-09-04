/**
 * Photo Verification & Upload Service
 * Sprint 23: Camera -> Compress Image -> Upload Backend -> Save URL
 */
import { wasteAPI } from "../api/api";

/**
 * Persiapkan dan unggah foto sampah ke backend TGX
 * @param {Object} params 
 * @param {string} params.waste_type
 * @param {number} params.weight_kg
 * @param {string} params.image_uri
 * @param {number} [params.school_id]
 * @param {Object} [params.location] { latitude, longitude }
 */
export const uploadWasteSubmission = async ({
    waste_type,
    weight_kg,
    image_uri,
    school_id,
    location,
    notes
}) => {
    try {
        const formData = new FormData();
        formData.append("waste_type", waste_type);
        formData.append("weight_kg", String(weight_kg));
        
        if (school_id) formData.append("school_id", String(school_id));
        if (notes) formData.append("notes", notes);
        if (location) {
            formData.append("location", JSON.stringify(location));
        }

        if (image_uri) {
            const filename = image_uri.split("/").pop() || "waste_photo.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            // React Native format for file upload
            formData.append("image", {
                uri: image_uri,
                name: filename,
                type
            });
        }

        const response = await wasteAPI.submit(formData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("uploadWasteSubmission error:", error);
        return {
            success: false,
            error: error.message || "Gagal mengunggah setoran sampah",
            isOffline: !!error.isOffline
        };
    }
};

export default {
    uploadWasteSubmission
};
