package com.example.carstore.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Review", schema = "dbo")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    @Column(name = "car_id") private Integer carId;
    private Integer rating;
    private String comment;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "review_date") private Date reviewDate;
    public Integer getId(){return id;} public void setId(Integer id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String username){this.username=username;}
    public Integer getCarId(){return carId;} public void setCarId(Integer carId){this.carId=carId;}
    public Integer getRating(){return rating;} public void setRating(Integer rating){this.rating=rating;}
    public String getComment(){return comment;} public void setComment(String comment){this.comment=comment;}
    public Date getReviewDate(){return reviewDate;} public void setReviewDate(Date reviewDate){this.reviewDate=reviewDate;}
}
