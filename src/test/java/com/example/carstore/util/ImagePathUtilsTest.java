package com.example.carstore.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ImagePathUtilsTest {

    @Test
    void normalizesLocalImagePathsForDatabaseStorage() {
        assertEquals("cars/demo.jpg", ImagePathUtils.normalizeForStorage("\\images\\cars\\demo.jpg"));
        assertEquals("demo.jpg", ImagePathUtils.normalizeForStorage("/images/demo.jpg"));
    }

    @Test
    void preservesRemoteUrlsAndUsesNeutralPlaceholderForMissingImage() {
        assertEquals("https://cdn.example.test/car.jpg",
                ImagePathUtils.normalizeForStorage("https://cdn.example.test/car.jpg"));
        assertEquals("/images/default-car.jpg", ImagePathUtils.resolve(" "));
        assertNull(ImagePathUtils.normalizeForStorage(null));
    }

    @Test
    void resolvesStoredFilenameToPublicImagePath() {
        assertEquals("/images/demo.jpg", ImagePathUtils.resolve("demo.jpg"));
        assertEquals("/images/demo.jpg", ImagePathUtils.resolve("/images/demo.jpg"));
    }
}
