package com.fitness.gateway;

import java.util.Map;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class GlobalErrorHandler extends DefaultErrorAttributes {

    @Override
    public Map getErrorAttributes(ServerRequest request, ErrorAttributeOptions options) {
        Map errorAttributes = super.getErrorAttributes(request, options);
        Throwable error = getError(request);
        
        log.error("Error occurred: {}", error.getMessage(), error);
        
        // Customize error response
        errorAttributes.put("message", error.getMessage());
        
        errorAttributes.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        
        return errorAttributes;
    }
}