    public CircuitBreaker userServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("userService", baseCircuitBreakerConfig());
    }

    @Bean
    public CircuitBreaker activityServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("activityService", baseCircuitBreakerConfig());
    }

    @Bean
    public CircuitBreaker aiServiceCircuitBreaker(CircuitBreakerRegistry registry) {
        return registry.circuitBreaker("aiService", baseCircuitBreakerConfig());
    }
}
