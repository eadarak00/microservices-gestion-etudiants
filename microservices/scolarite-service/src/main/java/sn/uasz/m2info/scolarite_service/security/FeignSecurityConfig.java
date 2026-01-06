package sn.uasz.m2info.scolarite_service.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import feign.RequestInterceptor;

@Configuration
public class FeignSecurityConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth instanceof JwtAuthenticationToken jwtAuth) {
                requestTemplate.header("Authorization", "Bearer " + jwtAuth.getToken().getTokenValue());
            }
        };
    }
}
