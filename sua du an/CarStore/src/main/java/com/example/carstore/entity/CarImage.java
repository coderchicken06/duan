package com.example.carstore.entity;

import javax.persistence.*;

@Entity
@Table(name = "CarImage", schema = "dbo")
public class CarImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "car_id", nullable = false)
    private Integer carId;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(name = "is_primary", nullable = false)
    private Boolean primaryImage = false;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getCarId() { return carId; }
    public void setCarId(Integer carId) { this.carId = carId; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getSortOrder() { return sortOrder == null ? 0 : sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder == null ? 0 : sortOrder; }
    public Boolean getPrimaryImage() { return Boolean.TRUE.equals(primaryImage); }
    public void setPrimaryImage(Boolean primaryImage) { this.primaryImage = Boolean.TRUE.equals(primaryImage); }
}
