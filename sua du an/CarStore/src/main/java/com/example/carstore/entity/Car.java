package com.example.carstore.entity;

import javax.persistence.*;
import com.example.carstore.util.ImagePathUtils;

@Entity
@Table(name = "Car", schema = "dbo")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private Double price;
    private String image;
    private String description;
    @Column(name = "brand_id", nullable = false)
    private Integer brandId;

    @Column(name = "year")
    private Integer year;

    private String color;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "first_registration")
    private String firstRegistration;

    private Integer mileage;

    @Column(name = "engine_type")
    private String engineType;

    @Column(name = "engine_capacity")
    private String engineCapacity;

    @Column(name = "interior_color")
    private String interiorColor;

    @Column(name = "body_type")
    private String bodyType;

    private Integer seats;
    private String drivetrain;
    private String transmission;

    private Integer horsepower;
    private String torque;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "fuel_consumption")
    private String fuelConsumption;

    private String warranty;

    @Column(name = "dealer_name")
    private String dealerName;

    @Column(name = "dealer_address")
    private String dealerAddress;

    @Column(name = "inspection_level")
    private String inspectionLevel;

    @Column(name = "inspection_note")
    private String inspectionNote;

    @Column(name = "safety_features")
    private String safetyFeatures;

    @Column(name = "comfort_features")
    private String comfortFeatures;

    public Car() {
    }

    public Car(Integer id, String name, Double price, String image, String description,
            Integer brandId, Integer year, String color) {
        this(id, name, price, image, description, brandId, year, color, 0);
    }

    public Car(Integer id, String name, Double price, String image, String description,
            Integer brandId, Integer year, String color, Integer stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.brandId = brandId;
        this.year = year;
        this.color = color;
        this.stock = stock == null ? 0 : stock;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    @Transient
    public String getImageUrl() {
        return ImagePathUtils.resolve(image);
    }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getBrandId() { return brandId; }
    public void setBrandId(Integer brandId) { this.brandId = brandId; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Integer getStock() { return stock == null ? 0 : stock; }
    public void setStock(Integer stock) { this.stock = stock == null ? 0 : stock; }
    public String getFirstRegistration() { return firstRegistration; }
    public void setFirstRegistration(String firstRegistration) { this.firstRegistration = firstRegistration; }
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }
    public String getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(String engineCapacity) { this.engineCapacity = engineCapacity; }
    public String getInteriorColor() { return interiorColor; }
    public void setInteriorColor(String interiorColor) { this.interiorColor = interiorColor; }
    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }
    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }
    public String getDrivetrain() { return drivetrain; }
    public void setDrivetrain(String drivetrain) { this.drivetrain = drivetrain; }
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public Integer getHorsepower() { return horsepower; }
    public void setHorsepower(Integer horsepower) { this.horsepower = horsepower; }
    public String getTorque() { return torque; }
    public void setTorque(String torque) { this.torque = torque; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public String getFuelConsumption() { return fuelConsumption; }
    public void setFuelConsumption(String fuelConsumption) { this.fuelConsumption = fuelConsumption; }
    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }
    public String getDealerName() { return dealerName; }
    public void setDealerName(String dealerName) { this.dealerName = dealerName; }
    public String getDealerAddress() { return dealerAddress; }
    public void setDealerAddress(String dealerAddress) { this.dealerAddress = dealerAddress; }
    public String getInspectionLevel() { return inspectionLevel; }
    public void setInspectionLevel(String inspectionLevel) { this.inspectionLevel = inspectionLevel; }
    public String getInspectionNote() { return inspectionNote; }
    public void setInspectionNote(String inspectionNote) { this.inspectionNote = inspectionNote; }
    public String getSafetyFeatures() { return safetyFeatures; }
    public void setSafetyFeatures(String safetyFeatures) { this.safetyFeatures = safetyFeatures; }
    public String getComfortFeatures() { return comfortFeatures; }
    public void setComfortFeatures(String comfortFeatures) { this.comfortFeatures = comfortFeatures; }
}
