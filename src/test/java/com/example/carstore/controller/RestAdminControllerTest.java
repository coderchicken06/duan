package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.entity.Car;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.repository.BrandRepository;
import com.example.carstore.repository.CarRepository;
import com.example.carstore.repository.OrderDetailRepository;
import com.example.carstore.repository.OrderRepository;
import com.example.carstore.repository.ReviewRepository;
import com.example.carstore.repository.QuotationRepository;
import com.example.carstore.repository.QuotationItemRepository;
import com.example.carstore.repository.PromotionCarRepository;
import com.example.carstore.repository.SupportRequestRepository;
import com.example.carstore.repository.ContractRepository;
import com.example.carstore.repository.NewsRepository;
import com.example.carstore.service.CarImageService;
import com.example.carstore.service.OrderService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RestAdminControllerTest {

    @Mock private AccountRepository accountRepo;
    @Mock private OrderRepository orderRepo;
    @Mock private OrderDetailRepository detailRepo;
    @Mock private CarRepository carRepo;
    @Mock private BrandRepository brandRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private OrderService orderService;
    @Mock private CarImageService carImageService;
    @Mock private ReviewRepository reviewRepo;
    @Mock private QuotationRepository quotationRepo;
    @Mock private QuotationItemRepository quotationItemRepo;
    @Mock private PromotionCarRepository promotionCarRepo;
    @Mock private SupportRequestRepository supportRequestRepo;
    @Mock private ContractRepository contractRepo;
    @Mock private NewsRepository newsRepo;

    private RestAdminController controller;

    @BeforeEach
    void setUp() {
        controller = new RestAdminController(
                accountRepo, orderRepo, detailRepo, carRepo, brandRepo,
                passwordEncoder, orderService, carImageService,
                reviewRepo, quotationRepo, quotationItemRepo, promotionCarRepo,
                supportRequestRepo, contractRepo, newsRepo);
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updatingOwnRoleRefreshesCurrentSessionAuthorities() {
        Account existing = account("admin", "ROLE_ADMIN");
        Account update = account("admin", "ROLE_USER");
        when(accountRepo.findById("admin")).thenReturn(Optional.of(existing));
        when(accountRepo.countByRole("ROLE_ADMIN")).thenReturn(2L);
        Authentication authentication = authentication("admin", "ROLE_ADMIN");
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Map<String, Object> result = controller.updateUser("admin", update, authentication);

        assertEquals(true, result.get("success"));
        assertEquals(true, result.get("roleChanged"));
        assertEquals(true, result.get("sessionUpdated"));
        assertEquals(false, result.get("requiresRelogin"));
        assertTrue(hasAuthority(SecurityContextHolder.getContext().getAuthentication(), "ROLE_USER"));
        assertFalse(hasAuthority(SecurityContextHolder.getContext().getAuthentication(), "ROLE_ADMIN"));
        assertTrue(hasAuthority(SecurityContextHolder.getContext().getAuthentication(), "SCOPE_profile"));
        verify(accountRepo).save(existing);
    }

    @Test
    void cannotDemoteLastAdministrator() {
        Account existing = account("admin", "ROLE_ADMIN");
        Account update = account("admin", "ROLE_USER");
        when(accountRepo.findById("admin")).thenReturn(Optional.of(existing));
        when(accountRepo.countByRole("ROLE_ADMIN")).thenReturn(1L);
        Authentication authentication = authentication("admin", "ROLE_ADMIN");

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> controller.updateUser("admin", update, authentication));

        assertEquals(HttpStatus.BAD_REQUEST, error.getStatus());
        assertEquals("ROLE_ADMIN", existing.getRole());
        verify(accountRepo, never()).save(any());
    }

    @Test
    void cannotDeleteOwnAccount() {
        Account existing = account("admin", "ROLE_ADMIN");
        when(accountRepo.findById("admin")).thenReturn(Optional.of(existing));
        Authentication authentication = authentication("admin", "ROLE_ADMIN");

        ResponseEntity<Map<String, Object>> response = controller.deleteUser("admin", authentication);
        Map<String, Object> result = response.getBody();

        assertEquals(400, response.getStatusCodeValue());
        assertEquals(false, result.get("success"));
        verify(accountRepo, never()).deleteById(anyString());
    }

    @Test
    void cannotDeleteLastAdministrator() {
        Account existing = account("other-admin", "ROLE_ADMIN");
        when(accountRepo.findById("other-admin")).thenReturn(Optional.of(existing));
        when(accountRepo.countByRole("ROLE_ADMIN")).thenReturn(1L);
        Authentication authentication = authentication("admin", "ROLE_ADMIN");

        ResponseEntity<Map<String, Object>> response = controller.deleteUser("other-admin", authentication);
        Map<String, Object> result = response.getBody();

        assertEquals(400, response.getStatusCodeValue());
        assertEquals(false, result.get("success"));
        verify(accountRepo, never()).deleteById(anyString());
    }

    @Test
    void updatingAnotherUsersRoleRequiresThatUserToLoginAgain() {
        Account existing = account("customer", "ROLE_USER");
        Account update = account("customer", "ROLE_ADMIN");
        when(accountRepo.findById("customer")).thenReturn(Optional.of(existing));
        Authentication authentication = authentication("admin", "ROLE_ADMIN");
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Map<String, Object> result = controller.updateUser("customer", update, authentication);

        assertEquals(true, result.get("success"));
        assertEquals(true, result.get("roleChanged"));
        assertEquals(false, result.get("sessionUpdated"));
        assertEquals(true, result.get("requiresRelogin"));
        assertTrue(String.valueOf(result.get("message")).contains("đăng nhập lại"));
        assertTrue(hasAuthority(SecurityContextHolder.getContext().getAuthentication(), "ROLE_ADMIN"));
        verify(accountRepo).save(existing);
    }

    @Test
    void creatingZeroStockCarMarksItOutOfStockInsteadOfDeposited() {
        Car car = new Car(null, "Xe hết hàng", 500_000_000D, "car.jpg", "Mô tả", 1, 2025, "Đen", 0);
        when(brandRepo.existsById(1)).thenReturn(true);
        when(carRepo.save(any(Car.class))).thenAnswer(invocation -> {
            Car saved = invocation.getArgument(0);
            saved.setId(10);
            return saved;
        });

        Map<String, Object> result = controller.createCar(car);

        assertEquals(true, result.get("success"));
        assertEquals("OUT_OF_STOCK", car.getStatus());
        verify(carRepo).save(car);
    }

    private Account account(String username, String role) {
        Account account = new Account();
        account.setUsername(username);
        account.setRole(role);
        return account;
    }

    private Authentication authentication(String username, String role) {
        return new UsernamePasswordAuthenticationToken(
                username,
                "N/A",
                List.of(new SimpleGrantedAuthority(role), new SimpleGrantedAuthority("SCOPE_profile")));
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().stream()
                .anyMatch(granted -> authority.equals(granted.getAuthority()));
    }
}
