package com.example.carstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.example.carstore.service.AccountUserDetailsService;
import com.example.carstore.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final CustomOAuth2UserService oAuth2UserService;
        private final AccountUserDetailsService accountUserDetailsService;
        private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

        public SecurityConfig(
                        CustomOAuth2UserService oAuth2UserService,
                        AccountUserDetailsService accountUserDetailsService,
                        OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {

                this.oAuth2UserService = oAuth2UserService;
                this.accountUserDetailsService = accountUserDetailsService;
                this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf().disable()
                                .cors().and()

                                .authorizeRequests()

                                .antMatchers(
                                                "/",
                                                "/index.html",
                                                "/assets/**",
                                                "/css/**",
                                                "/js/**",
                                                "/images/**",
                                                "/videos/**",
                                                "/oauth2/**",
                                                "/error")
                                .permitAll()

                                .antMatchers("/api/auth/**")
                                .permitAll()

                                .antMatchers(HttpMethod.GET, "/api/cars/**")
                                .permitAll()

                                .antMatchers("/api/cart/**")
                                .permitAll()

                                .antMatchers(
                                                "/admin/**",
                                                "/api/admin/**",
                                                "/api/upload",
                                                "/api/upload/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.POST, "/api/cars/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.PUT, "/api/cars/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.DELETE, "/api/cars/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.POST, "/api/support")
                                .authenticated()

                                .antMatchers(HttpMethod.GET, "/api/support/my")
                                .authenticated()

                                .antMatchers(HttpMethod.GET, "/api/support/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.PUT, "/api/support/**")
                                .hasRole("ADMIN")

                                .antMatchers(HttpMethod.DELETE, "/api/support/**")
                                .hasRole("ADMIN")

                                .antMatchers(
                                                "/api/orders/**",
                                                "/api/profile/**")
                                .authenticated()

                                .anyRequest()
                                .permitAll()

                                .and()

                                .oauth2Login()
                                .loginPage("/login")
                                .userInfoEndpoint()
                                .userService(oAuth2UserService)
                                .and()
                                .successHandler(oAuth2LoginSuccessHandler)

                                .and()

                                .logout()
                                .logoutUrl("/logout")
                                .logoutSuccessUrl("/")
                                .permitAll();

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return PasswordEncoderFactories.createDelegatingPasswordEncoder();
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {

                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();

                provider.setUserDetailsService(accountUserDetailsService);
                provider.setPasswordEncoder(passwordEncoder());

                return provider;
        }
}
