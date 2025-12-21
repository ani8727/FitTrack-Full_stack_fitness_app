package com.fitness.activityservice.validation;

import com.fitness.activityservice.modal.ActivityType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ActivityTypeValidator implements ConstraintValidator<ValidActivityType, ActivityType> {

    @Override
    public boolean isValid(ActivityType value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        return true;
    }
}
