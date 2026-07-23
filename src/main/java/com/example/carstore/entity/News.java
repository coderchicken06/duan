package com.example.carstore.entity;
import javax.persistence.*;import java.util.Date;
@Entity @Table(name="News",schema="dbo")
public class News{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Integer id; private String title;private String slug;
 @Column(name="image") private String thumbnail;private String summary;private String content;private String status;private String author;
 @Temporal(TemporalType.TIMESTAMP) @Column(name="create_date") private Date createdAt;
 @Temporal(TemporalType.TIMESTAMP) @Column(name="updated_at") private Date updatedAt;
 public Integer getId(){return id;}public void setId(Integer v){id=v;}public String getTitle(){return title;}public void setTitle(String v){title=v;}public String getSlug(){return slug;}public void setSlug(String v){slug=v;}public String getThumbnail(){return thumbnail;}public void setThumbnail(String v){thumbnail=v;}public String getSummary(){return summary;}public void setSummary(String v){summary=v;}public String getContent(){return content;}public void setContent(String v){content=v;}public String getStatus(){return status;}public void setStatus(String v){status=v;}public String getAuthor(){return author;}public void setAuthor(String v){author=v;}public Date getCreatedAt(){return createdAt;}public void setCreatedAt(Date v){createdAt=v;}public Date getUpdatedAt(){return updatedAt;}public void setUpdatedAt(Date v){updatedAt=v;}
}
