package com.example.carstore.controller;

import com.example.carstore.entity.Account;
import com.example.carstore.repository.AccountRepository;
import com.example.carstore.service.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class RestAuthControllerTest {
    private AccountRepository accounts;
    private PasswordEncoder passwords;
    private MailService mail;
    private RestAuthController controller;

    @BeforeEach
    void setUp() {
        accounts = mock(AccountRepository.class);
        passwords = mock(PasswordEncoder.class);
        mail = mock(MailService.class);
        controller = new RestAuthController(accounts, passwords, mail);
    }

    @Test
    void signupCreatesDisabledAccountAndSendsVerificationCode() {
        Account request = account("newuser", "secret1", "new@example.com");
        when(accounts.existsById("newuser")).thenReturn(false);
        when(accounts.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(passwords.encode("secret1")).thenReturn("{bcrypt}encoded");
        when(accounts.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> result = controller.signup(request);

        assertEquals(true, result.get("success"));
        assertEquals(true, result.get("requiresVerification"));
        assertFalse(request.getEnabled());
        assertNotNull(request.getVerificationCode());
        assertEquals(6, request.getVerificationCode().length());
        assertNotNull(request.getVerificationExpired());
        verify(mail).sendEmailVerificationCode("new@example.com", request.getVerificationCode());
    }

    @Test
    void verifyEmailEnablesAccountAndClearsCode() {
        Account account = account("newuser", "{bcrypt}encoded", "new@example.com");
        account.setEnabled(false);
        account.setVerificationCode("123456");
        account.setVerificationExpired(new java.util.Date(System.currentTimeMillis() + 60_000));
        when(accounts.findById("newuser")).thenReturn(Optional.of(account));
        when(accounts.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Map<String, Object> result = controller.verifyEmail(
                Map.of("username", "newuser", "code", "123456"));

        assertEquals(true, result.get("success"));
        assertTrue(account.getEnabled());
        assertNull(account.getVerificationCode());
        assertNull(account.getVerificationExpired());
        verify(accounts).save(account);
    }

    @Test
    void verifyEmailRejectsExpiredCode() {
        Account account = account("newuser", "{bcrypt}encoded", "new@example.com");
        account.setEnabled(false);
        account.setVerificationCode("123456");
        account.setVerificationExpired(new java.util.Date(System.currentTimeMillis() - 1));
        when(accounts.findById("newuser")).thenReturn(Optional.of(account));

        Map<String, Object> result = controller.verifyEmail(
                Map.of("username", "newuser", "code", "123456"));

        assertEquals(false, result.get("success"));
        assertFalse(account.getEnabled());
        verify(accounts, never()).save(any());
    }

    private Account account(String username, String password, String email) {
        Account account = new Account();
        account.setUsername(username);
        account.setPassword(password);
        account.setEmail(email);
        account.setFullname("New User");
        return account;
    }
}
