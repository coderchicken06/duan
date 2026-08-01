package com.example.carstore.service;
import com.example.carstore.entity.Promotion;import com.example.carstore.entity.PromotionCar;import com.example.carstore.repository.CarRepository;import com.example.carstore.repository.PromotionCarRepository;import com.example.carstore.repository.PromotionRepository;import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.util.*;
@Service public class PromotionService{
 private final PromotionRepository r;private final PromotionCarRepository promotionCars;private final CarRepository cars;
 public PromotionService(PromotionRepository r,PromotionCarRepository promotionCars,CarRepository cars){this.r=r;this.promotionCars=promotionCars;this.cars=cars;}
 private Date today(){return java.sql.Date.valueOf(java.time.LocalDate.now());}
 public List<Promotion> active(){return r.findActive(today());}public List<Promotion> activeForCar(Integer carId){return r.findActiveByCarId(carId,today());}public List<Promotion> all(){return r.findAll();}
 public double priceAfterPromotion(Integer carId,double originalPrice){
  return activeForCar(carId).stream().mapToDouble(p->{
   double discount="PERCENT".equals(p.getType())?originalPrice*p.getValue()/100D:p.getValue();
   return Math.max(0D,originalPrice-discount);
  }).min().orElse(originalPrice);
 }
 public Promotion save(Promotion p){
  if(p.getName()==null||p.getName().isBlank())throw new IllegalArgumentException("Tên khuyến mãi là bắt buộc.");
  if(!List.of("PERCENT","FIXED").contains(p.getType()))throw new IllegalArgumentException("Loại khuyến mãi phải là PERCENT hoặc FIXED.");
  if(p.getValue()==null||p.getValue()<=0||("PERCENT".equals(p.getType())&&p.getValue()>100))throw new IllegalArgumentException("Giá trị khuyến mãi không hợp lệ.");
  if(p.getStartDate()!=null&&p.getEndDate()!=null&&p.getEndDate().before(p.getStartDate()))throw new IllegalArgumentException("Ngày kết thúc phải sau ngày bắt đầu.");
  if(p.getStatus()==null)p.setStatus(true);if(p.getId()==null)p.setCreatedAt(new Date());return r.save(p);
 }
 @Transactional public void applyToCar(Integer promotionId,Integer carId){assignToCar(promotionId,carId);}
 @Transactional public void assignToCar(Integer promotionId,Integer carId){if(!r.existsById(promotionId))throw new IllegalArgumentException("Không tìm thấy khuyến mãi.");if(!cars.existsById(carId))throw new IllegalArgumentException("Không tìm thấy xe.");List<PromotionCar> current=promotionCars.findByPromotionId(promotionId);if(current.size()==1&&Objects.equals(current.get(0).getCarId(),carId))return;promotionCars.deleteByPromotionId(promotionId);promotionCars.flush();promotionCars.save(new PromotionCar(promotionId,carId));}
 public List<PromotionCar> assignments(Integer promotionId){return promotionCars.findByPromotionId(promotionId);}
 @Transactional public void stopApplying(Integer promotionId){if(!r.existsById(promotionId))throw new IllegalArgumentException("Không tìm thấy khuyến mãi.");promotionCars.deleteByPromotionId(promotionId);}
 @Transactional public void removeFromCar(Integer promotionId,Integer carId){promotionCars.deleteByPromotionIdAndCarId(promotionId,carId);}
 @Transactional public void delete(Integer id){if(!r.existsById(id))throw new IllegalArgumentException("Không tìm thấy khuyến mãi.");promotionCars.deleteByPromotionId(id);r.deleteById(id);}
}
