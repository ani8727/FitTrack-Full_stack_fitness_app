package com.fitness.userservice.security;

import org.springframework.util.StringUtils;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
    private final String audience;

    public AudienceValidator(String audience) {
        this.audience = audience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        if (!StringUtils.hasText(audience)) {
            return OAuth2TokenValidatorResult.success();
        }
        Object audClaim = token.getClaims().get("aud");
        if (audClaim instanceof String) {
            if (audience.equals(audClaim)) return OAuth2TokenValidatorResult.success();
        } else if (audClaim instanceof java.util.List) {
            @SuppressWarnings("unchecked")
            java.util.List<Object> audList = (java.util.List<Object>) audClaim;
            for (Object a : audList) {
                if (audience.equals(String.valueOf(a))) return OAuth2TokenValidatorResult.success();
            }
        }
        OAuth2Error error = new OAuth2Error("invalid_token", "The required audience is missing", null);
        return OAuth2TokenValidatorResult.failure(error);
    }
}
