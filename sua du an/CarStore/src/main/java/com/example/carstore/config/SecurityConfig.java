package com.example.carstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.example.carstore.service.AccountUserDetailsService;
import com.example.carstore.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final CustomOAuth2UserService oAuth2UserService;
        private final AccountUserDetailsService accountUserDetailsService;

        public SecurityConfig(
                        CustomOAuth2UserService oAuth2UserService,
                        AccountUserDetailsService accountUserDetailsService) {

                this.oAuth2UserService = oAuth2UserService;
                this.accountUserDetailsService = accountUserDetailsService;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                .antMatchers(
                                                "/",
                                                "/login",
                                                "/signup",
                                                "/forgot-password",
                                                "/verify-otp",
                                                "/reset-password",
                                                "/compare",
                                                "/cart/view",
                                                "/checkout",
                                                "/profile",
                                                "/history",
                                                "/service",
                                                "/support",
                                                "/order/**",
                                                "/admin/**",
                                                "/car/create",
                                                "/car/edit/**",
                                                "/css/**",
                                                "/js/**",
                                                "/assets/**",
                                                "/images/**",
                                                "/videos/**",
                                                "/oauth2/**")
                                .permitAll()
                                .antMatchers("/api/auth/**")
                                .permitAll()
                                .antMatchers(
                                                "/car/list",
                                                "/car/detail/**")
                                .permitAll()
                                .antMatchers(HttpMethod.GET, "/api/cars/**")
                                .permitAll()
                                .antMatchers(HttpMethod.GET, "/api/brands/**")
                                .permitAll()
                                .antMatchers("/api/brands/**")
                                .hasRole("ADMIN")
                                .antMatchers("/api/cart/**", "/cart/**")
                                .permitAll()
                                .antMatchers("/history")
                                .authenticated()
                                .antMatchers("/done/**")
                                .hasRole("ADMIN")
                                .antMatchers(
                                                "/car/create",
                                                "/car/save",
                                                "/car/edit/**",
                                                "/car/delete/**",
                                                "/api/admin/**",
                                                "/api/upload",
                                                "/api/upload/**")
                                .hasRole("ADMIN")
                                .antMatchers("/api/cars/**")
                                .hasRole("ADMIN")
                                .antMatchers(
                                                "/api/orders/revenue",
                                                "/api/orders/top")
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
                                .authenticated())
                                .exceptionHandling(exceptions -> exceptions
                                                .defaultAuthenticationEntryPointFor(
                                                                (request, response, exception) -> {
                                                                        response.setStatus(401);
                                                                        response.setContentType("application/json;charset=UTF-8");
                                                                        response.getWriter().write(
                                                                                        "{\"success\":false,\"message\":\"Not authenticated\"}");
                                                                },
                                                                new AntPathRequestMatcher("/api/**")))
                                .formLogin(form -> form
                                                .loginPage("/login")
                                                .loginProcessingUrl("/login")
                                                .defaultSuccessUrl("/", true)
                                                .permitAll())
                                .oauth2Login(oauth -> oauth
                                                .loginPage("/login")
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(oAuth2UserService))
                                                .defaultSuccessUrl("/", true))
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .logoutSuccessUrl("/")
                                                .permitAll());

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
