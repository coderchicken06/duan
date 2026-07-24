package com.example.carstore.util;

public final class ImagePathUtils {

    private ImagePathUtils() {
    }

    public static String normalizeForStorage(String image) {
        if (image == null) return null;
        String value = image.trim().replace('\\', '/');
        if (value.isEmpty()) return null;
        if (value.matches("(?i)^(https?:)?//.*") || value.startsWith("data:")) return value;
        value = value.replaceFirst("^/+", "");
        return value.startsWith("images/") ? value.substring("images/".length()) : value;
    }

    public static String resolve(String image) {
        String value = normalizeForStorage(image);
        if (value == null) return "/images/default-car.jpg";
        if (value.matches("(?i)^(https?:)?//.*") || value.startsWith("data:")) return value;
        return "/images/" + value;
    }
}
