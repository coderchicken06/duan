package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CarImage;
import com.example.carstore.repository.CarImageRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ImagePathUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarImageService {

    private final CarImageRepository imageRepo;
    private final CarRepository carRepo;

    public CarImageService(CarImageRepository imageRepo, CarRepository carRepo) {
        this.imageRepo = imageRepo;
        this.carRepo = carRepo;
    }

    @Transactional
    public List<CarImage> getImages(Integer carId) {
        requireCar(carId);
        reconcilePrimary(carId, null);
        return imageRepo.findImagesByCarId(carId);
    }

    @Transactional
    public void synchronizeCarImage(Integer carId) {
        Car car = requireCar(carId);
        List<CarImage> images = imageRepo.findImagesByCarId(carId);
        String carImage = ImagePathUtils.normalizeForStorage(car.getImage());
        if (images.isEmpty() && carImage != null) {
            CarImage image = new CarImage();
            image.setCarId(carId);
            image.setImageUrl(carImage);
            image.setSortOrder(0);
            image.setPrimaryImage(false);
            image = imageRepo.saveAndFlush(image);
            reconcilePrimary(carId, image.getId());
            return;
        }
        reconcilePrimary(carId, null);
    }

    @Transactional
    public CarImage addImage(Integer carId, CarImage payload) {
        requireCar(carId);
        String imageUrl = requireImageUrl(payload == null ? null : payload.getImageUrl());
        List<CarImage> current = imageRepo.findImagesByCarId(carId);
        rejectDuplicate(current, imageUrl, null);

        Integer currentPrimaryId = current.stream()
                .filter(image -> Boolean.TRUE.equals(image.getPrimaryImage()))
                .map(CarImage::getId)
                .findFirst()
                .orElse(null);

        CarImage image = new CarImage();
        image.setCarId(carId);
        image.setImageUrl(imageUrl);
        image.setSortOrder(payload.getSortOrder());
        image.setPrimaryImage(false);
        image = imageRepo.saveAndFlush(image);

        Integer preferredId = Boolean.TRUE.equals(payload.getPrimaryImage()) || currentPrimaryId == null
                ? image.getId() : currentPrimaryId;
        reconcilePrimary(carId, preferredId);
        return imageRepo.findById(image.getId()).orElseThrow();
    }

    @Transactional
    public CarImage updateImage(Integer carId, Integer imageId, CarImage payload) {
        requireCar(carId);
        CarImage existing = requireImage(carId, imageId);
        List<CarImage> current = imageRepo.findImagesByCarId(carId);
        Integer currentPrimaryId = current.stream()
                .filter(image -> Boolean.TRUE.equals(image.getPrimaryImage()))
                .map(CarImage::getId)
                .findFirst()
                .orElse(null);

        String imageUrl = requireImageUrl(payload == null ? null : payload.getImageUrl());
        rejectDuplicate(current, imageUrl, imageId);
        existing.setImageUrl(imageUrl);
        existing.setSortOrder(payload.getSortOrder());
        existing.setPrimaryImage(false);
        imageRepo.saveAndFlush(existing);

        Integer preferredId;
        if (Boolean.TRUE.equals(payload.getPrimaryImage())) {
            preferredId = imageId;
        } else if (currentPrimaryId != null && !currentPrimaryId.equals(imageId)) {
            preferredId = currentPrimaryId;
        } else {
            preferredId = current.stream()
                    .map(CarImage::getId)
                    .filter(id -> !id.equals(imageId))
                    .findFirst()
                    .orElse(imageId);
        }

        reconcilePrimary(carId, preferredId);
        return imageRepo.findById(imageId).orElseThrow();
    }

    @Transactional
    public void deleteImage(Integer carId, Integer imageId) {
        requireCar(carId);
        CarImage image = requireImage(carId, imageId);
        imageRepo.delete(image);
        imageRepo.flush();
        reconcilePrimary(carId, null);
    }

    private void reconcilePrimary(Integer carId, Integer preferredId) {
        List<CarImage> images = imageRepo.findImagesByCarId(carId);
        if (images.isEmpty()) {
            syncCarImage(carId, null);
            return;
        }

        CarImage primary = preferredId == null ? null : images.stream()
                .filter(image -> preferredId.equals(image.getId()))
                .findFirst()
                .orElse(null);
        if (primary == null) {
            primary = images.stream()
                    .filter(image -> Boolean.TRUE.equals(image.getPrimaryImage()))
                    .findFirst()
                    .orElse(images.get(0));
        }

        Integer primaryId = primary.getId();
        String primaryUrl = primary.getImageUrl();
        imageRepo.clearPrimaryByCarId(carId);
        CarImage selected = imageRepo.findById(primaryId).orElseThrow();
        selected.setPrimaryImage(true);
        imageRepo.saveAndFlush(selected);
        syncCarImage(carId, primaryUrl);
    }

    private void syncCarImage(Integer carId, String imageUrl) {
        Car car = requireCar(carId);
        car.setImage(imageUrl);
        carRepo.save(car);
    }

    private Car requireCar(Integer carId) {
        return carRepo.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe"));
    }

    private CarImage requireImage(Integer carId, Integer imageId) {
        return imageRepo.findById(imageId)
                .filter(image -> image.getCarId().equals(carId))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ảnh"));
    }

    private String requireImageUrl(String imageUrl) {
        String normalized = ImagePathUtils.normalizeForStorage(imageUrl);
        if (normalized == null) throw new IllegalArgumentException("Ảnh không được để trống");
        return normalized;
    }

    private void rejectDuplicate(List<CarImage> images, String imageUrl, Integer ignoredId) {
        boolean duplicate = images.stream()
                .filter(image -> ignoredId == null || !ignoredId.equals(image.getId()))
                .map(CarImage::getImageUrl)
                .map(ImagePathUtils::normalizeForStorage)
                .anyMatch(imageUrl::equalsIgnoreCase);
        if (duplicate) throw new IllegalArgumentException("Ảnh này đã tồn tại");
    }
}
