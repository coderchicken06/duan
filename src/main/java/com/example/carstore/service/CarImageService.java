package com.example.carstore.service;

import com.example.carstore.entity.Car;
import com.example.carstore.entity.CarImage;
import com.example.carstore.repository.CarImageRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.util.ImagePathUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarImageService {

    private final CarImageRepository imageRepo;
    private final CarRepository carRepo;

    public CarImageService(CarImageRepository imageRepo, CarRepository carRepo) {
        this.imageRepo = imageRepo;
        this.carRepo = carRepo;
    }

    @Transactional(readOnly = true)
    public List<CarImage> getImages(Integer carId) {
        requireCar(carId);
        return imageRepo.findImagesByCarId(carId);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public void synchronizeCarImage(Integer carId) {
        Car car = requireCarForUpdate(carId);
        List<CarImage> images = new ArrayList<>(imageRepo.findImagesByCarId(carId));
        String carImage = ImagePathUtils.normalizeForStorage(car.getImage());
        if (images.isEmpty() && carImage != null) {
            CarImage image = new CarImage();
            image.setCarId(carId);
            image.setImageUrl(carImage);
            image.setSortOrder(0);
            image.setPrimaryImage(false);
            image = imageRepo.save(image);
            images.add(image);
            reconcilePrimary(car, images, image.getId());
        } else {
            reconcilePrimary(car, images, null);
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public CarImage addImage(Integer carId, CarImage payload) {
        Car car = requireCarForUpdate(carId);
        String imageUrl = requireImageUrl(payload == null ? null : payload.getImageUrl());
        List<CarImage> current = new ArrayList<>(imageRepo.findImagesByCarId(carId));
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
        image = imageRepo.save(image);
        current.add(image);

        Integer preferredId = Boolean.TRUE.equals(payload.getPrimaryImage()) || currentPrimaryId == null
                ? image.getId() : currentPrimaryId;
        reconcilePrimary(car, current, preferredId);
        return image;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public CarImage updateImage(Integer carId, Integer imageId, CarImage payload) {
        Car car = requireCarForUpdate(carId);
        List<CarImage> current = new ArrayList<>(imageRepo.findImagesByCarId(carId));
        CarImage existing = current.stream()
                .filter(image -> imageId.equals(image.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ảnh"));
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

        reconcilePrimary(car, current, preferredId);
        return existing;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, rollbackFor = Exception.class)
    public void deleteImage(Integer carId, Integer imageId) {
        Car car = requireCarForUpdate(carId);
        List<CarImage> images = new ArrayList<>(imageRepo.findImagesByCarId(carId));
        CarImage image = images.stream()
                .filter(candidate -> imageId.equals(candidate.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ảnh"));
        imageRepo.delete(image);
        images.remove(image);
        reconcilePrimary(car, images, null);
    }

    private void reconcilePrimary(Car car, List<CarImage> images, Integer preferredId) {
        if (images.isEmpty()) {
            car.setImage(null);
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

        for (CarImage image : images) {
            image.setPrimaryImage(primary.getId().equals(image.getId()));
        }
        car.setImage(primary.getImageUrl());
    }

    private Car requireCar(Integer carId) {
        return carRepo.findById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe"));
    }

    private Car requireCarForUpdate(Integer carId) {
        return carRepo.findForUpdateById(carId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy xe"));
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
