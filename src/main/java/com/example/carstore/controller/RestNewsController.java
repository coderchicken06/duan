package com.example.carstore.controller;
import com.example.carstore.entity.News;import com.example.carstore.service.NewsService;import org.springframework.security.core.Authentication;import org.springframework.web.bind.annotation.*;import java.util.*;
@RestController @RequestMapping("/api/news") public class RestNewsController{
 private final NewsService s;public RestNewsController(NewsService s){this.s=s;}private boolean admin(Authentication a){return a!=null&&a.getAuthorities().stream().anyMatch(x->"ROLE_ADMIN".equals(x.getAuthority()));}
 @GetMapping public Map<String,Object> list(){return Map.of("success",true,"data",s.published());}@GetMapping("/{slug}")public Map<String,Object> get(@PathVariable String slug){return Map.of("success",true,"data",s.get(slug));}
 @GetMapping("/admin/all")public Map<String,Object> all(Authentication a){if(!admin(a))throw new IllegalArgumentException("Không có quyền.");return Map.of("success",true,"data",s.all());}
 @PostMapping public Map<String,Object> create(@RequestBody News n,Authentication a){if(!admin(a))throw new IllegalArgumentException("Không có quyền.");return Map.of("success",true,"data",s.save(n,a.getName()));}
 @PutMapping("/{id}")public Map<String,Object> update(@PathVariable Integer id,@RequestBody News n,Authentication a){if(!admin(a))throw new IllegalArgumentException("Không có quyền.");n.setId(id);return Map.of("success",true,"data",s.save(n,a.getName()));}
 @DeleteMapping("/{id}")public Map<String,Object> delete(@PathVariable Integer id,Authentication a){if(!admin(a))throw new IllegalArgumentException("Không có quyền.");s.delete(id);return Map.of("success",true);}
}
