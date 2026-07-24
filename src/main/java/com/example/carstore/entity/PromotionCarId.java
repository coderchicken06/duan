package com.example.carstore.entity;

import java.io.Serializable;
import java.util.Objects;

public class PromotionCarId implements Serializable {
    private Integer promotionId;
    private Integer carId;

    public PromotionCarId() {
    }

    public PromotionCarId(Integer promotionId, Integer carId) {
        this.promotionId = promotionId;
        this.carId = carId;
    }

    public Integer getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(Integer promotionId) {
        this.promotionId = promotionId;
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof PromotionCarId)) return false;
        PromotionCarId that = (PromotionCarId) other;
        return Objects.equals(promotionId, that.promotionId)
                && Objects.equals(carId, that.carId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(promotionId, carId);
    }
}
