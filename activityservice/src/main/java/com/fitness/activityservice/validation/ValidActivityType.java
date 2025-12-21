package com.fitness.activityservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ActivityTypeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidActivityType {
    String message() default "Invalid activity type";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
