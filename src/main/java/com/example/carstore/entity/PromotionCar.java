package com.example.carstore.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@IdClass(PromotionCarId.class)
@Table(name = "PromotionCar", schema = "dbo")
public class PromotionCar {
    @Id
    private Integer promotionId;

    @Id
    private Integer carId;

    public PromotionCar() {
    }

    public PromotionCar(Integer promotionId, Integer carId) {
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
}
