package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

class RestProfileControllerTest {

    @Test
    void emailDeliveryFailureDoesNotDisableAccountOrInvalidateSession() {
        AccountRepository accounts = mock(AccountRepository.class);
        PasswordEncoder passwords = mock(PasswordEncoder.class);
        MailService mail = mock(MailService.class);
        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpSession session = mock(HttpSession.class);
        RestProfileController controller = new RestProfileController(accounts, passwords, mail);

        Account existing = new Account();
        existing.setUsername("user1");
        existing.setEmail("old@example.com");
        existing.setEnabled(true);
        Account update = new Account();
        update.setEmail("new@example.com");
        when(accounts.findByUsername("user1")).thenReturn(Optional.of(existing));
        when(accounts.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(request.getSession(false)).thenReturn(session);
        doThrow(new IllegalStateException("SMTP unavailable"))
                .when(mail).sendEmailVerificationCode(eq("new@example.com"), anyString());

        assertThrows(IllegalStateException.class, () -> controller.updateProfile(
                update,
                new UsernamePasswordAuthenticationToken("user1", "N/A", List.of()),
                request));

        assertTrue(existing.getEnabled());
        assertNull(existing.getVerificationCode());
        assertNull(existing.getVerificationExpired());
        verify(accounts, never()).save(any());
        verify(session, never()).invalidate();
    }
}
