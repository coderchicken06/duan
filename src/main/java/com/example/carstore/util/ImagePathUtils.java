package com.example.carstore.util;

import java.util.Map;

public final class ImagePathUtils {

    private static final Map<String, String> LEGACY_IMAGE_ALIASES = Map.ofEntries(
            Map.entry("x5.jpg", "bmwx5.png"),
            Map.entry("x5.png", "bmwx5.png"),
            Map.entry("x5-gallery1.jpg", "bmwx5-gallery1.png"),
            Map.entry("x5-gallery2.jpg", "bmwx5-gallery2.png"),
            Map.entry("x5-gallery3.jpg", "bmwx5-gallery3.png"),
            Map.entry("x5-gallery4.jpg", "bmwx5-gallery4.png"),
            Map.entry("x5-gallery5.jpg", "bmwx5-gallery5.png"),
            Map.entry("c300.jpg", "mercedesC300.png"),
            Map.entry("c300.png", "mercedesC300.png"),
            Map.entry("c300-gallery1.jpg", "mercedesC300-gallery1.png"),
            Map.entry("c300-gallery2.jpg", "mercedesC300-gallery2.png"),
            Map.entry("c300-gallery3.jpg", "mercedesC300-gallery3.png"),
            Map.entry("c300-gallery4.jpg", "mercedesC300-gallery4.png"),
            Map.entry("c300-gallery5.jpg", "mercedesC300-gallery5.png"),
            Map.entry("bmw3.jpg", "bmw3series.png"),
            Map.entry("bmw3series.jpg", "bmw3series.png"),
            Map.entry("bmw3series.png", "bmw3series.png"),
            Map.entry("bmw3-gallery1.jpg", "bmw3series-gallery1.png"),
            Map.entry("bmw3-gallery2.jpg", "bmw3series-gallery2.png"),
            Map.entry("bmw3-gallery3.jpg", "bmw3series-gallery3.png"),
            Map.entry("bmw3-gallery4.jpg", "bmw3series-gallery4.png"),
            Map.entry("bmw3series-gallery1.jpg", "bmw3series-gallery1.png"),
            Map.entry("bmw3series-gallery2.jpg", "bmw3series-gallery2.png"),
            Map.entry("bmw3series-gallery3.jpg", "bmw3series-gallery3.png"),
            Map.entry("bmw3series-gallery4.jpg", "bmw3series-gallery4.png"),
            Map.entry("civic-gallery1.jpg", "civic-gallery1.png"),
            Map.entry("civic-gallery2.jpg", "civic-gallery2.png"),
            Map.entry("civic-gallery3.jpg", "civic-gallery3.png"),
            Map.entry("civic-gallery4.jpg", "civic-gallery4.png"),
            Map.entry("civic-gallery5.jpg", "civic-gallery5.png"),
            Map.entry("corolla-gallery1.jpg", "Corolla-gallery1.png"),
            Map.entry("corolla-gallery2.jpg", "Corolla-gallery2.png"),
            Map.entry("corolla-gallery3.jpg", "Corolla-gallery3.png"),
            Map.entry("corolla-gallery4.jpg", "Corolla-gallery4.png"),
            Map.entry("corolla-gallery5.jpg", "Corolla-gallery5.png"),
            Map.entry("camry-gallery1.png", "camry-gallery1.jpg"),
            Map.entry("camry-gallery2.jpg", "camry-gallery2.png"),
            Map.entry("camry-gallery3.jpg", "camry-gallery3.png"),
            Map.entry("camry-gallery4.jpg", "camry-gallery4.png"),
            Map.entry("camry-gallery5.jpg", "camry-gallery5.png"),
            Map.entry("wildtrak2025-gallery1.jpg", "Wildtrak2025-gallery1.png"),
            Map.entry("wildtrak2025-gallery2.jpg", "Wildtrak2025-gallery2.png"),
            Map.entry("wildtrak2025-gallery3.jpg", "Wildtrak2025-gallery3.png"),
            Map.entry("wildtrak2025-gallery4.jpg", "Wildtrak2025-gallery4.png"),
            Map.entry("wildtrak2025-gallery5.jpg", "Wildtrak2025-gallery5.png"),
            Map.entry("vf8-gallery1.jpg", "VF8-gallery1.png"),
            Map.entry("vf8-gallery2.jpg", "VF8-gallery2.png"),
            Map.entry("vf8-gallery3.jpg", "VF8-gallery3.png"),
            Map.entry("vf8-gallery4.jpg", "VF8-gallery4.png"),
            Map.entry("vf8-gallery5.jpg", "VF8-gallery5.png"),
            Map.entry("tucson-gallery1.jpg", "Tucson-gallery1.png"),
            Map.entry("tucson-gallery2.jpg", "Tucson-gallery2.png"),
            Map.entry("tucson-gallery3.jpg", "Tucson-gallery3.png"),
            Map.entry("tucson-gallery4.jpg", "Tucson-gallery4.png"),
            Map.entry("tucson-gallery5.jpg", "Tucson-gallery5.png"),
            Map.entry("wildtrak2025.jpg", "Wildtrak2025.png"),
            Map.entry("wildtrak2025.png", "Wildtrak2025.png"),
            Map.entry("vf8.jpg", "VF8.png"),
            Map.entry("vf8.png", "VF8.png"),
            Map.entry("tucson.jpg", "Tucson.png"),
            Map.entry("tucson.png", "Tucson.png"),
            Map.entry("corolla.jpg", "Corolla.png"),
            Map.entry("corolla.png", "Corolla.png"),
            Map.entry("civic.jpg", "civic.png"),
            Map.entry("camry.jpg", "camry.jpg")
    );

    private ImagePathUtils() {
    }

    public static String normalizeForStorage(String image) {
        if (image == null) return null;
        String value = image.trim().replace('\\', '/');
        if (value.isEmpty()) return null;
        if (value.matches("(?i)^(https?:)?//.*") || value.startsWith("data:")) return value;
        value = value.replaceFirst("^/+", "");
        if (value.startsWith("images/")) {
            value = value.substring("images/".length());
        }
        String normalized = LEGACY_IMAGE_ALIASES.getOrDefault(value.toLowerCase(), value);
        return normalized.startsWith("/") ? normalized.substring(1) : normalized;
    }

    public static String resolve(String image) {
        String value = normalizeForStorage(image);
        if (value == null) return "/images/default-car.jpg";
        if (value.matches("(?i)^(https?:)?//.*") || value.startsWith("data:")) return value;
        return "/images/" + value;
    }
}
