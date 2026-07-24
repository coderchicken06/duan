package com.example.carstore.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import java.time.LocalDateTime;
@Entity
@Table(name = "account")
public class Account {
    @Id
    private String username;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String fullname;
    private String email;
    private String role;

    // code xac thucthuc
            @Column(name = "enabled")
        private Boolean enabled = false;

        @Column(name = "verification_code")
        private String verificationCode;

        @Column(name = "verification_expired")
        private LocalDateTime verificationExpired;


    public Account() {}

    public Account(String username, String password, String fullname, String email, String role) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.email = email;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public Boolean getEnabled() {
        return enabled;
    }
    
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
    
    public String getVerificationCode() {
        return verificationCode;
    }
    // code xac thucthuc
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
    
    public LocalDateTime getVerificationExpired() {
        return verificationExpired;
    }
    
    public void setVerificationExpired(LocalDateTime verificationExpired) {
        this.verificationExpired = verificationExpired;
    }
}
