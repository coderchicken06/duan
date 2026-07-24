package com.example.carstore.entity;

public class CartItem {

    private Integer id;
    private String name;
    private double price;
    private int quantity;
    private String image;
    private Integer year;
    private String bodyType;
    private String color;
    private Integer stock;

    public CartItem() {}

    public CartItem(Integer id, String name, double price, int quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    public CartItem(Integer id, String name, double price, int quantity,
            String image, Integer year, String bodyType, String color, Integer stock) {
        this(id, name, price, quantity);
        this.image = image;
        this.year = year;
        this.bodyType = bodyType;
        this.color = color;
        this.stock = stock;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
