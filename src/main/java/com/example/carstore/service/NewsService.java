package com.example.carstore.service;
import com.example.carstore.entity.News;import com.example.carstore.repository.NewsRepository;import org.springframework.stereotype.Service;import java.text.Normalizer;import java.util.*;
@Service public class NewsService{
 private final NewsRepository repo;public NewsService(NewsRepository r){repo=r;}
 public List<News> published(){return repo.findByStatusOrderByCreatedAtDesc("PUBLISHED");}public List<News> all(){return repo.findAll();}
 public News get(String slug){return repo.findBySlug(slug).orElseThrow(()->new IllegalArgumentException("Không tìm thấy tin tức."));}
 public News save(News n,String author){
  if(n.getTitle()==null||n.getTitle().isBlank())throw new IllegalArgumentException("Tiêu đề là bắt buộc.");
  if(n.getTitle().trim().length()>300)throw new IllegalArgumentException("Tiêu đề không được vượt quá 300 ký tự.");
  if(n.getSummary()!=null&&n.getSummary().length()>500)throw new IllegalArgumentException("Tóm tắt không được vượt quá 500 ký tự.");
  if(!List.of("DRAFT","PUBLISHED").contains(n.getStatus()==null?"DRAFT":n.getStatus()))throw new IllegalArgumentException("Trạng thái tin không hợp lệ.");
  if(n.getId()!=null){News old=repo.findById(n.getId()).orElseThrow(()->new IllegalArgumentException("Không tìm thấy tin tức."));n.setCreatedAt(old.getCreatedAt());}
  else n.setCreatedAt(new Date());
  n.setTitle(n.getTitle().trim());n.setUpdatedAt(new Date());n.setAuthor(author);if(n.getStatus()==null)n.setStatus("DRAFT");
  if(n.getSlug()==null||n.getSlug().isBlank())n.setSlug(slug(n.getTitle()));
  else n.setSlug(slug(n.getSlug()));
  if(n.getSlug().isBlank())throw new IllegalArgumentException("Slug không hợp lệ.");
  if(repo.existsBySlugAndIdNot(n.getSlug(),n.getId()==null?0:n.getId()))throw new IllegalArgumentException("Slug tin tức đã tồn tại.");
  return repo.save(n);
 }
 public void delete(Integer id){if(!repo.existsById(id))throw new IllegalArgumentException("Không tìm thấy tin tức.");repo.deleteById(id);}private String slug(String s){return Normalizer.normalize(s,Normalizer.Form.NFD).replaceAll("\\p{M}","").toLowerCase().replaceAll("[^a-z0-9]+","-").replaceAll("(^-|-$)","");}
}
