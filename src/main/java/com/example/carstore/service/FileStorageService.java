package com.example.carstore.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "webp");
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;

    public String saveImage(MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Ảnh không được vượt quá 5 MB");
        }
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("File tải lên phải là hình ảnh");
        }

        String original = file.getOriginalFilename();
        if (!StringUtils.hasText(original)) {
            throw new IllegalArgumentException("Tên file không hợp lệ");
        }

        String cleanFileName = Paths.get(original).getFileName().toString();
        int dot = cleanFileName.lastIndexOf(".");
        if (dot < 0) {
            throw new IllegalArgumentException("File ảnh phải có đuôi");
        }

        String extension = cleanFileName.substring(dot + 1).toLowerCase();

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Chỉ cho phép ảnh jpg, jpeg, png, gif, webp");
        }

        String filename = UUID.randomUUID() + "." + extension;

        Path imagesDir = Paths.get("src/main/resources/static/images");
        Files.createDirectories(imagesDir);

        Path targetPath = imagesDir.resolve(filename);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }

        Path runtimeDir = Paths.get(
                System.getProperty("user.dir"),
                "target",
                "classes",
                "static",
                "images");
        Files.createDirectories(runtimeDir);
        Files.copy(targetPath, runtimeDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }
}
