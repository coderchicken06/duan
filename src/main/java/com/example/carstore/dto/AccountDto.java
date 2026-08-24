package com.example.carstore.dto;

import com.example.carstore.entity.Account;

/** Public representation of an account for administration screens. */
public class AccountDto {
    private String username;
    private String fullname;
    private String email;
    private String role;
    private Boolean enabled;

    public static AccountDto from(Account account) {
        AccountDto dto = new AccountDto();
        dto.username = account.getUsername();
        dto.fullname = account.getFullname();
        dto.email = account.getEmail();
        dto.role = account.getRole();
        dto.enabled = account.getEnabled();
        return dto;
    }

    public String getUsername() { return username; }
    public String getFullname() { return fullname; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public Boolean getEnabled() { return enabled; }
}
